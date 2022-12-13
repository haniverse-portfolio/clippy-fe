import { Avatar, Flex, Text } from "@mantine/core";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useTailwindResponsive } from "../../hooks/useTailwindResponsive";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import Clip from "../common/Clip";
import { apiAddress } from "../constValues";
import {
  clipType,
  recoil_createBtnLoading,
  recoil_createClip,
  recoil_createClipTrigger,
  recoil_createModalIsLoading,
  recoil_createModalIsLoadingError,
  recoil_createModalIsLoadingErrorMessage,
  recoil_createModalOpened,
  recoil_createModalStreamerInfo,
  recoil_followed,
  recoil_videoInfo,
} from "../states";

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
  const [createModalOpened, setCreateModalOpened] = useRecoilState(
    recoil_createModalOpened
  );
  const [createModalStreamerInfo, setCreateModalStreamerInfo] = useRecoilState(
    recoil_createModalStreamerInfo
  );
  const [isLoading, setIsLoading] = useRecoilState<boolean>(
    recoil_createModalIsLoading
  );
  const [followed, setFollowed] = useRecoilState(recoil_followed);
  const [videoInfo, setVideoInfo] = useRecoilState(recoil_videoInfo);

  const [extractorErrorStatus, setExtractorErrorStatus] = useState(false);
  const [extractorErrorMessage, setExtractorErrorMessage] = useState("");

  const { isSm, isMd } = useTailwindResponsive();

  const [createBtnLoading, setCreateBtnLoading] = useRecoilState<boolean>(
    recoil_createBtnLoading
  );
  const [createClip, triggerCreateClip] =
    useRecoilState<clipType>(recoil_createClip);
  const [createClipTrigger, setCreateClipTrigger] = useRecoilState<boolean>(
    recoil_createClipTrigger
  );
  const [isLoadingError, setIsLoadingError] = useRecoilState<boolean>(
    recoil_createModalIsLoadingError
  );
  const [isLoadingErrorMessage, setIsLoadingErrorMessage] =
    useRecoilState<string>(recoil_createModalIsLoadingErrorMessage);

  const postCreateClip = async (clip: clipType) => {
    setCreateBtnLoading(true);
    // https://api.clippy.kr/clip
    const url = apiAddress + "/clip";
    const res = await axios
      .post(url, clip, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        setCreateBtnLoading(false);
        triggerCreateClip(clip);
        return res.data;
      })
      .catch((res) => {
        const errMessage = res.response.data.message;
        alert(errMessage);
        setCreateBtnLoading(false);
        // error 표시해주기
      });
  };

  // useEffect(() => {
  //   if (createClipTrigger) {
  //     setCreateClipTrigger(false);
  //     postCreateClip(createClip);
  //   }
  // }, [createClipTrigger]);

  const postExtractor = async (streamerId: number) => {
    setExtractorErrorStatus(false);
    setExtractorErrorMessage("");

    // https://api.clippy.kr/extractor
    const url = apiAddress + "/extractor";

    const res = await axios
      .post(
        url,
        { streamerId: streamerId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setIsLoading(false);
        setVideoInfo(res.data.data);
        return res.data;
      })
      .catch((res) => {
        const errMessage = res.response.data.message;
        // alert(errMessage);
        setIsLoadingError(true);
        setIsLoadingErrorMessage(errMessage);
        // setExtractorErrorStatus(true);
        // setExtractorErrorMessage(errMessage);

        // error 표시해주기
      });
  };

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
          postExtractor(item.id);
          setCreateModalOpened(true);
          let copyStreamerInfo = JSON.parse(
            JSON.stringify(createModalStreamerInfo)
          );
          copyStreamerInfo.name = item.displayName;
          copyStreamerInfo.image = item.profileImage;
          setCreateModalStreamerInfo(copyStreamerInfo);
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
    <div className="py-[50px]">
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
