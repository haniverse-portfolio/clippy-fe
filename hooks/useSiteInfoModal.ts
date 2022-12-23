import { useRecoilState } from "recoil";
import { common_siteInfoModal_isOpen } from "../components/states";

export const useSiteInfoModal = () => {
  const [isSiteInfoModalOpen, setSiteInfoModalOpen] = useRecoilState(
    common_siteInfoModal_isOpen
  );

  const openSiteInfoModal = () => {
    !isSiteInfoModalOpen && setSiteInfoModalOpen(true);
  };

  const closeSiteInfoModal = () => {
    isSiteInfoModalOpen && setSiteInfoModalOpen(false);
  };

  return { isSiteInfoModalOpen, openSiteInfoModal, closeSiteInfoModal };
};
