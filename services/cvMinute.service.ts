import api from '@/axios/axios.instance';
import { PopupInterface } from '@/components/cv-minute/CvPreview';
import { IconInterface } from '@/interfaces/icon.interface';

const getCvMinuteService = async (id: number) => {
  try {
    const res = await api.get(`/cv-minute/${id}`);
    return res.data;
  } catch (error) {
    return { error: `GET CVMINUTE ERROR: ${error}` };
  }
};

const generateCvMinuteSectionAdviceService = async (id: number) => {
  try {
    const res = await api.post(`/cv-minute/${id}`);
    return res.data;
  } catch (error) {
    return { error: `GENERATE CVMINUTE PROPOSITION ERROR: ${error}` };
  }
};

const updateCvMinuteScoreService = async (id: number) => {
  try {
    const res = await api.put(`/cv-minute/${id}`);
    return res.data;
  } catch (error) {
    return { error: `UPDATE CVMINUTE SCORE ERROR: ${error}` };
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

const optimizeCvMinuteService = async (id: number) => {
  try {
    const res = await api.post(`/cv-minute/${id}/optimize`);
    return res.data;
  } catch (error) {
    return { error: `OPTIMIZE CVMINUTE ERROR: ${error}` };
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
  icon,
  iconSize,
  primaryBg,
  secondaryBg,
  tertiaryBg,
  sectionInfoId,
  cvMinuteSectionId,

  updateBg,
  newSection,
  updateExperience,
  updateContactSection,
  updateCvMinuteSection,
}: {
  id: number;
  title?: string;
  sectionTitle?: string;
  content: string;
  company?: string;
  date?: string;
  contrat?: string;
  icon?: IconInterface;
  iconSize?: number;
  primaryBg?: string;
  secondaryBg?: string;
  tertiaryBg?: string;
  sectionInfoId?: PopupInterface['sectionInfoId'];
  cvMinuteSectionId?: PopupInterface['cvMinuteSectionId'];

  updateBg?: PopupInterface['updateBg'];
  newSection?: PopupInterface['newSection'];
  updateExperience?: PopupInterface['updateExperience'];
  updateContactSection?: PopupInterface['updateContactSection'];
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
      icon,
      iconSize,
      primaryBg,
      secondaryBg,
      tertiaryBg,
      sectionInfoId,
      cvMinuteSectionId,

      updateBg,
      newSection,
      updateExperience,
      updateContactSection,
      updateCvMinuteSection,
    });
    return res.data;
  } catch (error) {
    return { error: `UPDATE CV MINUTE SECTION ERROR: ${error}` };
  }
};

const deleteCvMinuteSectionService = async (
  id: number,
  cvMinuteSectionId: number,
) => {
  try {
    const res = await api.delete(
      `/cv-minute/${id}/section/${cvMinuteSectionId}`,
    );
    return res.data;
  } catch (error) {
    return { error: `DELETE CVMINUTESECTION ERROR: ${error}` };
  }
};

const updateSectionInfoOrderService = async ({
  id,
  sectionInfoId,
  targetSectionInfoId,
}: {
  id: number;
  sectionInfoId: number;
  targetSectionInfoId: number;
}) => {
  try {
    const res = await api.put(`/cv-minute/${id}/section-info/order`, {
      sectionInfoId,
      targetSectionInfoId,
    });
    return res.data;
  } catch (error) {
    return { error: `UPDATE SECTIONINFO ORDER ERROR: ${error}` };
  }
};

const generateSectionInfoAdviceService = async (
  id: number,
  sectionInfoId: number,
  section: string,
) => {
  try {
    const res = await api.post(
      `/cv-minute/${id}/section-info/${sectionInfoId}`,
      { section },
    );
    return res.data;
  } catch (error) {
    return { error: `GENERATE SECTIONINFO PROPOSITION ERROR: ${error}` };
  }
};

const updateSectionInfoScoreService = async ({
  id,
  sectionInfoId,
}: {
  id: number;
  sectionInfoId: number;
}) => {
  try {
    const res = await api.put(`/cv-minute/${id}/section-info/${sectionInfoId}`);
    return res.data;
  } catch (error) {
    return { error: `UPDATE SECTIONINFO SCORE ERROR: ${error}` };
  }
};

const updateCvMinuteSectionOrderService = async ({
  id,
  cvMinuteSectionId,
  targetCvMinuteSectionId,
}: {
  id: number;
  cvMinuteSectionId: number;
  targetCvMinuteSectionId: number;
}) => {
  try {
    const res = await api.put(`/cv-minute/${id}/section/order`, {
      cvMinuteSectionId,
      targetCvMinuteSectionId,
    });
    return res.data;
  } catch (error) {
    return { error: `UPDATE CVMINUTE SECTION ORDER ERROR: ${error}` };
  }
};

const deleteSectionInfoService = async (id: number, sectionInfoId: number) => {
  try {
    const res = await api.delete(
      `/cv-minute/${id}/section-info/${sectionInfoId}`,
    );
    return res.data;
  } catch (error) {
    return { error: `DELETE SECTIONINFO ERROR: ${error}` };
  }
};

export {
  getCvMinuteService,
  generateCvMinuteSectionAdviceService,
  updateCvMinuteScoreService,
  addCvMinuteService,
  optimizeCvMinuteService,
  updateCvMinuteProfileService,
  updateCvMinuteSectionService,
  deleteCvMinuteSectionService,
  updateSectionInfoOrderService,
  generateSectionInfoAdviceService,
  updateSectionInfoScoreService,
  updateCvMinuteSectionOrderService,
  deleteSectionInfoService,
};
