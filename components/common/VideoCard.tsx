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
  AspectRatio,
} from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Heart } from "tabler-icons-react";
import * as util from "../../util/util";
import { apiAddress } from "../constValues";
import { useClippyLogin } from "../../hooks/useClippyAPI";
import { useLoginModal } from "../../hooks/useLoginModal";
import { IndenterminateProgressBar } from "./IndenterminateProgressBar";

interface VideoCardProps {
  clip: IClipInfo;
  mode?: "horizontal" | "vertical";
}

const VideoCard = ({ clip, mode = "vertical" }: VideoCardProps) => {
  const router = useRouter();
  const [isLike, setIsLike] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [thumbnailSrc, setThumbnailSrc] = useState(clip.cfVideoThumbnail);

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
    <div
      className="relative w-full p-0 m-0 flex justify-start items-center gap-2 cursor-pointer"
      key={clip.id}
      style={{ flexDirection: mode === "horizontal" ? "row" : "column" }}
      onClick={() => {
        router.push(`/clip/${clip.key}`);
      }}
      onMouseEnter={() => {
        const animatedThumbnail = `https://customer-m033z5x00ks6nunl.cloudflarestream.com/${
          clip.cfVideoId
        }/thumbnails/thumbnail.gif?time=0s&height=500&duration=5s&${Date.now()}}`;
        setThumbnailSrc(animatedThumbnail);
        setIsImageLoading(true);
      }}
      onMouseLeave={() => {
        setThumbnailSrc(clip.cfVideoThumbnail);
        setIsImageLoading(false);
      }}
    >
      <AspectRatio
        ratio={239 / 134.438}
        className="bg-gray-200 rounded-md"
        style={{
          width: mode === "horizontal" ? "50%" : "100%",
          minWidth: "140px",
          maxWidth: mode === "horizontal" ? "200px" : "400px",
        }}
      >
        <Image
          className="rounded-md"
          src={thumbnailSrc}
          alt="clip"
          onLoad={() => {
            setIsImageLoading(false);
          }}
          onError={() => {
            setIsImageLoading(false);
          }}
          radius={8}
        />
        {isImageLoading && (
          <IndenterminateProgressBar
            position="relative"
            className="mt-[-8px]"
          />
        )}
      </AspectRatio>
      {mode === "vertical" && (
        <div className="absolute flex justify-center items-center top-[12px] right-[12px] h-[34px] px-[16px] bg-[rgba(0,0,0,0.5)] rounded-full">
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
        </div>
      )}
      <div
        className="h-full flex flex-col items-start"
        style={{
          width: mode === "horizontal" ? "50%" : "100%",
          justifyContent:
            mode === "horizontal" ? "space-between" : "flex-start",
        }}
      >
        <div
          className={`w-[calc(100%-10px)] text-[16px] font-bold break-all mb-2 hover:underline ${
            mode === "horizontal"
              ? "whitespace-nowrap text-ellipsis overflow-hidden"
              : "line-clamp-2"
          }`}
        >
          {clip.title}
        </div>
        <div className="w-full flex justify-between items-center text-[14px]">
          <div
            className="h-full"
            style={{
              width: mode === "horizontal" ? "100%" : "calc(100% - 4em)",
            }}
          >
            <div
              className="whitespace-nowrap overflow-hidden text-ellipsis mb-1 hover:underline"
              style={{
                width: mode === "horizontal" ? "100%" : "calc(100% - 1em)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/channel/${clip.userInfo.login}`);
              }}
            >
              {clip.userInfo.display_name}
            </div>
            <div>
              <strong>반응 {clip.commentCount + clip.likeCount} • </strong>
              {util.showTime(clip.createdAt)}
            </div>
          </div>
          {mode === "vertical" && (
            <div className="w-[4em] h-full relative top-[-8px]">
              <ActionIcon
                variant="transparent"
                size={36}
                className="duration-100"
                style={isLike ? { color: "#000000" } : {}}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isClippyLogined) toggleLike();
                  else openLoginModal();
                }}
              >
                <Heart
                  size={36}
                  className="duration-100"
                  style={isLike ? { fill: "#000000" } : { fill: "#ffffff" }}
                />
              </ActionIcon>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
