'use client';

import React from 'react';
import { AudioLines, Disc, Disc2, Mic, RotateCcw } from 'lucide-react';

export default function AudioRecorder({
  resetForm,
  setResetForm,
  setAudio,
}: {
  resetForm: boolean;
  setResetForm: (value: boolean) => void;
  setAudio: (value: Blob) => void;
}) {
  const [recording, setRecording] = React.useState(false);
  const [audioURL, setAudioURL] = React.useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] =
    React.useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = React.useState<Blob[]>([]);

  React.useEffect(() => {
    if (resetForm) {
      setAudioURL(null);
      setRecording(false);
      setResetForm(false);
    }
  }, [resetForm]);

  const startRecording = async (
    event?: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (event) {
      event.preventDefault();
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(mediaRecorder);
    setAudioChunks([]);

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
      setAudio(audioBlob);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    mediaRecorder?.stop();
    setRecording(false);
  };

  const handleRestart = async () => {
    setAudioURL(null);
    await startRecording();
  };

  return (
    <div className="flex gap-2">
      {audioURL ? (
        <>
          <audio controls src={audioURL} className="w-72 h-10" />
          <i
            onClick={handleRestart}
            className="h-10 w-10 flex justify-center items-center text-white bg-[var(--u-primary-color)] rounded-full p-2 cursor-pointer hover:opacity-80"
          >
            <RotateCcw size={16} />
          </i>
        </>
      ) : (
        <>
          {recording ? (
            <button
              onClick={stopRecording}
              className="flex items-center justify-center gap-2 bg-[var(--u-primary-color)] text-sm text-white px-4 py-2 rounded-full select-none cursor-pointer"
            >
              <div className="w-2 h-2 bg-red-400 rounded-full ring-offset-2 ring-offset-[var(--u-primary-color)] ring-2 ring-red-400 animate-pulse" />
              <span>Enregistrement en cours</span>
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="flex items-center justify-center gap-2 bg-[var(--u-primary-color)] text-sm text-white px-4 py-2 rounded-full select-none cursor-pointer"
            >
              <i>
                <Mic size={16} />
              </i>
              <span>Enregistrer</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}
