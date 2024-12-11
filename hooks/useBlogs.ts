import { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Blog } from '../utils/types';

export const useFetchBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBlogs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'blogs'));
      const blogsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Blog[];
      setBlogs(blogsData);

      // Store data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('blogs', JSON.stringify(blogsData));
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const blogRef = localStorage.getItem('blogs');
        const oldBlogs = blogRef ? JSON.parse(blogRef) : [];
        if (oldBlogs.length > 0) {
          setBlogs(oldBlogs);
          setLoading(false); // Skip loading state
        }
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
        localStorage.removeItem('blogs'); // Clean up corrupted data
      }
    }

    // Fetch fresh data from Firestore regardless of localStorage
    fetchBlogs();
  }, []);

  return { blogs, loading, refetchBlogs: fetchBlogs };
};



export const getSingleBlog = async (id: string): Promise<Blog | null> => {
  try {
    const blogRef = doc(db, 'blogs', id);
    const blogSnapshot = await getDoc(blogRef);

    if (blogSnapshot.exists()) {
      return { id: blogSnapshot.id, ...blogSnapshot.data() } as Blog;
    } else {
      console.log(`Blog with ID ${id} does not exist.`);
      return null;
    }
  } catch (error) {
    console.log('Error fetching blog:', error);
    return null;
  }
};