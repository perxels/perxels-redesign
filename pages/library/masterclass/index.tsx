import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import { auth } from "../../../firebaseConfig"
import { MainLayout } from "../../../layouts"
import { LibraryLayout } from "../../../features/library"
import { MasterCardLayout } from "../../../features/library/MasterCardLayout"

const Masterclass = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
  const targetRef = useRef<HTMLDivElement | null>(null)

  const router = useRouter()

  useEffect(() => {
    if (targetRef.current) {
        const topOffset = 100 // Offset for the navbar
        const elementPosition =
          targetRef.current.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - topOffset
  
        window.scrollTo({
          top: offsetPosition,
        })
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/library/login') // redirect to login if not authenticated
      }
    })

    return () => unsubscribe() // cleanup
  }, [])

  return (
    <div>
        <MainLayout>
            <LibraryLayout>
                <div ref={targetRef}>
                    <MasterCardLayout />
                </div>
            </LibraryLayout>
        </MainLayout>
    </div>
  )
}

export default Masterclass