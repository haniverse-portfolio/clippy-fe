import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Flex, Text, Image, Avatar, AspectRatio } from "@mantine/core";
import { useTailwindResponsive } from "../../hooks/useTailwindResponsive";
import Clip from "./Clip";
import { useCreateClipModal } from "../../hooks/useCreateClipModal";
import Link from "next/link";
import { useRouter } from "next/router";

interface LiveCardInterface {
  stream: ILiveStreamerInfo;
}
const LiveCard = ({ stream }: LiveCardInterface) => {
  const { openCreateClipModal } = useCreateClipModal();

  const { isSm, isMd } = useTailwindResponsive();
  const router = useRouter();

  return (
    <Card
      p={0}
      m={0}
      onClick={() => {
        openCreateClipModal(
          parseInt(stream.user_id),
          stream.user_name,
          stream.profile_image_url
        );
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
        <AspectRatio ratio={239 / 134.438} className="bg-gray-200 rounded-md">
          <Image
            className="cursor-pointer rounded-md"
            src={stream.thumbnail_url
              .replace("{width}", "640")
              .replace("{height}", "360")}
            alt="stream thumbnail"
          />
        </AspectRatio>
        <Flex m={16} align="center" justify="space-between">
          <Flex align="center" direction="row">
            <div
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/channel/${stream.user_login}`);
              }}
              className="w-full flex justify-start items-center cursor-pointer"
            >
              <Avatar
                src={stream.profile_image_url}
                radius={99}
                size={32}
                mr={16}
              />
              <Text size={16} weight={700}>
                {stream.user_name}
              </Text>
            </div>
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
