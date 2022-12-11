import { solid, regular } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Center, Flex, Group, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useRecoilState } from "recoil";
import {
  Broadcast,
  Logout,
  MessageCircle2,
  Paperclip,
  Settings,
} from "tabler-icons-react";
import { apiAddress } from "../constValues";
import { recoil_sidebarOpened } from "../states";
import { Footer } from "./LiveAside";

const UserAside = () => {
  const goLogout = () => {
    const url = `${apiAddress}/user/logout`;
    window.location.href = url;
  };

  const [sidebarOpened, setSidebarOpened] =
    useRecoilState(recoil_sidebarOpened);

  return (
    <Stack style={{ height: "calc(100vh - 120px)" }}>
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
            <span className="ml-[17px] text-[16px] text-center">클립 생성</span>
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
  );
};

export default UserAside;
