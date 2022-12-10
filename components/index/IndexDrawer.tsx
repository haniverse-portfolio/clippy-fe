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
import { drawerOpened } from "../states";

export function IndexDrawer() {
  const [indexDrawerOpened, setIndexDrawerOpened] =
    useRecoilState(drawerOpened);

  return (
    <Drawer
      className="!p-0 !m-0"
      position="right"
      opened={indexDrawerOpened}
      onClose={() => setIndexDrawerOpened(false)}
      padding="xl"
      size="xl"
      withCloseButton={false}
    >
      <Stack>
        <div className="flex justify-between h-[120px] bg-white sticky top-0 z-50 shadow-sm">
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
                  setIndexDrawerOpened(false);
                }}
              />
            </ThemeIcon>
          </Group>
        </div>
        <span className="text-5xl text-center mt-24">내 채널</span>
        <Avatar radius="xl" size={240} src={null} />
        <span className="text-2xl text-center">닉네임</span>
        <Stack spacing={50}>
          <Group className="ml-16">
            <ThemeIcon variant="outline" color="dark">
              <Settings></Settings>
            </ThemeIcon>
            <span className="text-2xl text-center">클립 관리</span>
          </Group>
          <Group className="ml-16">
            <ThemeIcon variant="outline" color="dark">
              <Paperclip></Paperclip>
            </ThemeIcon>
            <span className="text-2xl text-center">클립 생성</span>
          </Group>
          <Group className="ml-16">
            <ThemeIcon variant="outline" color="dark">
              <Broadcast></Broadcast>
            </ThemeIcon>
            <span className="text-2xl text-center">팔로우 중인 채널</span>
          </Group>
          <Group className="ml-16">
            <ThemeIcon variant="outline" color="dark">
              <MessageCircle2></MessageCircle2>
            </ThemeIcon>
            <span className="text-2xl text-center">의견 보내기</span>
          </Group>
          <Group className="ml-16">
            <ThemeIcon variant="outline" color="dark">
              <Logout></Logout>
            </ThemeIcon>
            <span className="text-2xl text-center">로그아웃</span>
          </Group>
        </Stack>
      </Stack>
    </Drawer>
  );
}
