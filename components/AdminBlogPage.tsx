import React, { useMemo, useState } from 'react';
import { Button, Spinner, useDisclosure } from '@chakra-ui/react';
import { MdArrowDownward, MdArrowUpward, MdCreateNewFolder } from 'react-icons/md';
import { doc, deleteDoc, updateDoc, writeBatch, getDocs, collection } from 'firebase/firestore';
import { Blog } from '../utils/types'; // Assuming you have a Blog type defined
import { db } from '../firebaseConfig';
import DeleteDialog from '../features/admin/dialogs/DeleteDialog';
import FloatingButton from '../features/admin/utils/FloatingButton';
import CustomTable from '../features/admin/table/CustomTable';
import ManageBlogModal from '../features/admin/modals/ManageBlogModal';
import { useFetchBlogs } from '../hooks/useBlogs';
import DraggableTable from '../features/admin/table/DraggableTable';

const AdminBlogPage = () => {
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteLoader, setDeleteLoader] = useState(false);
  const {
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
    onOpen: onDeleteOpen,
  } = useDisclosure();
  const { blogs, loading, refetchBlogs } = useFetchBlogs();
  const [movingId, setMovingId] = useState<string | null>(null)

  const handleEdit = (row: any) => {
    const blog: Blog = {
      id: row.id,
      title: row.title,
      writer: row.writer,
     image: row.image,
      blog: row.blog,
    };
    setCurrentBlog(blog);
    onOpen();
  };

  const handleDelete = (row: any) => {
    setCurrentBlog(row);
    onDeleteOpen();
  };

  const deleteBlog = async () => {
    if (!currentBlog) return;
    setDeleteLoader(true);
    try {
      if (currentBlog.id) {
        // Delete blog document from Firestore
        await deleteDoc(doc(db, 'blogs', currentBlog.id));

        // Refresh the blogs after deletion
        refetchBlogs();
      }
      onDeleteClose();
    } catch (error) {
      console.error('Failed to delete blog:', error);
      alert('Something went wrong!');
    } finally {
      setDeleteLoader(false);
    }
  };

   // Sort pdf by order
   const sortedBlogs = useMemo(
    () =>
      [...blogs].sort((a, b) => {
        const orderA = a.order ?? blogs.indexOf(a)
        const orderB = b.order ?? blogs.indexOf(b)
        return orderA - orderB
      }),
    [blogs],
  )

  const handleMoveUp = async (row: any) => {
    if (!row.id) return
    setMovingId(row.id)
    // const currentIndex = videos.findIndex((v) => v.id === row.id)
    const currentIndex = (row.order ?? 1) - 1
    if (currentIndex > 0) {
      const prevVideo = sortedBlogs[currentIndex - 1]
      const currentOrder = row.order || currentIndex
      const prevOrder = prevVideo.order || currentIndex - 1

      try {
        await updateDoc(doc(db, 'blogs', row.id), { order: prevOrder })
        await updateDoc(doc(db, 'blogs', prevVideo.id!), {
          order: currentOrder,
        })
        refetchBlogs()
      } catch (error) {
        console.error('Failed to move blog:', error)
      } finally {
        setMovingId(null)
      }
    }
  }

  const handleMoveDown = async (row: any) => {
    if (!row.id) return
    setMovingId(row.id)
    if ((row?.order ?? 1) < sortedBlogs.length - 1) {
      const nextVideo = sortedBlogs[(row?.order ?? 1) - 1 + 1]
      const currentOrder = row.order || 1
      const nextOrder = nextVideo.order || 1 + 1

      try {
        await updateDoc(doc(db, 'blogs', row.id), { order: nextOrder })
        await updateDoc(doc(db, 'blogs', nextVideo.id!), {
          order: currentOrder,
        })
        refetchBlogs()
      } catch (error) {
        console.error('Failed to move blog:', error)
      } finally {
        setMovingId(null)
      }
    }
  }

  const handleDragEnd = async (newData: any) => {
    setMovingId(newData[0].id)
    try {
      const batch = writeBatch(db)

      newData.forEach((video: any) => {
        if (!video.id) {
          console.error('Video missing ID:', video)
          return
        }

        const videoRef = doc(db, 'blogs', video.id)
        batch.update(videoRef, { order: video.order })
      })
      await batch.commit()
      refetchBlogs()
      return true
    } catch (error) {
      console.error('Failed to move testimonials:', error)
    } finally {
      setMovingId(null)
    }
  }

  return (
    <>
      <DraggableTable
        data={sortedBlogs}
        columns={[
          { Header: 'Title', accessor: 'title' },
          { Header: 'Writer', accessor: 'writer' },
          {
            Header: 'Order',
            accessor: 'order',
            Cell: ({ row }: any) => {
              const currentIndex = sortedBlogs.findIndex(
                (v) => v.id === row.original.id,
              )
              const isMoving = movingId === row.original.id
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
                      currentIndex === sortedBlogs.length - 1 || isMoving
                    }
                    style={{
                      padding: '4px',
                      cursor: isMoving
                        ? 'wait'
                        : currentIndex === sortedBlogs.length - 1
                        ? 'not-allowed'
                        : 'pointer',
                      opacity: currentIndex === sortedBlogs.length - 1 ? 0.5 : 1,
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
        title="Add Blog"
        onClick={() => {
          setCurrentBlog(null);
          onOpen();
        }}
      />
      <ManageBlogModal
        isOpen={isOpen}
        onClose={onClose}
        refetchBlogs={refetchBlogs}
        blogToEdit={currentBlog}
      />

      <DeleteDialog
        title="Blog"
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        isLoading={deleteLoader}
        handleDelete={deleteBlog}
      />
    </>
  );
};

export default AdminBlogPage;
