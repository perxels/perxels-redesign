import React, { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { MdCreateNewFolder } from 'react-icons/md';
import { doc, deleteDoc } from 'firebase/firestore';
import { Blog } from '../utils/types'; // Assuming you have a Blog type defined
import { db } from '../firebaseConfig';
import DeleteDialog from '../features/admin/dialogs/DeleteDialog';
import FloatingButton from '../features/admin/utils/FloatingButton';
import CustomTable from '../features/admin/table/CustomTable';
import ManageBlogModal from '../features/admin/modals/ManageBlogModal';
import { useFetchBlogs } from '../hooks/useBlogs';

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

  return (
    <>
      <CustomTable
        data={blogs}
        columns={[
          { Header: 'Title', accessor: 'title' },
          { Header: 'Writer', accessor: 'writer' },
        ]}
        pageSize={8}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading}
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
