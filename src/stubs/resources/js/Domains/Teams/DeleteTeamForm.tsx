import useRoute from '@/Hooks/useRoute';
import JetActionSection from '@/Jetstream/ActionSection';
import JetConfirmationModal from '@/Jetstream/ConfirmationModal';
import JetDangerButton from '@/Jetstream/DangerButton';
import JetSecondaryButton from '@/Jetstream/SecondaryButton';
import { Team } from '@/types';
import { useForm } from '@inertiajs/inertia-react';
import classNames from 'classnames';
import React, { useState } from 'react';

interface Props {
  team: Team;
}

export default function DeleteTeamForm({ team }: Props) {
  const route = useRoute();
  const [confirmingTeamDeletion, setConfirmingTeamDeletion] = useState(false);
  const form = useForm({});

  function confirmTeamDeletion() {
    setConfirmingTeamDeletion(true);
  }

  function deleteTeam() {
    form.delete(route('teams.destroy', [team]), {
      errorBag: 'deleteTeam',
    });
  }

  return (
    <JetActionSection
      title={'Delete Team'}
      description={'Permanently delete this team.'}
    >
      <div className="max-w-xl text-sm text-gray-600">
        Once a team is deleted, all of its resources and data will be
        permanently deleted. Before deleting this team, please download any data
        or information regarding this team that you wish to retain.
      </div>

      <div className="mt-5">
        <JetDangerButton onClick={confirmTeamDeletion}>
          Delete Team
        </JetDangerButton>
      </div>

      {/* <!-- Delete Team Confirmation Modal --> */}
      <JetConfirmationModal
        isOpen={confirmingTeamDeletion}
        onClose={() => setConfirmingTeamDeletion(false)}
      >
        <JetConfirmationModal.Content title={'Delete Team'}>
          Are you sure you want to delete this team? Once a team is deleted, all
          of its resources and data will be permanently deleted.
        </JetConfirmationModal.Content>

        <JetConfirmationModal.Footer>
          <JetSecondaryButton onClick={() => setConfirmingTeamDeletion(false)}>
            Cancel
          </JetSecondaryButton>

          <JetDangerButton
            onClick={deleteTeam}
            className={classNames('ml-2', { 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Delete Team
          </JetDangerButton>
        </JetConfirmationModal.Footer>
      </JetConfirmationModal>
    </JetActionSection>
  );
}
