import Head from "next/head";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { mypageManage_sectionIndex } from "../../components/states";
import { Navbar } from "../../components/common/Navbar";
import { MypageMadeClip } from "../../components/mypage_manage/MypageMadeClip";
import { MypageChannelClip } from "../../components/mypage_manage/MypageChannelClip";
import { DeleteModal } from "../../components/mypage_manage/DeleteModal";
import { useClippyLogin } from "../../hooks/useClippyAPI";

export default function Home() {
  const sectionIndex = useRecoilValue(mypageManage_sectionIndex);

  const { checkClipyLogin } = useClippyLogin();

  useEffect(() => {
    checkClipyLogin().then((res) => {
      if (!res) window.location.replace("/");
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
        <div style={{ height: "calc(100vh - 120px)" }}>
          {sectionIndex === 0 ? <MypageMadeClip /> : <MypageChannelClip />}
        </div>
      </main>
    </div>
  );
}
