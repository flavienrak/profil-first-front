import { SectionInfoInterface } from '@/interfaces/cv-minute/sectionInfo.interface';
import { QualiCarriereChatInterface } from '@/interfaces/quali-carriere/chatInterface';
import { QualiCarriereQuestionInteface } from '@/interfaces/quali-carriere/questionInterface';
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
  },
});

export const { setQuestionReducer, newMessageReducer } =
  qualiCarriereSlice.actions;

export default qualiCarriereSlice.reducer;
