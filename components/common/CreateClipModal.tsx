import {
  Avatar,
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Modal,
  RangeSlider,
  Text,
  TextInput,
} from "@mantine/core";
import { FC, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  common_createClipModal_error,
  common_createClipModal_isClipInitDone,
  common_createClipModal_isClipInitLoading,
  common_createClipModal_liveVideoInfo,
  common_createClipModal_streamer,
} from "../states";
import { CircleX, DotsVertical, Paperclip } from "tabler-icons-react";
import ReactPlayer from "react-player";
import { apiAddress } from "../constValues";
import axios from "axios";
import { useRouter } from "next/router";
import { useCreateClipModal } from "../../hooks/useCreateClipModal";
import { useInterval } from "../../hooks/useInterval";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

const CreateClipModalTitle: FC = () => {
  const streamerInfo = useRecoilValue(common_createClipModal_streamer);

  return (
    <Group>
      <Avatar size={32} radius="xl" src={streamerInfo?.image} />
      <Text>
        <strong>{streamerInfo?.name}</strong>의 클립 생성
      </Text>
    </Group>
  );
};

const CreateClipModalInitLoading: FC = () => {
  const isLoading = useRecoilValue(common_createClipModal_isClipInitLoading);
  const [isLoadingDone, setIsLoadingDone] = useRecoilState(
    common_createClipModal_isClipInitDone
  );
  const liveVideoInfo = useRecoilValue(common_createClipModal_liveVideoInfo);
  const error = useRecoilValue(common_createClipModal_error);

  const [progressValue, setProgressValue] = useState(0);
  const [intervalDelay, setIntervalDelay] = useState<number | null>(55);

  useEffect(() => {
    if (isLoadingDone || error) {
      setIntervalDelay(null);
      setProgressValue(0);
    } else {
      setProgressValue(0);
      setIntervalDelay(55);
    }
  }, [isLoadingDone, error]);

  useEffect(() => {
    if (!isLoading) {
      setProgressValue(() => 55);
      setTimeout(() => {
        setIsLoadingDone(true);
      }, 1000);
    }
  }, [isLoading]);

  useInterval(() => {
    setProgressValue((state) =>
      state === 100 ? 100 : state >= 99.8 ? 99.8 : state + 0.6
    );
  }, intervalDelay);

  return (
    <>
      {!isLoadingDone && !liveVideoInfo && !error && (
        <div className="w-full h-[600px] flex flex-col justify-center items-center p-20">
          <p className="text-center text-xl text-gray-500 font-semibold mt-[-20px] mb-10">
            영상을 불러오는 중...
          </p>
          <div className="w-full flex justify-between items-center gap-3">
            <div className="relative w-full h-[6px] rounded-[3px] bg-gray-200 block">
              <div
                className="h-[6px] rounded-[3px] bg-purple-500 block duration-200"
                style={{ width: `${progressValue}%` }}
              ></div>
            </div>
            <div className="text-right w-[40px] mt-[-.15em] text-gray-500 whitespace-nowrap">
              {progressValue.toFixed(1)}%
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CreateClipModalError: FC = () => {
  const streamerInfo = useRecoilValue(common_createClipModal_streamer);
  const error = useRecoilValue(common_createClipModal_error);
  const { retryCreateClip } = useCreateClipModal();

  return (
    <>
      {error && (
        <Stack className="flex items-center justify-center h-[600px]">
          <Stack>
            <Center>
              <CircleX size={48} color="red" />
            </Center>
            <p className="text-center text-xl text-gray-500 font-semibold">
              {error.msg}
            </p>
            {error.statusCode === 500 && (
              <Center mt={30}>
                <Button
                  w={70}
                  h={48}
                  color="dark"
                  variant="outline"
                  radius={99}
                  px={20}
                  onClick={() => retryCreateClip(streamerInfo?.id as number)}
                >
                  <FontAwesomeIcon
                    icon={solid("rotate-right")}
                    color="#000"
                    height="24px"
                  />
                </Button>
              </Center>
            )}
          </Stack>
        </Stack>
      )}
    </>
  );
};

const CreateClipModalEditor: FC = () => {
  const isLoadingDone = useRecoilValue(common_createClipModal_isClipInitDone);
  const error = useRecoilValue(common_createClipModal_error);
  const liveVideoInfo = useRecoilValue(common_createClipModal_liveVideoInfo);

  const [isCreateClipBtnLoading, setIsCreateClipBtnLoading] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [clipRangeValue, setClipRangeValue] = useState<[number, number]>([
    0, 10,
  ]);
  const [createModalClipName, setCreateModalClipName] = useState("");

  const videoPlayerRef = useRef<ReactPlayer>(null);

  const router = useRouter();

  const { closeCreateClipModal } = useCreateClipModal();

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoPlayerRef.current) {
        setCurrentVideoTime(videoPlayerRef.current.getCurrentTime());
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.seekTo(clipRangeValue[0]);
    }
  }, [clipRangeValue]);

  useEffect(() => {
    // 현재 비디오 시간이 rangeValue 범위를 벗어나면 범위로 돌아옴
    if (
      videoPlayerRef.current &&
      (currentVideoTime < clipRangeValue[0] ||
        currentVideoTime > clipRangeValue[1])
    ) {
      videoPlayerRef.current.seekTo(clipRangeValue[0]);
    }
  }, [currentVideoTime]);

  const triggerCreateClip = async (clip: ICreateClipInfo) => {
    setIsCreateClipBtnLoading(true);
    await axios
      .post(`${apiAddress}/clip`, clip, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        setIsCreateClipBtnLoading(false);
        closeCreateClipModal();
        router.push(`/clip/${res.data.data.key}?creating=true`);
      })
      .catch((res) => {
        const errMessage = res.response.data.message;
        alert(errMessage);
        setIsCreateClipBtnLoading(false);
      });
  };

  return (
    <>
      {isLoadingDone && liveVideoInfo && !error && (
        <Stack className="h-[600px] w-full">
          <ReactPlayer
            ref={videoPlayerRef}
            url={liveVideoInfo.rawMediaUrl}
            width="100%"
            height="100%"
            playing
            controls
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload",
                },
              },
            }}
            onDuration={(duration: any) => {
              setVideoDuration(parseInt(duration));
              setClipRangeValue([60, parseInt(duration)]);
            }}
          />

          <RangeSlider
            mx={15}
            thumbChildren={<DotsVertical />}
            thumbSize={26}
            styles={{ thumb: { borderWidth: 2, padding: 3 } }}
            mt={42}
            value={clipRangeValue}
            max={videoDuration}
            min={0}
            maxRange={60}
            onChange={(value) => {
              setClipRangeValue(value);
            }}
            labelAlwaysOn
            color="violet"
          />
          <TextInput
            value={createModalClipName}
            onChange={(event) => {
              setCreateModalClipName(
                event.currentTarget.value.replace(/　/g, "")
              );
            }}
            size="md"
            placeholder="클립 제목"
            className="mb-[38px]"
          />
          <Group position="right">
            <Button
              className={
                createModalClipName === "" ? "hover:cursor-not-allowed" : ""
              }
              disabled={createModalClipName.trim() === ""}
              leftIcon={<Paperclip />}
              size="lg"
              color="dark"
              radius="xl"
              loading={isCreateClipBtnLoading}
              onClick={() => {
                triggerCreateClip({
                  requestId: liveVideoInfo.requestId,
                  starts: clipRangeValue[0],
                  ends: clipRangeValue[1],
                  title: createModalClipName,
                });
              }}
            >
              클립 생성
            </Button>
          </Group>
        </Stack>
      )}
    </>
  );
};

export const CreateClipModal: FC = () => {
  const { isCreateClipModalOpen, closeCreateClipModal } = useCreateClipModal();

  return (
    <Modal
      closeOnClickOutside={false}
      size="xl"
      title={<CreateClipModalTitle />}
      withCloseButton
      centered
      opened={isCreateClipModalOpen}
      onClose={closeCreateClipModal}
    >
      <div className="h-[650px]">
        <CreateClipModalInitLoading />
        <CreateClipModalEditor />
        <CreateClipModalError />
      </div>
    </Modal>
  );
};
