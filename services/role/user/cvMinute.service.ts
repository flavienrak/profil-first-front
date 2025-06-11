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

// GENERATE NEW CVMINUTE SECTION ADVICES
const generateNewCvMinuteSectionsService = async (id: number) => {
  try {
    const res = await api.post(`${cvMinutePrefix}/${id}/suggestions`);
    return res.data;
  } catch (error) {
    return { error: `GENERATE NEW CVMINUTE SECTION ERROR: ${error}` };
  }
};

// GENERATE CVMINUTE SECTION ADVICES
const generateCvMinuteSectionAdvicesService = async (data: {
  id: number;
  cvMinuteSectionId: number;
}) => {
  try {
    const res = await api.post(
      `${cvMinutePrefix}/${data.id}/cv-minute-section/${data.cvMinuteSectionId}/advices`,
    );
    return res.data;
  } catch (error) {
    return { error: `GENERATE CVMINUTE SECTION ADVICES ERROR: ${error}` };
  }
};

// UPDATE CVMINUTE SCORE
const updateCvMinuteScoreService = async (id: number) => {
  try {
    const res = await api.put(`${cvMinutePrefix}/${id}/score`);
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

// DELETE CVMINUTE
const deleteCvMinuteService = async (id: number) => {
  try {
    const res = await api.delete(`${cvMinutePrefix}/${id}`);
    return res.data;
  } catch (error) {
    return { error: `DELETE CVMINUTE ERROR: ${error}` };
  }
};

// UPDATE CVMINUTESECTION
const updateCvMinuteSectionService = async (data: {
  id: number;
  name?: string;
  sectionTitle?: string;
  title?: string;
  content: string;
  company?: string;
  date?: string;
  contrat?: string;
  icon?: IconInterface | null;
  iconSize?: number | null;
  primaryBg?: string;
  secondaryBg?: string;
  tertiaryBg?: string;
  cvMinuteSectionId?: PopupInterface['cvMinuteSectionId'];

  updateBg?: PopupInterface['updateBg'];
  updateName?: PopupInterface['updateName'];
  updateFirstname?: PopupInterface['updateFirstname'];
  updateContact?: PopupInterface['updateContact'];
  updateEditableSection?: PopupInterface['updateEditableSection'];
  updateTitle?: PopupInterface['updateTitle'];
  updatePresentation?: PopupInterface['updatePresentation'];
  updateExperience?: PopupInterface['updateExperience'];

  newContact?: PopupInterface['newContact'];
  newEditableSection?: PopupInterface['newEditableSection'];
  newExperience?: PopupInterface['newExperience'];
}) => {
  try {
    const res = await api.put(
      `${cvMinutePrefix}/${data.id}/cv-minute-section`,
      {
        name: data.name,
        sectionTitle: data.sectionTitle,
        title: data.title,
        content: data.content,
        company: data.company,
        date: data.date,
        contrat: data.contrat,
        icon: data.icon,
        iconSize: data.iconSize,
        primaryBg: data.primaryBg,
        secondaryBg: data.secondaryBg,
        tertiaryBg: data.tertiaryBg,
        cvMinuteSectionId: data.cvMinuteSectionId,

        updateBg: data.updateBg,
        updateName: data.updateName,
        updateFirstname: data.updateFirstname,
        updateContact: data.updateContact,
        updateEditableSection: data.updateEditableSection,
        updateTitle: data.updateTitle,
        updatePresentation: data.updatePresentation,
        updateExperience: data.updateExperience,

        newContact: data.newContact,
        newEditableSection: data.newEditableSection,
        newExperience: data.newExperience,
      },
    );
    return res.data;
  } catch (error) {
    return { error: `UPDATE CV MINUTE SECTION ERROR: ${error}` };
  }
};

// DELETE CVMINUTE SECTION
const deleteCvMinuteSectionService = async (data: {
  id: number;
  cvMinuteSectionId: number;
}) => {
  try {
    const res = await api.delete(
      `${cvMinutePrefix}/${data.id}/cv-minute-section/${data.cvMinuteSectionId}`,
    );
    return res.data;
  } catch (error) {
    return { error: `DELETE CVMINUTESECTION ERROR: ${error}` };
  }
};

// UPDATE CVMINUTE SECTION SCORE
const updateCvMinuteSectionScoreService = async (data: {
  id: number;
  cvMinuteSectionId: number;
}) => {
  try {
    const res = await api.put(
      `${cvMinutePrefix}/${data.id}/cv-minute-section/${data.cvMinuteSectionId}/score`,
    );
    return res.data;
  } catch (error) {
    return { error: `UPDATE CVMINUTE SECTION SCORE ERROR: ${error}` };
  }
};

// UPDATE CVMINUTE SECTION ORDER
const updateCvMinuteSectionOrderService = async (data: {
  id: number;
  cvMinuteSectionId: number;
  dragIndex: number;
  targetCvMinuteSectionId: number;
  dropIndex: number;
}) => {
  try {
    const res = await api.put(
      `${cvMinutePrefix}/${data.id}/cv-minute-section/order`,
      {
        cvMinuteSectionId: data.cvMinuteSectionId,
        dragIndex: data.dragIndex,
        targetCvMinuteSectionId: data.targetCvMinuteSectionId,
        dropIndex: data.dropIndex,
      },
    );
    return res.data;
  } catch (error) {
    return { error: `UPDATE CVMINUTE SECTION ORDER ERROR: ${error}` };
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
  generateNewCvMinuteSectionsService,
  deleteCvMinuteService,

  // CVMINUTE SECTION
  generateCvMinuteSectionAdvicesService,
  updateCvMinuteSectionService,
  updateCvMinuteSectionOrderService,
  deleteCvMinuteSectionService,
  updateCvMinuteSectionScoreService,
};
