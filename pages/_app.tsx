import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { theme } from '../config/theme'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '../styles/globals.css'
import { Provider } from 'react-redux'
import { store } from '../state/store'
import Head from 'next/head'
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#34296B" />
        <meta name="title" content="Perxels Design School" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://perxels.com/" />
        <meta property="og:title" content="Perxels Design School" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://perxels.com/" />
        <meta property="twitter:title" content="Perxels Design School" />
        <meta
          property="twitter:description"
          content="With the aid of an experienced mentor and professionals, we provide design education to aspiring UI/UX designers and also help designers grow to expertise level by exposing them to real-life cases."
        />
        <meta
          property="twitter:image"
          content="https://res.cloudinary.com/dmwfd0zhh/image/upload/v1599151361/perxels/Main%20Images/perxels_v7pzod.png"
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />

        <title key="title">Perxels - Design School</title>
      </Head>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=UA-176409924-1"
      />
      <Script
        strategy="afterInteractive"
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag("js", new Date());
  
        gtag("config", "UA-176409924-1");
        `,
        }}
      />
      <Script
        strategy="afterInteractive"
        id="facebook-pixel"
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
         fbq('init', '821337219169131'); 
        fbq('track', 'PageView');
        `,
        }}
      />
      <noscript
        dangerouslySetInnerHTML={{
          __html: `
        <img height="1" width="1" 
        src="https://www.facebook.com/tr?id=821337219169131&ev=PageView
        &noscript=1"/>
        `,
        }}
      />

      <Script
        strategy="afterInteractive"
        id="twitter-universal"
        dangerouslySetInnerHTML={{
          __html: `!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
        },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='//static.ads-twitter.com/uwt.js',
        a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
        // Insert Twitter Pixel ID and Standard Event data below
        twq('init','o62eq');
        twq('track','PageView');`,
        }}
      />

      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}
