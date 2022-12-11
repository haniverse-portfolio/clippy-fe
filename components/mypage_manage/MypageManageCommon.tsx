import { Button, Checkbox, Group, Stack, Text } from "@mantine/core";
import { Trash } from "tabler-icons-react";
import {
  mypageManage_channelClip,
  mypageManage_deleteModalOpened,
  mypageManage_madeClip,
  mypageManage_sectionIndex,
  mypageManage_selectedClip,
} from "../states";
import { atom, useRecoilState } from "recoil";
import { selectedAllClip, selectedClipDefault } from "../constValues";
import { useEffect, useState } from "react";
const BREAKPOINT = "@media (max-width: 755px)";
export function MypageManageCommon() {
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

  const checkAll = () => {
    if (selectAllChecked === false) setSelectedClip(selectedAllClip);
    else setSelectedClip(selectedClipDefault);

    setSelectAllChecked(!selectAllChecked);
  };

  useEffect(() => {
    let requiredLength = 0;
    if (sectionIndex === 0) requiredLength = mypageMadeClip.length;
    if (sectionIndex === 1) requiredLength = mypageChannelClip.length;
    if (isSelected() !== requiredLength) setSelectAllChecked(false);
    else setSelectAllChecked(true);
  }, [selectedClip]);

  return (
    <Stack className="w-[calc(100vw - 360px)] px-12 mt-12">
      <p className="text-4xl">클립 관리</p>
      <Group position="apart">
        <Group>
          <Button
            onClick={() => {
              setSelectedClip(selectedClipDefault);
              setSectionIndex(0);
            }}
            size="lg"
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
            size="lg"
            variant={sectionIndex === 1 ? "filled" : "outline"}
            color="dark"
            radius="xl"
          >
            내 채널의 클립
          </Button>
        </Group>
        <Button
          onClick={() => {
            if (isSelected()) setDeleteModalOpened(true);
          }}
          className={!isSelected() ? "hover:cursor-not-allowed" : ""}
          disabled={!isSelected()}
          leftIcon={<Trash />}
          size="lg"
          color="dark"
          radius="xl"
        >
          선택 클립 삭제
        </Button>
      </Group>
      <Stack
        justify="center"
        mt={16}
        className="h-[48px] border-0 border-black border-y-2 border-solid"
      >
        <Group>
          <Checkbox
            onClick={() => {
              checkAll();
            }}
            checked={selectAllChecked}
            className="m-[12px]"
            color="dark"
          />
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
    </Stack>
  );
}
