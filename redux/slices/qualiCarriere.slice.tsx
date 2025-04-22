import { QualiCarriereChatInterface } from '@/interfaces/quali-carriere/chatInterface';
import {
  QualiCarriereQuestionInteface,
  QuestionInterface,
} from '@/interfaces/quali-carriere/questionInterface';
import { ResumeInterface } from '@/interfaces/quali-carriere/resume.interface';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  question: QuestionInterface | null;
  qualiCarriereQuestion: QualiCarriereQuestionInteface | null;
  qualiCarriereResume: ResumeInterface | null;
  messages: QualiCarriereChatInterface[];
} = {
  question: null,
  qualiCarriereQuestion: null,
  qualiCarriereResume: null,
  messages: [],
};

const qualiCarriereSlice = createSlice({
  name: 'qualiCarriere',
  initialState,
  reducers: {
    setQuestionReducer: (state, action) => {
      const {
        question,
        qualiCarriereQuestion,
      }: {
        question: QuestionInterface;
        qualiCarriereQuestion: QualiCarriereQuestionInteface;
      } = action.payload;
      state.question = question;
      state.qualiCarriereQuestion = qualiCarriereQuestion;
    },
    setResumeReducer: (state, action) => {
      const {
        qualiCarriereResume,
        messages,
      }: {
        qualiCarriereResume: ResumeInterface;
        messages: QualiCarriereChatInterface[];
      } = action.payload;
      state.qualiCarriereResume = qualiCarriereResume;
      state.messages = messages;
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

export const { setQuestionReducer, setResumeReducer, newMessageReducer } =
  qualiCarriereSlice.actions;

export default qualiCarriereSlice.reducer;
