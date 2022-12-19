import { Avatar, Flex, Text } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTailwindResponsive } from "../../hooks/useTailwindResponsive";
import Clip from "../common/Clip";
import { useCreateClipModal } from "../../hooks/useCreateClipModal";
import { useClippyLogin } from "../../hooks/useClippyAPI";
import { getFollowedStreamer } from "../../util/clippy";
import { useRouter } from "next/router";
import { useLoginModal } from "../../hooks/useLoginModal";

interface LiveItemProps {
  item: IFollowedStreamerInfo;
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
      <Link href={`/channel/${item.user_login}`}>
        <Flex className="flex-col lg:flex-row" align="center">
          <Avatar
            src={item.profile_image_url}
            mr={8}
            size={isSm || isMd ? 48 : 32}
            radius="xl"
          ></Avatar>
          <Text className="mt-[5px] lg:mt-0">{item.user_name}</Text>
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
          openCreateClipModal(
            parseInt(item.user_id),
            item.user_name,
            item.profile_image_url
          );
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
  data: IFollowedStreamerInfo[];
}

const Live = ({ data }: LivePropsWrapper) => {
  const { isClippyLogined } = useClippyLogin();
  const { openLoginModal } = useLoginModal();
  const router = useRouter();

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
        <Text
          align="center"
          className="w-[80%] lg:w-full mx-auto break-keep"
          size={14}
          weight={300}
          mt={15}
          underline
          onClick={
            isClippyLogined
              ? () => router.push("/mypage/create")
              : openLoginModal
          }
        >
          팔로우 중인 스트리머 모두 보기
        </Text>
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

const LiveAside = () => {
  const [followed, setFollowed] = useState<IFollowedStreamerInfo[]>([]);

  useEffect(() => {
    getFollowedStreamer().then((res) => {
      setFollowed(res);
    });
  }, []);

  return (
    <Flex direction="column" align="center" h="100%" justify="space-between">
      <Live data={followed.filter((itm, idx) => idx < 8)} />
      <Footer />
    </Flex>
  );
};

export default LiveAside;
