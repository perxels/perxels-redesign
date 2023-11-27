import { createSlice } from '@reduxjs/toolkit'
import {
  TestimonialCardProps,
  testimonialContent,
  testimonialSliderContentScholarship,
} from '../../constant'

interface TestimonialState {
  selectedTestimonialSchl: TestimonialCardProps
  selectedTestimonialIndex: number
  testimonials: TestimonialCardProps[]
}

const initialState: TestimonialState = {
  selectedTestimonialSchl: testimonialSliderContentScholarship[0],
  selectedTestimonialIndex: 1,
  testimonials: testimonialSliderContentScholarship,
}

export const testimonialSchSlice = createSlice({
  name: 'testimonialSch',
  initialState,
  reducers: {
    setSelectedTestimonial: (state, action) => {
      state.selectedTestimonialSchl = action.payload
    },
    setSelectedTestimonialIndex: (state, action) => {
      state.selectedTestimonialIndex = action.payload
    },
    setTestimonials: (state, action) => {
      state.testimonials = action.payload
    },
  },
})

export const {
  setSelectedTestimonial,
  setSelectedTestimonialIndex,
  setTestimonials,
} = testimonialSchSlice.actions

export default testimonialSchSlice.reducer
