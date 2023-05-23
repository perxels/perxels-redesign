interface BannerContent {
  mainTitle: string
  subTitle: string
  time: string
  date: string
  location: string
  bannerImage: string
  description: string
  speakerName: string
  speakerRole: string
  content1: string
  content2: string
  content3: string
  content4: string

}

export const bannerContent: BannerContent = {
  mainTitle: 'LIVE DESIGN SESSION: ',
  subTitle: 'DATA REPRESENTATION ',
  time: '7pm - 8pm (WAT)',
  date: 'Sunday, June 4th, 2023',
  location: 'GOOGLE MEET',
  bannerImage: '/assets/images/banner/bannerImage.jpeg',
  description:
    "The facilitator will design a data dashboard for a healthcare organization that allows healthcare providers to monitor patient vital signs and health trends live alongside the audience. The dashboard will display the data in a visually appealing and easy-to-understand format, using charts, graphs, and other data visualizations.",
  content1: "The data dashboard will include things like blood pressure, heart rate, temperature, and other relevant health metrics. The dashboard should also allow healthcare providers to filter and sort the data, by patient, date, and other relevant criteria.",
  content2: "The facilitator will consider the visual design, layout, and user experience when creating the dashboard. At the end of the session, the audience will be able to create useful and user-friendly dashboards that represent visual data and be able to  set alerts for certain patient metrics or export data to a PDF or CSV file.",
  content3: "",
  content4: "",
  speakerName: 'Dara Sobaloju ',
  speakerRole: 'Product Designer, Treepz',
}
