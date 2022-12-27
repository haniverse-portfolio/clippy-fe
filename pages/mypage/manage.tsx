import Head from "next/head";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { mypageManage_sectionIndex } from "../../components/states";
import { Navbar } from "../../components/common/Navbar";
import { MypageMadeClip } from "../../components/mypage_manage/MypageMadeClip";
import { MypageChannelClip } from "../../components/mypage_manage/MypageChannelClip";
import { DeleteModal } from "../../components/mypage_manage/DeleteModal";
import { useClippyLogin } from "../../hooks/useClippyAPI";
import { useRouter } from "next/router";

export default function Home() {
  const sectionIndex = useRecoilValue(mypageManage_sectionIndex);

  const { checkClipyLogin } = useClippyLogin();

  const router = useRouter();

  useEffect(() => {
    checkClipyLogin().then((res) => {
      if (!res) router.push("/?login=true");
    });
  }, []);

  return (
    <div>
      <Head>
        <title>CLIPPY</title>
        <meta name="description" content="CLIPPY" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <DeleteModal />
        <Navbar />
        <div style={{ height: "calc(100vh - 120px)", paddingBottom: "50px" }}>
          {sectionIndex === 0 ? <MypageMadeClip /> : <MypageChannelClip />}
        </div>
      </main>
    </div>
  );
}
