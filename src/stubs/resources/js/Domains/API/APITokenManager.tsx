import { useForm, usePage } from '@inertiajs/inertia-react';
import classNames from 'classnames';
import React, { useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import JetActionMessage from '@/Jetstream/ActionMessage';
import JetActionSection from '@/Jetstream/ActionSection';
import JetButton from '@/Jetstream/Button';
import JetCheckbox from '@/Jetstream/Checkbox';
import JetConfirmationModal from '@/Jetstream/ConfirmationModal';
import JetDangerButton from '@/Jetstream/DangerButton';
import JetDialogModal from '@/Jetstream/DialogModal';
import JetFormSection from '@/Jetstream/FormSection';
import JetInput from '@/Jetstream/Input';
import JetInputError from '@/Jetstream/InputError';
import JetLabel from '@/Jetstream/Label';
import JetSecondaryButton from '@/Jetstream/SecondaryButton';
import JetSectionBorder from '@/Jetstream/SectionBorder';
import { ApiToken } from '@/types';

interface Props {
  tokens: ApiToken[];
  availablePermissions: string[];
  defaultPermissions: string[];
}

export default function APITokenManager({
  tokens,
  availablePermissions,
  defaultPermissions,
}: Props) {
  const route = useRoute();
  const createApiTokenForm = useForm({
    name: '',
    permissions: defaultPermissions,
  });
  const updateApiTokenForm = useForm({
    permissions: [] as string[],
  });
  const deleteApiTokenForm = useForm({});
  const [displayingToken, setDisplayingToken] = useState(false);
  const [managingPermissionsFor, setManagingPermissionsFor] =
    useState<ApiToken | null>(null);
  const [apiTokenBeingDeleted, setApiTokenBeingDeleted] =
    useState<ApiToken | null>(null);
  const page = usePage<any>();

  function createApiToken() {
    createApiTokenForm.post(route('api-tokens.store'), {
      preserveScroll: true,
      onSuccess: () => {
        setDisplayingToken(true);
        createApiTokenForm.reset();
      },
    });
  }

  function manageApiTokenPermissions(token: ApiToken) {
    updateApiTokenForm.setData('permissions', token.abilities);
    setManagingPermissionsFor(token);
  }

  function updateApiToken() {
    if (!managingPermissionsFor) {
      return;
    }
    updateApiTokenForm.put(
      route('api-tokens.update', [managingPermissionsFor]),
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => setManagingPermissionsFor(null),
      },
    );
  }

  function confirmApiTokenDeletion(token: ApiToken) {
    setApiTokenBeingDeleted(token);
  }

  function deleteApiToken() {
    if (!apiTokenBeingDeleted) {
      return;
    }
    deleteApiTokenForm.delete(
      route('api-tokens.destroy', [apiTokenBeingDeleted]),
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => setApiTokenBeingDeleted(null),
      },
    );
  }

  return (
    <div>
      {/* <!-- Generate API Token --> */}
      <JetFormSection
        onSubmit={createApiToken}
        title={'Create API Token'}
        description={
          'API tokens allow third-party services to authenticate with our application on your behalf.'
        }
        renderActions={() => (
          <>
            <JetActionMessage
              on={createApiTokenForm.recentlySuccessful}
              className="mr-3"
            >
              Created.
            </JetActionMessage>

            <JetButton
              className={classNames({
                'opacity-25': createApiTokenForm.processing,
              })}
              disabled={createApiTokenForm.processing}
            >
              Create
            </JetButton>
          </>
        )}
      >
        {/* <!-- Token Name --> */}
        <div className="col-span-6 sm:col-span-4">
          <JetLabel htmlFor="name">Name</JetLabel>
          <JetInput
            id="name"
            type="text"
            className="mt-1 block w-full"
            value={createApiTokenForm.data.name}
            onChange={e =>
              createApiTokenForm.setData('name', e.currentTarget.value)
            }
            autoFocus
          />
          <JetInputError
            message={createApiTokenForm.errors.name}
            className="mt-2"
          />
        </div>

        {/* <!-- Token Permissions --> */}
        {availablePermissions.length > 0 && (
          <div className="col-span-6">
            <JetLabel htmlFor="permissions">Permissions</JetLabel>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {availablePermissions.map(permission => (
                <div key={permission}>
                  <label className="flex items-center">
                    <JetCheckbox
                      value={permission}
                      checked={createApiTokenForm.data.permissions.includes(
                        permission,
                      )}
                      onChange={e => {
                        if (
                          createApiTokenForm.data.permissions.includes(
                            e.currentTarget.value,
                          )
                        ) {
                          createApiTokenForm.setData(
                            'permissions',
                            createApiTokenForm.data.permissions.filter(
                              p => p !== e.currentTarget.value,
                            ),
                          );
                        } else {
                          createApiTokenForm.setData('permissions', [
                            e.currentTarget.value,
                            ...createApiTokenForm.data.permissions,
                          ]);
                        }
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {permission}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </JetFormSection>

      {tokens.length > 0 ? (
        <div>
          <JetSectionBorder />

          {/* <!-- Manage API Tokens --> */}
          <div className="mt-10 sm:mt-0">
            <JetActionSection
              title={'Manage API Tokens'}
              description={
                'You may delete any of your existing tokens if they are no longer needed.'
              }
            >
              {/* <!-- API Token List --> */}
              <div className="space-y-6">
                {tokens.map(token => (
                  <div
                    className="flex items-center justify-between"
                    key={token.id}
                  >
                    <div>{token.name}</div>

                    <div className="flex items-center">
                      {token.last_used_ago && (
                        <div className="text-sm text-gray-400">
                          Last used {token.last_used_ago}
                        </div>
                      )}

                      {availablePermissions.length > 0 ? (
                        <button
                          className="cursor-pointer ml-6 text-sm text-gray-400 underline"
                          onClick={() => manageApiTokenPermissions(token)}
                        >
                          Permissions
                        </button>
                      ) : null}

                      <button
                        className="cursor-pointer ml-6 text-sm text-red-500"
                        onClick={() => confirmApiTokenDeletion(token)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </JetActionSection>
          </div>
        </div>
      ) : null}

      {/* <!-- Token Value Modal --> */}
      <JetDialogModal
        isOpen={displayingToken}
        onClose={() => setDisplayingToken(false)}
      >
        <JetDialogModal.Content title={'API Token'}>
          <div>
            Please copy your new API token. For your security, it won't be shown
            again.
          </div>

          <div className="mt-4 bg-gray-100 px-4 py-2 rounded font-mono text-sm text-gray-500">
            {page.props?.jetstream?.flash?.token}
          </div>
        </JetDialogModal.Content>
        <JetDialogModal.Footer>
          <JetSecondaryButton onClick={() => setDisplayingToken(false)}>
            Close
          </JetSecondaryButton>
        </JetDialogModal.Footer>
      </JetDialogModal>

      {/* <!-- API Token Permissions Modal --> */}
      <JetDialogModal
        isOpen={!!managingPermissionsFor}
        onClose={() => setManagingPermissionsFor(null)}
      >
        <JetDialogModal.Content title={'API Token Permissions'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availablePermissions.map(permission => (
              <div key={permission}>
                <label className="flex items-center">
                  <JetCheckbox
                    value={permission}
                    checked={updateApiTokenForm.data.permissions.includes(
                      permission,
                    )}
                    onChange={e => {
                      if (
                        updateApiTokenForm.data.permissions.includes(
                          e.currentTarget.value,
                        )
                      ) {
                        updateApiTokenForm.setData(
                          'permissions',
                          updateApiTokenForm.data.permissions.filter(
                            p => p !== e.currentTarget.value,
                          ),
                        );
                      } else {
                        updateApiTokenForm.setData('permissions', [
                          e.currentTarget.value,
                          ...updateApiTokenForm.data.permissions,
                        ]);
                      }
                    }}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {permission}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </JetDialogModal.Content>
        <JetDialogModal.Footer>
          <JetSecondaryButton onClick={() => setManagingPermissionsFor(null)}>
            Cancel
          </JetSecondaryButton>

          <JetButton
            onClick={updateApiToken}
            className={classNames('ml-2', {
              'opacity-25': updateApiTokenForm.processing,
            })}
            disabled={updateApiTokenForm.processing}
          >
            Save
          </JetButton>
        </JetDialogModal.Footer>
      </JetDialogModal>

      {/* <!-- Delete Token Confirmation Modal --> */}
      <JetConfirmationModal
        isOpen={!!apiTokenBeingDeleted}
        onClose={() => setApiTokenBeingDeleted(null)}
      >
        <JetConfirmationModal.Content title={'Delete API Token'}>
          Are you sure you would like to delete this API token?
        </JetConfirmationModal.Content>
        <JetConfirmationModal.Footer>
          <JetSecondaryButton onClick={() => setApiTokenBeingDeleted(null)}>
            Cancel
          </JetSecondaryButton>

          <JetDangerButton
            onClick={deleteApiToken}
            className={classNames('ml-2', {
              'opacity-25': deleteApiTokenForm.processing,
            })}
            disabled={deleteApiTokenForm.processing}
          >
            Delete
          </JetDangerButton>
        </JetConfirmationModal.Footer>
      </JetConfirmationModal>
    </div>
  );
}
