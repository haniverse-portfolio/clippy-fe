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
  SimpleGrid,
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
  mypageManage_selectedClip,
  mypageManage_madeClip,
} from "../states";
import Image from "next/image";
import {
  apiAddress,
  selectedAllClip,
  selectedClipDefault,
} from "../constValues";
import axios from "axios";
import MainLayout from "../common/MainLayout";
import UserAside from "../aside/UserAside";
import LiveAside from "../aside/LiveAside";
import { Sidebar } from "../common/Sidebar";
import { useEffect, useState } from "react";
import { faGlobeOceania } from "@fortawesome/free-solid-svg-icons";
import { MypageManageCommon } from "../mypage_manage/MypageManageCommon";
import LiveCard from "../common/LiveCard";

const BREAKPOINT = "@media (max-width: 755px)";

export function MypageCreate() {
  const [isLogined, setIsLogined] = useRecoilState(recoil_isLogined);
  const [followed, setFollowed] = useRecoilState(recoil_followed);
  const [drawerOpened, setDrawerOpened] = useRecoilState(recoil_sidebarOpened);

  const [selectedClip, setSelectedClip] = useRecoilState(
    mypageManage_selectedClip
  );
  const [mypageMadeClip, setMypageMadeClip] = useRecoilState(
    mypageManage_madeClip
  );

  const checkLogin = () => {
    const url = `${apiAddress}/user/check`;
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLogined(true);
        console.log(res);
        getFollowed();
      })
      .catch((err) => {
        setIsLogined(false);
        console.log(err);
      });
  };

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

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <div>
      <Sidebar />
      <MainLayout
        aside={UserAside}
        content={() => {
          return (
            <Container
              size="xl"
              sizes={{
                xs: 540,
                sm: 720,
                md: 960,
                lg: 1140,
                xl: 1500,
              }}
              mb={100}
            >
              <Stack mt={80}>
                <Text size={36} weight={300}>
                  클립 생성
                </Text>
              </Stack>
              <SimpleGrid
                cols={4}
                spacing={24}
                mt={40}
                breakpoints={[
                  { maxWidth: 1400, cols: 3, spacing: "md" },
                  { maxWidth: 980, cols: 2, spacing: "sm" },
                  { maxWidth: 600, cols: 1, spacing: "sm" },
                ]}
              >
                {followed.map((stream: any) => {
                  return <LiveCard key={stream.id} stream={stream} />;
                })}
              </SimpleGrid>
            </Container>
          );
        }}
      />
    </div>
  );
}

export default MypageCreate;
