import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Google Adsense */}
        <Script
          id="google-adsense"
          data-ad-client="ca-pub-3857090800854368"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          strategy="beforeInteractive"
        />
        {/* Google Adsense */}
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
