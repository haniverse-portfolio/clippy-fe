import {
  createStyles,
  Container,
  Text,
  Button,
  Group,
  keyframes,
  Badge,
  Flex,
  Card,
  Stack,
  ActionIcon,
  Drawer,
  ThemeIcon,
  Checkbox,
} from "@mantine/core";
import { GithubIcon } from "@mantine/ds";
import {
  BrandTwitch,
  Heart,
  Menu2,
  Scale,
  Paperclip,
  Trash,
} from "tabler-icons-react";
import { atom, useRecoilState } from "recoil";
import {
  recoil_sidebarOpened,
  recoil_followed,
  recoil_isLogined,
} from "../states";
import Image from "next/image";
import { apiAddress } from "../constValues";
import axios from "axios";
import MainLayout from "../common/MainLayout";
import UserAside from "../aside/UserAside";
import LiveAside from "../aside/LiveAside";
import { Sidebar } from "../common/Sidebar";
import { useState } from "react";
import { MypageManageCommon } from "./MypageManageCommon";

const BREAKPOINT = "@media (max-width: 755px)";

export const scale = keyframes({
  "from, to": { transform: "scale(0.7)" },
});

export function MypageChannelClip() {
  const [isLogined, setIsLogined] = useRecoilState(recoil_isLogined);
  const [followed, setFollowed] = useRecoilState(recoil_followed);
  const [drawerOpened, setDrawerOpened] = useRecoilState(recoil_sidebarOpened);

  const [selectedClip, setSelectedClip] = useState([]);

  const getFollowed = () => {
    const url = `${apiAddress}/twitch/followed_streams`;
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => {
        setFollowed(res.data.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Sidebar />
      <MainLayout
        aside={LiveAside}
        content={() => {
          return (
            <>
              <MypageManageCommon />
              <Stack
                justify="center"
                mt={16}
                className="mx-[48px] h-[48px] border-0 border-black border-y-2 border-solid"
              >
                <Group>
                  <Checkbox className="m-[12px]" color="dark" />
                  <Text fw={700} className="text-[16px] w-[516px] ml-[32px]">
                    정보
                  </Text>
                  <Group fw={700} className="text-[16px] w-[216px]">
                    채널
                  </Group>
                  <Text fw={700} className="text-[16px] w-[216px]">
                    생성일
                  </Text>
                  <Text fw={700} className="text-[16px]">
                    시청수
                  </Text>
                </Group>
              </Stack>
            </>
          );
        }}
      />
    </div>
  );
}
