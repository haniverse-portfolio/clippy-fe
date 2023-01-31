import { Avatar, Button, Center, Stack } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";
import { useRecoilState } from "recoil";
import {
  BrandTwitch,
  InfoCircle,
  Logout,
  MessageCircle2,
  Paperclip,
  Settings,
} from "tabler-icons-react";
import { useTailwindResponsive } from "../../hooks/useTailwindResponsive";
import { common_sidebarOpened } from "../states";
import { Footer } from "./LiveAside";
import { useClippyLogin } from "../../hooks/useClippyAPI";

interface UserAsideMenuProps {
  icon: ReactNode;
  text: string;
  forceLarge?: boolean;
  onClick?: () => void;
}
const UserAsideMenu = ({
  icon,
  text,
  forceLarge,
  onClick,
}: UserAsideMenuProps) => {
  return (
    <Stack
      justify="center"
      className="h-[78px] lg:h-[48px] hover:bg-gray-200 hover:font-bold cursor-pointer"
      style={{ height: forceLarge ? "48px" : "" }}
      onClick={onClick}
    >
      <div
        className="flex-col lg:flex-row flex justify-center lg:justify-start items-center mx-auto lg:ml-[48px]"
        style={{
          flexDirection: forceLarge ? "row" : ("" as any),
          justifyContent: forceLarge ? "flex-start" : "",
          marginLeft: forceLarge ? "48px" : "",
        }}
      >
        {icon}
        <span
          className="ml-0 lg:ml-[17px] mt-[10px] lg:mt-0 text-[16px] text-center"
          style={{
            marginLeft: forceLarge ? "17px" : "",
            marginTop: forceLarge ? "0" : "",
          }}
        >
          {text}
        </span>
      </div>
    </Stack>
  );
};

interface UserAsideProps {
  forceLarge?: boolean;
}
const UserAside = ({ forceLarge }: UserAsideProps) => {
  const [sidebarOpened, setSidebarOpened] =
    useRecoilState(common_sidebarOpened);

  const { isSm, isMd } = useTailwindResponsive();

  const { loginedClippyUserInfo, goClippyLogout } = useClippyLogin();

  return (
    <Stack style={{ height: "calc(100vh - 120px)" }}>
      <span
        className="hidden lg:block font-light text-[36px] text-center mt-[88px] lg:mt-[20px]"
        style={{
          display: forceLarge ? "block" : "",
          marginTop: forceLarge ? "20px" : "",
        }}
      >
        내 채널
      </span>
      <Center
        className="mt-[60px] lg:mt-0"
        style={{ marginTop: forceLarge ? "0" : "" }}
      >
        <Link
          onClick={() => {
            setSidebarOpened(false);
          }}
          href={`/channel/${loginedClippyUserInfo?.twitchName}`}
        >
          <Avatar
            radius="xl"
            size={(isSm || isMd) && !forceLarge ? 48 : 98}
            src={loginedClippyUserInfo?.profileImageUrl}
            style={{ borderRadius: 99 }}
          />
        </Link>
      </Center>
      <span
        className="text-[16px] text-center mt-[-10px] lg:mt-[-5px]"
        style={{ marginTop: forceLarge ? "-5px" : "" }}
      >
        <Link href={`/channel/${loginedClippyUserInfo?.twitchName}?tab=legacy`}>
          {loginedClippyUserInfo?.twitchDisplayName}
        </Link>
      </span>
      <Stack className="m-0 p-0" mt={38}>
        <Link
          onClick={() => {
            setSidebarOpened(false);
          }}
          href="/mypage/manage"
        >
          <UserAsideMenu
            forceLarge={forceLarge}
            icon={<Settings size={18} />}
            text={"클립 관리"}
          />
        </Link>
        <Link
          onClick={() => {
            setSidebarOpened(false);
          }}
          href={`/clipmanage/${loginedClippyUserInfo?.twitchName}`}
        >
          <UserAsideMenu
            forceLarge={forceLarge}
            icon={<BrandTwitch size={18} />}
            text={"트위치 클립 관리"}
          />
        </Link>
        <Link
          onClick={() => {
            setSidebarOpened(false);
          }}
          href="/mypage/create"
        >
          <UserAsideMenu
            forceLarge={forceLarge}
            icon={<Paperclip size={18} />}
            text={"클립 생성"}
          />
        </Link>
        {/* <Link
          onClick={() => {
            setSidebarOpened(false);
          }}
          href="/mypage/following"
        >
          <UserAsideMenu
            forceLarge={forceLarge}
            icon={<Broadcast size={18} />}
            text={"팔로우 중인 채널"}
          />
        </Link> */}
        <UserAsideMenu
          forceLarge={forceLarge}
          icon={<InfoCircle size={18} />}
          text={"고객 센터"}
          onClick={() => {
            window.open("https://clippy.oqupie.com/portal/1994");
          }}
        />
        <UserAsideMenu
          forceLarge={forceLarge}
          icon={<MessageCircle2 size={18} />}
          text={"의견 보내기"}
          onClick={() => {
            window.open("https://clippy.oqupie.com/portal/1994/request");
          }}
        />
        <UserAsideMenu
          onClick={() => {
            goClippyLogout();
          }}
          forceLarge={forceLarge}
          icon={<Logout size={18} />}
          text={"로그아웃"}
        />
      </Stack>
      <Footer />
    </Stack>
  );
};

export default UserAside;
