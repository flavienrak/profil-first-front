import api from '@/axios/axios.instance';

const mailValidationTokenService = async (token: string) => {
  try {
    const res = await api.get(`/token/mail-validation/${token}`);
    return res.data;
  } catch (error) {
    return { error: `MAIL VALIDATION TOKEN ERROR: ${error}` };
  }
};

const mailValidationService = async (data: { token: string; code: string }) => {
  try {
    const res = await api.post(`/token/mail-validation/${data.token}`, {
      code: data.code,
    });
    return res.data;
  } catch (error) {
    return { error: `MAIL VALIDATION ERROR: ${error}` };
  }
};

const resendMailValidationTokenService = async (token: string) => {
  try {
    const res = await api.get(`/token/mail-validation/${token}/resend`);
    return res.data;
  } catch (error) {
    return { error: `RESEND MAIL VALIDATION TOKEN ERROR: ${error}` };
  }
};

export {
  mailValidationTokenService,
  mailValidationService,
  resendMailValidationTokenService,
};
