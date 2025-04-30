import api from '@/axios/axios.instance';

import { UserInterface } from '@/interfaces/user.interface';

const jwtService = async () => {
  try {
    const res = await api.get('/auth/jwt');
    return res.data;
  } catch (error) {
    return { error: `JWT VERIFICATION ERROR: ${error}` };
  }
};

const loginService = async (data: {
  email: string;
  password: string;
  remember: boolean;
  role: UserInterface['role'];
}) => {
  try {
    const res = await api.post(
      '/auth/login',
      {
        email: data.email,
        password: data.password,
        remember: data.remember,
        role: data.role,
      },
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    return { error: `LOGIN ERROR: ${error}` };
  }
};

const registerService = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const res = await api.post('/auth/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
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

export { jwtService, loginService, registerService, logoutService };
