import { Flex, Group, Text } from "@mantine/core";
import { ReactNode } from "react";
import { useTailwindResponsive } from "../../hooks/useTailwindResponsive";

interface MyapgeTableRowProps {
  checkbox: ReactNode;
  imageURL?: string;
  title: string;
  channel: string;
  date: string;
  views: string;
}
export function MypageTableRow({
  checkbox,
  imageURL,
  title,
  channel,
  date,
  views,
}: MyapgeTableRowProps) {
  const { isSm, isMd } = useTailwindResponsive();
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
      <div
        className="min-w-[70px] flex justify-center items-center"
        style={{ height: isSm || isMd ? 150 : 90 }}
      >
        {checkbox}
      </div>
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
          <Group
            fw={700}
            className="h-[83px] min-w-[130px] bg-gray-200"
            style={{
              marginRight: isSm ? "" : "10px",
              backgroundImage: imageURL ? `url(${imageURL})` : "",
            }}
          />
          <Text
            fw={700}
            className="text-[16px] w-full whitespace-nowrap overflow-hidden text-ellipsis text-center"
          >
            {title}
          </Text>
        </Flex>
        <div
          className="flex justify-center items-center"
          style={{
            height: isSm || isMd ? 40 : 90,
            width: isSm || isMd ? "100%" : "28.57%",
          }}
        >
          <Text fw={700} className="text-[16px]">
            {channel}
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
    </Flex>
  );
}
