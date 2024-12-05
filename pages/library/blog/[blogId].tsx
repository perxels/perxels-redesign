import React, { useEffect, useRef, useState } from 'react'
import { MainLayout } from '../../../layouts'
import { LibraryLayout } from '../../../features/library'
import { BlogContentItem } from '../../../features/library'
import { useRouter } from 'next/router'
import { Blog } from '../../../utils/types'
import { getSingleBlog } from '../../../hooks/useBlogs'
import Head from 'next/head'

const BlogContent = () => {
  const router = useRouter();
  const { blogId } = router.query;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof blogId === 'string') {
      const fetchBlog = async () => {
        const blogData = await getSingleBlog(blogId);
        setBlog(blogData);
        setLoading(false);
      };

      fetchBlog();
    } else {
      setLoading(false); // Set loading to false if blogId is invalid
    }
  }, [blogId]);

  
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const targetRef = useRef<HTMLDivElement | null>(null)
    // eslint-disable-next-line react-hooks/rules-of-hooks
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

  return (
    <div>
      <MainLayout>
        <LibraryLayout>
        <div ref={targetRef}>
       {blog && <Head>
        <title>{blog.title}</title>
        <meta name="description" content={`Read the blog "${blog.title}" by ${blog.writer}.`} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={`Read the blog "${blog.title}" by ${blog.writer}.`} />
        <meta property="og:image" content={blog.image || '/default-image.jpg'} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${blogId}`} />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${blogId}`} />
      </Head>}
        {loading ? <div>Loading...</div> : !blog ? <div>Blog not found</div> : <BlogContentItem blog={blog.blog}/>    }
          </div>
        </LibraryLayout>
      </MainLayout>
    </div>
  )
}

export default BlogContent
