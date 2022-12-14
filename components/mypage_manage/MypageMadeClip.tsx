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
  mypageManage_selectedClip,
  mypageManage_madeClip,
} from "../states";
import Image from "next/image";
import { apiAddress } from "../constValues";
import axios from "axios";
import MainLayout from "../common/MainLayout";
import UserAside from "../aside/UserAside";
import LiveAside from "../aside/LiveAside";
import { Sidebar } from "../common/Sidebar";
import { useState } from "react";
import { faGlobeOceania } from "@fortawesome/free-solid-svg-icons";
import { MypageManageCommon } from "./MypageManageCommon";
import { MypageTableRow } from "./MypageTableRow";

const BREAKPOINT = "@media (max-width: 755px)";

export function MypageMadeClip() {
  const [isLogined, setIsLogined] = useRecoilState(recoil_isLogined);
  const [followed, setFollowed] = useRecoilState(recoil_followed);
  const [drawerOpened, setDrawerOpened] = useRecoilState(recoil_sidebarOpened);

  const [selectedClip, setSelectedClip] = useRecoilState(
    mypageManage_selectedClip
  );
  const [mypageMadeClip, setMypageMadeClip] = useRecoilState(
    mypageManage_madeClip
  );

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
        aside={UserAside}
        content={() => {
          return (
            <>
              <MypageManageCommon />
              {mypageMadeClip.length === 0 ? (
                <Stack>
                  <Text mt={142} c="gray" className="text-[36px] text-center">
                    생성된 클립이 없습니다.
                  </Text>
                </Stack>
              ) : (
                mypageMadeClip.map((cur, i) => {
                  return (
                    <MypageTableRow
                      key={i}
                      title={cur.info}
                      clipId={cur.clipId}
                      imageURL={cur.thumbnail}
                      channel={cur.channel}
                      channelName={cur.channelName}
                      date={cur.date}
                      views={cur.views}
                    />
                  );
                })
              )}
            </>
          );
        }}
      />
    </div>
  );
}
