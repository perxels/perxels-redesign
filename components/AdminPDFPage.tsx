import React, { useMemo, useState } from 'react'
import { Button, Spinner, useDisclosure } from '@chakra-ui/react'
import {
  MdArrowDownward,
  MdArrowUpward,
  MdCreateNewFolder,
} from 'react-icons/md'
import {
  doc,
  deleteDoc,
  updateDoc,
  writeBatch,
  collection,
  getDocs,
} from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { PDFDocument } from '../utils/types' // Assuming you have a PDF type defined in utils/types
import { db, storage } from '../firebaseConfig'
import DeleteDialog from '../features/admin/dialogs/DeleteDialog'
import FloatingButton from '../features/admin/utils/FloatingButton'
import ManageLibraryPDFModal from '../features/admin/modals/ManageLibraryPDFModal'
import { useFetchPdfs } from '../hooks/usePdfs'
import DraggableTable from '../features/admin/table/DraggableTable'

const AdminPdfPage = () => {
  const [currentPdf, setCurrentPdf] = useState<PDFDocument | null>(null) // Updated to currentPdf
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [movingPdfId, setMovingPdfId] = useState<string | null>(null)

  const [deleteLoader, setDeleteLoader] = useState(false)
  const {
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
    onOpen: onDeleteOpen,
  } = useDisclosure()
  const { pdfs, loading, refetchPdfs } = useFetchPdfs() // Fetch PDFs

  const handleEdit = (row: any) => {
    const pdf: PDFDocument = {
      id: row.id,
      mainTitle: row.mainTitle,
      subTitle: row?.subTitle,
      role: row.role,
      url: row.url,
      bannerImage: row?.bannerImage,
    }
    setCurrentPdf(pdf) // Set the current PDF for editing
    onOpen()
  }

  const handleDelete = (row: any) => {
    setCurrentPdf(row)
    onDeleteOpen()
  }

  const deletePdf = async () => {
    if (!currentPdf) return
    setDeleteLoader(true)
    try {
      if (currentPdf.id) {
        // Delete PDF document from Firestore
        await deleteDoc(doc(db, 'libraryPdfs', currentPdf.id))

        // Delete PDF file from Firebase Storage if it exists
        if (currentPdf.url.includes('firebasestorage')) {
          const pdfRef = ref(storage, currentPdf.url)
          await deleteObject(pdfRef)
        }
        // Delete banner image from Firebase Storage if it exists
        if (currentPdf.bannerImage) {
          const imageRef = ref(storage, currentPdf.bannerImage)
          await deleteObject(imageRef)
        }

        // Refresh the PDFs after deletion
        refetchPdfs()
      }
      onDeleteClose()
    } catch (error) {
      console.error('Failed to delete PDF:', error)
      alert('Something went wrong!')
    } finally {
      setDeleteLoader(false)
    }
  }

  // Sort pdf by order
  const sortedPdfs = useMemo(
    () =>
      [...pdfs].sort((a, b) => {
        const orderA = a.order ?? pdfs.indexOf(a)
        const orderB = b.order ?? pdfs.indexOf(b)
        return orderA - orderB
      }),
    [pdfs],
  )

  const handleMoveUp = async (row: any) => {
    if (!row.id) return
    setMovingPdfId(row.id)
    // const currentIndex = videos.findIndex((v) => v.id === row.id)
    const currentIndex = (row.order ?? 1) - 1
    if (currentIndex > 0) {
      const prevVideo = sortedPdfs[currentIndex - 1]
      const currentOrder = row.order || currentIndex
      const prevOrder = prevVideo.order || currentIndex - 1

      try {
        await updateDoc(doc(db, 'libraryPDFs', row.id), { order: prevOrder })
        await updateDoc(doc(db, 'libraryPDFs', prevVideo.id!), {
          order: currentOrder,
        })
        refetchPdfs()
      } catch (error) {
        console.error('Failed to move video:', error)
      } finally {
        setMovingPdfId(null)
      }
    }
  }

  const handleMoveDown = async (row: any) => {
    if (!row.id) return
    setMovingPdfId(row.id)
    if ((row?.order ?? 1) < sortedPdfs.length - 1) {
      const nextVideo = sortedPdfs[(row?.order ?? 1) - 1 + 1]
      const currentOrder = row.order || 1
      const nextOrder = nextVideo.order || 1 + 1

      try {
        await updateDoc(doc(db, 'libraryPDFs', row.id), { order: nextOrder })
        await updateDoc(doc(db, 'libraryPDFs', nextVideo.id!), {
          order: currentOrder,
        })
        refetchPdfs()
      } catch (error) {
        console.error('Failed to move video:', error)
      } finally {
        setMovingPdfId(null)
      }
    }
  }

  const handleDragEnd = async (newData: any) => {
    setMovingPdfId(newData[0].id)
    try {
      const batch = writeBatch(db)

      console.log(newData);

      newData.forEach((video: any) => {
        if (!video.id) {
          console.error('Video missing ID:', video)
          return
        }

        const videoRef = doc(db, 'libraryPDFs', video.id)
        batch.update(videoRef, { order: video.order })
      })
      await batch.commit()
      refetchPdfs()
      return true
    } catch (error) {
      console.error('Failed to move video:', error)
    } finally {
      setMovingPdfId(null)
    }
  }

  return (
    <>
      <DraggableTable
        data={sortedPdfs}
        columns={[
          { Header: 'Title', accessor: 'mainTitle' },
          { Header: 'Role', accessor: 'role' },
          {
            Header: 'Order',
            accessor: 'order',
            Cell: ({ row }: any) => {
              const currentIndex = sortedPdfs.findIndex(
                (v) => v.id === row.original.id,
              )
              const isMoving = movingPdfId === row.original.id
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
                      currentIndex === sortedPdfs.length - 1 || isMoving
                    }
                    style={{
                      padding: '4px',
                      cursor: isMoving
                        ? 'wait'
                        : currentIndex === sortedPdfs.length - 1
                        ? 'not-allowed'
                        : 'pointer',
                      opacity: currentIndex === sortedPdfs.length - 1 ? 0.5 : 1,
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
        isLoading={loading} // Set loading state appropriately
        onReorder={handleDragEnd}
        isPaginate={false}
      />
      <FloatingButton
        icon={<MdCreateNewFolder size="24" />}
        title="Add PDF"
        onClick={() => {
          setCurrentPdf(null)
          onOpen()
        }}
      />
      <ManageLibraryPDFModal
        isOpen={isOpen}
        onClose={onClose}
        refetchPDFs={refetchPdfs} // Update this to refetch PDFs after creation or update
        pdfToEdit={currentPdf} // Pass the current PDF to edit
      />

      <DeleteDialog
        title="PDF"
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        isLoading={deleteLoader}
        handleDelete={deletePdf}
      />
    </>
  )
}

export default AdminPdfPage
