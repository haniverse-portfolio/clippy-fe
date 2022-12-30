import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Mobile PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        {/* Google Adsense */}
        {/* <Script
          id="google-adsense"
          data-ad-client="ca-pub-3857090800854368"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3857090800854368"
          strategy="beforeInteractive"
        /> */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3857090800854368"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        {/* Google Adsense */}

        {/* Naver SEO */}
        <meta
          name="naver-site-verification"
          content="5d35480e4e49fdd4d1a06010f03f10e180155911"
        />
        {/* Naver SEO */}
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
