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
import { useState } from "react";
import { faGlobeOceania } from "@fortawesome/free-solid-svg-icons";
import { MypageManageCommon } from "./MypageManageCommon";

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
        aside={LiveAside}
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
                    <Stack
                      key={i}
                      justify="center"
                      className="mx-[48px] h-[120px] border-0 border-gray-200 border-b-2 border-solid"
                    >
                      <Group>
                        <Checkbox
                          onClick={() => {
                            let copySelectedClip = JSON.parse(
                              JSON.stringify(selectedClip)
                            ) as Array<boolean>;
                            copySelectedClip[i] = !copySelectedClip[i];
                            setSelectedClip(copySelectedClip);
                          }}
                          checked={selectedClip[i]}
                          className="m-[12px]"
                          color="dark"
                        />
                        <Group className="w-[516px] ml-[32px]">
                          <Group
                            fw={700}
                            className="h-[83px] w-[130px] bg-gray-200"
                          />
                          <Text fw={700} className="text-[16px] w-[216px]">
                            {cur.info}
                          </Text>
                        </Group>
                        <Text fw={700} className="text-[16px] w-[216px]">
                          {cur.channel}
                        </Text>
                        <Text fw={700} className="text-[16px] w-[216px]">
                          {cur.date}
                        </Text>
                        <Text fw={700} className="text-[16px]">
                          {cur.views}
                        </Text>
                      </Group>
                    </Stack>
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
