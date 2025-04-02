import api from '@/axios/axios.instance';
import { UserInterface } from '@/interfaces/user.interface';

const jwtIdService = async () => {
  try {
    const res = await api.get('/jwtid');
    return res.data;
  } catch (error) {
    return { error: `JWTID ERROR: ${error}` };
  }
};

const loginService = async ({
  email,
  password,
  remember,
  role,
}: {
  email: string;
  password: string;
  remember: boolean;
  role: UserInterface['role'];
}) => {
  try {
    const res = await api.post(
      '/auth/login',
      {
        email,
        password,
        remember,
        role,
      },
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    return { error: `LOGIN ERROR: ${error}` };
  }
};

const registerService = async ({
  name,
  email,
  password,
  role,
}: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const res = await api.post('/auth/register', {
      name,
      email,
      password,
      role,
    });
    return res.data;
  } catch (error) {
    return { error: `REGISTER ERROR: ${error}` };
  }
};

const logoutService = async () => {
  try {
    const res = await api.get('/auth/logout');
    return res.data;
  } catch (error) {
    return { error: `LOGOUT ERROR: ${error}` };
  }
};

export { jwtIdService, loginService, registerService, logoutService };
