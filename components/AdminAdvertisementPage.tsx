import React, { useState } from 'react'
import { useAdvertisements } from '../hooks/useAdvertisement'
import { EmptyAdvertisement } from './EmptyAdvertisement'
import FloatingButton from '../features/admin/utils/FloatingButton'
import { MdCreateNewFolder } from 'react-icons/md'
import { Badge, useDisclosure, useToast } from '@chakra-ui/react'
import ManageAdvertisement from '../features/admin/modals/ManageAdvertisement'
import CustomTable from '../features/admin/table/CustomTable'
import { Advertisement } from '../utils/types'
import Image from 'next/image'
import DeleteDialog from '../features/admin/dialogs/DeleteDialog'
import { deleteDoc, doc } from 'firebase/firestore'
import { db, storage } from '../firebaseConfig'
import { deleteObject, ref } from 'firebase/storage'

const AdminAdvertisementPage = () => {
  const [currentAdvertisement, setCurrentAdvertisement] =
    useState<Advertisement | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [deleteLoader, setDeleteLoader] = useState(false)

  const toast = useToast();

  const {
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
    onOpen: onDeleteOpen,
  } = useDisclosure()

  const { advertisements, loading, refetchAdvertisements } = useAdvertisements()

  const handleEdit = (row: any) => {
    const advertisement: Advertisement = {
      ...row,
    }

    setCurrentAdvertisement(advertisement)
    onOpen()
  }

  const handleDelete = (row: Advertisement) => {
    setCurrentAdvertisement(row)
    onDeleteOpen()
  }

  const deleteVideo = async () => {
    if (!currentAdvertisement) return;

    setDeleteLoader(true);

    try {
        if(currentAdvertisement.id) {
            await deleteDoc(doc(db, 'advertisements', currentAdvertisement.id))

            const advertisementRef = ref(storage, currentAdvertisement.imageUrl);
            await deleteObject(advertisementRef);

            refetchAdvertisements()
        }

        onDeleteClose()
    } catch (error) {
        console.error('Failed to delete video:', error);
        toast({
            title: "Something went wrong!"
        });
    } finally {
        setDeleteLoader(false);
    }
  }

  return (
    <>
      {advertisements?.length === 0 && <EmptyAdvertisement />}

      {advertisements?.length > 0 && (
        <CustomTable
          data={advertisements}
          columns={[
            { Header: 'Title', accessor: 'name' },
            {
              Header: 'Image',
              accessor: 'imageUrl',
              Cell: ({ row }: any) => {
                return (
                  <Image
                    src={row.original.imageUrl}
                    alt={row.original.name}
                    width={224}
                    height={86.25}
                  />
                )
              },
            },
            {
                Header: 'Should open new tab?',
                accessor: 'openNewTab',
                Cell: ({ row }: any) => {
                    return (
                        <Badge size="lg" px={2} py={1} colorScheme={row.original.openAnotherTab ? 'green' : 'yellow'}>{row.original.openAnotherTab ? "Yes" : "No"}</Badge>
                    )
                }
            }
          ]}
          pageSize={8}
          isLoading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <FloatingButton
        icon={<MdCreateNewFolder size="24" />}
        title="Add Advertisement"
        onClick={() => {
          setCurrentAdvertisement(null)
          onOpen()
        }}
        maxWidth="240px"
      />

      <ManageAdvertisement
        isOpen={isOpen}
        onClose={onClose}
        refetchAdvertisements={refetchAdvertisements}
        advertisementToEdit={currentAdvertisement}
      />

      <DeleteDialog
        title="Advertisement"
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        isLoading={deleteLoader}
        handleDelete={deleteVideo}
      />
    </>
  )
}

export default AdminAdvertisementPage
