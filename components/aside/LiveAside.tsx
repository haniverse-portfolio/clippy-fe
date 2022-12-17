import { Avatar, Flex, Text } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useTailwindResponsive } from "../../hooks/useTailwindResponsive";
import Clip from "../common/Clip";
import { recoil_followed } from "../states";
import { useCreateClipModal } from "../../hooks/useCreateClipModal";

interface LiveProps {
  profileImage: string;
  id: number;
  name: string;
  displayName: string;
}

interface LiveItemProps {
  item: LiveProps;
}

const LiveItem = ({ item }: LiveItemProps) => {
  const { openCreateClipModal } = useCreateClipModal();
  const { isSm, isMd } = useTailwindResponsive();

  return (
    <Flex
      pos={"relative"}
      direction="row"
      justify="space-between"
      align="center"
      mb={32}
      className="mx-auto w-max lg:w-[100%]"
    >
      <Link href={`/channel/${item.name}`}>
        <Flex className="flex-col lg:flex-row" align="center">
          <Avatar
            src={item.profileImage}
            mr={8}
            size={isSm || isMd ? 48 : 32}
            radius="xl"
          ></Avatar>
          <Text className="mt-[5px] lg:mt-0">{item.displayName}</Text>
        </Flex>
      </Link>
      <div
        className="cursor-pointer
                  flex justify-center items-center
                  w-[20px] h-[20px]
                  rounded-full
                  absolute lg:relative 
                  top-0 lg:top-auto 
                  bg-black lg:bg-transparent
                  right-[10px] lg:right-auto"
        onClick={() => {
          openCreateClipModal(item.id, item.displayName, item.profileImage);
        }}
      >
        <Clip
          w={isSm || isMd ? 9 : 14}
          h={isSm || isMd ? 12 : 18}
          fill={isSm || isMd ? "#ffffff" : "#111111"}
        />
      </div>
    </Flex>
  );
};

interface LivePropsWrapper {
  data: LiveProps[];
}

const Live = ({ data }: LivePropsWrapper) => {
  return (
    <Flex className="flex-1" direction="column" justify="space-around">
      <div>
        <Text
          align="center"
          className="w-[80%] lg:w-full mx-auto break-keep"
          weight={700}
          mb={40}
          mt={20}
        >
          어떤 스트리머의 클립을 만들까요?
        </Text>
        <Flex direction="column">
          {data.map((item) => (
            <LiveItem key={item.id} item={item} />
          ))}
        </Flex>
        <Link href="/mypage/create">
          <Text
            align="center"
            className="w-[80%] lg:w-full mx-auto break-keep"
            size={14}
            weight={300}
            mt={15}
            underline
          >
            팔로우 중인 스트리머 모두 보기
          </Text>
        </Link>
      </div>
    </Flex>
  );
};

export const Footer = () => {
  return (
    <div className="pt-[50px] pb-20">
      <Text
        className="w-[75%] lg:w-full mx-auto break-keep"
        size={14}
        align="center"
      >
        © CLIPPY 2022. MADE IN SEOUL
      </Text>
    </div>
  );
};

const itemMock = [
  {
    profileImage: "/images/mock-user.svg",
    id: 1,
    name: "clippykr",
    displayName: "CLIPPY1",
  },
  {
    profileImage: "/images/mock-user.svg",
    id: 2,
    name: "clippykr",
    displayName: "CLIPPY2",
  },
  {
    profileImage: "/images/mock-user.svg",
    id: 3,
    name: "clippykr",
    displayName: "CLIPPY3",
  },
];

const calc = (items: any): LiveProps[] => {
  let count = 0;
  const returnData: LiveProps[] = [];
  items.forEach((item: any) => {
    if (count > 8) return;
    count++;
    returnData.push({
      id: item.user_id,
      name: item.user_login,
      displayName: item.user_name,
      profileImage: item.profile_image_url,
    });
  });

  return returnData;
};

const LiveAside = () => {
  const [followed, setFollowed] = useRecoilState(recoil_followed);
  const [calcFollowed, setCalcFollowed] = useState<LiveProps[]>([...followed]);

  useEffect(() => {
    setCalcFollowed(calc(followed));
  }, [followed]);

  return (
    <Flex direction="column" align="center" h="100%" justify="space-between">
      <Live data={calcFollowed} />
      <Footer />
    </Flex>
  );
};

export default LiveAside;
