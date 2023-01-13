import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Mobile PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

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
