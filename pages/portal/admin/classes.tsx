import React from 'react'
import { AdminAuthGuard } from '../../../components/PortalAuthGuard'
import { PortalAdminLayout } from '../../../features/portal/admin/admin-layout'
import { ClassesWrapper } from '../../../features/portal/admin/classes/classes-wrapper'

const Classes = () => {
  return (
    <AdminAuthGuard>
        <PortalAdminLayout>
            <ClassesWrapper />
        </PortalAdminLayout>
    </AdminAuthGuard>
  )
}

export default Classes