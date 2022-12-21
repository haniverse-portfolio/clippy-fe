import { Group, Drawer, Stack } from "@mantine/core";
import { Menu2 } from "tabler-icons-react";
import { useRecoilState } from "recoil";
import { common_sidebarOpened } from "../states";
import Logo from "./Logo";
import UserAside from "../aside/UserAside";

export const SidebarInner = () => {
  const [sidebarOpened, setSidebarOpened] =
    useRecoilState(common_sidebarOpened);

  return (
    <>
      <Stack>
        <div className="p-[36px] h-[120px] bg-white sticky top-0 z-50 shadow-sm">
          <Group position="apart">
            <Logo />
            <Menu2
              className="cursor-pointer"
              size={48}
              onClick={() => {
                setSidebarOpened(false);
              }}
            />
          </Group>
        </div>
        <UserAside forceLarge={true} />
      </Stack>
    </>
  );
};

export function Sidebar() {
  const [sidebarOpened, setSidebarOpened] =
    useRecoilState(common_sidebarOpened);

  return (
    <Drawer
      className="!p-0 !m-0"
      position="right"
      opened={sidebarOpened}
      onClose={() => setSidebarOpened(false)}
      padding="xl"
      size={360}
      withCloseButton={false}
    >
      <SidebarInner />
    </Drawer>
  );
}
