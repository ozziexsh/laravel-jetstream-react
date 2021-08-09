import useRoute from '@/Hooks/useRoute';
import JetActionMessage from '@/Jetstream/ActionMessage';
import JetButton from '@/Jetstream/Button';
import JetFormSection from '@/Jetstream/FormSection';
import JetInput from '@/Jetstream/Input';
import JetInputError from '@/Jetstream/InputError';
import JetLabel from '@/Jetstream/Label';
import { JetstreamTeamPermissions, Team, User } from '@/types';
import { useForm } from '@inertiajs/inertia-react';
import classNames from 'classnames';
import React from 'react';

interface Props {
  team: Team & { owner: User };
  permissions: JetstreamTeamPermissions;
}

export default function UpdateTeamNameForm({ team, permissions }: Props) {
  const route = useRoute();
  const form = useForm({
    name: team.name,
  });

  function updateTeamName() {
    form.put(route('teams.update', [team]), {
      errorBag: 'updateTeamName',
      preserveScroll: true,
    });
  }

  return (
    <JetFormSection
      onSubmit={updateTeamName}
      title={'Team Name'}
      description={`The team's name and owner information.`}
      renderActions={
        permissions.canUpdateTeam
          ? () => (
              <>
                <JetActionMessage on={form.recentlySuccessful} className="mr-3">
                  Saved.
                </JetActionMessage>

                <JetButton
                  className={classNames({ 'opacity-25': form.processing })}
                  disabled={form.processing}
                >
                  Save
                </JetButton>
              </>
            )
          : undefined
      }
    >
      {/* <!-- Team Owner Information --> */}
      <div className="col-span-6">
        <JetLabel value="Team Owner" />

        <div className="flex items-center mt-2">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={team.owner.profile_photo_url}
            alt={team.owner.name}
          />

          <div className="ml-4 leading-tight">
            <div>{team.owner.name}</div>
            <div className="text-gray-700 text-sm">{team.owner.email}</div>
          </div>
        </div>
      </div>

      {/* <!-- Team Name --> */}
      <div className="col-span-6 sm:col-span-4">
        <JetLabel htmlFor="name" value="Team Name" />

        <JetInput
          id="name"
          type="text"
          className="mt-1 block w-full"
          value={form.data.name}
          onChange={e => form.setData('name', e.currentTarget.value)}
          disabled={!permissions.canUpdateTeam}
        />

        <JetInputError message={form.errors.name} className="mt-2" />
      </div>
    </JetFormSection>
  );
}
