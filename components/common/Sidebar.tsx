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
import {
  recoil_followed,
  recoil_sidebarIndex,
  recoil_sidebarOpened,
} from "../states";
import { apiAddress } from "../constValues";
import Logo from "./Logo";
import { Footer } from "../aside/LiveAside";
import Link from "next/link";

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
        <span className="font-light text-[36px] text-center mt-[88px]">
          내 채널
        </span>
        <Center>
          <Avatar radius="xl" size={98} src={null} />
        </Center>
        <span className="text-[16px] text-center mt-[16px]">임준현</span>
        <Stack className="m-0 p-0" mt={38}>
          <Link
            onClick={() => {
              setSidebarOpened(false);
            }}
            href="/mypage_manage"
          >
            <Stack
              justify="center"
              className="h-[48px] hover:bg-gray-200 hover:font-bold cursor-pointer"
            >
              <Group ml={48}>
                <Settings size={18} />
                <span className="ml-[17px] text-[16px] text-center">
                  클립 관리
                </span>
              </Group>
            </Stack>
          </Link>
          <Stack
            justify="center"
            className="h-[48px] hover:bg-gray-200 hover:font-bold cursor-pointer"
          >
            <Group ml={48}>
              <Paperclip size={18} />
              <span className="ml-[17px] text-[16px] text-center">
                클립 생성
              </span>
            </Group>
          </Stack>
          <Stack
            justify="center"
            className="h-[48px] hover:bg-gray-200 hover:font-bold cursor-pointer"
          >
            <Group ml={48}>
              <Broadcast size={18} />
              <span className="ml-[17px] text-[16px] text-center">
                팔로우 중인 채널
              </span>
            </Group>
          </Stack>
          <Stack
            justify="center"
            className="h-[48px] hover:bg-gray-200 hover:font-bold cursor-pointer"
          >
            <Group ml={48}>
              <MessageCircle2 size={18} />
              <span className="ml-[17px] text-[16px] text-center">
                의견 보내기
              </span>
            </Group>
          </Stack>
          <Stack
            justify="center"
            onClick={() => {
              goLogout();
            }}
            className="h-[48px] hover:bg-gray-200 hover:font-bold cursor-pointer"
          >
            <Group ml={48}>
              <Logout size={18} />
              <span className="ml-[17px] text-[16px] text-center cursor-pointer">
                로그아웃
              </span>
            </Group>
          </Stack>
        </Stack>
        <Footer />
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
      size={360}
      withCloseButton={false}
    >
      <SidebarInner />
    </Drawer>
  );
}
