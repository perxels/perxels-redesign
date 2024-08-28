import React, { useState } from 'react'
import AdminLayout from '../../features/admin/layout/AdminLayout'
import { Text, useDisclosure } from '@chakra-ui/react'
import CustomTable from '../../features/admin/table/CustomTable'
import ManageMasterClassModal from '../../features/admin/modals/ManageMasterClassModal'
import FloatingButton from '../../features/admin/utils/FloatingButton'
import { MdCreateNewFolder } from 'react-icons/md'
import DeleteDialog from '../../features/admin/dialogs/DeleteDialog'
import { db, storage } from '../../firebaseConfig' // Ensure this import path is correct
import { doc, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { MasterClass } from '../../utils/types'
import { useFetchMasterClass } from '../../hooks/useMasterClass'

const AdminMasterClasses = () => {
  const [currentClass, setCurrentClass] = useState<MasterClass | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [deleteLoader, setDeleteLoader] = useState(false)
  const {
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
    onOpen: onDeleteOpen,
  } = useDisclosure()
  const { classes, loading, refetchClasses } = useFetchMasterClass()

  const handleEdit = (row: any) => {
    const masterClass: MasterClass = {
      id: row.id,
      title: row.title,
      dateTime: row.dateTime,
      content1: row.content1,
      content2: row.content2,
      content3: row.content3,
      importantInfo: row.importantInfo,
      image: row.image,
    }
    setCurrentClass(masterClass)
    onOpen()
  }

  const handleDelete = (row: any) => {
    setCurrentClass(row)
    onDeleteOpen()
  }

  const deleteMasterClass = async () => {
    if (!currentClass) return
    setDeleteLoader(true)
    try {
      if (currentClass.id) {
        // Delete master class document from Firestore
        await deleteDoc(doc(db, 'masterClasses', currentClass.id))

        // Delete master class image from Firebase Storage if it exists
        if (currentClass.image) {
          const imageRef = ref(storage, currentClass.image)
          await deleteObject(imageRef)
        }

        // Refresh the master classes after deletion
        refetchClasses()
      }
      onDeleteClose()
    } catch (error) {
      console.error('Failed to delete master class:', error)
      alert('Something went wrong!')
    } finally {
      setDeleteLoader(false)
    }
  }

  return (
    <AdminLayout>
      <Text as="h1" mb="20px">
        Manage Master Classes
      </Text>
      <CustomTable
        data={classes}
        columns={[
          { Header: 'Title', accessor: 'title' },
          { Header: 'Date & Time', accessor: 'dateTime' },
          // { Header: 'Important Info', accessor: 'importantInfo' },
        ]}
        pageSize={8}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading} // You can set loading state appropriately
      />
      <FloatingButton
        icon={<MdCreateNewFolder size="24" />}
        title="Add Master Class"
        onClick={() => {
          setCurrentClass(null)
          onOpen()
        }}
      />
      <ManageMasterClassModal
        isOpen={isOpen}
        onClose={onClose}
        refetchClasses={refetchClasses}
        masterClassToEdit={currentClass}
      />
      <DeleteDialog
        title="Master Class"
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        isLoading={deleteLoader}
        handleDelete={deleteMasterClass}
      />
    </AdminLayout>
  )
}

export default AdminMasterClasses
