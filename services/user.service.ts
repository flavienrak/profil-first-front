import api from '@/axios/axios.instance';

const getUserService = async () => {
  try {
    const res = await api.get('/user');
    return res.data;
  } catch (error) {
    return { error: `GET USER ERROR: ${error}` };
  }
};

const cvMinuteService = async (formData: FormData) => {
  try {
    const res = await api.post('/user/cv-minute', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error) {
    return { error: `CV MINUTE ERROR: ${error}` };
  }
};

const acceptConditionsService = async () => {
  try {
    const res = await api.get('/user/accept-conditions');
    return res.data;
  } catch (error) {
    return { error: `ACCEPT CONDITIONS ERROR: ${error}` };
  }
};

export { getUserService, cvMinuteService, acceptConditionsService };
