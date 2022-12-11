import { Button, Group, Stack } from "@mantine/core";
import { Trash } from "tabler-icons-react";
import {
  mypageManage_sectionIndex,
  mypageManage_selectedClip,
} from "../states";
import { atom, useRecoilState } from "recoil";
import { selectedClipDefault } from "../constValues";
const BREAKPOINT = "@media (max-width: 755px)";
export function MypageManageCommon() {
  const [sectionIndex, setSectionIndex] = useRecoilState(
    mypageManage_sectionIndex
  );
  const [selectedClip, setSelectedClip] = useRecoilState(
    mypageManage_selectedClip
  );

  const isSelected = () => {
    let flag = false as boolean;
    for (let i = 0; i < selectedClip.length; i++) {
      if (selectedClip[i] === true) {
        flag = true;
        break;
      }
    }
    return flag;
  };

  return (
    <Stack className="px-36 mt-12">
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
          disabled={!isSelected()}
          leftIcon={<Trash></Trash>}
          size="lg"
          color="dark"
          radius="xl"
        >
          선택 클립 삭제
        </Button>
      </Group>
    </Stack>
  );
}
