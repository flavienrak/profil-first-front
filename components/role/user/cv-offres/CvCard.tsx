'use client';

import React from 'react';
import Link from 'next/link';
import Popup from '@/components/utils/Popup';
import SecondaryButton from '@/components/utils/role/user/button/SecondaryButton';
import PrimaryButton from '@/components/utils/role/user/button/PrimaryButton';

import { FileText, PenSquare, X, Check, Trash } from 'lucide-react';
import { CvMinuteInterface } from '@/interfaces/role/user/cv-minute/cvMinute.interface';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  copyCvMinuteService,
  deleteCvMinuteService,
  updateCvMinuteNameService,
  updateCvMinuteVisibilityService,
} from '@/services/role/user/cvMinute.service';
import { useDispatch } from 'react-redux';
import {
  deleteCvMinuteReducer,
  updateOneCvMinuteReducer,
} from '@/redux/slices/role/user/cvMinute.slice';
import { useRouter } from 'next/navigation';

const cvMinuteSchema = z.object({
  name: z.string().trim().min(1, 'Nom requis'),
});

type CvMinuteFormValues = z.infer<typeof cvMinuteSchema>;

export default function CVCard({ cvMinute }: { cvMinute: CvMinuteInterface }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isEditing, setIsEditing] = React.useState(false);
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [updateChoice, setUpdateChoice] = React.useState(false);
  const [isLoadingCopy, setIsLoadingCopy] = React.useState(false);
  const [redirectLoading, setRedirectLoading] = React.useState(false);
  const [loadingVisibility, setLoadingVisibility] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = React.useState(false);

  const form = useForm<CvMinuteFormValues>({
    resolver: zodResolver(cvMinuteSchema),
    defaultValues: {
      name: cvMinute.name,
    },
  });

  const onSubmit = async (data: CvMinuteFormValues) => {
    const parseRes = cvMinuteSchema.safeParse(data);

    if (parseRes.success) {
      setUpdateLoading(true);
      const res = await updateCvMinuteNameService({
        id: cvMinute.id,
        name: parseRes.data.name,
      });
      if (res.cvMinute) {
        dispatch(updateOneCvMinuteReducer({ cvMinute: res.cvMinute }));
      }
      setUpdateLoading(false);
    }
    setIsEditing(false);
  };

  const handleChangeVisibility = async () => {
    setLoadingVisibility(true);
    const res = await updateCvMinuteVisibilityService(cvMinute.id);

    if (res.cvMinute) {
      dispatch(updateOneCvMinuteReducer({ cvMinute: res.cvMinute }));
    }

    if (showModal) {
      setShowModal(false);
    }
    setLoadingVisibility(false);
  };

  const handleCopyCvMinute = async () => {
    setIsLoadingCopy(true);
    const res = await copyCvMinuteService(cvMinute.id);

    if (res.cvMinute) {
      router.push(`/cv-minute/${res.cvMinute.id}`);
    }
  };

  const handleDeleteCvMinute = async () => {
    setIsLoadingDelete(true);
    const res = await deleteCvMinuteService(cvMinute.id);

    if (res.cvMinute) {
      dispatch(deleteCvMinuteReducer({ cvMinute: res.cvMinute }));
    }

    setIsLoadingDelete(false);
  };

  return (
    <div className="bg-[var(--bg-secondary-color)] rounded-lg shadow-md overflow-hidden">
      <div className="h-14 flex items-center gap-4 bg-[var(--u-primary-color)]/5 px-4 group">
        <div className="flex items-center gap-2 flex-1">
          <FileText className="w-6 h-6 text-[var(--u-primary-color)]" />

          {isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
                <div className="w-full flex gap-4">
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            autoComplete="off"
                            className="flex-1 border-[var(--u-primary-color)] rounded bg-[var(--bg-secondary-color)] text-[var(--text-primary-color)] placeholder:text-[var(--text-secondary-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--u-primary-color)]/20"
                            placeholder={cvMinute.name}
                            autoFocus
                            required
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <button
                    type="submit"
                    className="text-green-600 hover:text-green-700 cursor-pointer opacity-80 hover:opacity-100"
                  >
                    {updateLoading ? (
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                    ) : (
                      <Check size={20} />
                    )}
                  </button>
                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      setIsEditing(false);
                    }}
                    className="text-red-500 hover:text-red-600 cursor-pointer opacity-80 hover:opacity-100"
                  >
                    <X size={20} />
                  </button>
                </div>
              </form>
            </Form>
          ) : (
            <label
              onClick={() => setIsEditing(true)}
              className="font-medium text-[var(--text-primary-color)] hover:text-[var(--u-primary-color)] transition-colors"
            >
              {cvMinute.name}
            </label>
          )}
        </div>

        <i
          onClick={() => setShowDelete(true)}
          className="text-red-400 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        >
          <Trash size={16} />
        </i>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <button
          onClick={() => setUpdateChoice(true)}
          className={`flex items-center w-full justify-center gap-2 p-3 rounded-md text-[var(--u-primary-white)] hover:text-[var(--u-primary-color)] transition-all ${
            redirectLoading
              ? 'bg-[var(--u-primary-color)]/5 opacity-80 pointer-events-none'
              : 'bg-[var(--u-primary-color)]/5 hover:bg-[var(--u-primary-color)]/10 cursor-pointer'
          }`}
        >
          {redirectLoading ? (
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <PenSquare size={16} />
          )}
          <span className="text-sm transition-transform duration-200">
            Modifier
          </span>
        </button>

        {/* <div className="px-4 pb-4 space-y-3">
          <button
            onClick={async () => {
              if (cvMinute.visible) {
                setShowModal(true);
              } else {
                await handleChangeVisibility();
              }
            }}
            disabled={loadingVisibility}
            className={`flex items-center gap-3 w-full py-2 px-4 rounded-lg transition-all duration-200 ${
              cvMinute.visible
                ? 'bg-green-50 hover:bg-green-100'
                : 'bg-red-50 hover:bg-red-100'
            } ${
              loadingVisibility
                ? 'opacity-80 pointer-events-none'
                : 'hover:opacity-80 cursor-pointer'
            }`}
          >
            {loadingVisibility ? (
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
            ) : cvMinute.visible ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-red-500" />
            )}
            <span
              className={`text-sm ${
                cvMinute.visible ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {cvMinute.visible
                ? 'Ce CV est visible par les recruteurs'
                : "Ce CV n'est pas visible des recruteurs"}
            </span>
          </button>
        </div> */}
      </div>

      {updateChoice && (
        <Popup onClose={() => setUpdateChoice(false)}>
          <div className="flex flex-col gap-8 rounded-xl p-8 max-w-lg w-full text-center">
            <h2 className="text-2xl text-[var(--u-primary-color)] font-bold">
              Créer une copie ou modifier la version actuelle ?
            </h2>

            <div className="flex flex-col gap-4">
              <p className="text-[var(--text-primary-color)]">
                Lorsque vous cliquez sur copier, on va créer une copie de la
                version actuelle.
              </p>
              <p className="text-[var(--text-primary-color)]">
                Vous pourrez ainsi avoir plusieurs versions de vos CV tout en
                gardant l'original.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Link
                href={`/cv-minute/${cvMinute.id}`}
                onClick={() => setRedirectLoading(true)}
                className={`flex-1 flex items-center justify-center gap-2 px-8 py-1 border border-[var(--u-primary-white)] text-[var(--u-primary-white)] font-semibold rounded-full select-none ${
                  redirectLoading
                    ? 'opacity-80 pointer-events-none'
                    : 'hover:opacity-80 transition-opacity duration-150 cursor-pointer '
                }`}
              >
                {redirectLoading && (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-[1.5em] h-[1.5em] animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                <span>Modifier</span>
              </Link>
              <PrimaryButton
                label="Copier"
                isLoading={isLoadingCopy}
                onClick={handleCopyCvMinute}
                className="h-12 flex-1 px-8 text-base rounded-full"
              />
            </div>
          </div>
        </Popup>
      )}

      {showDelete && (
        <Popup onClose={() => setShowDelete(false)}>
          <div className="flex flex-col gap-8 rounded-xl p-8 max-w-lg w-full text-center">
            <h2 className="text-2xl text-[var(--u-primary-color)] font-bold">
              Voulez vous vraiment supprimer ce CV ?
            </h2>

            <div className="flex flex-col gap-4">
              <p className="text-[var(--text-primary-color)]">
                Cette action est irréversible, vous allez perdre toutes vos
                données.
              </p>
              <p className="text-[var(--text-primary-color)]">
                Vous pouvez annuler cette action en cliquant sur le bouton
                "Annuler".
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <div
                onClick={() => setRedirectLoading(true)}
                className={`flex-1 flex items-center justify-center gap-2 px-8 py-1 border border-[var(--text-secondary-gray)] text-[var(--text-secondary-gray)] font-semibold rounded-full select-none ${
                  redirectLoading
                    ? 'opacity-80 pointer-events-none'
                    : 'hover:opacity-80 transition-opacity duration-150 cursor-pointer '
                }`}
              >
                {redirectLoading && (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-[1.5em] h-[1.5em] animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                <span>Annuler</span>
              </div>
              <PrimaryButton
                label="Supprimer"
                isLoading={isLoadingDelete}
                onClick={handleDeleteCvMinute}
                className="h-12 flex-1 px-8 text-base rounded-full bg-red-400"
              />
            </div>
          </div>
        </Popup>
      )}

      {/* {showModal && (
        <Popup onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-8 rounded-xl p-8 max-w-lg w-full text-center">
            <h2 className="text-2xl text-[var(--u-primary-color)] font-bold">
              Actuellement ce CV est anonymisé par notre IA.
            </h2>

            <div className="flex flex-col gap-4">
              <p className="text-[var(--text-secondary-gray)]">
                Cette version anonyme est consultable par les recruteurs qui
                cherchent un candidat.
              </p>

              <p className="text-[var(--text-secondary-gray)]">
                A tout moment vous pouvez être contacté par les recruteurs via
                la messagerie.
              </p>
            </div>

            <p className="text-[var(--text-primary-color)] font-semibold">
              Voulez-vous conserver l'accès de votre CV anonyme aux recruteurs ?
            </p>

            <div className="flex justify-center gap-4">
              <SecondaryButton
                label="Non"
                isLoading={loadingVisibility}
                onClick={handleChangeVisibility}
                className="h-12 flex-1 px-8 gap-2 text-base rounded-full"
              />
              <PrimaryButton
                label="Oui"
                onClick={() => setShowModal(false)}
                className="h-12 flex-1 px-8 text-base rounded-full"
              />
            </div>
          </div>
        </Popup>
      )} */}
    </div>
  );
}
