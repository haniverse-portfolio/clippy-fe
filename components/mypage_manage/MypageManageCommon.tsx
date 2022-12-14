import { Button, Checkbox, Flex, Group, Stack, Text } from "@mantine/core";
import { Trash } from "tabler-icons-react";
import {
  mypageManage_channelClip,
  mypageManage_deleteModalOpened,
  mypageManage_madeClip,
  mypageManage_sectionIndex,
  mypageManage_selectedClip,
} from "../states";
import { atom, useRecoilState } from "recoil";
import {
  apiAddress,
  selectedAllClip,
  selectedClipDefault,
} from "../constValues";
import { useEffect, useState } from "react";
import * as util from "../../util/util";
import { useTailwindResponsive } from "../../hooks/useTailwindResponsive";
import axios from "axios";
const BREAKPOINT = "@media (max-width: 755px)";
export function MypageManageCommon() {
  const { isSm, isMd } = useTailwindResponsive();
  const [sectionIndex, setSectionIndex] = useRecoilState(
    mypageManage_sectionIndex
  );
  const [selectedClip, setSelectedClip] = useRecoilState(
    mypageManage_selectedClip
  );
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [mypageMadeClip, setMypageMadeClip] = useRecoilState(
    mypageManage_madeClip
  );
  const [mypageChannelClip, setMypageChannelClip] = useRecoilState(
    mypageManage_channelClip
  );
  const [isAllCheckClicked, setIsAllCheckClicked] = useState(false);

  const [deleteModalOpened, setDeleteModalOpened] = useRecoilState(
    mypageManage_deleteModalOpened
  );
  const isSelected = () => {
    let cnt = 0 as number;
    for (let i = 0; i < selectedClip.length; i++) {
      if (selectedClip[i] === true) {
        cnt++;
      }
    }
    return cnt;
  };

  // 내가 만든 클립 -> mypageMadeClip
  const getMypageMadeClip = async () => {
    await axios
      .get(`${apiAddress}/user/me/clip`, {
        withCredentials: true,
      })
      .then((res) => {
        const newData = res.data.data.map((clip: any) => {
          return {
            info: clip.title,
            clipId: clip.key,
            thumbnail: clip.cfVideoThumbnail,
            channel: clip.userInfo.display_name,
            channelName: clip.userInfo.login,
            date: util.showTime(clip.createdAt),
            views: clip.viewCount,
          };
        });

        setMypageMadeClip(newData);
      });
  };

  // 내 채널의 클립 -> mypageChannelClip
  const getMypageChannelClip = async () => {
    await axios
      .get(`${apiAddress}/user/me/clipped`, {
        withCredentials: true,
      })
      .then((res) => {
        const newData = res.data.data.map((clip: any) => {
          return {
            info: clip.title,
            clipId: clip.key,
            thumbnail: clip.cfVideoThumbnail,
            channel: clip.userInfo.display_name,
            channelName: clip.userInfo.login,
            date: util.showTime(clip.createdAt),
            views: clip.viewCount,
          };
        });

        setMypageChannelClip(newData);
      });
  };

  useEffect(() => {
    getMypageMadeClip();
    getMypageChannelClip();
  }, []);

  const checkAll = () => {
    if (selectAllChecked === false) setSelectedClip(selectedAllClip);
    else setSelectedClip(selectedClipDefault);

    setSelectAllChecked(!selectAllChecked);
  };

  useEffect(() => {
    setTimeout(() => {
      if (!isAllCheckClicked) {
        let requiredLength = 0;
        if (sectionIndex === 0) requiredLength = mypageMadeClip.length;
        if (sectionIndex === 1) requiredLength = mypageChannelClip.length;
        if (isSelected() !== requiredLength) setSelectAllChecked(false);
        else setSelectAllChecked(true);
      } else setIsAllCheckClicked(() => false);
    }, 50);
  }, [selectedClip]);

  return (
    <Stack className="w-[calc(100vw - 360px)] px-5 mt-12">
      <p className="text-4xl">클립 관리</p>
      <Group position="apart" className="mt-2">
        <Group>
          <Button
            onClick={() => {
              setSelectedClip(selectedClipDefault);
              setSectionIndex(0);
            }}
            size={isSm || isMd ? "sm" : "lg"}
            variant={sectionIndex === 0 ? "filled" : "outline"}
            color="dark"
            radius="xl"
          >
            내가 만든 클립
          </Button>
          <Button
            onClick={() => {
              setSelectedClip(selectedClipDefault);
              setSectionIndex(1);
            }}
            size={isSm || isMd ? "sm" : "lg"}
            variant={sectionIndex === 1 ? "filled" : "outline"}
            color="dark"
            radius="xl"
          >
            내 채널의 클립
          </Button>
        </Group>
        {/* <Button
          onClick={() => {
            if (isSelected()) setDeleteModalOpened(true);
          }}
          className={!isSelected() ? "hover:cursor-not-allowed" : ""}
          disabled={!isSelected()}
          leftIcon={<Trash />}
          size={isSm || isMd ? "sm" : "lg"}
          color="dark"
          radius="xl"
        >
          선택 클립 삭제
        </Button> */}
      </Group>
      <Flex
        justify="space-between"
        mt={16}
        className="border-black border-2 lg:border-x-0 border-solid relative"
        style={{
          height: isSm || isMd ? 60 : 48,
        }}
      >
        {/*<div
          className="w-[70px] flex justify-center items-center border-r-[1px] lg:border-0 border-black"
          style={{ height: isSm || isMd ? 56 : 44 }}
        >
           <Checkbox
            onClick={() => {
              setIsAllCheckClicked(() => true);
              checkAll();
            }}
            checked={selectAllChecked}
            color="dark"
            className="mb-[-4px]"
          />
        </div> */}
        <Flex
          direction={isSm || isMd ? "column" : "row"}
          justify="center"
          align={"center"}
          style={{
            width: "70%",
          }}
        >
          <div
            className="flex justify-center items-center border-r-[1px] lg:border-0 border-black"
            style={{
              height: isSm || isMd ? 28 : 44,
              width: isSm || isMd ? "100%" : "71.43%",
            }}
          >
            <Text fw={700} className="text-[16px] whitespace-nowrap">
              클립
            </Text>
          </div>
          <div
            className="flex justify-center items-center border-t-[1px] lg:border-t-[0px] border-r-[1px] lg:border-0 border-black"
            style={{
              height: isSm || isMd ? 27 : 44,
              width: isSm || isMd ? "100%" : "28.57%",
            }}
          >
            <Text fw={700} className="text-[16px] whitespace-nowrap">
              채널
            </Text>
          </div>
        </Flex>
        <Flex
          direction={isSm || isMd ? "column" : "row"}
          justify="center"
          align={"center"}
          style={{
            width: "30%",
          }}
        >
          <div
            className="flex justify-center items-center lg:border-0 border-black"
            style={{
              height: isSm || isMd ? 28 : 44,
              width: isSm || isMd ? "100%" : "50%",
            }}
          >
            <Text fw={700} className="text-[16px] whitespace-nowrap">
              생성일
            </Text>
          </div>
          <div
            className="border-t-[1px] border-black lg:border-0 flex justify-center items-center"
            style={{
              height: isSm || isMd ? 27 : 44,
              width: isSm || isMd ? "100%" : "50%",
            }}
          >
            <Text fw={700} className="text-[16px] whitespace-nowrap">
              시청수
            </Text>
          </div>
        </Flex>
        <div
          className="w-[70px] flex justify-center items-center border-l-[1px] lg:border-0 border-black"
          style={{ height: isSm || isMd ? 56 : 44 }}
        >
          <Text fw={700} className="text-[16px] whitespace-nowrap">
            관리
          </Text>
        </div>
      </Flex>
    </Stack>
  );
}
