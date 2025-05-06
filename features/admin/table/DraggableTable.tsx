import React, { useState, useEffect, useRef } from 'react'
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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { MdDragIndicator } from 'react-icons/md'
import { StrictModeDroppable } from './StrictModeDroppable'
// Fix for React 18 with react-beautiful-dnd

const DraggableTable = ({
  data,
  columns,
  pageSize,
  onEdit,
  onDelete,
  isLoading,
  error,
  searchQuery,
  isPaginate = true,
  onReorder, // New prop to handle reordering
}: any) => {
  const [currentPage, setCurrentPage] = useState(0)
  // const [filteredData, setFilteredData] = useState(data)
  const [tableData, setTableData] = useState(data)

  useEffect(() => {
    if (searchQuery) {
      const filtered = data.filter((row: any) =>
        columns.some((column: any) =>
          String(row[column.accessor])
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        ),
      )
      // setFilteredData(filtered)
      setTableData(filtered)
      setCurrentPage(0)
    } else {
      // setFilteredData(data)
      setTableData(data)
    }
  }, [searchQuery, data, columns])

  const start = currentPage * pageSize
  const end = start + pageSize
  const paginatedData = isPaginate ? tableData.slice(start, end) : tableData

  const totalPages = Math.ceil(tableData.length / pageSize)

  const showActions = onEdit || onDelete

  // Handle drag end event
  const handleDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return
    }

    const startIndex = result.source.index
    const endIndex = result.destination.index

    // If the item was dropped in the same position, do nothing
    if (startIndex === endIndex) {
      return
    }

    // Create a copy of the current page data
    const currentPageItems = [...paginatedData]

    // Remove the item from the source position
    const [removed] = currentPageItems.splice(startIndex, 1)

    // Insert it at the destination position
    currentPageItems.splice(endIndex, 0, removed)

    // Update the full data array based on pagination
    const newData = [...tableData]
    for (let i = 0; i < currentPageItems.length; i++) {
      newData[start + i] = currentPageItems[i]
    }

    // Update order-id for all affected items to maintain sort order
    // Calculate the range of items that need order-id updates
    const minIndex = Math.min(startIndex, endIndex) + start
    const maxIndex = Math.max(startIndex, endIndex) + start
    
    // Update order-ids for all items in the affected range
    for (let i = 0; i < newData.length; i++) {
      // Ensure each item has an order-id property
      if (i >= minIndex && i <= maxIndex) {
        newData[i].order = i + 1 // Assuming order-id starts from 1
      }
    }

    // Update the state
    // setFilteredData(newData)

    // Call the callback if provided
    if (onReorder) {
      // Pass the updated data with new order-ids
      onReorder(newData)
    }
  }

  return (
    <Box w="full">
      <TableContainer rounded="15px" width="full">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Table
            rounded="15px"
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
                {/* Drag handle column */}
                <Th color="white" fontSize="15px" width="50px"></Th>
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
            <StrictModeDroppable droppableId="table-body">
              {(provided) => (
                <Tbody
                  rounded="15px"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  data-rbd-droppable-id="table-body"
                  data-rbd-droppable-context-id={
                    provided.droppableProps['data-rbd-droppable-context-id']
                  }
                >
                  {isLoading ? (
                    <Tr h="40px">
                      <Td colSpan={columns.length + 3}>
                        <Center>
                          <Spinner size="md" />
                        </Center>
                      </Td>
                    </Tr>
                  ) : error ? (
                    <Tr h="40px">
                      <Td colSpan={columns.length + 3}>
                        <Center>
                          <Text color="red.500">{error}</Text>
                        </Center>
                      </Td>
                    </Tr>
                  ) : paginatedData.length === 0 ? (
                    <Tr h="40px">
                      <Td colSpan={columns.length + 3}>
                        <Center>
                          <Text>No Data Found</Text>
                        </Center>
                      </Td>
                    </Tr>
                  ) : (
                    paginatedData.map((row: any, rowIndex: any) => (
                      <Draggable
                        key={`row-${start + rowIndex}`}
                        draggableId={`row-${start + rowIndex}`}
                        index={rowIndex}
                      >
                        {(provided, snapshot) => (
                          <Tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            data-rbd-draggable-id={`row-${start + rowIndex}`}
                            data-rbd-draggable-context-id={
                              provided.draggableProps[
                                'data-rbd-draggable-context-id'
                              ]
                            }
                            bg={snapshot.isDragging ? 'gray.100' : undefined}
                            minH="40px"
                          >
                            <Td width="50px" {...provided.dragHandleProps}>
                              <MdDragIndicator size="20px" cursor="grab" />
                            </Td>
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
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </Tbody>
              )}
            </StrictModeDroppable>
          </Table>
        </DragDropContext>
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

export default DraggableTable
