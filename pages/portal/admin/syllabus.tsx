// pages/portal/admin/syllabus.tsx
import React from 'react'
import { AdminAuthGuard } from '../../../components/PortalAuthGuard'
import { PortalAdminLayout } from '../../../features/portal/admin/admin-layout'
import { SyllabusManagement } from '../../../features/portal/admin/syllabus/syllabus-management'

const AdminSyllabusPage = () => {
  return (
    <AdminAuthGuard>
      <PortalAdminLayout>
        <SyllabusManagement />
      </PortalAdminLayout>
    </AdminAuthGuard>
  )
}

export default AdminSyllabusPage
