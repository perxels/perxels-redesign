'use client'

import React, { useEffect, useState } from 'react'
import {
  SimpleGrid,
  Box,
  Text,
  Image,
  Flex,
  Button,
  Stack,
  CircularProgress,
} from '@chakra-ui/react'
import { PdfCards } from './PdfCard'
import { LibraryAd } from './LibraryAd'
import { libraryCardContent } from '../../constant'
import { useFetchPdfs } from '../../hooks/usePdfs'
export const PdfCardLayout = () => {
  const [data, setData] = useState<string[][] | null>(null)
  const [dataLoading, setDataLoading] = useState(false)
  const [dataChanged, setDataChanged] = useState(0)
  const { pdfs, loading } = useFetchPdfs() // Fetch PDFs

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true)
      try {
        const response = await fetch(
          'https://script.google.com/macros/s/AKfycbzGvHAIrZ5scdlcZ306yoXar2qXHBed9R5dIaTAw8AXyoCCiDVZwYmQeSczR_YTj5rTyQ/exec',
        ) // Replace with your web app URL
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const result = await response.json()
        // Process the data to extract emails
        const emailArray = result.slice(1).map((row: string[]) => row[1]) // Assuming emails are in the second column
        setData(emailArray)
      } catch (error: any) {
        alert(error.message)
      } finally {
        setDataLoading(false)
      }
    }

    fetchData()
  }, [dataChanged])
  return (
    <Box>
      <SimpleGrid py="10%" columns={[1, 2, 2]} spacing="32px">
        {dataLoading || loading ? (
          <Stack w="full" alignItems="center" justifyContent="center">
            <CircularProgress
              isIndeterminate
              color="#34296B"
              thickness="10px"
              size={30}
            />
          </Stack>
        ) : (
          <>
            {pdfs.map((item, i) => {
              return (
                <PdfCards
                  key={i}
                  bannerImage={item.bannerImage}
                  tag="E-Book"
                  mainTitle={item.mainTitle}
                  subTitle={item.subTitle}
                  role={item.role}
                  url={item.url}
                  data={data}
                  dataChanged={dataChanged}
                  setDataChanged={setDataChanged}
                />
              )
            })}
          </>
        )}
      </SimpleGrid>
      {/* <Box>
        <LibraryAd />
      </Box> */}
      {/* <SimpleGrid py="10%" columns={[1, 2, 2]} spacing="32px">
            <PdfCards/>
            <PdfCards/>
            <PdfCards/>
            <PdfCards/>
        </SimpleGrid> */}
    </Box>
  )
}
