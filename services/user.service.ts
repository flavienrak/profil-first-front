import api from '@/axios/axios.instance';

const uploadCvService = async ({
  cv,
  position,
}: {
  cv: File;
  position: string;
}) => {
  try {
    const res = await api.post('/user/upload-cv', {
      cv,
      position,
    });
    return res.data;
  } catch (error) {
    return { error: `UPLOAD CV ERROR: ${error}` };
  }
};

export { uploadCvService };
