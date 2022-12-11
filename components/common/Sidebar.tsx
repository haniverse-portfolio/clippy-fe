import {
  Navbar,
  Group,
  Code,
  ScrollArea,
  createStyles,
  Badge,
  ThemeIcon,
  Drawer,
  Text,
  Stack,
  Avatar,
  Center,
  ActionIcon,
} from "@mantine/core";
import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
} from "@tabler/icons";
import Image from "next/image";
import {
  Broadcast,
  Logout,
  Menu2,
  MessageCircle2,
  Paperclip,
  Settings,
} from "tabler-icons-react";
import { atom, useRecoilState } from "recoil";
import { recoil_sidebarIndex, recoil_sidebarOpened } from "../states";
import { apiAddress } from "../constValues";

export const SidebarInner = () => {
  const [sidebarOpened, setSidebarOpened] =
    useRecoilState(recoil_sidebarOpened);
  const [sidebarIndex, setSidebarIndex] = useRecoilState(recoil_sidebarIndex);

  const goLogout = () => {
    const url = `${apiAddress}/user/logout`;
    window.location.href = url;
  };

  return (
    <>
      <Stack>
        <div className="p-[36px] h-[120px] bg-white sticky top-0 z-50 shadow-sm">
          <Group position="apart">
            <Group>
              <Image alt="logo" src="/images/clip.svg" width={30} height={48} />
              <span
                className="text-5xl font-extrabold bg-gradient-to-r text-transparent bg-clip-text from-indigo-500 via-purple-500 to-indigo-500 animate-text "
                // variant="gradient"
                // gradient={{ from: "violet", to: "grape" }}
              >
                CLIPPY
              </span>
              <Badge variant="filled" color="green" size="lg" radius="sm">
                Beta
              </Badge>
            </Group>
            <ThemeIcon size={48} variant="outline" color="dark">
              <Menu2
                size={48}
                onClick={() => {
                  setSidebarOpened(false);
                }}
              />
            </ThemeIcon>
          </Group>
        </div>
        <span className="text-5xl text-center mt-24">내 채널</span>
        <Center>
          <Avatar radius="xl" size={240} src={null} />
        </Center>
        <span className="text-2xl text-center">임준현</span>
        <Stack className="m-0 p-0" mt={30}>
          <Stack className="py-4 hover:bg-gray-200 hover:font-bold cursor-pointer">
            <Group ml={48}>
              <ActionIcon size={36}>
                <Settings size={36} />
              </ActionIcon>
              <span className="text-2xl text-center">클립 관리</span>
            </Group>
          </Stack>
          <Stack className="py-4 hover:bg-gray-200 hover:font-bold cursor-pointer">
            <Group ml={48}>
              <ActionIcon size={36}>
                <Paperclip size={36} />
              </ActionIcon>
              <span className="text-2xl text-center">클립 생성</span>
            </Group>
          </Stack>
          <Stack className="py-4 hover:bg-gray-200 hover:font-bold cursor-pointer">
            <Group ml={48}>
              <ActionIcon size={36}>
                <Broadcast size={36} />
              </ActionIcon>
              <span className="text-2xl text-center">팔로우 중인 채널</span>
            </Group>
          </Stack>
          <Stack className="py-4 hover:bg-gray-200 hover:font-bold cursor-pointer">
            <Group ml={48}>
              <ActionIcon size={36}>
                <MessageCircle2 size={36} />
              </ActionIcon>
              <span className="text-2xl text-center">의견 보내기</span>
            </Group>
          </Stack>
          <Stack
            onClick={() => {
              goLogout();
            }}
            className="py-4 hover:bg-gray-200 hover:font-bold cursor-pointer"
          >
            <Group ml={48}>
              <ActionIcon size={36}>
                <Logout size={36} />
              </ActionIcon>
              <span className="text-2xl text-center cursor-pointer">
                로그아웃
              </span>
            </Group>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export function Sidebar() {
  const [sidebarOpened, setSidebarOpened] =
    useRecoilState(recoil_sidebarOpened);

  return (
    <Drawer
      className="!p-0 !m-0"
      position="right"
      opened={sidebarOpened}
      onClose={() => setSidebarOpened(false)}
      padding="xl"
      size="xl"
      withCloseButton={false}
    >
      <SidebarInner />
    </Drawer>
  );
}
