import { Stream } from "@cloudflare/stream-react";
import { Flex, Loader, Skeleton, Text } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { apiAddress } from "../constValues";

export const CloudflareVideo = ({
  videoId,
  clipId,
  creating,
  videoPlayState,
}: any) => {
  console.log(videoId);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [onPlay, setOnPlay] = useState<boolean>(false);
  const [videoStatus, setVideoStatus] = useState<any>({
    state: "queued",
  });

  const [videoCreating, setVideoCreating] = useState<boolean>(creating);

  const checkStatus = async () => {
    const res = await axios
      .get(`${apiAddress}/clip/${clipId}/status`)
      .then((res) => {
        console.log(res.data.data.result.status);
        const status = res.data.data.result.status;
        setVideoStatus(status);

        if (status.state === "ready") {
          setVideoCreating(false);
          setIsLoaded(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!videoCreating) return;

    const interval: any = setInterval(() => checkStatus(), 1000);

    return () => clearInterval(interval);
  }, [videoCreating]);

  return (
    <div style={{ width: "100%", height: "max-content" }}>
      {videoId !== "" ? (
        videoCreating ? (
          <div style={{ height: "max-content" }}>
            <Flex
              align="center"
              direction="column"
              justify="space-evenly"
              h="100%"
            >
              <Loader size="lg" />
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
                    ? `고화질 인코딩 중 (${parseInt(videoStatus.pctComplete)}%)`
                    : "처리 완료"}
                </Text>
              </Flex>
            </Flex>
          </div>
        ) : (
          <div style={{ height: "max-content" }}>
            {isLoaded || <Skeleton width="100%" height={460}></Skeleton>}

            <Stream
              src={videoId}
              controls={true}
              responsive={true}
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
        )
      ) : (
        <Skeleton width="100%" height={460}></Skeleton>
      )}
    </div>
  );
};
