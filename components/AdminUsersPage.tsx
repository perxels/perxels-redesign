import React from 'react'
import { useUsers } from '../hooks/useUser'
import CustomTable from '../features/admin/table/CustomTable'
import { formatDate } from '../utils'
import { Badge } from '@chakra-ui/react'

const AdminUsersPage = () => {
  const { users, loading, refetchUsers } = useUsers()

  return (
    <>
      <CustomTable
        data={users}
        columns={[
          {
            Header: 'Name',
            access: 'firstName',
            Cell: ({ row }: any) =>
              row.original.firstName + ' ' + row.original.lastName,
          },
          {
            Header: 'Level Of Design',
            access: 'levelOfDesign',
            Cell: ({ row }: any) => row.original.levelOfDesign
          },
          {
            Header: 'Role',
            access: 'role',
            Cell: ({ row }: any) => (
                <Badge>{row.original.role}</Badge>
            )
          },
          {
            Header: 'Email Address',
            access: 'email',
            Cell: ({ row }: any) => row.original.email
        },
        {
            Header: 'Phone Number',
            access: 'phone',
            Cell: ({ row }: any) => row.original.phone ?? "-"
          },
          { 
            Header: 'Created At', 
            accessor: 'createdAt',
            // Custom cell renderer for dates
            Cell: ({ row }: any) => {
              return formatDate(new Date(row.original.createdAt.seconds * 1000).toString());
            }
          },
        ]}
        pageSize={8}
        isLoading={loading}
      />
    </>
  )
}

export default AdminUsersPage
