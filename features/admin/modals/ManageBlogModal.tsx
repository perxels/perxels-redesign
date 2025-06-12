import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  HStack,
  Image,
} from '@chakra-ui/react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import dynamic from 'next/dynamic';
import { db, storage } from '../../../firebaseConfig';
import { Blog } from '../../../utils/types';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface ManageBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchBlogs: () => void;
  blogToEdit?: Blog | null;
}

const ManageBlogModal: React.FC<ManageBlogModalProps> = ({
  isOpen,
  onClose,
  refetchBlogs,
  blogToEdit,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('');
  const [blog, setBlog] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null)



  const quillModules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
      ],
 
    },
  };

  useEffect(() => {
    if (blogToEdit) {
      setTitle(blogToEdit.title || '');
      setWriter(blogToEdit.writer || '');
      setBlog(blogToEdit.blog || '');
    } else {
      setTitle('');
      setWriter('');
      setBlog('');
    }
  }, [blogToEdit]);

  const handleSubmit = async () => {
    if (!title || !writer || !blog) {
      toast({
        title: 'Validation Error',
        description: 'All fields are required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    setLoading(true);
    try {
      let blogImageUrl = null;
  
      if (imageFile) {
        const uniqueName = `${Date.now()}_${imageFile.name}`;
        const imageRef = ref(storage, `blog-images/${uniqueName}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        blogImageUrl = await getDownloadURL(snapshot.ref);
      }
  
      if (blogToEdit) {
        if (!blogToEdit?.id) {
          throw new Error('Blog ID is required to edit the document.');
        }
  
        const blogRef = doc(db, 'blogs', blogToEdit.id);
        await updateDoc(blogRef, {
          title,
          writer,
          blog,
          image: blogImageUrl || blogToEdit.image, // Use existing image if no new one is uploaded
        });
      } else {
        await addDoc(collection(db, 'blogs'), {
          title,
          writer,
          blog,
          image: blogImageUrl,
        });
      }
  
      toast({
        title: 'Success',
        description: blogToEdit ? 'Blog updated successfully.' : 'Blog created successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
  
      refetchBlogs();
      onClose();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{blogToEdit ? 'Edit Blog' : 'Add Blog'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4} isRequired>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Writer</FormLabel>
            <Input value={writer} onChange={(e) => setWriter(e.target.value)} />
          </FormControl>
          <FormControl isRequired={blogToEdit? false :true} my='10px'>
              <FormLabel>Blog Image (1750 X 900)</FormLabel>
       
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  if (event.currentTarget.files) {
                    setImageFile(event.currentTarget.files[0])
                  }
                }}
              />
           
            </FormControl>
          <FormControl mb={4}>
            <FormLabel>Blog</FormLabel>
            <ReactQuill
            
              value={blog}
              onChange={setBlog}
              modules={quillModules}
              theme="snow"
              style={{height:'400px'}}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter mt={5}>
          <Button onClick={onClose} mr={3} variant="ghost" bg='white'>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Saving"
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ManageBlogModal;
