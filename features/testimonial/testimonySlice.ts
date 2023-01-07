import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { TestimonialCardProps } from '../../constant'

export interface TestimonyState {
  activeIndex: number
  testimonies: TestimonialCardProps[]
  selectedTestimony: TestimonialCardProps | null
}

const initialState: TestimonyState = {
  activeIndex: 1,
  testimonies: [],
  selectedTestimony: null,
}

export const testimonySlice = createSlice({
  name: 'testimony',
  initialState,
  reducers: {
    setActiveIndex: (state, action: PayloadAction<number>) => {
      state.activeIndex = action.payload
    },
    setTestimonies: (state, action: PayloadAction<TestimonialCardProps[]>) => {
      state.testimonies = action.payload
    },
    setSelectedTestimony: (
      state,
      action: PayloadAction<TestimonialCardProps>,
    ) => {
      state.selectedTestimony = action.payload
    },
  },
})

export const { setActiveIndex, setTestimonies, setSelectedTestimony } =
  testimonySlice.actions

export default testimonySlice.reducer
