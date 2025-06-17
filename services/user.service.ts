import api from '@/axios/axios.instance';
import { ModeType } from '@/types/mode.type';

const getUserService = async () => {
  try {
    const res = await api.get('/user');
    return res.data;
  } catch (error) {
    return { error: `GET USER ERROR: ${error}` };
  }
};

const updateUserInfosService = async (data: {
  mode?: ModeType;
  fontSize?: number;
  acceptConditions?: boolean;
  acceptFreeUse?: boolean;
}) => {
  try {
    const res = await api.put('/user/user-infos', {
      mode: data.mode,
      fontSize: data.fontSize,
      acceptConditions: data.acceptConditions,
      acceptFreeUse: data.acceptFreeUse,
    });
    return res.data;
  } catch (error) {
    return { error: `UPDATE USER INFOS ERROR: ${error}` };
  }
};

export { getUserService, updateUserInfosService };
