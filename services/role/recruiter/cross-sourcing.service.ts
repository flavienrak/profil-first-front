import api from '@/axios/axios.instance';

const crossSourcingPrefix = '/role/recruiter/cross-sourcing';

const getUsersService = async () => {
  try {
    const res = await api.get(`${crossSourcingPrefix}`);
    return res.data;
  } catch (error) {
    return { error: `GET USERS ERROR: ${error}` };
  }
};

const getUserCvMinutesService = async (id: number) => {
  try {
    const res = await api.get(`${crossSourcingPrefix}/${id}`);
    return res.data;
  } catch (error) {
    return { error: `GET USER CVMINUTES ERROR: ${error}` };
  }
};

const getUserCvMinuteService = async (data: {
  id: number;
  cvMinuteId: number;
}) => {
  try {
    const res = await api.get(
      `${crossSourcingPrefix}/${data.id}/cv-minute/${data.cvMinuteId}`,
    );
    return res.data;
  } catch (error) {
    return { error: `GET USER CVMINUTE ERROR: ${error}` };
  }
};

export { getUsersService, getUserCvMinutesService, getUserCvMinuteService };
