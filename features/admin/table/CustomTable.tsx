import React, { useState, useEffect } from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Box,
  Flex,
  IconButton,
  Text,
  Spinner,
  Center,
} from '@chakra-ui/react'
import { MdDelete } from 'react-icons/md'
import { BiEdit } from 'react-icons/bi'

const CustomTable = ({
  data,
  columns,
  pageSize,
  onEdit,
  onDelete,
  isLoading,
  error,
  searchQuery,
  isPaginate = true,
}: any) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [filteredData, setFilteredData] = useState(data)

  useEffect(() => {
    if (searchQuery) {
      const filtered = data.filter((row: any) =>
        columns.some((column: any) =>
          String(row[column.accessor])
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        ),
      )
      setFilteredData(filtered)
      setCurrentPage(0)
    } else {
      setFilteredData(data)
    }
  }, [searchQuery, data, columns])

  const start = currentPage * pageSize
  const end = start + pageSize
  const paginatedData = filteredData.slice(start, end)

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const showActions = onEdit || onDelete

  return (
    <Box w="full">
      <TableContainer
        // minH={!paginatedData || paginatedData.length === 0 ? "30vh" : ""}
        rounded="15px"
        width="full"
      >
        <Table
          rounded="15px"
          // minH={!paginatedData || paginatedData.length === 0 ? "" : "50vh"}
          border={
            !paginatedData || paginatedData.length === 0
              ? ''
              : '3px solid brand.purple.500'
          }
          roundedTop="15px"
          variant="simple"
        >
          <Thead
            height={'70px'}
            roundedTop="15px"
            background="brand.purple.500"
          >
            <Tr>
              <Th color="white" fontSize="15px">
                #
              </Th>
              {columns.map((column: any) => (
                <Th color="white" fontSize="15px" key={column.accessor}>
                  {column.Header}
                </Th>
              ))}
              {showActions && (
                <Th color="white" fontSize="15px">
                  Actions
                </Th>
              )}
            </Tr>
          </Thead>
          <Tbody rounded="15px">
            {isLoading ? (
              <Tr h="40px">
                <Td colSpan={columns.length + 2}>
                  <Center>
                    <Spinner size="md" />
                  </Center>
                </Td>
              </Tr>
            ) : error ? (
              <Tr h="40px">
                <Td colSpan={columns.length + 2}>
                  <Center>
                    <Text color="red.500">{error}</Text>
                  </Center>
                </Td>
              </Tr>
            ) : paginatedData.length === 0 ? (
              <Tr h="40px">
                <Td colSpan={columns.length + 2}>
                  <Center>
                    <Text>No Data Found</Text>
                  </Center>
                </Td>
              </Tr>
            ) : (
              paginatedData.map((row: any, rowIndex: any) => (
                <Tr key={rowIndex} minH="40px">
                  <Td>{start + rowIndex + 1}</Td>
                  {columns.map((column: any) => (
                    <Td fontSize="13px" key={column.accessor}>
                      {column.Cell ? (
                        <column.Cell row={{ original: row }} />
                      ) : (
                        row[column.accessor] || 'Not Applicable'
                      )}
                    </Td>
                  ))}
                  {showActions && (
                    <Td>
                      {onEdit && (
                        <IconButton
                          aria-label="Edit"
                          icon={<BiEdit />}
                          color="white"
                          isRound
                          backgroundColor="brand.900"
                          colorScheme="green"
                          onClick={() => onEdit(row)}
                          mr={2}
                        />
                      )}
                      {onDelete && (
                        <IconButton
                          icon={<MdDelete />}
                          aria-label="Delete"
                          color="white"
                          isRound
                          backgroundColor="brand.900"
                          colorScheme="green"
                          onClick={() => onDelete(row)}
                        />
                      )}
                    </Td>
                  )}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
      {isPaginate && (
        <Flex
          w="full"
          justifyContent="space-between"
          alignItems="center"
          mt={4}
        >
          <Box>
            Page {currentPage + 1} of {totalPages}
          </Box>
          <Box>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              mr={2}
              color="brand.900"
              colorScheme="green"
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage === totalPages - 1}
              color="white"
              backgroundColor="brand.900"
              colorScheme="green"
            >
              Next
            </Button>
          </Box>
        </Flex>
      )}
    </Box>
  )
}

export default CustomTable
