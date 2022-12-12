import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Card,
  Flex,
  Text,
  Image,
  Stack,
  ActionIcon,
  Group,
  Avatar,
} from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { Heart } from "tabler-icons-react";
import { useTailwindResponsive } from "../../hooks/useTailwindResponsive";
import * as util from "../../util/util";
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
import Clip from "./Clip";

const LiveCard = ({ stream }: any) => {
  const router = useRouter();

  const { isSm, isMd } = useTailwindResponsive();

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

  const make = (item: any) => {
    postExtractor(parseInt(item.user_id));
    setCreateModalOpened(true);
    let copyStreamerInfo = JSON.parse(JSON.stringify(createModalStreamerInfo));
    copyStreamerInfo.name = item.displayName;
    copyStreamerInfo.image = item.profileImage;
    setCreateModalStreamerInfo(copyStreamerInfo);
  };

  return (
    <Card
      p={0}
      m={0}
      onClick={() => {
        // router.push(`/clip/${clip.key}`);
        make(stream);
      }}
    >
      <Flex justify="center" direction="column">
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              height: 34,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1,
              borderRadius: 99,
            }}
          >
            <Flex h={34} align="center" px={16}>
              <FontAwesomeIcon
                icon={solid("eye")}
                style={{
                  width: 14,
                  height: 12,
                  color: "white",
                  marginRight: 4,
                }}
              />
              <Text size={12} weight={700} color="white">
                LIVE
              </Text>
            </Flex>
          </div>
        </div>
        <Image
          className="cursor-pointer rounded-md"
          src={stream.thumbnail_url
            .replace("{width}", "640")
            .replace("{height}", "360")}
          alt="stream thumbnail"
          radius={8}
        />
        <Flex m={16} align="center" justify="space-between">
          <Flex align="center" direction="row">
            <Avatar
              src={stream.profile_image_url}
              radius={99}
              size={32}
              mr={16}
            />
            <Text size={16} weight={700}>
              {stream.user_name}
            </Text>
          </Flex>
          <Clip
            w={isSm || isMd ? 9 : 14}
            h={isSm || isMd ? 12 : 18}
            fill={isSm || isMd ? "#ffffff" : "#111111"}
          />
        </Flex>
      </Flex>
    </Card>
  );
};

export default LiveCard;
