import { SectionInfoInterface } from '@/interfaces/cv-minute/sectionInfo.interface';
import { QualiCarriereChatInterface } from '@/interfaces/quali-carriere/chatInterface';
import { QualiCarriereCompetenceInteface } from '@/interfaces/quali-carriere/competence.interface';
import { QualiCarriereQuestionInteface } from '@/interfaces/quali-carriere/questionInterface';
import { QualiCarriereResumeInterface } from '@/interfaces/quali-carriere/resume.interface';
import { createSlice } from '@reduxjs/toolkit';

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
        qualiCarriereQuestion,
        totalQuestions,
      }: {
        experience: SectionInfoInterface;
        qualiCarriereQuestion: QualiCarriereQuestionInteface;
        experiences?: SectionInfoInterface[];
        totalQuestions?: number;
      } = action.payload;
      state.experience = experience;
      state.qualiCarriereQuestion = qualiCarriereQuestion;

      if (experiences) {
        state.experiences = experiences;
      }

      if (totalQuestions) {
        state.totalQuestions = totalQuestions;
      }
    },
    newMessageReducer: (state, action) => {
      const {
        message,
        response,
      }: {
        message: QualiCarriereChatInterface;
        response: QualiCarriereChatInterface;
      } = action.payload;
      state.messages.push(message);
      state.messages.push(response);

      state.messages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
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
