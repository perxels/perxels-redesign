import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { AdminAuthGuard } from '../../../components/PortalAuthGuard'
import { PortalAdminLayout } from '../../../features/portal/admin/admin-layout'
import { SchoolFeesFilter } from '../../../features/portal/admin/school-fees/SchoolFeesFilter'
import { SchoolFeesStats, SchoolFeesFilterState } from '../../../features/portal/admin/school-fees/SchoolFeesStats'
import { SchoolFeesLists } from '../../../features/portal/admin/school-fees/SchoolFeesLists'

const defaultFilters: SchoolFeesFilterState = {
  branch: 'all',
  classType: 'all',
  classPlan: '',
}

const SchoolFees = () => {
  const router = useRouter()
  const [filters, setFilters] = useState<SchoolFeesFilterState>(defaultFilters)

  // Initialize filters from query string on mount
  useEffect(() => {
    if (!router.isReady) return
    const { branch, classType, classPlan } = router.query
    setFilters({
      branch: typeof branch === 'string' ? branch : 'all',
      classType: typeof classType === 'string' ? classType : 'all',
      classPlan: typeof classPlan === 'string' ? classPlan : '',
    })
  }, [router.isReady])

  // Update query string when filters change
  useEffect(() => {
    if (!router.isReady) return
    const query: Record<string, string> = {}
    if (filters.branch && filters.branch !== 'all') query.branch = filters.branch
    if (filters.classType && filters.classType !== 'all') query.classType = filters.classType
    if (filters.classPlan) query.classPlan = filters.classPlan
    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true })
  }, [filters, router])

  return (
    <AdminAuthGuard>
        <PortalAdminLayout>
            <SchoolFeesFilter onChange={setFilters} />
            <SchoolFeesStats filters={filters} />
            <SchoolFeesLists filters={filters} />
        </PortalAdminLayout>
    </AdminAuthGuard>
  )
}

export default SchoolFees