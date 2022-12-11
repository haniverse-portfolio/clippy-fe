import { Modal } from "@mantine/core";
import { useRecoilState } from "recoil";
import { recoil_createModalOpened } from "../states";

export const CreateModal = () => {
  const [createModalOpened, setCreateModalOpened] = useRecoilState(
    recoil_createModalOpened
  );

  return (
    <Modal
      overflow="inside"
      className="h-full"
      size="xl"
      withCloseButton={false}
      centered
      opened={createModalOpened}
      onClose={() => setCreateModalOpened(false)}
    >
      hello
    </Modal>
  );
};
