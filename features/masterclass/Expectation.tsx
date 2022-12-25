import React from 'react'
import { MainContainer } from '../../layouts'
import {
  Box,
  Center,
  Image,
  Text,
  SimpleGrid,
  Heading,
  List,
  ListIcon,
  ListItem,
  Grid,
  Button,
} from '@chakra-ui/react'
import { SectionHeader } from '../../components'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import {TfiArrowCircleRight} from 'react-icons/tfi'
import { BasicExpectation } from '../../constant/masterclass'
export const Expectation = () => {
  return (
    <MainContainer>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Box maxW={{ base: '100%', md: '100%', lg: '80%' }}>
          <SectionHeader
            title="Everything you need to know about this Masterclass."
            subTitle="what to expect"
          />
          <Center>
            <Text marginTop={'-2.25rem'}>
              This is a{' '}
              <Text as="span" fontWeight={'bold'}>
                2 Days Free{' '}
              </Text>{' '}
              Masterclass.
            </Text>
          </Center>
        </Box>
      </Box>

      <Box
      p={{ base: '0rem', md: '1.5rem', lg: '1.5rem' }}
      >
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 2 }}
          spacing={10}
          mt="2.5rem"
        >
          <Box>
            <Heading fontSize={'3.125rem'} color="brand.dark.200">
              Basic Class
            </Heading>
            <Text fontSize={'1.5625rem'} color="#555555" mb="2.5rem">
              This class is for those with the following criteria:
            </Text>
            <List>
              <ListItem>
                {BasicExpectation.map(({ expectation, id }) => (
                  <Grid
                    key={id}
                    templateColumns={[
                      '1.5rem 1fr',
                      '1.5rem 1fr',
                      '1.5rem 1fr',
                      '30px 1fr',
                    ]}
                    gap={['0.75rem', '0.1375rem']}
                    mb="1.625rem"
                    alignItems={'center'}
                  >
                    <ListIcon
                      as={BsFillCheckCircleFill}
                      color="#34296B"
                      fontSize={'1.55rem'}
                    />
                    <Text fontSize={'1.25rem'} color="brand.dark.200">
                      {expectation}
                    </Text>
                  </Grid>
                ))}
              </ListItem>
            </List>
            <Text
              fontWeight={'700'}
              fontSize="1.25rem"
              lineHeight="1.875rem"
              color="#555555"
            >
              IMPORTANT INFORMATION:
            </Text>
            <Text fontSize={'1.5625rem'} color="#555555">
              Anyone who registers for this masterclass automatically have
              access to 25% discount of Perxels paid training
            </Text>

            <Box
            mt="1.875rem"
            display={"flex"}
            columnGap="0.1rem"
            >
              <Button>Join Basic Class</Button>

              <Button color="brand.purple.500" background={'transparent'} border="none">
              Download Project
                    <Text ml="0.709375rem">
                        <TfiArrowCircleRight />
                    </Text>
            
              </Button>
            </Box>
          </Box>
          <Box>
            <Box>
              <Image
                src="assets/images/masterclass/basicImage.png"
                alt="basic"
              />
            </Box>
          </Box>
        </SimpleGrid>
      </Box>
    </MainContainer>
  )
}
