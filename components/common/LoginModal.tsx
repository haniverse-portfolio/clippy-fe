import { Button, Modal } from "@mantine/core";
import { useLoginModal } from "../../hooks/useLoginModal";
import { useClippyLogin } from "../../hooks/useClippyAPI";

export const LoginModal = () => {
  const { goClippyLogin } = useClippyLogin();
  const { isLoginModalOpen, closeLoginModal } = useLoginModal();

  return (
    <>
      <Modal
        closeOnClickOutside
        withCloseButton
        centered
        size="md"
        title="로그인"
        opened={isLoginModalOpen}
        onClose={closeLoginModal}
      >
        <div className="flex justify-center items-center gap-4 flex-col">
          <div className="text-center">
            3초만에 트위치로 로그인하고
            <br />
            내가 좋아하는 스트리머의 클립을 만들어 보세요!
          </div>
          <Button
            mb={20}
            h={42}
            color="dark"
            radius={99}
            px={20}
            style={{
              fontSize: 16,
              fontWeight: 700,
            }}
            onClick={() => goClippyLogin()}
          >
            트위치 로그인
          </Button>
        </div>
      </Modal>
      <style jsx global>{`
        .mantine-Modal-modal {
          min-height: auto !important;
        }
      `}</style>
    </>
  );
};
