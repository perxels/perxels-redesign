"use client";

import { useRouter } from 'next/router';

const Library = () => {
  const router = useRouter();

  if (typeof window !== 'undefined') {
    router.push('/library/videos');
    return null; // Prevents the rest of the component from rendering
  }

  return null; // Ensures that nothing renders on the server-side
};

export default Library;


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
