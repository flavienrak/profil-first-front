import api from '@/axios/axios.instance';

const acceptConditionsService = async () => {
  try {
    const res = await api.get('/user/accept-conditions');
    return res.data;
  } catch (error) {
    return { error: `ACCEPT CONDITIONS ERROR: ${error}` };
  }
};

export { acceptConditionsService };
