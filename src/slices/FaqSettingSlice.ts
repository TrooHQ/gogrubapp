import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FAQItem {
  question: string;
  inputValue?: string;
  subItems?: FAQItem[];
}

interface FAQState {
  faqData: FAQItem[];
  openIndex: number | null;
  faqDataInner: FAQItem[];
  openIndexInner: number | null;
}

const initialState: FAQState = {
  faqData: [],
  openIndex: null,
  faqDataInner: [],
  openIndexInner: null,
};

const FaqSettingSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {
    toggleAnswer: (state, action: PayloadAction<number>) => {
      state.openIndex =
        state.openIndex === action.payload ? null : action.payload;
    },
    toggleAnswerInner: (state, action: PayloadAction<number>) => {
      state.openIndexInner =
        state.openIndexInner === action.payload ? null : action.payload;
    },
    updateInputValue: (
      state,
      action: PayloadAction<{ index: number; value: string }>
    ) => {
      const { index, value } = action.payload;
      state.faqData[index].inputValue = value;
    },
    updateInputValueInner: (
      state,
      action: PayloadAction<{ index: number; value: string }>
    ) => {
      const { index, value } = action.payload;
      state.faqDataInner[index].inputValue = value;
    },
  },
});

export const {
  toggleAnswer,
  toggleAnswerInner,
  updateInputValue,
  updateInputValueInner,
} = FaqSettingSlice.actions;
export default FaqSettingSlice.reducer;
