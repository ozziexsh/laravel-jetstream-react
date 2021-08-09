import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import JetActionMessage from '@/Jetstream/ActionMessage';
import JetActionSection from '@/Jetstream/ActionSection';
import JetButton from '@/Jetstream/Button';
import JetConfirmationModal from '@/Jetstream/ConfirmationModal';
import JetDangerButton from '@/Jetstream/DangerButton';
import JetDialogModal from '@/Jetstream/DialogModal';
import JetFormSection from '@/Jetstream/FormSection';
import JetInput from '@/Jetstream/Input';
import JetInputError from '@/Jetstream/InputError';
import JetLabel from '@/Jetstream/Label';
import JetSecondaryButton from '@/Jetstream/SecondaryButton';
import JetSectionBorder from '@/Jetstream/SectionBorder';
import {
  JetstreamTeamPermissions,
  Nullable,
  Role,
  Team,
  TeamInvitation,
  User,
} from '@/types';
import { Inertia } from '@inertiajs/inertia';
import { useForm } from '@inertiajs/inertia-react';
import classNames from 'classnames';
import React, { useState } from 'react';

interface UserMembership extends User {
  membership: {
    role: string;
  };
}

interface Props {
  team: Team & {
    team_invitations: TeamInvitation[];
    users: UserMembership[];
  };
  availableRoles: Role[];
  userPermissions: JetstreamTeamPermissions;
}

export default function TeamMemberManager({
  team,
  availableRoles,
  userPermissions,
}: Props) {
  const route = useRoute();
  const addTeamMemberForm = useForm({
    email: '',
    role: null as Nullable<string>,
  });
  const updateRoleForm = useForm({
    role: null as Nullable<string>,
  });
  const leaveTeamForm = useForm({});
  const removeTeamMemberForm = useForm({});
  const [currentlyManagingRole, setCurrentlyManagingRole] = useState(false);
  const [managingRoleFor, setManagingRoleFor] = useState<Nullable<User>>(null);
  const [confirmingLeavingTeam, setConfirmingLeavingTeam] = useState(false);
  const [teamMemberBeingRemoved, setTeamMemberBeingRemoved] =
    useState<Nullable<User>>(null);
  const page = useTypedPage();

  function addTeamMember() {
    addTeamMemberForm.post(route('team-members.store', [team]), {
      errorBag: 'addTeamMember',
      preserveScroll: true,
      onSuccess: () => addTeamMemberForm.reset(),
    });
  }

  function cancelTeamInvitation(invitation: TeamInvitation) {
    Inertia.delete(route('team-invitations.destroy', [invitation]), {
      preserveScroll: true,
    });
  }

  function manageRole(teamMember: UserMembership) {
    setManagingRoleFor(teamMember);
    updateRoleForm.setData('role', teamMember.membership.role);
    setCurrentlyManagingRole(true);
  }

  function updateRole() {
    if (!managingRoleFor) {
      return;
    }
    updateRoleForm.put(route('team-members.update', [team, managingRoleFor]), {
      preserveScroll: true,
      onSuccess: () => setCurrentlyManagingRole(false),
    });
  }

  function confirmLeavingTeam() {
    setConfirmingLeavingTeam(true);
  }

  function leaveTeam() {
    leaveTeamForm.delete(
      route('team-members.destroy', [team, page.props.user]),
    );
  }

  function confirmTeamMemberRemoval(teamMember: User) {
    setTeamMemberBeingRemoved(teamMember);
  }

  function removeTeamMember() {
    if (!teamMemberBeingRemoved) {
      return;
    }
    removeTeamMemberForm.delete(
      route('team-members.destroy', [team, teamMemberBeingRemoved]),
      {
        errorBag: 'removeTeamMember',
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => setTeamMemberBeingRemoved(null),
      },
    );
  }

  function displayableRole(role: string) {
    return availableRoles.find(r => r.key === role)?.name;
  }

  return (
    <div>
      {userPermissions.canAddTeamMembers ? (
        <div>
          <JetSectionBorder />

          {/* <!-- Add Team Member --> */}
          <JetFormSection
            onSubmit={addTeamMember}
            title={'Add Team Member'}
            description={
              'Add a new team member to your team, allowing them to collaborate with you.'
            }
            renderActions={() => (
              <>
                <JetActionMessage
                  on={addTeamMemberForm.recentlySuccessful}
                  className="mr-3"
                >
                  Added.
                </JetActionMessage>

                <JetButton
                  className={classNames({
                    'opacity-25': addTeamMemberForm.processing,
                  })}
                  disabled={addTeamMemberForm.processing}
                >
                  Add
                </JetButton>
              </>
            )}
          >
            <div className="col-span-6">
              <div className="max-w-xl text-sm text-gray-600">
                Please provide the email address of the person you would like to
                add to this team.
              </div>
            </div>

            {/* <!-- Member Email --> */}
            <div className="col-span-6 sm:col-span-4">
              <JetLabel htmlFor="email" value="Email" />
              <JetInput
                id="email"
                type="email"
                className="mt-1 block w-full"
                value={addTeamMemberForm.data.email}
                onChange={e =>
                  addTeamMemberForm.setData('email', e.currentTarget.value)
                }
              />
              <JetInputError
                message={addTeamMemberForm.errors.email}
                className="mt-2"
              />
            </div>

            {/* <!-- Role --> */}
            {availableRoles.length > 0 ? (
              <div className="col-span-6 lg:col-span-4">
                <JetLabel htmlFor="roles" value="Role" />
                <JetInputError
                  message={addTeamMemberForm.errors.role}
                  className="mt-2"
                />

                <div className="relative z-0 mt-1 border border-gray-200 rounded-lg cursor-pointer">
                  {availableRoles.map((role, i) => (
                    <button
                      type="button"
                      className={classNames(
                        'relative px-4 py-3 inline-flex w-full rounded-lg focus:z-10 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200',
                        {
                          'border-t border-gray-200 rounded-t-none': i > 0,
                          'rounded-b-none':
                            i != Object.keys(availableRoles).length - 1,
                        },
                      )}
                      onClick={() =>
                        addTeamMemberForm.setData('role', role.key)
                      }
                      key={role.key}
                    >
                      <div
                        className={classNames({
                          'opacity-50':
                            addTeamMemberForm.data.role &&
                            addTeamMemberForm.data.role != role.key,
                        })}
                      >
                        {/* <!-- Role Name --> */}
                        <div className="flex items-center">
                          <div
                            className={classNames('text-sm text-gray-600', {
                              'font-semibold':
                                addTeamMemberForm.data.role == role.key,
                            })}
                          >
                            {role.name}
                          </div>

                          {addTeamMemberForm.data.role == role.key ? (
                            <svg
                              className="ml-2 h-5 w-5 text-green-400"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          ) : null}
                        </div>

                        {/* <!-- Role Description --> */}
                        <div className="mt-2 text-xs text-gray-600">
                          {role.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </JetFormSection>
        </div>
      ) : null}

      {team.team_invitations.length > 0 && userPermissions.canAddTeamMembers ? (
        <div>
          <JetSectionBorder />

          {/* <!-- Team Member Invitations --> */}
          <div className="mt-10 sm:mt-0" />

          <JetActionSection
            title={'Pending Team Invitations'}
            description={
              'These people have been invited to your team and have been sent an invitation email. They may join the team by accepting the email invitation.'
            }
          >
            {/* <!-- Pending Team Member Invitation List --> */}
            <div className="space-y-6">
              {team.team_invitations.map(invitation => (
                <div
                  className="flex items-center justify-between"
                  key={invitation.id}
                >
                  <div className="text-gray-600">{invitation.email}</div>

                  <div className="flex items-center">
                    {/* <!-- Cancel Team Invitation --> */}
                    {userPermissions.canRemoveTeamMembers ? (
                      <button
                        className="cursor-pointer ml-6 text-sm text-red-500 focus:outline-none"
                        onClick={() => cancelTeamInvitation(invitation)}
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </JetActionSection>
        </div>
      ) : null}

      {team.users.length > 0 ? (
        <div>
          <JetSectionBorder />

          {/* <!-- Manage Team Members --> */}
          <div className="mt-10 sm:mt-0" />

          <JetActionSection
            title={'Team Members'}
            description={'All of the people that are part of this team.'}
          >
            {/* <!-- Team Member List --> */}
            <div className="space-y-6">
              {team.users.map(user => (
                <div
                  className="flex items-center justify-between"
                  key={user.id}
                >
                  <div className="flex items-center">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={user.profile_photo_url}
                      alt={user.name}
                    />
                    <div className="ml-4">{user.name}</div>
                  </div>

                  <div className="flex items-center">
                    {/* <!-- Manage Team Member Role --> */}
                    {userPermissions.canAddTeamMembers &&
                    availableRoles.length ? (
                      <button
                        className="ml-2 text-sm text-gray-400 underline"
                        onClick={() => manageRole(user)}
                      >
                        {displayableRole(user.membership.role)}
                      </button>
                    ) : availableRoles.length ? (
                      <div className="ml-2 text-sm text-gray-400">
                        {displayableRole(user.membership.role)}
                      </div>
                    ) : null}

                    {/* <!-- Leave Team --> */}
                    {page.props.user.id === user.id ? (
                      <button
                        className="cursor-pointer ml-6 text-sm text-red-500"
                        onClick={confirmLeavingTeam}
                      >
                        Leave
                      </button>
                    ) : null}

                    {/* <!-- Remove Team Member --> */}
                    {userPermissions.canRemoveTeamMembers ? (
                      <button
                        className="cursor-pointer ml-6 text-sm text-red-500"
                        onClick={() => confirmTeamMemberRemoval(user)}
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </JetActionSection>
        </div>
      ) : null}

      {/* <!-- Role Management Modal --> */}
      <JetDialogModal
        isOpen={currentlyManagingRole}
        onClose={() => setCurrentlyManagingRole(false)}
      >
        <JetDialogModal.Content title={'Manage Role'}></JetDialogModal.Content>
        {managingRoleFor ? (
          <div>
            <div className="relative z-0 mt-1 border border-gray-200 rounded-lg cursor-pointer">
              {availableRoles.map((role, i) => (
                <button
                  type="button"
                  className={classNames(
                    'relative px-4 py-3 inline-flex w-full rounded-lg focus:z-10 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200',
                    {
                      'border-t border-gray-200 rounded-t-none': i > 0,
                      'rounded-b-none':
                        i !== Object.keys(availableRoles).length - 1,
                    },
                  )}
                  onClick={() => updateRoleForm.setData('role', role.key)}
                  key={role.key}
                >
                  <div
                    className={classNames({
                      'opacity-50':
                        updateRoleForm.data.role &&
                        updateRoleForm.data.role !== role.key,
                    })}
                  >
                    {/* <!-- Role Name --> */}
                    <div className="flex items-center">
                      <div
                        className={classNames('text-sm text-gray-600', {
                          'font-semibold':
                            updateRoleForm.data.role === role.key,
                        })}
                      >
                        {role.name}
                      </div>
                      {updateRoleForm.data.role === role.key ? (
                        <svg
                          className="ml-2 h-5 w-5 text-green-400"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      ) : null}
                    </div>

                    {/* <!-- Role Description --> */}
                    <div className="mt-2 text-xs text-gray-600">
                      {role.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <JetDialogModal.Footer>
          <JetSecondaryButton onClick={() => setCurrentlyManagingRole(false)}>
            Cancel
          </JetSecondaryButton>

          <JetButton
            onClick={updateRole}
            className={classNames('ml-2', {
              'opacity-25': updateRoleForm.processing,
            })}
            disabled={updateRoleForm.processing}
          >
            Save
          </JetButton>
        </JetDialogModal.Footer>
      </JetDialogModal>

      {/* <!-- Leave Team Confirmation Modal --> */}
      <JetConfirmationModal
        isOpen={confirmingLeavingTeam}
        onClose={() => setConfirmingLeavingTeam(false)}
      >
        <JetConfirmationModal.Content title={'Leave Team'}>
          Are you sure you would like to leave this team?
        </JetConfirmationModal.Content>
        <JetConfirmationModal.Footer>
          <JetSecondaryButton onClick={() => setConfirmingLeavingTeam(false)}>
            Cancel
          </JetSecondaryButton>

          <JetDangerButton
            onClick={leaveTeam}
            className={classNames('ml-2', {
              'opacity-25': leaveTeamForm.processing,
            })}
            disabled={leaveTeamForm.processing}
          >
            Leave
          </JetDangerButton>
        </JetConfirmationModal.Footer>
      </JetConfirmationModal>

      {/* <!-- Remove Team Member Confirmation Modal --> */}
      <JetConfirmationModal
        isOpen={!!teamMemberBeingRemoved}
        onClose={() => setTeamMemberBeingRemoved(null)}
      >
        <JetConfirmationModal.Content title={'Remove Team Member'}>
          Are you sure you would like to remove this person from the team?
        </JetConfirmationModal.Content>
        <JetConfirmationModal.Footer>
          <JetSecondaryButton onClick={() => setTeamMemberBeingRemoved(null)}>
            Cancel
          </JetSecondaryButton>

          <JetDangerButton
            onClick={removeTeamMember}
            className={classNames('ml-2', {
              'opacity-25': removeTeamMemberForm.processing,
            })}
            disabled={removeTeamMemberForm.processing}
          >
            Remove
          </JetDangerButton>
        </JetConfirmationModal.Footer>
      </JetConfirmationModal>
    </div>
  );
}
