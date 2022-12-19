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
} from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Heart } from "tabler-icons-react";
import * as util from "../../util/util";
import { apiAddress } from "../constValues";
import { useClippyLogin } from "../../hooks/useClippyAPI";
import { useLoginModal } from "../../hooks/useLoginModal";

const VideoCard = ({ clip }: any) => {
  const router = useRouter();
  const [isLike, setIsLike] = useState(false);

  const { isClippyLogined } = useClippyLogin();
  const { openLoginModal } = useLoginModal();

  const getLikeStatus = async () => {
    const url = `${apiAddress}/clip/${clip.key}/like`;
    const res = await axios.get(url, { withCredentials: true });
    setIsLike(res.data.data);
  };

  const toggleLike = () => {
    const url = `${apiAddress}/clip/${clip.key}/like`;

    if (isLike) {
      axios
        .delete(url, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
          setIsLike(!isLike);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .post(url, {}, { withCredentials: true })
        .then((res) => {
          console.log(res);
          setIsLike(!isLike);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (isClippyLogined) getLikeStatus();
  }, []);

  return (
    <Card p={0} m={0} key={clip.id}>
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
                {Intl.NumberFormat("ko-KR").format(clip.viewCount)}
              </Text>
            </Flex>
          </div>
        </div>
        <Image
          className="cursor-pointer rounded-md"
          src={clip.cfVideoThumbnail}
          alt="clip"
          onClick={() => {
            router.push(`/clip/${clip.key}`);
          }}
          onMouseOver={(e: any) => {
            // change thumbnail src to thumbnail gif
            const animatedThumbnail = `https://customer-m033z5x00ks6nunl.cloudflarestream.com/${
              clip.cfVideoId
            }/thumbnails/thumbnail.gif?time=0s&height=500&duration=5s&${Date.now()}}`;
            e.target.src = animatedThumbnail;
          }}
          radius={8}
          onMouseLeave={(e: any) => {
            // change thumbnail src to thumbnail jpg
            e.target.src = clip.cfVideoThumbnail;
          }}
        />
        <Group position="apart">
          <Stack spacing={0} style={{ width: "calc(100% - 100px)" }}>
            <Text
              size={16}
              weight={700}
              mt={5}
              align="left"
              onClick={() => {
                router.push(`/clip/${clip.key}`);
              }}
              style={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                maxWidth: 280,
                cursor: "pointer",
              }}
            >
              {clip.title}
            </Text>
            <Text
              mt={5}
              align="left"
              size={14}
              weight={400}
              onClick={() => {
                router.push(`/channel/${clip.userInfo.login}`);
              }}
              style={{
                cursor: "pointer",
              }}
            >
              {clip.userInfo.display_name}
            </Text>
            <Text mt={5} align="left" size={14}>
              <strong>반응 {clip.commentCount + clip.likeCount} • </strong>
              {util.showTime(clip.createdAt)}
            </Text>
          </Stack>
          <div style={{ marginLeft: 24, marginRight: 24 }}>
            <ActionIcon
              variant="transparent"
              size={36}
              className="duration-100"
              style={isLike ? { color: "#000000" } : {}}
              onClick={isClippyLogined ? toggleLike : openLoginModal}
            >
              <Heart
                size={36}
                className="duration-100"
                style={isLike ? { fill: "#000000" } : { fill: "#ffffff" }}
              />
            </ActionIcon>
          </div>
        </Group>
      </Flex>
    </Card>
  );
};

export default VideoCard;
