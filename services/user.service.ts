import axios from 'axios';
const backendUri = process.env.NEXT_PUBLIC_BACKEND_URI;

const uploadCvService = async ({
  cv,
  position,
}: {
  cv: File;
  position: string;
}) => {
  try {
    const res = await axios.post(`${backendUri}/api/user/upload-cv`, {
      cv,
      position,
    });
    return res.data;
  } catch (error) {
    return { error: `UPLOAD CV ERROR: ${error}` };
  }
};

export { uploadCvService };
