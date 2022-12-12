import { Navbar } from "../../components/common/Navbar";
import MypageCreate from "../../components/mypage_create/MypageCreate";
import { DeleteModal } from "../../components/mypage_manage/DeleteModal";

const Create = () => {
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
