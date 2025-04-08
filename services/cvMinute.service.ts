import api from '@/axios/axios.instance';

const getCvMinuteService = async (id: string | number) => {
  try {
    const res = await api.get(`/cv-minute/${id}`);
    return res.data;
  } catch (error) {
    return { error: `GET CV MINUTE ERROR: ${error}` };
  }
};

const addCvMinuteService = async (formData: FormData) => {
  try {
    const res = await api.post('/cv-minute', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error) {
    return { error: `ADD CV MINUTE ERROR: ${error}` };
  }
};

const updateCvMinuteProfileService = async (id: number, formData: FormData) => {
  try {
    const res = await api.post(`/cv-minute/${id}/profile`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error) {
    return { error: `UPDATE CV MINUTE PROFILE ERROR: ${error}` };
  }
};

const updateCvMinuteSectionService = async ({
  id,
  content,
  sectionTitle,
  title,
  company,
  date,
  contrat,
  conseil,
  suggestion,
  sectionId,
  sectionOrder,
  sectionInfoId,
  sectionInfoOrder,
  cvMinuteSectionId,
}: {
  id: number;
  content?: string;
  sectionTitle?: string;
  title?: string;
  company?: string;
  date?: string;
  contrat?: string;
  conseil?: string;
  suggestion?: string;
  sectionId?: number;
  sectionOrder?: number;
  sectionInfoId?: number;
  sectionInfoOrder?: number;
  cvMinuteSectionId?: number;
}) => {
  try {
    const res = await api.put(`/cv-minute/${id}/section`, {
      sectionId,
      sectionOrder,
      sectionInfoId,
      sectionInfoOrder,
      content,
      sectionTitle,
      title,
      company,
      date,
      contrat,
      conseil,
      suggestion,
      cvMinuteSectionId,
    });
    return res.data;
  } catch (error) {
    return { error: `UPDATE CV MINUTE SECTION ERROR: ${error}` };
  }
};

export {
  getCvMinuteService,
  addCvMinuteService,
  updateCvMinuteProfileService,
  updateCvMinuteSectionService,
};
