'use client';

import React from 'react';
import Popup from '@/components/utils/Popup';
import Title from '@/components/utils/role/user/Title';
import PrimaryButton from '@/components/utils/role/user/button/PrimaryButton';

import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addCvMinuteService } from '@/services/role/user/cvMinute.service';
import { useDispatch } from 'react-redux';

export default function CvMinuteComponent() {
  const router = useRouter();

  const [file, setFile] = React.useState<File | null>(null);
  const [message, setMessage] = React.useState('');
  const [position, setPosition] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();

    if (file && position.trim().length > 5) {
      setIsLoading(true);
      formData.append('file', file);
      formData.append('position', position.trim());

      const res = await addCvMinuteService(formData);

      if (res.cvMinuteId) {
        router.push(`/cv-minute/${res.cvMinuteId}`);
      } else if (res.invalidDocument) {
        setMessage('Le CV doit être en format PDF ou WORD seulement');
      }
    } else if (!file) {
      setMessage('Merci de mettre votre CV dans le champs dédié');
    } else if (position.trim().length < 5) {
      setMessage("Merci de copier une offre d'emploi dans le champs dédié");
    }
  };

  return (
    <div className="h-full w-full flex justify-center items-center px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl w-full flex flex-col gap-14 bg-white rounded-2xl p-8 shadow-lg"
      >
        <div className="flex justify-center">
          <Title
            value={'Obtenez un CV optimisé en quelques minutes'}
            className="max-w-[32rem]"
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 bg-[var(--u-primary-color)] text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </span>
                <h2 className="text-lg font-semibold">Importez votre CV</h2>
              </div>

              <label
                onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}
                htmlFor="file"
                className="flex flex-col items-center gap-4 h-52 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[var(--u-primary-color)] transition-colors duration-300 cursor-pointer group"
              >
                <Upload className="w-12 h-12 text-gray-400 group-hover:text-[var(--u-primary-color)] transition-colors duration-300 cursor-pointer" />
                {file ? (
                  <p className="font-medium tracking-tighter">{file.name}</p>
                ) : (
                  <p className="text-gray-500">
                    Déposez votre CV ici ou cliquez pour sélectionner <br />
                    Fichier: PDF ou WORD
                  </p>
                )}
                <input
                  id="file"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChangeFile}
                />
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 bg-[var(--u-primary-color)] text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </span>
                <h2 className="text-lg font-semibold">
                  Collez l'offre d'emploi
                </h2>
              </div>
              <textarea
                required
                onChange={(event) => setPosition(event.target.value)}
                className="w-full h-52 p-4 border-2 border-gray-200 rounded-xl focus:border-[var(--u-primary-color)] focus:ring-2 focus:ring-[var(--u-primary-color)]/20 transition-colors duration-300 resize-none"
                placeholder="Copiez-collez ici le contenu de l'offre d'emploi..."
              />
            </div>
          </div>

          <div className="flex justify-center">
            <PrimaryButton
              label="Je démarre mon CV valorisant"
              type="submit"
              isLoading={isLoading}
              className="w-80 h-14 px-8 py-4 rounded-full text-base shadow-lg"
            />
          </div>
        </form>
      </motion.div>

      {message && (
        <Popup onClose={() => setMessage('')}>
          <div className="flex items-center flex-col gap-6">
            <p className="max-w-4/5 text-center text-lg tracking-wide">
              {message}
            </p>
            <PrimaryButton
              label="J'ai compris"
              onClick={() => setMessage('')}
              className="h-14 px-8 text-base rounded-full"
            />
          </div>
        </Popup>
      )}
    </div>
  );
}
