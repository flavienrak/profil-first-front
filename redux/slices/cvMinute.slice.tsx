import { CvMinuteInterface } from '@/interfaces/cvMinute.interface';
import { CvMinuteSectionInterface } from '@/interfaces/cvMinuteSection.interface';
import { FileInterface } from '@/interfaces/file.interface';
import { SectionInterface } from '@/interfaces/section.interface';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  cvMinute: CvMinuteInterface | null;
  files: FileInterface[];
  sections: SectionInterface[];
  cvMinuteSections: CvMinuteSectionInterface[];
} = {
  cvMinute: null,
  files: [],
  sections: [],
  cvMinuteSections: [],
};

const cvMinuteSlice = createSlice({
  name: 'cvMinute',
  initialState,
  reducers: {
    setCvMinuteReducer: (state, action) => {
      const {
        cvMinute,
        files,
        sections,
        cvMinuteSections,
      }: {
        cvMinute: CvMinuteInterface;
        files: FileInterface[];
        sections: SectionInterface[];
        cvMinuteSections: CvMinuteSectionInterface[];
      } = action.payload;

      if (cvMinute) {
        state.cvMinute = cvMinute;
      }
      if (files) {
        state.files = files;
      }
      if (sections) {
        state.sections = sections;
      }
      if (cvMinuteSections) {
        state.cvMinuteSections = cvMinuteSections;
      }
    },
    updateCvMinuteReducer: (state, action) => {
      const {
        cvMinuteSection,
        sectionInfo,
      }: {
        cvMinuteSection: CvMinuteSectionInterface;
        sectionInfo: SectionInterface;
      } = action.payload;

      if (cvMinuteSection) {
        const index = state.cvMinuteSections.findIndex(
          (c) =>
            c.cvMinuteId === cvMinuteSection.cvMinuteId &&
            c.sectionId === cvMinuteSection.sectionId,
        );

        if (index !== -1) {
          state.cvMinuteSections[index] = cvMinuteSection;
        } else {
          state.cvMinuteSections.push(cvMinuteSection);
        }
      }

      if (sectionInfo) {
      }
    },
  },
});

export const { setCvMinuteReducer, updateCvMinuteReducer } =
  cvMinuteSlice.actions;

export default cvMinuteSlice.reducer;
