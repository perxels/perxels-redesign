import { createSlice } from '@reduxjs/toolkit'

interface TestimonialState {
    selectedTestimonial: {
        id: number
        name: string
        title: string
        content: string
    } | null,
    selectedTestimonialIndex: number
}

const initialState: TestimonialState = {
    selectedTestimonial: null,
    selectedTestimonialIndex: 1
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
        }
    }
})

export const { setSelectedTestimonial, setSelectedTestimonialIndex } = testimonialSlice.actions

export default testimonialSlice.reducer