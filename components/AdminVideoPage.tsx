import React, { useState } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { MdCreateNewFolder } from 'react-icons/md'
import { doc, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { Video } from '../utils/types' // Assuming you have a Video type defined in utils/types
import { db, storage } from '../firebaseConfig'
import DeleteDialog from '../features/admin/dialogs/DeleteDialog'
import FloatingButton from '../features/admin/utils/FloatingButton'
import CustomTable from '../features/admin/table/CustomTable'
import ManageLibraryVideoModal from '../features/admin/modals/ManageLibraryVideoModal'
import { useFetchVideos } from '../hooks/useVideos'

const AdminVideoPage = () => {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null) // Updated to currentVideo
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [deleteLoader, setDeleteLoader] = useState(false)
  const {
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
    onOpen: onDeleteOpen,
  } = useDisclosure()
  const { videos, loading, refetchVideos } = useFetchVideos() // Fetch videos instead of master classes

  const handleEdit = (row: any) => {
    const video: Video = {
      id: row.id,
      videoTitle: row.videoTitle,
      videoSession: row.videoSession,
      author: row.author,
      datePosted: row.datePosted,
      videoUrl: row.videoUrl,
      imageUrl: row?.imageUrl,
      // description: row.description,
    }
    setCurrentVideo(video) // Set the current video for editing
    onOpen()
  }

  const handleDelete = (row: any) => {
    setCurrentVideo(row)
    onDeleteOpen()
  }

  const deleteVideo = async () => {
    if (!currentVideo) return
    setDeleteLoader(true)
    try {
      if (currentVideo.id) {
        // Delete video document from Firestore
        await deleteDoc(doc(db, 'libryvideos', currentVideo.id))

        // Delete video file from Firebase Storage if it exists
        if (currentVideo.videoUrl) {
          const videoRef = ref(storage, currentVideo.videoUrl)
          await deleteObject(videoRef)
        }
        // Delete image file from Firebase Storage if it exists
        if (currentVideo.imageUrl) {
          const imageRef = ref(storage, currentVideo.imageUrl)
          await deleteObject(imageRef)
        }

        // Refresh the videos after deletion
        refetchVideos()
      }
      onDeleteClose()
    } catch (error) {
      console.error('Failed to delete video:', error)
      alert('Something went wrong!')
    } finally {
      setDeleteLoader(false)
    }
  }

  return (
    <>
      <CustomTable
        data={videos}
        columns={[
          { Header: 'Title', accessor: 'videoTitle' },
          { Header: 'Session', accessor: 'videoSession' },
          { Header: 'Author', accessor: 'author' },
          { Header: 'Date Posted', accessor: 'datePosted' },
        ]}
        pageSize={8}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading} // Set loading state appropriately
      />
      <FloatingButton
        icon={<MdCreateNewFolder size="24" />}
        title="Add Video"
        onClick={() => {
          setCurrentVideo(null)
          onOpen()
        }}
      />
      <ManageLibraryVideoModal
        isOpen={isOpen}
        onClose={onClose}
        refetchVideos={refetchVideos} // Update this to refetch videos after creation or update
        videoToEdit={currentVideo} // Pass the current video to edit
      />

      <DeleteDialog
        title="Video"
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        isLoading={deleteLoader}
        handleDelete={deleteVideo}
      />
    </>
  )
}

export default AdminVideoPage
