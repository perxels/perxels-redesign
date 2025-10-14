import { useMemo } from 'react'
import { parseSessionTime } from '../lib/utils/timeParser'
import { Session } from '../types/attendance-v2.types'

interface UseSessionTimeReturn {
  isWithinSessionTime: boolean
  sessionStart: Date
  sessionEnd: Date
  timeUntilStart: number
  timeUntilEnd: number
  formattedTimeRange: string
}

export const useSessionTime = (
  session: Session | null,
): UseSessionTimeReturn => {
  return useMemo(() => {
    if (!session) {
      return {
        isWithinSessionTime: false,
        sessionStart: new Date(),
        sessionEnd: new Date(),
        timeUntilStart: 0,
        timeUntilEnd: 0,
        formattedTimeRange: 'No session',
      }
    }

    try {
      const now = new Date()
      const sessionStart = parseSessionTime(session.startsAt)
      const sessionEnd = parseSessionTime(session.endsAt)

      // Validate parsed dates
      if (isNaN(sessionStart.getTime()) || isNaN(sessionEnd.getTime())) {
        console.error('Invalid session times:', {
          sessionStart,
          sessionEnd,
          session,
        })
        throw new Error('Invalid session times')
      }

      const isWithin = now >= sessionStart && now <= sessionEnd
      const timeUntilStart = Math.max(0, sessionStart.getTime() - now.getTime())
      const timeUntilEnd = Math.max(0, sessionEnd.getTime() - now.getTime())

      // Format time range consistently
      const formattedTimeRange = `${sessionStart.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })} - ${sessionEnd.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}`

      return {
        isWithinSessionTime: isWithin,
        sessionStart,
        sessionEnd,
        timeUntilStart,
        timeUntilEnd,
        formattedTimeRange,
      }
    } catch (error) {
      console.error('Error in useSessionTime:', error)
      return {
        isWithinSessionTime: false,
        sessionStart: new Date(),
        sessionEnd: new Date(),
        timeUntilStart: 0,
        timeUntilEnd: 0,
        formattedTimeRange: 'Error loading time',
      }
    }
  }, [session])
}
