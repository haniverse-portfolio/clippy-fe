import Head from "next/head";
import { Navbar } from "../components/common/Navbar";
import { IndexAfterLogin } from "../components/index/IndexAfterLogin";

export default function Home() {
  return (
    <div>
      <Head>
        <title>CLIPPY</title>
        <meta name="description" content="CLIPPY" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative">
        <Navbar />
        <div
          style={{
            height: "calc(100vh - 120px)",
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          <IndexAfterLogin />
        </div>
      </main>
    </div>
  );
}
