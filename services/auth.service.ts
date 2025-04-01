import axios from 'axios';
const backendUri = process.env.NEXT_PUBLIC_BACKEND_URI;

const jwtIdService = async () => {
  try {
    const res = await axios.get(`${backendUri}/api/jwtid`);
    return res.data;
  } catch (error) {
    return { error: `JWTID ERROR: ${error}` };
  }
};

const loginService = async ({
  email,
  password,
  remember,
}: {
  email: string;
  password: string;
  remember: boolean;
}) => {
  try {
    const res = await axios.post(`${backendUri}/api/auth/login`, {
      email,
      password,
      remember,
    });
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
    const res = await axios.post(`${backendUri}/api/auth/register`, {
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
    const res = await axios.get(`${backendUri}/api/auth/logout`);
    return res.data;
  } catch (error) {
    return { error: `LOGOUT ERROR: ${error}` };
  }
};

export { jwtIdService, loginService, registerService, logoutService };
