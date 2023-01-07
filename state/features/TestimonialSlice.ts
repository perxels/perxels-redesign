import { createSlice } from '@reduxjs/toolkit'
import {
  TestimonialCardProps,
  testimonialContent,
  testimonialSliderContent,
} from '../../constant'

interface TestimonialState {
  selectedTestimonial: TestimonialCardProps
  selectedTestimonialIndex: number
  testimonials: TestimonialCardProps[]
}

const initialState: TestimonialState = {
  selectedTestimonial: testimonialSliderContent[0],
  selectedTestimonialIndex: 1,
  testimonials: testimonialSliderContent,
}

export const testimonialSlice = createSlice({
  name: 'testimonial',
  initialState,
  reducers: {
    setSelectedTestimonial: (state, action) => {
      state.selectedTestimonial = action.payload
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
} = testimonialSlice.actions

export default testimonialSlice.reducer
