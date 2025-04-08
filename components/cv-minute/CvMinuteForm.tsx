'use client';

import React from 'react';
import Popup from '../utils/Popup';
import qs from 'query-string';

import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { addCvMinuteService } from '@/services/cvMinute.service';

export default function CvMinuteForm() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

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
    let currentQuery = null;
    const formData = new FormData();

    if (file && position.trim().length > 5) {
      setIsLoading(true);
      formData.append('file', file);
      formData.append('position', position.trim());

      const res = await addCvMinuteService(formData);

      if (res.cvMinuteId) {
        currentQuery = qs.parse(params.toString());
        const updateQuery = {
          ...currentQuery,
          cvMinute: res.cvMinuteId,
        };
        const url = qs.stringifyUrl({
          url: pathname,
          query: updateQuery,
        });

        router.push(url);
        router.refresh();
      } else if (res.invalidDocument) {
        setMessage('Le CV doit être en format PDF ou WORD seulement');
      }
    } else if (!file) {
      setMessage('Merci de mettre votre CV dans le champs dédié');
    } else if (position.trim().length < 5) {
      setMessage("Merci de copier une offre d'emploi dans le champs dédié");
    }

    setIsLoading(false);
  };

  return (
    <div className="h-full w-full flex justify-center items-center px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex flex-col gap-14 bg-white rounded-2xl p-8 shadow-lg"
      >
        <div className="flex justify-center">
          <h1 className="text-4xl font-bold max-w-[32rem] text-center bg-gradient-to-r from-[#4461F2] to-[#6B7FFF] bg-clip-text text-transparent">
            Obtenez un CV optimisé en quelques minutes
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-8">
            {/* CV Upload Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 bg-[#6B2CF5] text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </span>
                <h2 className="text-lg font-semibold">Importez votre CV</h2>
              </div>

              <label
                onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}
                htmlFor="file"
                className="flex flex-col items-center gap-4 h-52 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#6B2CF5] transition-colors duration-300 cursor-pointer group"
              >
                <Upload className="w-12 h-12 text-gray-400 group-hover:text-[#6B2CF5] transition-colors duration-300 cursor-pointer" />
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

            {/* Job Description Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 bg-[#6B2CF5] text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </span>
                <h2 className="text-lg font-semibold">
                  Collez l'offre d'emploi
                </h2>
              </div>
              <textarea
                required
                onChange={(event) => setPosition(event.target.value)}
                className="w-full h-52 p-4 border-2 border-gray-200 rounded-xl focus:border-[#6B2CF5] focus:ring-2 focus:ring-[#6B2CF5]/20 transition-colors duration-300 resize-none"
                placeholder="Copiez-collez ici le contenu de l'offre d'emploi..."
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type={'submit'}
              disabled={isLoading}
              className={`px-8 py-4 bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] text-white rounded-full font-semibold transition-opacity duration-300 shadow-lg ${
                isLoading ? 'opacity-90' : 'hover:opacity-90 cursor-pointer'
              }`}
            >
              <p className="flex justify-center items-center gap-[0.5em] font-semibold text-[0.875em] text-white">
                {isLoading && (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 me-2 text-white animate-spin"
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
                <span>Je démarre mon CV valorisant</span>
              </p>
            </button>
          </div>
        </form>
      </motion.div>

      {message && (
        <Popup onClose={() => setMessage('')}>
          <div className="flex items-center flex-col gap-6">
            <p className="max-w-4/5 text-center text-lg tracking-wide">
              {message}
            </p>
            <button
              onClick={() => setMessage('')}
              className="w-full px-8 py-3 bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 cursor-pointer"
            >
              J'ai compris
            </button>
          </div>
        </Popup>
      )}
    </div>
  );
}
