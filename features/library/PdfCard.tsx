import React, { useEffect, useState } from 'react'
import {
  Box,
  Text,
  Heading,
  Image,
  Center,
  Flex,
  useDisclosure,
} from '@chakra-ui/react'
import { libraryCardContentProps } from '../../constant'
import LibraryPdfModal from '../../components/LibraryPdfModal'
export const PdfCards: React.FC<libraryCardContentProps> = ({
  bannerImage,
  mainTitle,
  subTitle,
  tag,
  role,
  url,
  data,
  dataChanged,
  setDataChanged,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box
      display="flex"
      position="relative"
      flexDir="column"
      alignItems="flex-start"
      borderRadius="10px"
    >
      <Box maxHeight="253px" width="100%" position="relative">
        <Image
          height="100%"
          width="100%"
          borderRadius={'8px 8px 0px 0px'}
          objectFit={'cover'}
          src={
            bannerImage
              ? bannerImage
              : './assets/images/library/libraryImage1.png'
          }
          alt="libraryCard1"
        />
      </Box>
      <Box
        borderRadius={'0px 0px 8px 8px'}
        position="relative"
        p="16px 24px"
        width="100%"
        bgColor="rgba(246, 246, 246, 0.65);"
      >
        <Flex justifyContent="space-between">
          <Center
            mb="16px"
            borderRadius={'16px'}
            color="#171717"
            border="1px solid #E8E8E8"
            display="inline-flex"
            p="6px 10px"
          >
            {tag}
          </Center>
          <Center
            mb="16px"
            borderRadius={'16px'}
            color="#FFFFFF"
            border="1px solid #E8E8E8"
            display="inline-flex"
            p="6px 10px"
            background="#363576"
            cursor="pointer"
            onClick={onOpen}
          >
            Download
          </Center>
        </Flex>

        <Heading fontSize="24px" lineHeight="120%" fontWeight="600">
          {mainTitle}
        </Heading>
        <Text
          fontSize="18px"
          color="#1A1A1A"
          // mt="12px"
        >
          {subTitle}
        </Text>
        <Text
          fontSize="18px"
          color="rgba(26, 26, 26, 0.80)"
          // mt="8px"
          //   fontStyle={'italic'}
        >
          {role}
        </Text>
      </Box>
      <LibraryPdfModal
        isOpen={isOpen}
        onClose={onClose}
        userList={data}
        title={mainTitle}
        url={url}
        dataChanged={dataChanged}
        setDataChanged={setDataChanged}
      />
    </Box>
  )
}
