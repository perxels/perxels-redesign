import React from 'react'
import { FacilitatorAuthGuard } from '../../../components/PortalAuthGuard'
import { FacilitatorLayout } from '../../../features/portal/facilitator/facilitator-layout'
import { ClassesHeaderActions } from '../../../features/portal/admin/classes/classes-header-actions'
import { ClassStudentFilter } from '../../../features/portal/admin/classes/class-student-filter'
import { StudentList } from '../../../features/portal/admin/classes/student-list'

const FacilitatorStudentsPage = () => {
  return (
    <FacilitatorAuthGuard>
      <FacilitatorLayout>
        <ClassesHeaderActions />
        <ClassStudentFilter />
        <StudentList />
      </FacilitatorLayout>
    </FacilitatorAuthGuard>
  )
}

export default FacilitatorStudentsPage
