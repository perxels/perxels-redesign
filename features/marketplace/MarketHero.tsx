import { Box, Text, VStack } from '@chakra-ui/react'

export const MarketHero = () => {
  return (
    <VStack alignItems="center">
      <Text
        fontWeight="600"
        fontSize={['30px', '60px']}
        lineHeight={['34px', '40px', '50px', '70px']}
        textAlign="center"
        mt="40px"
        as={'h1'}
        maxW="800px"
        fontFamily="Proxima Nova"
      >
        <Text as="span" display={['inline-block', 'block']}>
          Perxels Store
        </Text>{' '}
        Where Fans Become Heroes
      </Text>
    </VStack>
  )
}
