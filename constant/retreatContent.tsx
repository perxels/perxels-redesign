export interface RetreatInfoInterface {
    title: string;
    content: string;
    iconSrc: string;
    fontSize: string;
     bgColor: string;
     marginT?: string;
}

export const InfoContent : RetreatInfoInterface[] = [
   
    {
        title: "₦5000",
        content: "Access Fee",
        iconSrc: "https://res.cloudinary.com/deudl0ryy/image/upload/v1704516234/Icon1_khkypy.svg",
        fontSize: "4.0625rem",
        bgColor: "#F0FFDF"
    },
    {
        title: "FEB 3, 11AM",
        content: "Event Date",
        iconSrc: "https://res.cloudinary.com/deudl0ryy/image/upload/v1704516234/Icon4_goxhic.svg",
        fontSize: "2.5rem",
        bgColor: "#FFFCDF",
        marginT: "2rem"
    },
    {
        title: "Lekki",
        content: "Venue",
        iconSrc: "https://res.cloudinary.com/deudl0ryy/image/upload/v1704516237/Icon2_p9vcfk.svg",
        fontSize: "4rem",
        bgColor: "#FCEBFF"
    }
]
