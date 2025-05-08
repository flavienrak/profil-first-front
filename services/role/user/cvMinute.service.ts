import api from '@/axios/axios.instance';

import { PopupInterface } from '@/components/role/user/cv-minute/id/CvPreview';
import { IconInterface } from '@/interfaces/icon.interface';

const cvMinutePrefix = '/role/user/cv-minute';

// GET CVMINUTES
const getAllCvMinuteService = async () => {
  try {
    const res = await api.get(`${cvMinutePrefix}`);
    return res.data;
  } catch (error) {
    return { error: `GET ALL CVMINUTE ERROR: ${error}` };
  }
};

// ADD CVMINUTE
const addCvMinuteService = async (formData: FormData) => {
  try {
    const res = await api.post(`${cvMinutePrefix}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error) {
    return { error: `ADD CV MINUTE ERROR: ${error}` };
  }
};

// GET CVMINUTE
const getCvMinuteService = async (id: number) => {
  try {
    const res = await api.get(`${cvMinutePrefix}/${id}`);
    return res.data;
  } catch (error) {
    return { error: `GET CVMINUTE ERROR: ${error}` };
  }
};

// COPY CVMINUTE
const copyCvMinuteService = async (id: number) => {
  try {
    const res = await api.post(`${cvMinutePrefix}/${id}/copy`);
    return res.data;
  } catch (error) {
    return { error: `COPY CVMINUTE ERROR: ${error}` };
  }
};

// UPDATE CVMINUTE NAME
const updateCvMinuteNameService = async (data: {
  id: number;
  name: string;
}) => {
  try {
    const res = await api.put(`${cvMinutePrefix}/${data.id}/name`, {
      name: data.name,
    });
    return res.data;
  } catch (error) {
    return { error: `UPDATE CVMINUTE NAME ERROR: ${error}` };
  }
};

// UPDATE CVMINUTEVISIBILITY
const updateCvMinuteVisibilityService = async (id: number) => {
  try {
    const res = await api.put(`${cvMinutePrefix}/${id}/visibility`);
    return res.data;
  } catch (error) {
    return { error: `UPDATE CVMINUTE VISIBILITY ERROR: ${error}` };
  }
};

// GENERATE CVMINUTE SECTION ADVICE
const generateCvMinuteSectionPropositionService = async (id: number) => {
  try {
    const res = await api.post(`${cvMinutePrefix}/${id}`);
    return res.data;
  } catch (error) {
    return { error: `GENERATE CVMINUTE PROPOSITION ERROR: ${error}` };
  }
};

// UPDATE CVMINUTE SCORE
const updateCvMinuteScoreService = async (id: number) => {
  try {
    const res = await api.put(`${cvMinutePrefix}/${id}`);
    return res.data;
  } catch (error) {
    return { error: `UPDATE CVMINUTE SCORE ERROR: ${error}` };
  }
};

// OPTIMIZE CVMINUTE
const optimizeCvMinuteService = async (id: number) => {
  try {
    const res = await api.post(`${cvMinutePrefix}/${id}/optimize`);
    return res.data;
  } catch (error) {
    return { error: `OPTIMIZE CVMINUTE ERROR: ${error}` };
  }
};

// UPDATE CVMINUTE PROFILE
const updateCvMinuteProfileService = async (id: number, formData: FormData) => {
  try {
    const res = await api.post(`${cvMinutePrefix}/${id}/profile`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error) {
    return { error: `UPDATE CV MINUTE PROFILE ERROR: ${error}` };
  }
};

// UPDATE CVMINUTESECTION
const updateCvMinuteSectionService = async (data: {
  id: number;
  title?: string;
  sectionTitle?: string;
  content: string;
  company?: string;
  date?: string;
  contrat?: string;
  icon?: IconInterface | null;
  iconSize?: number | null;
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
    const res = await api.put(`${cvMinutePrefix}/${data.id}/section`, {
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

// DELETE CVMINUTE SECTION
const deleteCvMinuteSectionService = async (
  id: number,
  cvMinuteSectionId: number,
) => {
  try {
    const res = await api.delete(
      `${cvMinutePrefix}/${id}/section/${cvMinuteSectionId}`,
    );
    return res.data;
  } catch (error) {
    return { error: `DELETE CVMINUTESECTION ERROR: ${error}` };
  }
};

// UPDATE SECTIONINFO ORDER
const updateSectionInfoOrderService = async (data: {
  id: number;
  sectionInfoId: number;
  targetSectionInfoId: number;
}) => {
  try {
    const res = await api.put(
      `${cvMinutePrefix}/${data.id}/section-info/order`,
      {
        sectionInfoId: data.sectionInfoId,
        targetSectionInfoId: data.targetSectionInfoId,
      },
    );
    return res.data;
  } catch (error) {
    return { error: `UPDATE SECTIONINFO ORDER ERROR: ${error}` };
  }
};

// GENERATE SECTIONINFO ADVICE
const generateSectionInfoPropositionService = async (data: {
  id: number;
  sectionInfoId: number;
  section: string;
}) => {
  try {
    const res = await api.post(
      `${cvMinutePrefix}/${data.id}/section-info/${data.sectionInfoId}`,
      { section: data.section },
    );
    return res.data;
  } catch (error) {
    return { error: `GENERATE SECTIONINFO PROPOSITION ERROR: ${error}` };
  }
};

// UPDATE SECTIONINFO SCORE
const updateSectionInfoScoreService = async (data: {
  id: number;
  sectionInfoId: number;
}) => {
  try {
    const res = await api.put(
      `${cvMinutePrefix}/${data.id}/section-info/${data.sectionInfoId}`,
    );
    return res.data;
  } catch (error) {
    return { error: `UPDATE SECTIONINFO SCORE ERROR: ${error}` };
  }
};

// UPDATE CVMINUTE SECTION ORDER
const updateCvMinuteSectionOrderService = async (data: {
  id: number;
  cvMinuteSectionId: number;
  targetCvMinuteSectionId: number;
}) => {
  try {
    const res = await api.put(`${cvMinutePrefix}/${data.id}/section/order`, {
      cvMinuteSectionId: data.cvMinuteSectionId,
      targetCvMinuteSectionId: data.targetCvMinuteSectionId,
    });
    return res.data;
  } catch (error) {
    return { error: `UPDATE CVMINUTE SECTION ORDER ERROR: ${error}` };
  }
};

// DELETE SECTIONINFO
const deleteSectionInfoService = async (data: {
  id: number;
  sectionInfoId: number;
}) => {
  try {
    const res = await api.delete(
      `${cvMinutePrefix}/${data.id}/section-info/${data.sectionInfoId}`,
    );
    return res.data;
  } catch (error) {
    return { error: `DELETE SECTIONINFO ERROR: ${error}` };
  }
};

export {
  // CVMINUTE
  getAllCvMinuteService,
  addCvMinuteService,
  getCvMinuteService,
  copyCvMinuteService,
  updateCvMinuteNameService,
  updateCvMinuteVisibilityService,
  updateCvMinuteScoreService,
  optimizeCvMinuteService,
  updateCvMinuteProfileService,

  // CVMINUTE SECTION
  generateCvMinuteSectionPropositionService,
  updateCvMinuteSectionService,
  updateCvMinuteSectionOrderService,
  deleteCvMinuteSectionService,

  // SECTIONINFO
  updateSectionInfoOrderService,
  generateSectionInfoPropositionService,
  updateSectionInfoScoreService,
  deleteSectionInfoService,
};
