import React, { useMemo, useState } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import {
  MdCreateNewFolder,
  MdArrowUpward,
  MdArrowDownward,
} from 'react-icons/md'
import {
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  collection,
} from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { Video } from '../utils/types' // Assuming you have a Video type defined in utils/types
import { db, storage } from '../firebaseConfig'
import DeleteDialog from '../features/admin/dialogs/DeleteDialog'
import FloatingButton from '../features/admin/utils/FloatingButton'
import CustomTable from '../features/admin/table/CustomTable'
import ManageLibraryVideoModal from '../features/admin/modals/ManageLibraryVideoModal'
import { useFetchVideos } from '../hooks/useVideos'
import { Spinner, Button } from '@chakra-ui/react'

const AdminVideoPage = () => {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null) // Updated to currentVideo
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [deleteLoader, setDeleteLoader] = useState(false)
  const [movingVideoId, setMovingVideoId] = useState<string | null>(null)
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
      order: row.order,
    }
    setCurrentVideo(video) // Set the current video for editing
    onOpen()
  }

  // Sort videos by order
  const sortedVideos = useMemo(() => [...videos].sort((a, b) => {
    const orderA = a.order ?? videos.indexOf(a)
    const orderB = b.order ?? videos.indexOf(b)
    return orderA - orderB
  }), [videos])

  const handleDelete = (row: any) => {
    setCurrentVideo(row)
    onDeleteOpen()
  }

  const handleMoveUp = async (row: any) => {
    if (!row.id) return
    setMovingVideoId(row.id)
    // const currentIndex = videos.findIndex((v) => v.id === row.id)
    const currentIndex = (row.order ?? 1) - 1
    if (currentIndex > 0) {
      const prevVideo = sortedVideos[currentIndex - 1]
      const currentOrder = row.order || currentIndex
      const prevOrder = prevVideo.order || currentIndex - 1

      try {
        await updateDoc(doc(db, 'libraryVideos', row.id), { order: prevOrder })
        await updateDoc(doc(db, 'libraryVideos', prevVideo.id!), {
          order: currentOrder,
        })
        refetchVideos()
      } catch (error) {
        console.error('Failed to move video:', error)
      } finally {
        setMovingVideoId(null)
      }
    }
  }

  const handleMoveDown = async (row: any) => {
    if (!row.id) return
    setMovingVideoId(row.id)
    if ((row?.order ?? 1) < sortedVideos.length - 1) {
      const nextVideo = sortedVideos[((row?.order ?? 1) - 1) + 1]
      const currentOrder = row.order || 1
      const nextOrder = nextVideo.order || 1 + 1;

      try {
        await updateDoc(doc(db, 'libraryVideos', row.id), { order: nextOrder })
        await updateDoc(doc(db, 'libraryVideos', nextVideo.id!), {
          order: currentOrder,
        })
        refetchVideos()
      } catch (error) {
        console.error('Failed to move video:', error)
      } finally {
        setMovingVideoId(null)
      }
    }
  }

  const deleteVideo = async () => {
    if (!currentVideo) return
    setDeleteLoader(true)
    try {
      if (currentVideo.id) {
        // Delete video document from Firestore
        await deleteDoc(doc(db, 'libraryVideos', currentVideo.id))

        // Delete video file from Firebase Storage if it exists
        if (currentVideo.videoUrl.includes('firebasestorage')) {
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
        data={sortedVideos}
        columns={[
          { Header: 'Title', accessor: 'videoTitle' },
          { Header: 'Session', accessor: 'videoSession' },
          { Header: 'Author', accessor: 'author' },
          { Header: 'Date Posted', accessor: 'datePosted' },
          {
            Header: 'Order',
            accessor: 'order',
            Cell: ({ row }: any) => {
              const currentIndex = videos.findIndex(
                (v) => v.id === row.original.id,
              )
              const isMoving = movingVideoId === row.original.id
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
                    disabled={currentIndex === videos.length - 1 || isMoving}
                    style={{
                      padding: '4px',
                      cursor: isMoving
                        ? 'wait'
                        : currentIndex === videos.length - 1
                        ? 'not-allowed'
                        : 'pointer',
                      opacity: currentIndex === videos.length - 1 ? 0.5 : 1,
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
        // onDragEnd={handleDragEnd}
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
