import React, { useMemo, useState } from 'react'
import { Button, Spinner, useDisclosure } from '@chakra-ui/react'
import { MdArrowDownward, MdArrowUpward, MdCreateNewFolder } from 'react-icons/md'
import { doc, deleteDoc, updateDoc, writeBatch, getDocs, collection } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { Testimonial } from '../utils/types' // Assuming you have a Testimonial type defined
import { db, storage } from '../firebaseConfig'
import DeleteDialog from '../features/admin/dialogs/DeleteDialog'
import FloatingButton from '../features/admin/utils/FloatingButton'
import ManageTestimonialModal from '../features/admin/modals/ManageTestimonialModal'
import { useFetchTestimonials } from '../hooks/useTestimonials'
import DraggableTable from '../features/admin/table/DraggableTable'

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
  const [movingTestimonialId, setMovingTestimonialId] = useState<string | null>(null)

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

  // Sort testimonial by order
  const sortedTestimonial = useMemo(
    () =>
      [...testimonials].sort((a, b) => {
        const orderA = a.order ?? testimonials.indexOf(a)
        const orderB = b.order ?? testimonials.indexOf(b)
        return orderA - orderB
      }),
    [testimonials],
  )

  const handleMoveUp = async (row: any) => {
    if (!row.id) return
    setMovingTestimonialId(row.id)
    // const currentIndex = videos.findIndex((v) => v.id === row.id)
    const currentIndex = (row.order ?? 1) - 1
    if (currentIndex > 0) {
      const prevVideo = sortedTestimonial[currentIndex - 1]
      const currentOrder = row.order || currentIndex
      const prevOrder = prevVideo.order || currentIndex - 1

      try {
        await updateDoc(doc(db, 'testimonials', row.id), { order: prevOrder })
        await updateDoc(doc(db, 'testimonials', prevVideo.id!), {
          order: currentOrder,
        })
        refetchTestimonials()
      } catch (error) {
        console.error('Failed to move video:', error)
      } finally {
        setMovingTestimonialId(null)
      }
    }
  }

  const handleMoveDown = async (row: any) => {
    if (!row.id) return
    setMovingTestimonialId(row.id)
    if ((row?.order ?? 1) < sortedTestimonial.length - 1) {
      const nextVideo = sortedTestimonial[(row?.order ?? 1) - 1 + 1]
      const currentOrder = row.order || 1
      const nextOrder = nextVideo.order || 1 + 1

      try {
        await updateDoc(doc(db, 'testimonials', row.id), { order: nextOrder })
        await updateDoc(doc(db, 'testimonials', nextVideo.id!), {
          order: currentOrder,
        })
        refetchTestimonials()
      } catch (error) {
        console.error('Failed to move testimonials:', error)
      } finally {
        setMovingTestimonialId(null)
      }
    }
  }

  const handleDragEnd = async (newData: any) => {
    setMovingTestimonialId(newData[0].id)
    try {
      const batch = writeBatch(db)

      newData.forEach((video: any) => {
        if (!video.id) {
          console.error('Video missing ID:', video)
          return
        }

        const videoRef = doc(db, 'testimonials', video.id)
        batch.update(videoRef, { order: video.order })
      })
      await batch.commit()
      refetchTestimonials()
      return true
    } catch (error) {
      console.error('Failed to move testimonials:', error)
    } finally {
      setMovingTestimonialId(null)
    }
  }

  return (
    <>
      <DraggableTable
        data={sortedTestimonial}
        columns={[
          { Header: 'Name', accessor: 'name' },
          { Header: 'Role', accessor: 'role' },
          // { Header: 'Testimony', accessor: 'testimony' },
          {
            Header: 'Order',
            accessor: 'order',
            Cell: ({ row }: any) => {
              const currentIndex = sortedTestimonial.findIndex(
                (v) => v.id === row.original.id,
              )
              const isMoving = movingTestimonialId === row.original.id
              return (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleMoveUp(row.original)}
                    disabled={currentIndex === 0 || isMoving}
                    style={{
                      padding: '4px',
                      cursor: isMoving
                        ? 'wait'
                        : currentIndex === 0
                        ? 'not-allowed'
                        : 'pointer',
                      opacity: currentIndex === 0 ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '24px',
                      minHeight: '24px',
                    }}
                  >
                    {isMoving ? <Spinner size="sm" /> : <MdArrowUpward />}
                  </button>
                  <button
                    onClick={() => handleMoveDown(row.original)}
                    disabled={
                      currentIndex === sortedTestimonial.length - 1 || isMoving
                    }
                    style={{
                      padding: '4px',
                      cursor: isMoving
                        ? 'wait'
                        : currentIndex === sortedTestimonial.length - 1
                        ? 'not-allowed'
                        : 'pointer',
                      opacity: currentIndex === sortedTestimonial.length - 1 ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '24px',
                      minHeight: '24px',
                    }}
                  >
                    {isMoving ? <Spinner size="sm" /> : <MdArrowDownward />}
                  </button>
                </div>
              )
            },
          },
        ]}
        pageSize={8}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading}
        onReorder={handleDragEnd}
        isPaginate={false}
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
