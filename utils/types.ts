// Admin Portal 

// -- Masterclass -- 
export interface MasterClass {
    id?: string
    title: string
    dateTime: string
    content1?: string
    content2?: string
    content3?: string
    importantInfo: string
    entries:string
    image: string
  }
  export interface MasterClassHero {
    id: string
    title: string
    desc: string
  }

  export interface Video {
    id?: string;
    videoTitle: string;
    videoSession: string;
    author: string;
    datePosted: string;
    videoUrl: string;
    imageUrl?: string;
  }
  export interface PDFDocument {
    id: string;            // Unique ID of the PDF document in Firestore
    mainTitle: string;      // Main title of the PDF
    subTitle?: string;      // Optional subtitle for additional description
    role: string;           // Role or category of the PDF (e.g., subject, topic)
    url: string;            // URL of the PDF file (stored in Firebase Storage)
    bannerImage?: string;   // Optional URL for a banner or thumbnail image
    datePosted?: string;    // Optional date the PDF was posted
  }

  export interface Testimonial {
    id?: string // Optional since it will be assigned by Firebase
    name: string
    role: string
    testimony: string
    imageUrl?: string // Optional in case no image is uploaded
  }
  
  export interface Blog {
    id?: string; // Optional because it may not exist for new blogs
    title: string;
    writer: string;
    image?: string;
    blog: string; // The main blog content (HTML string from ReactQuill)
  }
  