import {
  Step,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
} from '@chakra-ui/react'
import React from 'react'

const steps = [
  { title: 'User Details' },
  { title: 'Verify Email' },
  { title: 'School Fee Information' },
  { title: 'Growth Information' },
]

interface AuthStepperProps {
  currentStep: number
}

export const AuthStepper = ({ currentStep }: AuthStepperProps) => {
  return (
    <Stepper
      colorScheme="brand.purple"
      index={currentStep}
      maxW="727px"
      size="lg"
      my={12}
    >
      {steps.map((step, index) => (
        <Step key={index}>
          <StepIndicator
            bg={currentStep === index ? 'brand.purple.500' : 'brand.purple.100'}
            color={currentStep === index ? 'white' : 'brand.dark.100'}
            fontWeight={700}
            border="none"
          >
            <StepStatus
              complete={<StepNumber />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>
          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  )
}
