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

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let currentQuery = null;
    const formData = new FormData();

    if (file && position.trim().length > 5) {
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
                onDragOver={(e) => e.preventDefault()}
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
                onChange={(e) => setPosition(e.target.value)}
                className="w-full h-52 p-4 border-2 border-gray-200 rounded-xl focus:border-[#6B2CF5] focus:ring-2 focus:ring-[#6B2CF5]/20 transition-colors duration-300 resize-none"
                placeholder="Copiez-collez ici le contenu de l'offre d'emploi..."
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type={'submit'}
              className="px-8 py-4 bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] text-white rounded-full font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg cursor-pointer"
            >
              Je démarre mon CV valorisant
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
