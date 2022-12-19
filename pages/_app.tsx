import "../styles/globals.css";
import "../styles/navbar.scss";
import { RecoilRoot } from "recoil";
import type { AppProps } from "next/app";
import { MantineProvider, createEmotionCache } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import * as Sentry from "@sentry/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as gtag from "../lib/gtag";
import Script from "next/script";
import { LoginModal } from "../components/common/LoginModal";
// import * as dotenv from "dotenv";
// dotenv.config();

// http://localhost:4800
// https://clippy.kr

Sentry.init({
  dsn: "https://87301c0ff5c34cd5b4793e0473689f4f@o1217331.ingest.sentry.io/4504299552768000",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const myCache = createEmotionCache({
  key: "mantine",
  prepend: false,
});

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  // Kakao SDK 설정 시작
  useEffect(() => {
    window.Kakao.init("5941386c58984aaa4a1e0e36a4c8fc87");
  }, []);
  // Kakao SDK 설정 끝

  // GA 설정 시작
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: any) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("hashChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("hashChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  // GA 설정 끝

  return (
    <>
      {/* GA 설정 시작 */}
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gtag.GA_TRACKING_ID}', {
          page_path: window.location.pathname,
        });
      `,
        }}
      />
      {/* GA 설정 끝 */}

      {/* Kakao SDK 시작 */}
      <Script
        strategy="beforeInteractive"
        src="https://developers.kakao.com/sdk/js/kakao.js"
      />
      {/* Kakao SDK 끝 */}

      <RecoilRoot>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          emotionCache={myCache}
          theme={{ fontFamily: "Noto Sans KR" }}
        >
          <NotificationsProvider>
            <LoginModal />
            <Component {...pageProps} />
          </NotificationsProvider>
        </MantineProvider>
      </RecoilRoot>
    </>
  );
}
