import api from '@/axios/axios.instance';

const getUserService = async () => {
  try {
    const res = await api.get('/user');
    return res.data;
  } catch (error) {
    return { error: `GET USER ERROR: ${error}` };
  }
};

export { getUserService };
