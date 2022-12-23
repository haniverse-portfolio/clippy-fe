import { Modal } from "@mantine/core";
import { useSiteInfoModal } from "../../hooks/useSiteInfoModal";

export const SiteInfoModal = () => {
  const { isSiteInfoModalOpen, closeSiteInfoModal } = useSiteInfoModal();

  return (
    <Modal
      closeOnClickOutside
      withCloseButton
      centered
      size="md"
      title="사이트 정보"
      opened={isSiteInfoModalOpen}
      onClose={closeSiteInfoModal}
    >
      <div className="p-5"></div>
    </Modal>
  );
};
