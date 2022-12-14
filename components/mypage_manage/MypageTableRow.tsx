import { Flex, Group, Text } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";
import { useRecoilState } from "recoil";
import { Trash } from "tabler-icons-react";
import { useTailwindResponsive } from "../../hooks/useTailwindResponsive";
import {
  mypageManage_deleteModalOpened,
  recoil_deleteTargetClips,
} from "../states";

interface MyapgeTableRowProps {
  checkbox: ReactNode;
  imageURL?: string;
  title: string;
  channel: string;
  date: string;
  views: string;
  clipId: string;
  channelName: string;
  disableDelete?: boolean;
}
export function MypageTableRow({
  checkbox,
  imageURL,
  clipId,
  title,
  channel,
  channelName,
  date,
  views,
  disableDelete = false,
}: MyapgeTableRowProps) {
  const [deleteModalOpened, setDeleteModalOpened] = useRecoilState(
    mypageManage_deleteModalOpened
  );
  const [deleteTargetClips, setDeleteTargetClips] = useRecoilState(
    recoil_deleteTargetClips
  );
  const { isSm, isMd } = useTailwindResponsive();

  const deleteOneClip = (id: string) => {
    setDeleteTargetClips([id]);
    setDeleteModalOpened(true);
  };

  return (
    <Flex
      justify="space-between"
      mt={5}
      pb={5}
      className="border-b-2 border-gray-200 border-solid relative mx-5"
      style={{
        height: isSm || isMd ? 150 : 90,
      }}
    >
      {/* <div
        className="min-w-[70px] flex justify-center items-center"
        style={{ height: isSm || isMd ? 150 : 90 }}
      >
        {checkbox}
      </div> */}
      <Flex
        direction={isSm || isMd ? "column" : "row"}
        justify="center"
        align={"center"}
        style={{
          width: "70%",
          minWidth: "100px",
        }}
      >
        <Flex
          justify={isSm ? "center" : "start"}
          align="center"
          direction={isSm ? "column" : "row"}
          style={{
            height: isSm || isMd ? 110 : 90,
            width: isSm || isMd ? "100%" : "71.43%",
          }}
        >
          <Link href={`/clip/${clipId}`}>
            <Group
              fw={700}
              className="h-[83px] min-w-[130px] bg-gray-200"
              style={{
                marginRight: isSm ? "" : "10px",
                backgroundImage: imageURL ? `url(${imageURL})` : "",
              }}
            />
          </Link>
          <Text
            fw={700}
            className="text-[16px] w-full whitespace-nowrap overflow-hidden text-ellipsis text-center"
          >
            <Link href={`/clip/${clipId}`}>{title}</Link>
          </Text>
        </Flex>
        <div
          className="flex justify-center items-center"
          style={{
            height: isSm || isMd ? 40 : 90,
            width: isSm || isMd ? "100%" : "28.57%",
          }}
        >
          <Link href={`/channel/${channelName}`}>
            <Text fw={700} className="text-[16px]">
              {channel}
            </Text>
          </Link>
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
          className="flex justify-center items-center"
          style={{
            height: isSm || isMd ? 75 : 90,
            width: isSm || isMd ? "100%" : "50%",
          }}
        >
          <Text fw={700} className="text-[16px]">
            {date}
          </Text>
        </div>
        <div
          className="flex justify-center items-center"
          style={{
            height: isSm || isMd ? 75 : 90,
            width: isSm || isMd ? "100%" : "50%",
          }}
        >
          <Text fw={700} className="text-[16px]">
            {views}
          </Text>
        </div>
      </Flex>
      {!disableDelete && (
        <div
          className="min-w-[67px] flex justify-center items-center"
          style={{ height: isSm || isMd ? 150 : 90 }}
        >
          <Trash
            className="cursor-pointer"
            onClick={() => deleteOneClip(clipId)}
          />
        </div>
      )}
    </Flex>
  );
}
