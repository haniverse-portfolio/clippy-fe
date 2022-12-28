import { useRecoilState } from "recoil";
import { useClippyLogin } from "./useClippyAPI";
import { common_loginModal_isOpen } from "../components/states";

export const useLoginModal = () => {
  const { checkClipyLogin } = useClippyLogin();
  const [isLoginModalOpen, setIsLoginModalOpen] = useRecoilState(
    common_loginModal_isOpen
  );

  const openLoginModal = (redirectURL?: string) => {
    if (!isLoginModalOpen) {
      checkClipyLogin().then((res) => {
        if (!res) {
          if (redirectURL) localStorage.setItem("redirect_url", redirectURL);
          setIsLoginModalOpen(true);
        }
      });
    }
  };

  const closeLoginModal = () => {
    localStorage.removeItem("redirect_url");
    setIsLoginModalOpen(false);
  };

  return { isLoginModalOpen, openLoginModal, closeLoginModal };
};
