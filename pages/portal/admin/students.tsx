import React from 'react'
import { AdminAuthGuard } from '../../../components/PortalAuthGuard'
import { PortalAdminLayout } from '../../../features/portal/admin/admin-layout'
import { ClassesHeaderActions } from '../../../features/portal/admin/classes/classes-header-actions'
import { ClassStudentFilter } from '../../../features/portal/admin/classes/class-student-filter'
import { StudentList } from '../../../features/portal/admin/classes/student-list'

const Students = () => {
  return (
    <AdminAuthGuard>
      <PortalAdminLayout>
        <ClassesHeaderActions />
        <ClassStudentFilter />
        <StudentList />
      </PortalAdminLayout>
    </AdminAuthGuard>
  )
}

export default Students


