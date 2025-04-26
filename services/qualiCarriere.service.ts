import api from '@/axios/axios.instance';

const getQuestionService = async () => {
  try {
    const res = await api.get('/quali-carriere');
    return res.data;
  } catch (error) {
    return { error: `GET QUESTION ERROR: ${error}` };
  }
};

const respondQuestionService = async (data: {
  id: number;
  formData: FormData;
}) => {
  try {
    const res = await api.post(`/quali-carriere/${data.id}`, data.formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    return { error: `RESPOND QUESTION ERROR: ${error}` };
  }
};

const changeQualiCarriereStatusService = async () => {
  try {
    const res = await api.post('/quali-carriere/status');
    return res.data;
  } catch (error) {
    return { error: `CHANGE QUALICARRIERE STATUS ERROR: ${error}` };
  }
};

const editQualiCarriereResumeService = async ({
  id,
  content,
}: {
  id: number;
  content: string;
}) => {
  try {
    const res = await api.put(`/quali-carriere/${id}/resume`, { content });
    return res.data;
  } catch (error) {
    return { error: `EDIT QUALICARRIERE RESUME ERROR: ${error}` };
  }
};

const editQualiCarriereCompetenceService = async (
  competences: {
    id: number;
    content: string;
  }[],
) => {
  try {
    const res = await api.put(`/quali-carriere/competence`, {
      competences,
    });
    return res.data;
  } catch (error) {
    return { error: `EDIT QUALICARRIERE COMPETENCE ERROR: ${error}` };
  }
};

const sendQualiCarriereMessageService = async (message: string) => {
  try {
    const res = await api.post(`/quali-carriere/message`, { message });
    return res.data;
  } catch (error) {
    return { error: `SEND QUALICARRIERE MESSAGE ERROR: ${error}` };
  }
};

export {
  getQuestionService,
  respondQuestionService,
  changeQualiCarriereStatusService,
  editQualiCarriereResumeService,
  editQualiCarriereCompetenceService,
  sendQualiCarriereMessageService,
};
