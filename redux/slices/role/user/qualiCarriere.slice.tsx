import { createSlice } from '@reduxjs/toolkit';
import { QualiCarriereChatInterface } from '@/interfaces/role/user/quali-carriere/chatInterface';
import { QualiCarriereCompetenceInteface } from '@/interfaces/role/user/quali-carriere/competence.interface';
import { QualiCarriereQuestionInteface } from '@/interfaces/role/user/quali-carriere/questionInterface';
import { QualiCarriereResumeInterface } from '@/interfaces/role/user/quali-carriere/resume.interface';
import { CvMinuteSectionInterface } from '@/interfaces/role/user/cv-minute/cvMinuteSection.interface';
import { CvMinuteInterface } from '@/interfaces/role/user/cv-minute/cvMinute.interface';

const initialState: {
  experience: CvMinuteSectionInterface | null;
  cvMinute: CvMinuteInterface | null;
  qualiCarriereQuestion: QualiCarriereQuestionInteface | null;
  messages: QualiCarriereChatInterface[];
  totalQuestions: number;
} = {
  experience: null,
  cvMinute: null,
  qualiCarriereQuestion: null,
  messages: [],
  totalQuestions: 0,
};

const qualiCarriereSlice = createSlice({
  name: 'qualiCarriere',
  initialState,
  reducers: {
    setQuestionReducer: (state, action) => {
      const data: {
        experience: CvMinuteSectionInterface;
        cvMinute?: CvMinuteInterface;
        messages?: QualiCarriereChatInterface[];
        qualiCarriereQuestion: QualiCarriereQuestionInteface;
        totalQuestions?: number;
      } = action.payload;
      state.experience = data.experience;
      state.qualiCarriereQuestion = data.qualiCarriereQuestion;

      if (data.messages) {
        state.messages = data.messages;
      }

      if (data.cvMinute) {
        state.cvMinute = data.cvMinute;
      }

      if (data.totalQuestions) {
        state.totalQuestions = data.totalQuestions;
      }
    },
    newMessageReducer: (state, action) => {
      const data: { message: QualiCarriereChatInterface } = action.payload;
      state.messages.push(data.message);
    },
    updateResumeReducer: (state, action) => {
      const data: { qualiCarriereResume: QualiCarriereResumeInterface } =
        action.payload;

      if (state.cvMinute) {
        state.cvMinute = {
          ...state.cvMinute,
          cvMinuteSections: state.cvMinute.cvMinuteSections.map((c) =>
            c.id === data.qualiCarriereResume.cvMinuteSectionId
              ? {
                  ...c,
                  qualiCarriereResumes: c.qualiCarriereResumes
                    ? c.qualiCarriereResumes.map((resume) =>
                        resume.id === data.qualiCarriereResume.id
                          ? data.qualiCarriereResume
                          : resume,
                      )
                    : [data.qualiCarriereResume],
                }
              : c,
          ),
        };
      }
    },
    updateCompetenceReducer: (state, action) => {
      const data: {
        qualiCarriereCompetences: QualiCarriereCompetenceInteface[];
      } = action.payload;

      if (state.cvMinute) {
        state.cvMinute = {
          ...state.cvMinute,
          cvMinuteSections: state.cvMinute.cvMinuteSections.map((experience) =>
            experience.id === data.qualiCarriereCompetences[0].cvMinuteSectionId
              ? {
                  ...experience,
                  qualiCarriereCompetences:
                    experience.qualiCarriereCompetences.map((c) => {
                      const updated = data.qualiCarriereCompetences.find(
                        (up) => up.id === c.id,
                      );
                      return updated ? { ...c, ...updated } : c;
                    }),
                }
              : experience,
          ),
        };
      }
    },
  },
});

export const {
  setQuestionReducer,
  newMessageReducer,
  updateResumeReducer,
  updateCompetenceReducer,
} = qualiCarriereSlice.actions;

export default qualiCarriereSlice.reducer;
