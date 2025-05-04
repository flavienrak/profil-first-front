import { createSlice } from '@reduxjs/toolkit';
import { SectionInfoInterface } from '@/interfaces/role/user/cv-minute/sectionInfo.interface';
import { QualiCarriereChatInterface } from '@/interfaces/role/user/quali-carriere/chatInterface';
import { QualiCarriereCompetenceInteface } from '@/interfaces/role/user/quali-carriere/competence.interface';
import { QualiCarriereQuestionInteface } from '@/interfaces/role/user/quali-carriere/questionInterface';
import { QualiCarriereResumeInterface } from '@/interfaces/role/user/quali-carriere/resume.interface';

const initialState: {
  experience: SectionInfoInterface | null;
  experiences: SectionInfoInterface[];
  qualiCarriereQuestion: QualiCarriereQuestionInteface | null;
  messages: QualiCarriereChatInterface[];
  totalQuestions: number;
} = {
  experience: null,
  experiences: [],
  qualiCarriereQuestion: null,
  messages: [],
  totalQuestions: 0,
};

const qualiCarriereSlice = createSlice({
  name: 'qualiCarriere',
  initialState,
  reducers: {
    setQuestionReducer: (state, action) => {
      const {
        experience,
        experiences,
        messages,
        qualiCarriereQuestion,
        totalQuestions,
      }: {
        experience: SectionInfoInterface;
        experiences?: SectionInfoInterface[];
        messages?: QualiCarriereChatInterface[];
        qualiCarriereQuestion: QualiCarriereQuestionInteface;
        totalQuestions?: number;
      } = action.payload;
      state.experience = experience;
      state.qualiCarriereQuestion = qualiCarriereQuestion;

      if (messages) {
        state.messages = messages;
      }

      if (experiences) {
        state.experiences = experiences;
      }

      if (totalQuestions) {
        state.totalQuestions = totalQuestions;
      }
    },
    newMessageReducer: (state, action) => {
      const data: { message: QualiCarriereChatInterface } = action.payload;
      state.messages.push(data.message);
    },
    updateResumeReducer: (state, action) => {
      const {
        experienceId,
        qualiCarriereResume,
      }: {
        experienceId: number;
        qualiCarriereResume: QualiCarriereResumeInterface;
      } = action.payload;
      state.experiences = state.experiences.map((experience) => {
        if (experience.id !== experienceId) return experience;

        return {
          ...experience,
          qualiCarriereResumes: experience.qualiCarriereResumes
            ? experience.qualiCarriereResumes.map((resume) =>
                resume.id === qualiCarriereResume.id
                  ? qualiCarriereResume
                  : resume,
              )
            : [qualiCarriereResume],
        };
      });
    },
    updateCompetenceReducer: (state, action) => {
      const {
        experienceId,
        qualiCarriereCompetences,
      }: {
        experienceId: number;
        qualiCarriereCompetences: QualiCarriereCompetenceInteface[];
      } = action.payload;
      state.experiences = state.experiences.map((experience) => {
        if (experience.id !== experienceId) return experience;

        return {
          ...experience,
          qualiCarriereCompetences: experience.qualiCarriereCompetences
            ? experience.qualiCarriereCompetences.map((c) => {
                const updated = qualiCarriereCompetences.find(
                  (comp) => comp.id === c.id,
                );
                return updated ? { ...c, ...updated } : c;
              })
            : qualiCarriereCompetences,
        };
      });
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
