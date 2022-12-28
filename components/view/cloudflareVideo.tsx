import { Stream } from "@cloudflare/stream-react";
import { AspectRatio, Flex, Loader, Skeleton, Text } from "@mantine/core";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { apiAddress } from "../constValues";

interface CloudflareVideoProps {
  videoId: string;
  clipId: string;
  videoPlayState?: [boolean, Dispatch<SetStateAction<boolean>>];
  autoPlay?: boolean;
  muted?: boolean;
  startAt?: number;
}

export const CloudflareVideo = ({
  videoId,
  clipId,
  videoPlayState,
  autoPlay,
  muted,
  startAt,
}: CloudflareVideoProps) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [onPlay, setOnPlay] = useState<boolean>(false);
  const [videoStatus, setVideoStatus] = useState<any>({
    state: "queued",
  });

  const [isVideoReady, setIsVideoReady] = useState<boolean | null>(null);

  const checkStatus = () => {
    axios
      .get(`${apiAddress}/clip/${clipId}/status`)
      .then((res) => {
        const status = res.data.data.result.status;
        setVideoStatus(status);

        if (status.state === "ready") {
          setIsVideoReady(true);
          setIsLoaded(true);
        } else {
          setIsVideoReady(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    checkStatus();
  }, []);

  useEffect(() => {
    if (isVideoReady) return;

    const interval = setInterval(() => checkStatus(), 1000);

    return () => clearInterval(interval);
  }, [isVideoReady]);

  return (
    <div style={{ width: "100%", height: "max-content" }}>
      {videoId !== "" ? (
        <>
          {isVideoReady === false && (
            <div style={{ height: "max-content" }}>
              <AspectRatio ratio={528 / 297} className="bg-gray-200">
                <Flex
                  align="center"
                  direction="column"
                  justify="space-evenly"
                  gap={4}
                  h="100%"
                >
                  <Loader size="lg" color="violet" />
                  <Flex align="center" direction="column">
                    <Text mb={10}>
                      현재 영상 처리 중입니다. 조금만 더 기다려주세요
                    </Text>
                    <Text>
                      처리 상황 :{" "}
                      {videoStatus.state === "queued"
                        ? "대기 중"
                        : videoStatus.state === "inprogress"
                        ? `기본화질 인코딩 중 (${parseInt(
                            videoStatus.pctComplete
                          )}%)`
                        : videoStatus.state === "ready"
                        ? `고화질 인코딩 중 (${parseInt(
                            videoStatus.pctComplete
                          )}%)`
                        : "처리 완료"}
                    </Text>
                  </Flex>
                </Flex>
              </AspectRatio>
            </div>
          )}
          {isVideoReady === true && (
            <div style={{ height: "max-content" }}>
              {isLoaded || (
                <AspectRatio
                  ratio={528 / 297}
                  className="bg-gray-200"
                ></AspectRatio>
              )}

              <Stream
                src={videoId}
                controls={true}
                responsive={true}
                autoplay={autoPlay}
                muted={muted}
                startTime={startAt}
                onLoadStart={() => {
                  setIsLoaded(true);
                  setOnPlay(false);
                }}
                onPause={() => {
                  if (videoPlayState) {
                    const [_, setIsVideoPlay] = videoPlayState;
                    setIsVideoPlay(false);
                  }
                }}
                onPlaying={() => {
                  if (videoPlayState) {
                    const [_, setIsVideoPlay] = videoPlayState;
                    setIsVideoPlay(true);
                  }
                }}
                onPlay={async () => {
                  if (onPlay) return;
                  await axios
                    .post(
                      `${apiAddress}/analytics/view`,
                      {
                        id: clipId,
                      },
                      {
                        withCredentials: true,
                      }
                    )
                    .then(() => {
                      setOnPlay(true);
                    });
                }}
              ></Stream>
            </div>
          )}
        </>
      ) : (
        <AspectRatio ratio={528 / 297} className="bg-gray-200"></AspectRatio>
      )}
    </div>
  );
};
