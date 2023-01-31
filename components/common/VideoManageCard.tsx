import { brands, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
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
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Heart, Paperclip } from "tabler-icons-react";
import * as util from "../../util/util";
import { apiAddress } from "../constValues";
import { useClippyLogin } from "../../hooks/useClippyAPI";
import { useLoginModal } from "../../hooks/useLoginModal";
import { IndenterminateProgressBar } from "./IndenterminateProgressBar";
import { LogoWithoutBeta } from "./Logo";

interface VideoCardProps {
  clip: IClipInfo;
  mode?: "horizontal" | "vertical";
}

const VideoManageCard = ({ clip, mode = "vertical" }: VideoCardProps) => {
  const router = useRouter();
  const [isMask, setIsMask] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [thumbnailSrc, setThumbnailSrc] = useState(clip.cfVideoThumbnail);

  const { isClippyLogined } = useClippyLogin();
  const { openLoginModal } = useLoginModal();

  const getMaskStatus = async () => {
    const url = `${apiAddress}/clip/${clip.key}/mask`;
    const res = await axios.get(url, { withCredentials: true });
    setIsMask(res.data.data);
  };

  const toggleMask = () => {
    const url = `${apiAddress}/clip/${clip.key}/mask`;

    if (isMask) {
      axios
        .delete(url, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
          setIsMask(!isMask);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .post(url, {}, { withCredentials: true })
        .then((res) => {
          console.log(res);
          setIsMask(!isMask);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (isClippyLogined) getMaskStatus();
  }, []);

  return (
    <div
      className="relative w-full p-0 m-0 flex justify-start items-center gap-2 cursor-pointer"
      key={clip.id}
      style={{ flexDirection: mode === "horizontal" ? "row" : "column" }}
      onMouseEnter={() => {
        if (!clip.isLegacy && !clip?.isAdult) {
          const animatedThumbnail = `https://customer-m033z5x00ks6nunl.cloudflarestream.com/${
            clip.cfVideoId
          }/thumbnails/thumbnail.gif?time=0s&height=500&duration=5s&${Date.now()}}`;
          setThumbnailSrc(animatedThumbnail);
          setIsImageLoading(true);
        }
      }}
      onMouseLeave={() => {
        if (!clip.isLegacy) {
          setThumbnailSrc(clip.cfVideoThumbnail);
          setIsImageLoading(false);
        }
      }}
    >
      <Link
        href={`/clip/${clip.key}`}
        className="bg-gray-200 rounded-md"
        style={{
          width: mode === "horizontal" ? "50%" : "100%",
          minWidth: "140px",
          maxWidth: mode === "horizontal" ? "200px" : "400px",
        }}
      >
        <AspectRatio ratio={239 / 134.438}>
          {clip?.isAdult ? (
            <div
              style={{
                position: "absolute",
                zIndex: 10,
                width: "30%",
                left: "35%",
              }}
            >
              <LogoWithoutBeta />
            </div>
          ) : (
            <></>
          )}
          <Image
            className={clip?.isAdult ? "rounded-md nsfw" : "rounded-md"}
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
      </Link>
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
      {mode === "vertical" && (
        <div className="absolute flex justify-center items-center top-[12px] left-[12px] h-[34px] w-[34px] bg-[rgba(255,255,255,0.5)] rounded-full">
          {clip.isLegacy ? (
            <FontAwesomeIcon
              icon={brands("twitch")}
              // icon={solid("twitch")}
              style={{
                width: 16,
                // height: 12,
                color: "#6441A4",
                // marginRight: 4,
              }}
            />
          ) : (
            <Paperclip size={16} />
          )}
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
        <Link
          href={`/clip/${clip.key}`}
          className={`w-[calc(100%-10px)] text-[16px] font-bold break-all mb-2 hover:underline block ${
            mode === "horizontal"
              ? "whitespace-nowrap text-ellipsis overflow-hidden"
              : "line-clamp-2"
          }`}
        >
          {clip.title}
        </Link>
        <div className="w-full flex justify-between items-center text-[14px]">
          <div
            className="h-full"
            style={{
              width: mode === "horizontal" ? "100%" : "calc(100% - 4em)",
            }}
          >
            <Link
              href={`/channel/${clip.userInfo.login}`}
              className="whitespace-nowrap overflow-hidden text-ellipsis mb-1 hover:underline block"
              style={{
                width: mode === "horizontal" ? "100%" : "calc(100% - 1em)",
              }}
            >
              {clip.userInfo.display_name}
            </Link>
            <div>
              <strong>반응 {clip.commentCount + clip.likeCount} • </strong>
              {util.showTime(clip.createdAt)}
            </div>
          </div>
          {mode === "vertical" && !clip.isLegacy && (
            <div className="w-[4em] h-full relative top-[-8px]">
              <ActionIcon
                variant="transparent"
                size={36}
                className="duration-100"
                style={isMask ? { color: "#000000" } : {}}
                onClick={() => {
                  if (isClippyLogined) toggleMask();
                  else openLoginModal();
                }}
              >
                <Eye
                  size={36}
                  className="duration-100"
                  style={isMask ? { fill: "#000000" } : { fill: "#ffffff" }}
                />
              </ActionIcon>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoManageCard;
