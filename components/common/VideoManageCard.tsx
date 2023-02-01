import { brands, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Text, Image, AspectRatio, Switch, Tooltip } from "@mantine/core";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Heart, Paperclip } from "tabler-icons-react";
import * as util from "../../util/util";
import { apiAddress } from "../constValues";
import { useClippyLogin } from "../../hooks/useClippyAPI";
import { useLoginModal } from "../../hooks/useLoginModal";
import { IndenterminateProgressBar } from "./IndenterminateProgressBar";
import { LogoWithoutBeta } from "./Logo";
import { useRecoilState } from "recoil";
import { mypageManage_twitch_legacyClipPolicy } from "../states";

interface VideoCardProps {
  clip: IClipInfo;
  mode?: "horizontal" | "vertical";
}

const VideoManageCard = ({ clip, mode = "vertical" }: VideoCardProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [clipInfo, setClipInfo] = useState<IClipInfo>(clip);
  const [thumbnailSrc, setThumbnailSrc] = useState(clipInfo.cfVideoThumbnail);
  const [legacyClipPolicy, setLegacyClipPolicy] = useRecoilState(
    mypageManage_twitch_legacyClipPolicy
  );
  const [isToggleLegacyClipHideReady, setIsToggleLegacyClipHideReady] =
    useState(true);

  const { isClippyLogined } = useClippyLogin();
  const { openLoginModal } = useLoginModal();

  const toggleLegacyClipHide = async () => {
    if (!isClippyLogined) {
      openLoginModal();
      return;
    }
    if (!isToggleLegacyClipHideReady || legacyClipPolicy.hideAll) return;
    setIsToggleLegacyClipHideReady(() => false);
    const url = `${apiAddress}/clip/legacy/${clipInfo.key}/hide`;
    if (clipInfo.isHide) await axios.delete(url, { withCredentials: true });
    else await axios.post(url, {}, { withCredentials: true });
    setClipInfo((state) => ({ ...state, isHide: !state.isHide }));
    setIsToggleLegacyClipHideReady(() => true);
  };

  useEffect(() => {
    setClipInfo(clip);
  }, [clip]);

  return (
    <div
      className="relative w-full p-0 m-0 flex justify-start items-center gap-2 cursor-pointer"
      key={clipInfo.id}
      style={{ flexDirection: mode === "horizontal" ? "row" : "column" }}
      onMouseEnter={() => {
        if (!clipInfo.isLegacy && !clipInfo?.isAdult) {
          const animatedThumbnail = `https://customer-m033z5x00ks6nunl.cloudflarestream.com/${
            clipInfo.cfVideoId
          }/thumbnails/thumbnail.gif?time=0s&height=500&duration=5s&${Date.now()}}`;
          setThumbnailSrc(animatedThumbnail);
          setIsImageLoading(true);
        }
      }}
      onMouseLeave={() => {
        if (!clipInfo.isLegacy) {
          setThumbnailSrc(clipInfo.cfVideoThumbnail);
          setIsImageLoading(false);
        }
      }}
    >
      <Link
        href={`/clip/${clipInfo.key}`}
        className="bg-gray-200 rounded-md"
        style={{
          width: mode === "horizontal" ? "50%" : "100%",
          minWidth: "140px",
          maxWidth: mode === "horizontal" ? "200px" : "400px",
        }}
      >
        <AspectRatio ratio={239 / 134.438}>
          {clipInfo?.isAdult ? (
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
            className={`${
              clipInfo?.isAdult ? "rounded-md nsfw" : "rounded-md"
            } grayscale-20`}
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
            {Intl.NumberFormat("ko-KR").format(clipInfo.viewCount)}
          </Text>
        </div>
      )}
      {mode === "vertical" && (
        <div className="absolute flex justify-center items-center top-[12px] left-[12px] h-[34px] w-[34px] bg-[rgba(255,255,255,0.5)] rounded-full">
          {clipInfo.isLegacy ? (
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
          href={`/clip/${clipInfo.key}`}
          className={`w-[calc(100%-10px)] text-[16px] font-bold break-all mb-2 hover:underline block ${
            mode === "horizontal"
              ? "whitespace-nowrap text-ellipsis overflow-hidden"
              : "line-clamp-2"
          }`}
        >
          {clipInfo.title}
        </Link>
        <div className="w-full flex justify-between items-center text-[14px]">
          <div
            className="h-full"
            style={{
              width: mode === "horizontal" ? "100%" : "calc(100% - 8em)",
            }}
          >
            <Link
              href={`/channel/${clipInfo.userInfo.login}`}
              className="whitespace-nowrap overflow-hidden text-ellipsis mb-1 hover:underline block"
              style={{
                width: mode === "horizontal" ? "100%" : "calc(100% - 1em)",
              }}
            >
              {clipInfo.userInfo.display_name}
            </Link>
            <div>
              <strong>
                반응 {clipInfo.commentCount + clipInfo.likeCount} •{" "}
              </strong>
              {util.showTime(clipInfo.createdAt)}
            </div>
          </div>
          {mode === "vertical" && clipInfo.isLegacy && (
            <div className="w-[8em] h-full relative flex justify-end items-center">
              <Tooltip
                label={
                  "전체 비공개 상태에서는 개별 클립의 공개 상태를 변경할 수 없습니다."
                }
                disabled={!legacyClipPolicy.hideAll}
              >
                <div className="hover:cursor-pointer h-max">
                  <Switch
                    color="dark"
                    checked={
                      legacyClipPolicy.hideAll ? false : !clipInfo.isHide
                    }
                    onLabel="공개상태"
                    offLabel="비공개상태"
                    size="lg"
                    onClick={toggleLegacyClipHide}
                  />
                </div>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoManageCard;
