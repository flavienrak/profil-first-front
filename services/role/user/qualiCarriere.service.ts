import api from '@/axios/axios.instance';

const qualiCarrierePrefix = '/role/user/quali-carriere';

// GET QUESTION
const getQuestionService = async () => {
  try {
    const res = await api.get(`${qualiCarrierePrefix}`);
    return res.data;
  } catch (error) {
    return { error: `GET QUESTION ERROR: ${error}` };
  }
};

// RESPOND QUESTION
const respondQuestionService = async (data: {
  id: number;
  formData: FormData;
}) => {
  try {
    const res = await api.post(
      `${qualiCarrierePrefix}/${data.id}`,
      data.formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return res.data;
  } catch (error) {
    return { error: `RESPOND QUESTION ERROR: ${error}` };
  }
};

// CHANGE STATUS
const changeQualiCarriereStatusService = async () => {
  try {
    const res = await api.post(`${qualiCarrierePrefix}/status`);
    return res.data;
  } catch (error) {
    return { error: `CHANGE QUALICARRIERE STATUS ERROR: ${error}` };
  }
};

// EDIT RESUME
const editQualiCarriereResumeService = async ({
  id,
  content,
}: {
  id: number;
  content: string;
}) => {
  try {
    const res = await api.put(`${qualiCarrierePrefix}/${id}/resume`, {
      content,
    });
    return res.data;
  } catch (error) {
    return { error: `EDIT QUALICARRIERE RESUME ERROR: ${error}` };
  }
};

// EDIT COMPETENCE
const editQualiCarriereCompetenceService = async (
  competences: {
    id: number;
    content: string;
  }[],
) => {
  try {
    const res = await api.put(`${qualiCarrierePrefix}/competence`, {
      competences,
    });
    return res.data;
  } catch (error) {
    return { error: `EDIT QUALICARRIERE COMPETENCE ERROR: ${error}` };
  }
};

// SEND MESSAGE CHAT
const sendQualiCarriereMessageService = async (message: string) => {
  try {
    const res = await api.post(`${qualiCarrierePrefix}/message`, {
      message,
    });
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
