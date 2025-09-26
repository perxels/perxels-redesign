import React, { useState } from 'react'
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  HStack,
  Text,
} from '@chakra-ui/react'
import { GoChevronDown } from 'react-icons/go'
import { RxDownload } from 'react-icons/rx'
import { exportToCSV, exportToExcel } from '../utils/exportFunctions'
import { flattenStudentData } from '../utils/exportHelpers'

interface ExportStudentsButtonProps {
  students: any[]
  filters?: any
  isLoading?: boolean
  variant?: 'button' | 'icon'
  size?: 'sm' | 'md' | 'lg'
}

export const ExportStudentsButton: React.FC<ExportStudentsButtonProps> = ({
  students,
  filters = {},
  isLoading = false,
  variant = 'button',
  size = 'md',
}) => {
  const [exporting, setExporting] = useState<string | null>(null)
  const toast = useToast()

  const handleExport = async (format: 'csv' | 'excel') => {
    if (!students || students.length === 0) {
      toast({
        title: 'No data to export',
        description: 'There are no students to export.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setExporting(format)

    try {
      if (format === 'csv') {
        exportToCSV(students, filters, toast)
      } else if (format === 'excel') {
        exportToExcel(students, filters, toast)
      }
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: 'Export failed',
        description: 'An error occurred while exporting. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      // Small delay to show loading state
      setTimeout(() => setExporting(null), 1000)
    }
  }

  const getButtonText = () => {
    if (exporting) {
      return `Exporting ${exporting.toUpperCase()}...`
    }
    return `Export (${students.length})`
  }

  if (variant === 'icon') {
    return (
      <Menu>
        <MenuButton
          as={Button}
          size={size}
          variant="outline"
          isLoading={isLoading || !!exporting}
          leftIcon={<RxDownload />}
        >
          <HStack spacing={1}>
            <Text>Export</Text>
            <Text fontSize="xs" color="gray.500">
              ({students.length})
            </Text>
          </HStack>
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => handleExport('excel')}
            isDisabled={students.length === 0}
          >
            Export to Excel (.xlsx)
          </MenuItem>
          <MenuItem
            onClick={() => handleExport('csv')}
            isDisabled={students.length === 0}
          >
            Export to CSV
          </MenuItem>
        </MenuList>
      </Menu>
    )
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        size={size}
        colorScheme="blue"
        variant="outline"
        isLoading={isLoading || !!exporting}
        rightIcon={<GoChevronDown />}
        leftIcon={<RxDownload />}
        isDisabled={students.length === 0}
      >
        {getButtonText()}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => handleExport('excel')} icon={<RxDownload />}>
          Export to Excel
        </MenuItem>
        {/* <MenuItem onClick={() => handleExport('excel')} icon={<RxDownload />}>
          Export to Excel (.xlsx) - Recommended
        </MenuItem>
        <MenuItem onClick={() => handleExport('csv')} icon={<RxDownload />}>
          Export to CSV
        </MenuItem> */}
      </MenuList>
    </Menu>
  )
}
