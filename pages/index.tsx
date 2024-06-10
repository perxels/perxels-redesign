import { useEffect, useState } from 'react'
import { Banner } from '../features/banner'
import { OurClassGroup } from '../features/classGroup'
import { Hero, HeroSubSection } from '../features/home'
import { Portfolio } from '../features/portfolio'
import { Story } from '../features/story'
import { Testimonial } from '../features/testimonial'
import { MainLayout } from '../layouts'

export default function Home() {
  const isTargetDate = (
    targetDate: string,
    targetHour: number,
    targetMinute: number,
    targetPeriod: string,
  ) => {
    const now = new Date()
    const nowHours = now.getHours()
    const nowMinutes = now.getMinutes()

    // Adjust target hour to 24-hour format based on targetPeriod
    let targetHours24 =
      targetPeriod === 'PM' && targetHour !== 12 ? targetHour + 12 : targetHour
    if (targetPeriod === 'AM' && targetHour === 12) {
      targetHours24 = 0 // 12 AM is 00:00 in 24-hour format
    }

    // Construct the target date and time string
    const targetDateTimeString = `${targetDate}T${targetHours24
      .toString()
      .padStart(2, '0')}:${targetMinute.toString().padStart(2, '0')}:00`

    // Parse the target date and time
    const targetDateTime = new Date(targetDateTimeString)

    // Construct the current date and time string using nowHours directly
    const nowDateString = now.toISOString().slice(0, 10) // Extract YYYY-MM-DD
    const currentDateTimeString = `${nowDateString}T${nowHours
      .toString()
      .padStart(2, '0')}:${nowMinutes.toString().padStart(2, '0')}:00`

    // Parse the current date and time
    const currentDateTime = new Date(currentDateTimeString)

    // Compare the two Date objects
    return currentDateTime > targetDateTime
  }

  // Example usage:
  const targetDate = '2024-06-16' // Target date
  const targetHour = 8 // Target hour
  const targetMinute = 30 // Target minute
  const targetPeriod = 'PM' // Target period (AM/PM)

  const showBanner = isTargetDate(
    targetDate,
    targetHour,
    targetMinute,
    targetPeriod,
  )

  return (
    <MainLayout>
      {!showBanner && <Banner />}
      <Hero />
      <HeroSubSection />
      <OurClassGroup />
      <Story />
      <Portfolio />
      <Testimonial />
    </MainLayout>
  )
}
