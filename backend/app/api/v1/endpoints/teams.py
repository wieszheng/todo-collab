"""团队接口"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, Team, TeamMember, MemberRole
from app.schemas.user import (
    TeamCreate, TeamUpdate, TeamResponse, TeamMemberResponse, 
    InviteMember, UpdateMemberRole, UserResponse
)

router = APIRouter()


@router.get("/", response_model=List[TeamResponse])
async def list_teams(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取用户所在的团队列表"""
    # 查询用户所属的团队
    query = (
        select(Team)
        .join(TeamMember, TeamMember.team_id == Team.id)
        .where(TeamMember.user_id == current_user.id)
    )
    result = await db.execute(query)
    teams = list(result.scalars().all())
    
    # 为每个团队加载成员信息
    for team in teams:
        members_query = (
            select(TeamMember, User)
            .join(User, User.id == TeamMember.user_id)
            .where(TeamMember.team_id == team.id)
        )
        members_result = await db.execute(members_query)
        members_data = members_result.all()
        
        team.members = []
        for member, user in members_data:
            member.user = UserResponse.model_validate(user)
            team.members.append(TeamMemberResponse.model_validate(member))
    
    return teams


@router.post("/", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
async def create_team(
    data: TeamCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """创建团队"""
    # 创建团队
    team = Team(
        name=data.name,
        description=data.description,
        creator_id=current_user.id
    )
    db.add(team)
    await db.flush()
    
    # 创建者自动成为 owner
    owner_member = TeamMember(
        team_id=team.id,
        user_id=current_user.id,
        role=MemberRole.OWNER.value
    )
    db.add(owner_member)
    await db.commit()
    
    # 重新查询以获取完整信息
    await db.refresh(team)
    
    # 构建响应
    team.members = [TeamMemberResponse(
        id=owner_member.id,
        team_id=team.id,
        user_id=current_user.id,
        role=MemberRole.OWNER.value,
        joined_at=owner_member.joined_at,
        user=UserResponse.model_validate(current_user)
    )]
    
    return team


@router.get("/{team_id}", response_model=TeamResponse)
async def get_team(
    team_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取团队详情"""
    # 检查用户是否是团队成员
    member_check = await db.execute(
        select(TeamMember).where(
            TeamMember.team_id == team_id,
            TeamMember.user_id == current_user.id
        )
    )
    if not member_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="你不是该团队成员")
    
    # 获取团队信息
    result = await db.execute(
        select(Team).where(Team.id == team_id)
    )
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="团队不存在")
    
    # 获取成员列表
    members_query = (
        select(TeamMember, User)
        .join(User, User.id == TeamMember.user_id)
        .where(TeamMember.team_id == team_id)
    )
    members_result = await db.execute(members_query)
    members_data = members_result.all()
    
    team.members = []
    for member, user in members_data:
        member.user = UserResponse.model_validate(user)
        team.members.append(TeamMemberResponse.model_validate(member))
    
    return team


@router.put("/{team_id}", response_model=TeamResponse)
async def update_team(
    team_id: str,
    data: TeamUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """更新团队信息（仅 owner 和 admin 可操作）"""
    # 检查权限
    member_result = await db.execute(
        select(TeamMember).where(
            TeamMember.team_id == team_id,
            TeamMember.user_id == current_user.id
        )
    )
    member = member_result.scalar_one_or_none()
    if not member or member.role not in [MemberRole.OWNER.value, MemberRole.ADMIN.value]:
        raise HTTPException(status_code=403, detail="没有权限")
    
    # 更新团队
    team_result = await db.execute(
        select(Team).where(Team.id == team_id)
    )
    team = team_result.scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="团队不存在")
    
    if data.name:
        team.name = data.name
    if data.description is not None:
        team.description = data.description
    
    await db.commit()
    await db.refresh(team)
    
    return await get_team(team_id, current_user, db)


@router.delete("/{team_id}")
async def delete_team(
    team_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """解散团队（仅 owner 可操作）"""
    # 检查权限
    member_result = await db.execute(
        select(TeamMember).where(
            TeamMember.team_id == team_id,
            TeamMember.user_id == current_user.id
        )
    )
    member = member_result.scalar_one_or_none()
    if not member or member.role != MemberRole.OWNER.value:
        raise HTTPException(status_code=403, detail="只有创建者可以解散团队")
    
    # 删除团队（级联删除成员）
    team_result = await db.execute(
        select(Team).where(Team.id == team_id)
    )
    team = team_result.scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="团队不存在")
    
    await db.delete(team)
    await db.commit()
    
    return {"message": "团队已解散"}


@router.post("/{team_id}/invite", response_model=TeamMemberResponse, status_code=status.HTTP_201_CREATED)
async def invite_member(
    team_id: str,
    data: InviteMember,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """邀请成员加入团队"""
    # 检查权限
    member_result = await db.execute(
        select(TeamMember).where(
            TeamMember.team_id == team_id,
            TeamMember.user_id == current_user.id
        )
    )
    member = member_result.scalar_one_or_none()
    if not member or member.role not in [MemberRole.OWNER.value, MemberRole.ADMIN.value]:
        raise HTTPException(status_code=403, detail="没有权限邀请成员")
    
    # 验证角色
    if data.role not in [MemberRole.ADMIN.value, MemberRole.MEMBER.value]:
        raise HTTPException(status_code=400, detail="无效的角色")
    
    # 查找被邀请的用户
    user_result = await db.execute(
        select(User).where(User.email == data.email)
    )
    invited_user = user_result.scalar_one_or_none()
    if not invited_user:
        raise HTTPException(status_code=404, detail="用户不存在")
    
    # 检查是否已是成员
    existing = await db.execute(
        select(TeamMember).where(
            TeamMember.team_id == team_id,
            TeamMember.user_id == invited_user.id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="该用户已是团队成员")
    
    # 添加成员
    new_member = TeamMember(
        team_id=team_id,
        user_id=invited_user.id,
        role=data.role
    )
    db.add(new_member)
    await db.commit()
    await db.refresh(new_member)
    
    return TeamMemberResponse(
        id=new_member.id,
        team_id=team_id,
        user_id=invited_user.id,
        role=new_member.role,
        joined_at=new_member.joined_at,
        user=UserResponse.model_validate(invited_user)
    )


@router.put("/{team_id}/members/{member_id}")
async def update_member_role(
    team_id: str,
    member_id: str,
    data: UpdateMemberRole,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """更新成员角色（仅 owner 可操作）"""
    # 检查权限
    member_result = await db.execute(
        select(TeamMember).where(
            TeamMember.team_id == team_id,
            TeamMember.user_id == current_user.id
        )
    )
    current_member = member_result.scalar_one_or_none()
    if not current_member or current_member.role != MemberRole.OWNER.value:
        raise HTTPException(status_code=403, detail="只有创建者可以更改成员角色")
    
    # 验证角色
    if data.role not in [MemberRole.ADMIN.value, MemberRole.MEMBER.value]:
        raise HTTPException(status_code=400, detail="无效的角色")
    
    # 查找目标成员
    target_result = await db.execute(
        select(TeamMember).where(
            TeamMember.id == member_id,
            TeamMember.team_id == team_id
        )
    )
    target_member = target_result.scalar_one_or_none()
    if not target_member:
        raise HTTPException(status_code=404, detail="成员不存在")
    
    # 不能修改 owner 的角色
    if target_member.role == MemberRole.OWNER.value:
        raise HTTPException(status_code=400, detail="不能修改创建者的角色")
    
    target_member.role = data.role
    await db.commit()
    
    return {"message": "角色已更新"}


@router.delete("/{team_id}/members/{member_id}")
async def remove_member(
    team_id: str,
    member_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """移除成员"""
    # 检查权限
    member_result = await db.execute(
        select(TeamMember).where(
            TeamMember.team_id == team_id,
            TeamMember.user_id == current_user.id
        )
    )
    current_member = member_result.scalar_one_or_none()
    if not current_member:
        raise HTTPException(status_code=403, detail="你不是该团队成员")
    
    # 查找目标成员
    target_result = await db.execute(
        select(TeamMember).where(
            TeamMember.id == member_id,
            TeamMember.team_id == team_id
        )
    )
    target_member = target_result.scalar_one_or_none()
    if not target_member:
        raise HTTPException(status_code=404, detail="成员不存在")
    
    # owner 可以移除任何人，admin 可以移除 member，member 只能移除自己
    if target_member.role == MemberRole.OWNER.value:
        raise HTTPException(status_code=400, detail="不能移除创建者")
    
    if current_member.role == MemberRole.MEMBER.value and target_member.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="没有权限移除该成员")
    
    if current_member.role == MemberRole.ADMIN.value and target_member.role == MemberRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="不能移除其他管理员")
    
    await db.delete(target_member)
    await db.commit()
    
    return {"message": "成员已移除"}


@router.post("/{team_id}/leave")
async def leave_team(
    team_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """退出团队"""
    # 查找成员记录
    member_result = await db.execute(
        select(TeamMember).where(
            TeamMember.team_id == team_id,
            TeamMember.user_id == current_user.id
        )
    )
    member = member_result.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=400, detail="你不是该团队成员")
    
    # owner 不能直接退出，需要先转让或解散团队
    if member.role == MemberRole.OWNER.value:
        raise HTTPException(status_code=400, detail="创建者不能退出团队，请先转让或解散团队")
    
    await db.delete(member)
    await db.commit()
    
    return {"message": "已退出团队"}
