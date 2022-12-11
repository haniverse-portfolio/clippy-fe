import { Avatar, Flex, Text } from "@mantine/core";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Clip from "../common/Clip";
import { apiAddress } from "../constValues";
import {
  recoil_createModalIsLoading,
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
        setExtractorErrorStatus(true);
        setExtractorErrorMessage(errMessage);

        // error 표시해주기
      });
  };

  return (
    <Flex direction="row" justify="space-between" align="center" mb={32}>
      <Flex direction="row" align="center">
        <Avatar src={item.profileImage} size={32} mr={8} radius="xl"></Avatar>
        <Text>{item.displayName}</Text>
      </Flex>
      <div
        className="cursor-pointer"
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
        <Clip w={14} h={18} />
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
        <Text align="center" weight={700} mb={40} mt={20}>
          어떤 스트리머의 클립을 만들까요?
        </Text>
        <Flex direction="column">
          {data.map((item) => (
            <LiveItem key={item.id} item={item} />
          ))}
        </Flex>
        <Link href="/">
          <Text align="center" size={14} weight={300} mt={15} underline>
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
      <Text size={14} align="center">
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
