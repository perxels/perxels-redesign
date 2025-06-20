import { useMemo, useState } from 'react'
import { AdminMasterClass } from '../utils/types'
import { Spinner, useDisclosure } from '@chakra-ui/react'
import { useFetchMasterClass } from '../hooks/useAdminMasterclass'
import { deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore'
import { db, storage } from '../firebaseConfig'
import { deleteObject, ref } from 'firebase/storage'
import DraggableTable from '../features/admin/table/DraggableTable'
import { formatDate } from '../utils'
import { MdArrowDownward, MdArrowUpward, MdCreateNewFolder } from 'react-icons/md'
import FloatingButton from '../features/admin/utils/FloatingButton'
import DeleteDialog from '../features/admin/dialogs/DeleteDialog'
import ManageLibraryMasterClassModal from '../features/admin/modals/ManageLibraryMasterClassModal'

const AdminMasterclassPage = () => {
  const [currentClass, setCurrentClass] = useState<AdminMasterClass | null>(
    null,
  )
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [deleteLoader, setDeleteLoader] = useState(false)
  const [movingClassId, setMovingClassId] = useState<string | null>(null)

  const {
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
    onOpen: onDeleteOpen,
  } = useDisclosure()

  const { masterClasses, loading, refetchMasterClasses } = useFetchMasterClass()

  const handleEdit = (row: any) => {
    const masterClass: AdminMasterClass = {
      id: row.id,
      title: row.title,
      url: row.url,
      bannerImage: row.bannerImage,
      datePosted: row.datePosted,
      firstTag: row.firstTag,
      secondTag: row.secondTag,
      order: row.order,
    }
    setCurrentClass(masterClass)
    onOpen()
  }

  const sortedMasterClasses = useMemo(() => {
    return [...masterClasses].sort((a, b) => {
      const orderA = a.order ?? masterClasses.indexOf(a)
      const orderB = b.order ?? masterClasses.indexOf(b)
      return orderA - orderB
    })
  }, [masterClasses])

  const handleDelete = (row: any) => {
    setCurrentClass(row)
    onDeleteOpen()
  }

  const handleMoveUp = async (row: any) => {
    if (!row.id) return
    setMovingClassId(row.id)
    const currentIndex = (row.order ?? 1) - 1
    if (currentIndex > 0) {
      const prevClass = sortedMasterClasses[currentIndex - 1]
      const currentOrder = row.order || currentIndex
      const prevOrder = prevClass.order || currentIndex - 1

      try {
        await updateDoc(doc(db, 'adminMasterClasses', row.id), {
          order: prevOrder,
        })
        await updateDoc(doc(db, 'adminMasterClasses', prevClass.id!), {
          order: currentOrder,
        })
        refetchMasterClasses()
      } catch (error) {
        console.error('Failed to move master class:', error)
      } finally {
        setMovingClassId(null)
      }
    }
  }

  const handleMoveDown = async (row: any) => {
    if (!row.id) return
    setMovingClassId(row.id)
    if ((row?.order ?? 1) < sortedMasterClasses.length - 1) {
      const nextClass = sortedMasterClasses[(row?.order ?? 1) - 1 + 1]
      const currentOrder = row.order || 1
      const nextOrder = nextClass.order || 1 + 1

      try {
        await updateDoc(doc(db, 'adminMasterClasses', row.id), {
          order: nextOrder,
        })
        await updateDoc(doc(db, 'adminMasterClasses', nextClass.id!), {
          order: currentOrder,
        })
        refetchMasterClasses()
      } catch (error) {
        console.error('Failed to move master class:', error)
      } finally {
        setMovingClassId(null)
      }
    }
  }

  const handleDragEnd = async (newData: any) => {
    setMovingClassId(newData[0].id)
    try {
      const batch = writeBatch(db)

      newData.forEach((masterClass: any) => {
        if (!masterClass.id) {
          console.error('Master class missing ID:', masterClass)
          return
        }

        const masterClassRef = doc(db, 'adminMasterClasses', masterClass.id)
        batch.update(masterClassRef, { order: masterClass.order })
      })
      await batch.commit()
      refetchMasterClasses()
      return true
    } catch (error) {
      console.error('Failed to move master class:', error)
    } finally {
      setMovingClassId(null)
    }
  }

  const deleteMasterClass = async () => {
    if (!currentClass) return
    setDeleteLoader(true)
    try {
      if (currentClass.id) {
        await deleteDoc(doc(db, 'adminMasterClasses', currentClass.id))

        if (currentClass.bannerImage) {
          const imageRef = ref(storage, currentClass.bannerImage)
          await deleteObject(imageRef)
        }

        refetchMasterClasses()
        onDeleteClose()
      }
    } catch (error) {
      console.error('Failed to delete master class:', error)
    } finally {
      setDeleteLoader(false)
    }
  }
  return (
    <>
      <DraggableTable
        data={sortedMasterClasses}
        columns={[
          {
            Header: 'Title',
            accessor: 'title',
          },
          {
            Header: 'First Tag',
            accessor: 'firstTag',
          },
          {
            Header: 'Second Tag',
            accessor: 'secondTag',
          },
          {
            Header: 'Views',
            accessor: 'views',
            Cell: ({ row }: any) => {
              return row.original.views || 0
            },
          },
          {
            Header: 'Date Posted',
            accessor: 'datePosted',
            Cell: ({ row }: any) => {
              return formatDate(row.original.datePosted)
            },
          },
          {
            Header: 'Order',
            accessor: 'order',
            Cell: ({ row }: any) => {
                const currentIndex = sortedMasterClasses.findIndex(
                  (v) => v.id === row.original.id,
                )
                const isMoving = movingClassId === row.original.id
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
                      disabled={currentIndex === sortedMasterClasses.length - 1 || isMoving}
                      style={{
                        padding: '4px',
                        cursor: isMoving
                          ? 'wait'
                          : currentIndex === sortedMasterClasses.length - 1
                          ? 'not-allowed'
                          : 'pointer',
                        opacity: currentIndex === sortedMasterClasses.length - 1 ? 0.5 : 1,
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
        title="Add Master Class"
        onClick={() => {
          setCurrentClass(null)
          onOpen()
        }}
      />
      <ManageLibraryMasterClassModal
        isOpen={isOpen}
        onClose={onClose}
        refetchMasterClasses={refetchMasterClasses}
        masterClassToEdit={currentClass}
      />

      <DeleteDialog
        title="Master Class"
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        isLoading={deleteLoader}
        handleDelete={deleteMasterClass}
      />
    </>
  )
}

export default AdminMasterclassPage
