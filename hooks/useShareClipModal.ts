import { useRecoilState, useSetRecoilState } from "recoil";
import {
  recoil_shareClipModal_content,
  recoil_shareClipModal_isOpen,
} from "../components/states";

export const useShareClipModal = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useRecoilState(
    recoil_shareClipModal_isOpen
  );
  const setShareModalContent = useSetRecoilState(recoil_shareClipModal_content);

  const openShareClipModal = (
    streamer: string,
    thumbnail: string,
    title: string,
    like: number,
    clipper: string
  ) => {
    setShareModalContent({
      streamer,
      thumbnail,
      title,
      like,
      clipper,
    });
    setIsShareModalOpen(true);
  };

  const closeShareClopModal = () => {
    setShareModalContent(null);
    setIsShareModalOpen(false);
  };

  return { isShareModalOpen, openShareClipModal, closeShareClopModal };
};
