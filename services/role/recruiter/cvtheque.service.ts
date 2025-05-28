import api from '@/axios/axios.instance';
import {
  AddCvThequeCritereInterface,
  UpdateCvThequeCritereInterface,
} from '@/interfaces/role/recruiter/cvtheque-form';

const cvThequePrefix = '/role/recruiter/cvtheque';

const getCvThequeHistoryService = async () => {
  try {
    const res = await api.get(`${cvThequePrefix}/history`);
    return res.data;
  } catch (error) {
    return { error: `GET CVTHEQUE HISTORY ERROR: ${error}` };
  }
};

const saveCvThequeCritereService = async (id: number) => {
  try {
    const res = await api.post(`${cvThequePrefix}/${id}/save`);
    return res.data;
  } catch (error) {
    return { error: `SAVE CVTHEQUE CRITERE ERROR: ${error}` };
  }
};

const getCvAnonymService = async (id: number, cvAnonymId: number) => {
  try {
    const res = await api.get(
      `${cvThequePrefix}/${id}/cv-anonym/${cvAnonymId}`,
    );
    return res.data;
  } catch (error) {
    return { error: `GET CV ANONYM ERROR: ${error}` };
  }
};

const getCvThequeCritereService = async (id: number) => {
  try {
    const res = await api.get(`${cvThequePrefix}/${id}`);
    return res.data;
  } catch (error) {
    return { error: `GET CVTHEQUE CRITERE ERROR: ${error}` };
  }
};

const addCvThequeCritereService = async (data: AddCvThequeCritereInterface) => {
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
    return { error: `ADD CVTHEQUE CRITERE ERROR: ${error}` };
  }
};

const updateCvThequeCritereService = async (
  data: { id: number } & UpdateCvThequeCritereInterface,
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
    return { error: `UPDATE CVTHEQUE CRITERE ERROR: ${error}` };
  }
};

const resendCvThequeCritereService = async (id: number) => {
  try {
    const res = await api.get(`${cvThequePrefix}/${id}/resend`);
    return res.data;
  } catch (error) {
    return { error: `GET RESEND CVTHEQUE CRITERE ERROR: ${error}` };
  }
};

const contactAnonymService = async (data: {
  id: number;
  cvAnonymId: number;
  type: string;
  date: Date;
  hour: number;
  minute: number;
  message: string;
}) => {
  try {
    const res = await api.post(
      `${cvThequePrefix}/${data.id}/contact/${data.cvAnonymId}`,
      {
        type: data.type,
        date: data.date,
        hour: data.hour,
        minute: data.minute,
        message: data.message,
      },
    );
    return res.data;
  } catch (error) {
    return { error: `CONTACT CV ANONYM ERROR: ${error}` };
  }
};

export {
  getCvThequeHistoryService,
  getCvAnonymService,
  getCvThequeCritereService,
  addCvThequeCritereService,
  updateCvThequeCritereService,
  saveCvThequeCritereService,
  resendCvThequeCritereService,
  contactAnonymService,
};
