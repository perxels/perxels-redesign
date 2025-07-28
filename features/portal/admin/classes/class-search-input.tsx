import { Input } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export const ClassSearchInput = () => {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')

  // Initialize search value from URL
  useEffect(() => {
    setSearchValue((router.query.search as string) || '')
  }, [router.query.search])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    
    // Update URL with search query
    const updatedQuery = { ...router.query }
    if (value.trim()) {
      updatedQuery.search = value.trim()
    } else {
      delete updatedQuery.search
    }
    
    router.push({ pathname: router.pathname, query: updatedQuery }, undefined, { shallow: true })
  }

  return (
    <Input 
      colorScheme='purple' 
      w="200px" 
      height={["40px", "64px"]} 
      bgColor="gray.100" 
      _placeholder={{ color: "gray.600" }} 
      fontSize="1rem" 
      placeholder="Search" 
      value={searchValue}
      onChange={handleSearchChange}
    />
  )
}
