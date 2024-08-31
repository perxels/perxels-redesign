import React, { useState } from 'react'
import AdminLayout from '../../features/admin/layout/AdminLayout'
import {
  Button,
  HStack,
  IconButton,
  Spinner,
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
    <AdminLayout title="Master Class">
      <VStack
        bg="#f4d06f"
        px="20px"
        shadow="md"
        mb="20px"
        rounded="md"
        py="20px"
        alignItems="flex-start"
      >
        <HStack
          mb="10px"
          pb="10px"
          borderBottom="1px solid black"
          w="full"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text as="h1" maxW="70%" color="black">
            Hero Section :
          </Text>
          <Button
            size="sm"
            color="black"
            px="10px"
            bg="white"
            rounded="md"
            _hover={{ bg: 'black', color: 'white' }}
            aria-label="edit"
            rightIcon={<BiEdit />}
            onClick={() => {
              const currentData = heroData[0]
              setCurrentHero(currentData)
              onHeroOpen()
            }}
            isDisabled={heroData.length > 0 ? false : true}
          >
            edit
          </Button>
        </HStack>
        {heroLoader ? (
          <VStack w="full" h="60px" alignItems="center" justifyContent="center">
            <Spinner size="md" />
          </VStack>
        ) : (
          <>
            <Text as="h1" color="#333333">
              {heroData[0]?.title}
            </Text>
            <Text as="p" mb="10px" color="#333333">
              {heroData[0]?.desc}
            </Text>
          </>
        )}
      </VStack>
      <CustomTable
        data={classes}
        columns={[
          { Header: 'Title', accessor: 'title' },
          { Header: 'Date & Time', accessor: 'dateTime' },
          { Header: 'Response Status', accessor: 'entries' },
        ]}
        pageSize={8}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading} // You can set loading state appropriately
      />
      <FloatingButton
        icon={<MdCreateNewFolder size="24" />}
        title="Add Master Class"
        onClick={() => {
          setCurrentClass(null)
          onOpen()
        }}
      />
      <ManageMasterClassModal
        isOpen={isOpen}
        onClose={onClose}
        refetchClasses={refetchClasses}
        masterClassToEdit={currentClass}
      />
      <ManageMasterClassHero
        isOpen={isHeroOpen}
        onClose={onHeroClose}
        refetchHero={refetchHero}
        masterClassHeroToEdit={currentHero}
      />
      <DeleteDialog
        title="Master Class"
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        isLoading={deleteLoader}
        handleDelete={deleteMasterClass}
      />
    </AdminLayout>
  )
}

export default AdminMasterClasses
