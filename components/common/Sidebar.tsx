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
import UserAside from "../aside/UserAside";

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
        <UserAside forceLarge={true} />
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
