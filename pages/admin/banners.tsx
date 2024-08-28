import React, { useState } from 'react'
import AdminLayout from '../../features/admin/layout/AdminLayout'
import { Text, useDisclosure } from '@chakra-ui/react'
import CustomTable from '../../features/admin/table/CustomTable'
import CreateBannerModal from '../../features/admin/modals/CreateBannerModal'
import FloatingButton from '../../features/admin/utils/FloatingButton'
import { MdCreateNewFolder } from 'react-icons/md'
import DeleteDialog from '../../features/admin/dialogs/DeleteDialog'
import { db, storage } from '../../firebaseConfig' // Ensure this import path is correct
import { doc, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { useFetchBanner } from '../../hooks/useActiveBanner'

interface Banner {
  id?: string
  mainTitle: string
  subTitle: string
  location: string
  bannerImage?: string
  description: string
  content1: string
  content2: string
  content3: string
  content4: string
  speakerName: string
  speakerRole: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
}

const AdminBanners = () => {
  const { banners, loading, refetchBanners } = useFetchBanner()
  const [currentBanner, setCurrentBanner] = useState<Banner | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [deleteLoader, setDeleteLoader] = useState(false)
  const {
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
    onOpen: onDeleteOpen,
  } = useDisclosure()

  const handleEdit = (row: any) => {
    const banner: Banner = {
      id: row.id,
      mainTitle: row.mainTitle,
      subTitle: row.subTitle,
      location: row.location,
      bannerImage: row.bannerImage,
      description: row.description,
      content1: row.content1,
      content2: row.content2,
      content3: row.content3,
      content4: row.content4,
      speakerName: row.speakerName,
      speakerRole: row.speakerRole,
      startDate: row.startDate,
      endDate: row.endDate,
      startTime: row.startTime,
      endTime: row.endTime,
    }
    setCurrentBanner(banner)
    onOpen()
  }

  const handleDelete = (row: any) => {
    setCurrentBanner(row)
    onDeleteOpen()
  }

  const deleteBanner = async () => {
    if (!currentBanner) return
    setDeleteLoader(true)
    try {
      if (currentBanner.id) {
        // Delete banner document from Firestore
        await deleteDoc(doc(db, 'banners', currentBanner.id))

        // Delete banner image from Firebase Storage if it exists
        if (currentBanner.bannerImage) {
          const bannerImageRef = ref(storage, currentBanner.bannerImage)
          await deleteObject(bannerImageRef)
        }

        // Refresh the banners after deletion
        await refetchBanners()
      }
      onDeleteClose()
    } catch (error) {
      console.error('Failed to delete banner:', error)
    } finally {
      setDeleteLoader(false)
    }
  }

  return (
    <AdminLayout>
      <Text as="h1" mb="20px">
        Manage Site Banner
      </Text>
      <CustomTable
        data={banners}
        columns={[
          { Header: 'Title', accessor: 'mainTitle' },
          { Header: 'Event Date', accessor: 'endDate' },
          { Header: 'Start Time', accessor: 'startTime' },
          { Header: 'End Time', accessor: 'endTime' },
          { Header: 'Location', accessor: 'location' },
        ]}
        pageSize={8}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading}
      />
      <FloatingButton
        icon={<MdCreateNewFolder size="24" />}
        title="Add Banner"
        onClick={() => {
          setCurrentBanner(null)
          onOpen()
        }}
      />
      <CreateBannerModal
        isOpen={isOpen}
        onClose={onClose}
        banner={currentBanner}
        fetchBanners={refetchBanners}
      />
      <DeleteDialog
        title="Banner"
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        isLoading={deleteLoader}
        handleDelete={deleteBanner}
      />
    </AdminLayout>
  )
}

export default AdminBanners
