'use client'

import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { auth } from '../firebaseConfig'

const Library = () => {
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/library/login') // redirect to login if not authenticated
      } else {
        router.push('/library/videos')
      }
    })

    return () => unsubscribe() // cleanup
  }, [])

  return null // Ensures that nothing renders on the server-side
}

export default Library

// "use client";

// import React, { useEffect } from 'react';
// import { MainLayout } from '../layouts';
// import { Hero, LibraryLayout } from '../features/library';
// import { LibraryCardLayout } from '../features/library';
// import { useRouter } from 'next/router';

// const Library = () => {
//   const router = useRouter();

//   useEffect(() => {
//     router.push('/library/videos');
//   }, [router]);

//   return (
//     <div>
//       <MainLayout>
//         <LibraryLayout>
//           <LibraryCardLayout />
//         </LibraryLayout>
//       </MainLayout>
//     </div>
//   );
// };

// export default Library;
