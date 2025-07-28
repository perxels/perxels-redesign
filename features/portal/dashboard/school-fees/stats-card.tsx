import { Card, CardBody, Heading, Text } from '@chakra-ui/react'
import React from 'react'

interface StatsCardProps {
  title: string
  amount: string
  isTitleBig?: boolean
  color?: string
  w?: string[]
}

export const StatsCard = ({
  title,
  amount,
  isTitleBig = false,
  color = 'brand.purple.100',
  w = ['300px']
}: StatsCardProps) => {
  return (
    <Card shadow="none" bg={color} borderRadius="2xl" p={[4, 6]} px={[1, 3]} h={['130px', '150px', '170px']} cursor="pointer" w={w}>
      <CardBody>
        <Text fontSize={isTitleBig ? ["2xl", "4xl"] : ["sm", "lg", "lg"]} color="brand.dark.100">
          {title}
        </Text>
        <Heading
          fontSize={isTitleBig ? ['2xl', '4xl'] : ['4xl', '7xl']}
          fontFamily="sans-serif"
          color="brand.dark.100"
          fontWeight={isTitleBig ? "300" : "regular"}
        >
          {amount}
        </Heading>
      </CardBody>
    </Card>
  )
}
