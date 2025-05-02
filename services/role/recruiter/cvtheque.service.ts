import api from '@/axios/axios.instance';
import {
  AddPayload,
  UpdatePayload,
} from '@/components/role/recruiter/cvtheque/id/CvThequeDetails';

const cvThequePrefix = '/role/recruiter/cvtheque';

const getCvThequeCritereService = async (id: number) => {
  try {
    const res = await api.get(`${cvThequePrefix}/${id}`);
    return res.data;
  } catch (error) {
    return { error: `GET CV CRITERE ERROR: ${error}` };
  }
};

const addCvThequeCritereService = async (data: AddPayload) => {
  try {
    const res = await api.post(`${cvThequePrefix}`, {
      position: data.position,
      description: data.description,
      domain: data.domain,
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

const updateCvThequeCritereService = async (
  data: { id: number } & UpdatePayload,
) => {
  try {
    const res = await api.put(`${cvThequePrefix}/${data.id}`, {
      position: data.position,
      description: data.description,
      domain: data.domain,
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

const addCvThequeHistory = async (id: number) => {
  try {
    const res = await api.post(`${cvThequePrefix}/${id}/history`);
    return res.data;
  } catch (error) {
    return { error: `ADD CVTHEQUE HISTORY ERROR: ${error}` };
  }
};

export {
  getCvThequeCritereService,
  addCvThequeCritereService,
  updateCvThequeCritereService,
  addCvThequeHistory,
};
