import "../styles/globals.css";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import type { AppProps } from "next/app";
import { MantineProvider, createEmotionCache } from "@mantine/core";
import * as Sentry from "@sentry/nextjs";

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <MantineProvider withGlobalStyles withNormalizeCSS emotionCache={myCache}>
        <Component {...pageProps} />
      </MantineProvider>
    </RecoilRoot>
  );
}
