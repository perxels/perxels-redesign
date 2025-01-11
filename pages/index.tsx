import Script from 'next/script'
import { Banner } from '../features/banner'
import { OurClassGroup } from '../features/classGroup'
import { Hero, HeroSubSection } from '../features/home'
import { Portfolio } from '../features/portfolio'
import { Story } from '../features/story'
import { Testimonial } from '../features/testimonial'
import { useActiveBanner } from '../hooks/useActiveBanner'
import { MainLayout } from '../layouts'

export default function Home() {
  const { banner } = useActiveBanner()

  return (
    <>
      {/* Facebook Pixel Code */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '309688088029898'); 
            fbq('track', 'PageView');
          `,
        }}
      />
      {/* NoScript Fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src="https://www.facebook.com/tr?id=309688088029898&ev=PageView&noscript=1"
        />
      </noscript>


    {/* LinkedIn Tracking Script */}
    <Script
        id="linkedin-partner-id"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            _linkedin_partner_id = "7932145";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          `,
        }}
      />
      <Script
        id="linkedin-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(l) {
              if (!l) {
                window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                window.lintrk.q = [];
              }
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";
              b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `,
        }}
      />
      {/* NoScript Fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src="https://px.ads.linkedin.com/collect/?pid=7932145&fmt=gif"
        />
      </noscript>
    <MainLayout>
      {banner && <Banner data={banner} />}
      <Hero />
      <HeroSubSection />
      <OurClassGroup />
      <Story />
      <Portfolio />
      <Testimonial />
    </MainLayout>
    </>
  )
}
