export interface RetreatInfoInterface {
    title: string;
    content: string;
    icon: string;
    fontSize: string;
     bgColor: string;
}

export const InfoContent : RetreatInfoInterface[] = [
   
    {
        title: "₦5000",
        content: "Access Fee",
        icon: "/assets/images/retreat/icon1.svg",
        fontSize: "4.0625rem",
        bgColor: "#F0FFDF"
    },
    {
        title: "FEB 4, 11AM",
        content: "Event Date",
        icon: "/assets/images/retreat/icon4.svg",
        fontSize: "2.5rem",
        bgColor: "#FFFCDF"
    },
    {
        title: "Lekki",
        content: "Venue",
        icon: "/assets/images/retreat/icon2.svg",
        fontSize: "4rem",
        bgColor: "#FCEBFF"
    }
]
