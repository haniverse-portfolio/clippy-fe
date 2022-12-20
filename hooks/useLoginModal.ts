import { useRecoilState } from "recoil";
import { useClippyLogin } from "./useClippyAPI";
import { common_loginModal_isOpen } from "../components/states";

export const useLoginModal = () => {
  const { checkClipyLogin } = useClippyLogin();
  const [isLoginModalOpen, setIsLoginModalOpen] = useRecoilState(
    common_loginModal_isOpen
  );

  const openLoginModal = () => {
    if (!isLoginModalOpen) {
      checkClipyLogin().then((res) => {
        if (!res) {
          setIsLoginModalOpen(true);
        }
      });
    }
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return { isLoginModalOpen, openLoginModal, closeLoginModal };
};
