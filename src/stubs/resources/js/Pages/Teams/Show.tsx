import DeleteTeamForm from '@/Domains/Teams/DeleteTeamForm';
import TeamMemberManager from '@/Domains/Teams/TeamMemberManager';
import UpdateTeamNameForm from '@/Domains/Teams/UpdateTeamNameForm';
import JetSectionBorder from '@/Jetstream/SectionBorder';
import AppLayout from '@/Layouts/AppLayout';
import {
  JetstreamTeamPermissions,
  Role,
  Team,
  TeamInvitation,
  User,
} from '@/types';
import React from 'react';

interface UserMembership extends User {
  membership: {
    role: string;
  };
}

interface Props {
  team: Team & {
    owner: User;
    team_invitations: TeamInvitation[];
    users: UserMembership[];
  };
  availableRoles: Role[];
  permissions: JetstreamTeamPermissions;
}

export default function Show({ team, availableRoles, permissions }: Props) {
  return (
    <AppLayout
      title="Team Settings"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Team Settings
        </h2>
      )}
    >
      <div>
        <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
          <UpdateTeamNameForm team={team} permissions={permissions} />

          <div className="mt-10 sm:mt-0">
            <TeamMemberManager
              team={team}
              availableRoles={availableRoles}
              userPermissions={permissions}
            />
          </div>

          {permissions.canDeleteTeam && !team.personal_team ? (
            <>
              <JetSectionBorder />

              <div className="mt-10 sm:mt-0">
                <DeleteTeamForm team={team} />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
}
