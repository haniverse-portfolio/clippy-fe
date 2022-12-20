import { useEffect } from "react";
import { Navbar } from "../../components/common/Navbar";
import MypageCreate from "../../components/mypage_create/MypageCreate";
import { DeleteModal } from "../../components/mypage_manage/DeleteModal";
import { useClippyLogin } from "../../hooks/useClippyAPI";
import { useRouter } from "next/router";

const Create = () => {
  const { checkClipyLogin } = useClippyLogin();

  const router = useRouter();

  useEffect(() => {
    checkClipyLogin().then((res) => {
      if (!res) router.push("/?login=true");
    });
  }, []);

  return (
    <div>
      <main>
        <DeleteModal />
        <Navbar />
        <div style={{ height: "calc(100vh - 120px)" }}>
          <MypageCreate />
        </div>
      </main>
    </div>
  );
};

export default Create;
