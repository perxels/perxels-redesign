import React, { useState } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { MdCreateNewFolder } from 'react-icons/md'
import { doc, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { Testimonial } from '../utils/types' // Assuming you have a Testimonial type defined
import { db, storage } from '../firebaseConfig'
import DeleteDialog from '../features/admin/dialogs/DeleteDialog'
import FloatingButton from '../features/admin/utils/FloatingButton'
import CustomTable from '../features/admin/table/CustomTable'
import ManageTestimonialModal from '../features/admin/modals/ManageTestimonialModal'
import { useFetchTestimonials } from '../hooks/useTestimonials'

const AdminTestimonialPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [deleteLoader, setDeleteLoader] = useState(false)
  const {
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
    onOpen: onDeleteOpen,
  } = useDisclosure()
  const { testimonials, loading, refetchTestimonials } = useFetchTestimonials()

  const handleEdit = (row: any) => {
    const testimonial: Testimonial = {
      id: row.id,
      name: row.name,
      role: row.role,
      testimony: row.testimony,
      imageUrl: row.imageUrl,
    }
    setCurrentTestimonial(testimonial)
    onOpen()
  }

  const handleDelete = (row: any) => {
    setCurrentTestimonial(row)
    onDeleteOpen()
  }

  const deleteTestimonial = async () => {
    if (!currentTestimonial) return
    setDeleteLoader(true)
    try {
      if (currentTestimonial.id) {
        // Delete testimonial document from Firestore
        await deleteDoc(doc(db, 'testimonials', currentTestimonial.id))

        // Delete image file from Firebase Storage if it exists
        if (currentTestimonial.imageUrl) {
          const imageRef = ref(storage, currentTestimonial.imageUrl)
          await deleteObject(imageRef)
        }

        // Refresh the testimonials after deletion
        refetchTestimonials()
      }
      onDeleteClose()
    } catch (error) {
      console.error('Failed to delete testimonial:', error)
      alert('Something went wrong!')
    } finally {
      setDeleteLoader(false)
    }
  }

  return (
    <>
      <CustomTable
        data={testimonials}
        columns={[
          { Header: 'Name', accessor: 'name' },
          { Header: 'Role', accessor: 'role' },
          // { Header: 'Testimony', accessor: 'testimony' },
        ]}
        pageSize={8}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading}
      />
      <FloatingButton
        icon={<MdCreateNewFolder size="24" />}
        title="Add Testimonial"
        onClick={() => {
          setCurrentTestimonial(null)
          onOpen()
        }}
      />
      <ManageTestimonialModal
        isOpen={isOpen}
        onClose={onClose}
        refetchTestimonials={refetchTestimonials}
        testimonialToEdit={currentTestimonial}
      />

      <DeleteDialog
        title="Testimonial"
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        isLoading={deleteLoader}
        handleDelete={deleteTestimonial}
      />
    </>
  )
}

export default AdminTestimonialPage
