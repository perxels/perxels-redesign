import React, { useState } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { MdCreateNewFolder } from 'react-icons/md'
import { doc, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { PDFDocument } from '../utils/types' // Assuming you have a PDF type defined in utils/types
import { db, storage } from '../firebaseConfig'
import DeleteDialog from '../features/admin/dialogs/DeleteDialog'
import FloatingButton from '../features/admin/utils/FloatingButton'
import CustomTable from '../features/admin/table/CustomTable'
import ManageLibraryPDFModal from '../features/admin/modals/ManageLibraryPDFModal'
import { useFetchPdfs } from '../hooks/usePdfs'

const AdminPdfPage = () => {
  const [currentPdf, setCurrentPdf] = useState<PDFDocument | null>(null) // Updated to currentPdf
  const { isOpen, onOpen, onClose } = useDisclosure()

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

  return (
    <>
      <CustomTable
        data={pdfs}
        columns={[
          { Header: 'Title', accessor: 'mainTitle' },
          { Header: 'Role', accessor: 'role' },
        ]}
        pageSize={8}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading} // Set loading state appropriately
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
