import api from '@/axios/axios.instance';

const cvThequePrefix = '/role/recruiter/cvtheque';

const getCvCritereService = async (id: number) => {
  try {
    const res = await api.get(`${cvThequePrefix}/${id}`);
    return res.data;
  } catch (error) {
    return { error: `GET CV CRITERE ERROR: ${error}` };
  }
};

const addCvCritereService = async (data: {
  position: string;
  description?: string;
  competences?: string[];
  experience?: number;
  diplome?: string;
  localisation?: string;
  distance?: number;
}) => {
  try {
    const res = await api.post(`${cvThequePrefix}`, {
      position: data.position,
      description: data.description,
      competences: data.competences,
      experience: data.experience,
      diplome: data.diplome,
      localisation: data.localisation,
      distance: data.distance,
    });
    return res.data;
  } catch (error) {
    return { error: `ADD CV CRITERE ERROR: ${error}` };
  }
};

const updateCvCritereService = async (data: {
  id: number;
  position: string;
  description?: string;
  competences?: string[];
  experience?: number;
  diplome?: string;
  localisation?: string;
  distance?: number;
}) => {
  try {
    const res = await api.put(`${cvThequePrefix}/${data.id}`, {
      position: data.position,
      description: data.description,
      competences: data.competences,
      experience: data.experience,
      diplome: data.diplome,
      localisation: data.localisation,
      distance: data.distance,
    });
    return res.data;
  } catch (error) {
    return { error: `UPDATE CV CRITERE ERROR: ${error}` };
  }
};

export { getCvCritereService, addCvCritereService, updateCvCritereService };
