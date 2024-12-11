import React, { useState } from 'react'
import AdminLayout from '../../features/admin/layout/AdminLayout'
import {
  Box,
  Button,
  HStack,
  IconButton,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import CustomTable from '../../features/admin/table/CustomTable'
import ManageMasterClassModal from '../../features/admin/modals/ManageMasterClassModal'
import FloatingButton from '../../features/admin/utils/FloatingButton'
import { MdCreateNewFolder } from 'react-icons/md'
import DeleteDialog from '../../features/admin/dialogs/DeleteDialog'
import { db, storage } from '../../firebaseConfig' // Ensure this import path is correct
import { doc, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { MasterClass, MasterClassHero } from '../../utils/types'
import {
  useFetchMasterClass,
  useFetchMasterclassHero,
} from '../../hooks/useMasterClass'
import { BiEdit } from 'react-icons/bi'
import ManageMasterClassHero from '../../features/admin/modals/ManageMasterClassHero'
import { Testimonial } from '../../features/designChallenge/Testimonial'
import AdminVideoPage from '../../components/AdminVideoPage'
import AdminPdfPage from '../../components/AdminPDFPage'
import AdminTestimonialPage from '../../components/AdminTestimonialPage'
import AdminBlogPage from '../../components/AdminBlogPage'

const AdminMasterClasses = () => {
  const [currentClass, setCurrentClass] = useState<MasterClass | null>(null)
  const [currentHero, setCurrentHero] = useState<MasterClassHero | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isHeroOpen,
    onOpen: onHeroOpen,
    onClose: onHeroClose,
  } = useDisclosure()
  const [deleteLoader, setDeleteLoader] = useState(false)
  const {
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
    onOpen: onDeleteOpen,
  } = useDisclosure()
  const { classes, loading, refetchClasses } = useFetchMasterClass()
  const {
    heroData,
    loading: heroLoader,
    refetchHero,
  } = useFetchMasterclassHero()

  const handleEdit = (row: any) => {
    const masterClass: MasterClass = {
      id: row.id,
      title: row.title,
      dateTime: row.dateTime,
      content1: row.content1,
      content2: row.content2,
      content3: row.content3,
      entries: row.entries,
      importantInfo: row.importantInfo,
      image: row.image,
    }
    setCurrentClass(masterClass)
    onOpen()
  }

  const handleDelete = (row: any) => {
    setCurrentClass(row)
    onDeleteOpen()
  }

  const deleteMasterClass = async () => {
    if (!currentClass) return
    setDeleteLoader(true)
    try {
      if (currentClass.id) {
        // Delete master class document from Firestore
        await deleteDoc(doc(db, 'masterClasses', currentClass.id))

        // Delete master class image from Firebase Storage if it exists
        if (currentClass.image) {
          const imageRef = ref(storage, currentClass.image)
          await deleteObject(imageRef)
        }

        // Refresh the master classes after deletion
        refetchClasses()
      }
      onDeleteClose()
    } catch (error) {
      console.error('Failed to delete master class:', error)
      alert('Something went wrong!')
    } finally {
      setDeleteLoader(false)
    }
  }

  return (
    <AdminLayout title="Library">
      <Tabs
        variant="soft-rounded"
        colorScheme="purple"
        //   index={changeState}
        //   onChange={(index) => setChangeState(index)}
      >
        <TabList
          overflowX="auto" // Enable horizontal scrolling
          whiteSpace="nowrap"
        >
          <Tab>Videos</Tab>
          <Tab>PDF</Tab>
          <Tab>Testimonial</Tab>
          <Tab>Blogs</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box w="full" mt="10px">
              <AdminVideoPage />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box w="full" mt="10px">
              <AdminPdfPage />
            </Box>
          </TabPanel>
          <TabPanel>
            <AdminTestimonialPage />
          </TabPanel>
          <TabPanel>
           <AdminBlogPage/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </AdminLayout>
  )
}

export default AdminMasterClasses
