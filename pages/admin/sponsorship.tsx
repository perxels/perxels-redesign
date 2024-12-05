import AdminLayout from '../../features/admin/layout/AdminLayout';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Divider,
  Spinner,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import ManageSponsorshipHero from '../../features/admin/modals/ManageSponsorshipHero';
import { BiEdit } from 'react-icons/bi';
import CustomTable from '../../features/admin/table/CustomTable';
import FloatingButton from '../../features/admin/utils/FloatingButton';
import DeleteDialog from '../../features/admin/dialogs/DeleteDialog';
import { MdCreateNewFolder } from 'react-icons/md';
import ManageSponsorshipClass from '../../features/admin/modals/ManageSponsorshipClass';
import { ClassDetails, SponsorshipHero } from '../../utils/types';
import { useSponsorshipClass, useSponsorshipHero } from '../../hooks/useSponsorship';
import moment from 'moment';



const AdminSponsorship = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedHero, setSelectedHero] = useState<SponsorshipHero | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassDetails | null>(null);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const {heroData,isLoading,refetchHero} = useSponsorshipHero()
  const {classData,loading,refetchClass} = useSponsorshipClass()



  const handleEditHero = (hero: SponsorshipHero) => {
    setSelectedHero(hero);
    setIsModalOpen(true);
  };

  const handleEditClass = (classDetails: ClassDetails) => {
    setSelectedClass(classDetails);
    onOpen();
  };

  const handleDeleteClass = async () => {
    if (!classToDelete) return;
    try {
      setDeleteLoader(true);
      await deleteDoc(doc(db, 'sponsorshipClasses', classToDelete));
      refetchClass()
    } catch (error) {
      console.error('Error deleting class:', error);
    } finally {
      setDeleteLoader(false);
      setDeleteOpen(false);
    }
  };

  return (
    <AdminLayout title="Sponsorship">
      <Box bg="#f4d06f" p="20px" shadow="md" mb="20px" rounded="md">
        {/* Sponsorship Hero Management */}
        <Heading color="black" as="h2" size="lg" mb={6}>
        Sponsorship Hero
        </Heading>
        {isLoading ? (
          <Stack alignItems="center" justifyContent="center">
            <Spinner size="lg" />
          </Stack>
        ) : (
          heroData.map((hero) => (
            <VStack
              key={hero.id}
              align="start"
              borderWidth="1px"
              borderRadius="lg"
              p={4}
              mb={4}
              spacing={4}
            >
              <Text color="black">
                <strong>Event Title:</strong> {hero.eventTitle}
              </Text >
              <Text color="black">
                <strong>Main Title:</strong> {hero.mainTitle}
              </Text>
              <Text color="black">
                <strong>Paragraph:</strong> {hero.paragraph}
              </Text>
              <Divider />
              <Heading color="black" as="h4" size="md">
                Application Criteria
              </Heading>
              {hero.applicationCriteria.map((criteria, index) => (
                <Box  bg='white' color="black" w='full' rounded='md' key={index} p={2}>
                  <Text>
                    <strong>Title:</strong> {criteria.title}
                  </Text>
                  <Text>
                    <strong>Description:</strong> {criteria.paragraph}
                  </Text>
                </Box>
              ))}
              <Divider />
              <Text color="black">
                <strong>Application Opening:</strong>{' '}
                {moment(hero.applicationOpeningDate).format('MMMM Do, YYYY')} at  {moment(hero.applicationOpeningTime, 'HH:mm').format('h:mm a')} 
              </Text>
              <Text color="black">
                <strong>Application Closing:</strong>{' '}
                {moment(hero.applicationClosingDate).format('MMMM Do, YYYY')} at  {moment(hero.applicationClosingTime, 'HH:mm').format('h:mm a')}
              </Text>
              <HStack justifyContent="flex-end" w="full">
                <Button
                     size="sm"
                     color="black"
                     px="10px"
                     bg="white"
                     rounded="md"
                     _hover={{ bg: 'black', color: 'white' }}
                     aria-label="edit"
                     rightIcon={<BiEdit />}
                  onClick={() => handleEditHero(hero)}
                >
                  Edit
                </Button>
              </HStack>
            </VStack>
          ))
        )}
        <ManageSponsorshipHero
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          refetchHero={refetchHero}
          sponsorshipHeroToEdit={selectedHero}
        />
      </Box>
      <Heading color="black" as="h2" size="lg" mb={6}>
        Sponsorship Classes
        </Heading>
      {/* Classes Table */}
      <CustomTable
        data={classData}
        isLoading={loading}
        columns={[
          { Header: 'Title', accessor: 'title' },
          { Header: 'Duration', accessor: 'classDur' },
          { Header: 'Type', accessor: 'classType' },
        ]}
        pageSize={8}
        onEdit={handleEditClass}
        onDelete={(item: any) => {
          setClassToDelete(item.id);
          setDeleteOpen(true);
        }}
      />
      <FloatingButton
        icon={<MdCreateNewFolder size="24" />}
        title="Add New Class"
        onClick={()=>{setSelectedClass(null)
          onOpen()}}
      />
      <ManageSponsorshipClass
        isOpen={isOpen}
        onClose={onClose}
        refetchClasses={refetchClass}
        classToEdit={selectedClass}
      />
      <DeleteDialog
        title="Class"
        isOpen={isDeleteOpen}
        onClose={() => setDeleteOpen(false)}
        isLoading={deleteLoader}
        handleDelete={handleDeleteClass}
      />
    </AdminLayout>
  );
};

export default AdminSponsorship;
