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
import { useRouter } from "next/router";
import { Heart } from "tabler-icons-react";
import * as util from "../../util/util";

const VideoCard = ({ clip }: any) => {
  const router = useRouter();

  return (
    <Card
      p={0}
      m={0}
      key={clip.id}
      onClick={() => {
        router.push(`/clip/${clip.key}`);
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
              <Text
                size={12}
                weight={700}
                color="white"
                style={
                  {
                    // lineHeight: "34px",
                    // padding: "0 15px",
                  }
                }
              >
                {Intl.NumberFormat("ko-KR").format(clip.viewCount)}
              </Text>
            </Flex>
          </div>
        </div>
        <Image
          className="cursor-pointer rounded-md"
          src={clip.cfVideoThumbnail}
          alt="clip"
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
              style={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                // width: "calc((100vw - 360px) / 4 - 24px - 60px)",
                maxWidth: 280,
              }}
            >
              {clip.title}
            </Text>
            <Text mt={5} align="left" size={14} weight={400}>
              {clip.userInfo.display_name}
            </Text>
            <Text mt={5} align="left" size={14}>
              <strong>반응 {clip.commentCount + clip.likeCount} • </strong>
              {util.showTime(clip.createdAt)}
            </Text>
          </Stack>
          <div style={{ marginLeft: 24, marginRight: 24 }}>
            <ActionIcon variant="transparent" size={36}>
              <Heart size={36} />
            </ActionIcon>
          </div>
        </Group>
      </Flex>
    </Card>
  );
};

export default VideoCard;
