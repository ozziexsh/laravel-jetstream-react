import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import JetFormSection from '@/Jetstream/FormSection';
import JetInput from '@/Jetstream/Input';
import JetInputError from '@/Jetstream/InputError';
import JetLabel from '@/Jetstream/Label';
import { useForm } from '@inertiajs/inertia-react';
import React from 'react';

export default function CreateTeamForm() {
  const route = useRoute();
  const page = useTypedPage();
  const form = useForm({
    name: '',
  });

  function createTeam() {
    form.post(route('teams.store'), {
      errorBag: 'createTeam',
      preserveScroll: true,
    });
  }

  return (
    <JetFormSection
      onSubmit={createTeam}
      title={'Team Details'}
      description={'Create a new team to collaborate with others on projects.'}
    >
      <div className="col-span-6">
        <JetLabel value="Team Owner" />

        <div className="flex items-center mt-2">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={page.props.user.profile_photo_url}
            alt={page.props.user.name}
          />

          <div className="ml-4 leading-tight">
            <div>{page.props.user.name}</div>
            <div className="text-gray-700 text-sm">{page.props.user.email}</div>
          </div>
        </div>
      </div>

      <div className="col-span-6 sm:col-span-4">
        <JetLabel htmlFor="name" value="Team Name" />
        <JetInput
          id="name"
          type="text"
          className="mt-1 block w-full"
          value={form.data.name}
          onChange={e => form.setData('name', e.currentTarget.value)}
          autoFocus
        />
        <JetInputError message={form.errors.name} className="mt-2" />
      </div>
    </JetFormSection>
  );
}
