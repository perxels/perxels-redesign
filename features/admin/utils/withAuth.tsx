// components/withAuth.tsx
import { ReactElement, ComponentType, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../../../firebaseConfig' // Update path if needed
import { Spinner, Text, VStack } from '@chakra-ui/react'

interface WithAuthProps {
  user?: User | null
}

const withAuth = <P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, 'user'>> => {
  const WithAuthComponent = (props: Omit<P, 'user'>): ReactElement => {
    const [loading, setLoading] = useState<boolean>(true)
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user)
          setLoading(false)
        } else {
          router.push('/admin')
        }
      })

      return () => unsubscribe()
    }, [router])

    if (loading)
      return (
        <VStack w="full" h="100vh" alignItems="center" justifyContent="center">
          <Spinner size={['md', 'lg']} />
          <Text as="span">Loading...</Text>
        </VStack>
      )

    return <WrappedComponent user={user} {...(props as P)} />
  }

  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
  return WithAuthComponent
}

export default withAuth
