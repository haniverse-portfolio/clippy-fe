import { useRecoilState, useSetRecoilState } from "recoil";
import {
  common_shareClipModal_content,
  common_shareClipModal_isOpen,
} from "../components/states";

export const useShareClipModal = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useRecoilState(
    common_shareClipModal_isOpen
  );
  const setShareModalContent = useSetRecoilState(common_shareClipModal_content);

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
