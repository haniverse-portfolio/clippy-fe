import { useEffect } from "react";
import { Navbar } from "../../components/common/Navbar";
import MypageCreate from "../../components/mypage_create/MypageCreate";
import { DeleteModal } from "../../components/mypage_manage/DeleteModal";
import { useClippyLogin } from "../../hooks/useClippyAPI";

const Create = () => {
  const { checkClipyLogin } = useClippyLogin();

  useEffect(() => {
    checkClipyLogin().then((res) => {
      if (!res) window.location.replace("/");
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
