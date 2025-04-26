import api from '@/axios/axios.instance';

import { PopupInterface } from '@/components/cv-minute/id/CvPreview';
import { IconInterface } from '@/interfaces/icon.interface';

const getCvMinuteService = async (id: number) => {
  try {
    const res = await api.get(`/cv-minute/${id}`);
    return res.data;
  } catch (error) {
    return { error: `GET CVMINUTE ERROR: ${error}` };
  }
};

const updateCvMinuteNameService = async (data: {
  id: number;
  name: string;
}) => {
  try {
    const res = await api.put(`/cv-minute/${data.id}/name`, {
      name: data.name,
    });
    return res.data;
  } catch (error) {
    return { error: `UPDATE CVMINUTE NAME ERROR: ${error}` };
  }
};

const updateCvMinuteVisibilityService = async (id: number) => {
  try {
    const res = await api.put(`/cv-minute/${id}/visibility`);
    return res.data;
  } catch (error) {
    return { error: `UPDATE CVMINUTE VISIBILITY ERROR: ${error}` };
  }
};

const getAllCvMinuteService = async () => {
  try {
    const res = await api.get('/cv-minute');
    return res.data;
  } catch (error) {
    return { error: `GET ALL CVMINUTE ERROR: ${error}` };
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

const updateCvMinuteSectionService = async (data: {
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
    const res = await api.put(`/cv-minute/${data.id}/section`, {
      title: data.title,
      sectionTitle: data.sectionTitle,
      content: data.content,
      company: data.company,
      date: data.date,
      contrat: data.contrat,
      icon: data.icon,
      iconSize: data.iconSize,
      primaryBg: data.primaryBg,
      secondaryBg: data.secondaryBg,
      tertiaryBg: data.tertiaryBg,
      sectionInfoId: data.sectionInfoId,
      cvMinuteSectionId: data.cvMinuteSectionId,

      updateBg: data.updateBg,
      newSection: data.newSection,
      updateExperience: data.updateExperience,
      updateContactSection: data.updateContactSection,
      updateCvMinuteSection: data.updateCvMinuteSection,
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

const updateSectionInfoOrderService = async (data: {
  id: number;
  sectionInfoId: number;
  targetSectionInfoId: number;
}) => {
  try {
    const res = await api.put(`/cv-minute/${data.id}/section-info/order`, {
      sectionInfoId: data.sectionInfoId,
      targetSectionInfoId: data.targetSectionInfoId,
    });
    return res.data;
  } catch (error) {
    return { error: `UPDATE SECTIONINFO ORDER ERROR: ${error}` };
  }
};

const generateSectionInfoAdviceService = async (data: {
  id: number;
  sectionInfoId: number;
  section: string;
}) => {
  try {
    const res = await api.post(
      `/cv-minute/${data.id}/section-info/${data.sectionInfoId}`,
      { section: data.section },
    );
    return res.data;
  } catch (error) {
    return { error: `GENERATE SECTIONINFO PROPOSITION ERROR: ${error}` };
  }
};

const updateSectionInfoScoreService = async (data: {
  id: number;
  sectionInfoId: number;
}) => {
  try {
    const res = await api.put(
      `/cv-minute/${data.id}/section-info/${data.sectionInfoId}`,
    );
    return res.data;
  } catch (error) {
    return { error: `UPDATE SECTIONINFO SCORE ERROR: ${error}` };
  }
};

const updateCvMinuteSectionOrderService = async (data: {
  id: number;
  cvMinuteSectionId: number;
  targetCvMinuteSectionId: number;
}) => {
  try {
    const res = await api.put(`/cv-minute/${data.id}/section/order`, {
      cvMinuteSectionId: data.cvMinuteSectionId,
      targetCvMinuteSectionId: data.targetCvMinuteSectionId,
    });
    return res.data;
  } catch (error) {
    return { error: `UPDATE CVMINUTE SECTION ORDER ERROR: ${error}` };
  }
};

const deleteSectionInfoService = async (data: {
  id: number;
  sectionInfoId: number;
}) => {
  try {
    const res = await api.delete(
      `/cv-minute/${data.id}/section-info/${data.sectionInfoId}`,
    );
    return res.data;
  } catch (error) {
    return { error: `DELETE SECTIONINFO ERROR: ${error}` };
  }
};

export {
  getCvMinuteService,
  updateCvMinuteNameService,
  updateCvMinuteVisibilityService,
  getAllCvMinuteService,
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
