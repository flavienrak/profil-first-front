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

const updateCvMinuteSectionService = async ({
  id,
  sectionId,
  sectionInfoId,
  content,
  sectionTitle,
  title,
  company,
  date,
  contrat,
  conseil,
  suggestion,
}: {
  id: number;
  sectionId: number;
  sectionInfoId?: number;
  content?: string;
  sectionTitle?: string;
  title?: string;
  company?: string;
  date?: string;
  contrat?: string;
  conseil: string;
  suggestion: string;
}) => {
  try {
    const res = await api.put(`/cv-minute/${id}/section`, {
      sectionId,
      sectionInfoId,
      content,
      sectionTitle,
      title,
      company,
      date,
      contrat,
      conseil,
      suggestion,
    });
    return res.data;
  } catch (error) {
    return { error: `UPDATE CV MINUTE SECTION ERROR: ${error}` };
  }
};

export { getCvMinuteService, addCvMinuteService, updateCvMinuteSectionService };
