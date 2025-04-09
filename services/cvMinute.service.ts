import api from '@/axios/axios.instance';
import { PopupInterface } from '@/components/cv-minute/CvPreview';

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
  title,
  sectionTitle,
  content,
  company,
  date,
  contrat,
  sectionId,
  sectionOrder,
  sectionInfoId,
  sectionInfoOrder,
  cvMinuteSectionId,

  newSection,
  updateExperience,
  updateCvMinuteSection,
}: {
  id: number;
  title?: string;
  sectionTitle?: string;
  content: string;
  company?: string;
  date?: string;
  contrat?: string;
  sectionId?: PopupInterface['sectionId'];
  sectionOrder?: PopupInterface['sectionOrder'];
  sectionInfoId?: PopupInterface['sectionInfoId'];
  sectionInfoOrder?: PopupInterface['sectionInfoOrder'];
  cvMinuteSectionId?: PopupInterface['cvMinuteSectionId'];

  newSection?: PopupInterface['newSection'];
  updateExperience?: PopupInterface['updateExperience'];
  updateCvMinuteSection?: PopupInterface['updateCvMinuteSection'];
}) => {
  try {
    const res = await api.put(`/cv-minute/${id}/section`, {
      title,
      sectionTitle,
      content,
      company,
      date,
      contrat,
      sectionId,
      sectionOrder,
      sectionInfoId,
      sectionInfoOrder,
      cvMinuteSectionId,

      newSection,
      updateExperience,
      updateCvMinuteSection,
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
