import {
  Avatar,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  RangeSlider,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect, useState, useRef } from "react";
import { useRecoilState } from "recoil";
import { CircleX, Paperclip } from "tabler-icons-react";
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
  recoil_videoInfo,
} from "../states";
import ReactPlayer from "react-player";
import axios from "axios";
import { apiAddress } from "../constValues";
import { useRouter } from "next/router";

export const CreateModal = () => {
  interface videoType {
    thumbnailUrl: string;
    rawMediaUrl: string;
    clip: {
      clipId: string;
      editUrl: string;
    };
  }

  const [createModalOpened, setCreateModalOpened] = useRecoilState(
    recoil_createModalOpened
  );
  const [createModalStreamerInfo, setCreateModalStreamerInfo] = useRecoilState(
    recoil_createModalStreamerInfo
  );
  const [videoInfo, setVideoInfo] = useRecoilState(recoil_videoInfo);
  const [createModalClipName, setCreateModalClipName] = useState<string>("");
  const [rangeValue, setRangeValue] = useState<[number, number]>([0, 10]);
  const [startRangeValue, setStartRangeValue] = useState<number>(0);
  const [endRangeValue, setEndRangeValue] = useState<number>(10);
  const [isLoading, setIsLoading] = useRecoilState<boolean>(
    recoil_createModalIsLoading
  );
  const [isLoadingError, setIsLoadingError] = useRecoilState<boolean>(
    recoil_createModalIsLoadingError
  );
  const [isLoadingErrorMessage, setIsLoadingErrorMessage] =
    useRecoilState<string>(recoil_createModalIsLoadingErrorMessage);

  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);
  const [createBtnLoading, setCreateBtnLoading] = useRecoilState<boolean>(
    recoil_createBtnLoading
  );

  const router = useRouter();

  const triggerCreateClip = async (clip: clipType) => {
    setCreateBtnLoading(true);
    // https://api.clippy.kr/clip
    const url = apiAddress + "/clip";
    const res = await axios
      .post(url, clip, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        setCreateBtnLoading(false);
        setCreateModalOpened(false);
        router.push(`/clip/${res.data.data.key}?creating=true`);
        return res.data;
      })
      .catch((res) => {
        const errMessage = res.response.data.message;
        // if (errMessage.includes("아직 원본 클립 처리가 완료되지 않았습니다.")) {
        //   setCreateBtnLoading(false);
        //   setCreateModalOpened(false);
        //   router.push(`/clip/${videoInfo.requestId}?creating=true`);
        // } else {
        // error 표시해주기
        alert(errMessage);
        setCreateBtnLoading(false);
        // }
      });
  };
  // useRef
  const playerRef = useRef<ReactPlayer>(null);

  // const []

  useEffect(() => {
    if (createModalOpened === false) {
      setIsLoading(true);
      setIsLoadingError(false);
      setIsLoadingErrorMessage("errMessage");
    }
  }, [createModalOpened]);

  useEffect(() => {
    // 시작시간이 바뀌면 video를 시작초부터 재생
  }, [rangeValue]);

  useEffect(() => {
    // 시작시간이 바뀌면 video를 시작초부터 재생
    if (playerRef.current !== null) {
      playerRef.current.seekTo(startRangeValue);
    }
  }, [startRangeValue]);

  useEffect(() => {
    // 0.5초마다 현재 비디오 시간을 가져옴
    const interval = setInterval(() => {
      if (playerRef.current !== null) {
        setCurrentVideoTime(playerRef.current.getCurrentTime());
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // 현재 비디오 시간이 rangeValue 범위를 벗어나면 범위로 돌아옴
    if (currentVideoTime < startRangeValue) {
      playerRef.current?.seekTo(startRangeValue);
    } else if (currentVideoTime > endRangeValue) {
      playerRef.current?.seekTo(startRangeValue);
    }
  }, [currentVideoTime]);

  return (
    <Modal
      closeOnClickOutside={false}
      // overflow="inside"
      className="h-full"
      size="xl"
      title={
        <Group>
          <Avatar
            src={createModalStreamerInfo.image}
            size={32}
            radius="xl"
          ></Avatar>
          <Text className="text-[20px]">
            <strong>{createModalStreamerInfo.name}</strong>의 클립 생성
          </Text>
        </Group>
      }
      withCloseButton={true}
      centered
      opened={createModalOpened}
      onClose={() => setCreateModalOpened(false)}
    >
      {isLoading === true ? (
        isLoadingError ? (
          <Stack className="flex items-center justify-center h-[600px]">
            <Stack>
              <Center>
                <CircleX size={48} color="red" />
              </Center>
              <p className="text-center text-xl text-gray-500 font-semibold">
                {isLoadingErrorMessage}
              </p>
            </Stack>
          </Stack>
        ) : (
          <Stack className="flex items-center justify-center h-[600px]">
            <Stack>
              <Center>
                <Loader color="violet" size="xl" />
              </Center>
              <p className="text-center text-xl text-gray-500 font-semibold">
                영상을 불러오는 중...
              </p>
            </Stack>
          </Stack>
        )
      ) : (
        <Stack className="h-[600px] w-full">
          <ReactPlayer
            ref={playerRef}
            url={videoInfo.rawMediaUrl}
            controls
            width="100%"
            height="100%"
            playing={true}
            onDuration={(duration: any) => {
              setVideoDuration(parseInt(duration));
              setRangeValue([60, parseInt(duration)]);
              setStartRangeValue(60);
              setEndRangeValue(parseInt(duration));
            }}
          />

          {/* <Stack className="my-[30px] w-[828px] h-[440px] bg-gray-300"></Stack> */}
          <RangeSlider
            mt={42}
            value={rangeValue}
            max={videoDuration}
            min={0}
            maxRange={60}
            onChange={(value) => {
              setRangeValue(value);
              setStartRangeValue(value[0]);
              setEndRangeValue(value[1]);
            }}
            labelAlwaysOn
            color="violet"
          />
          <TextInput
            value={createModalClipName}
            onChange={(event) => {
              setCreateModalClipName(event.currentTarget.value);
            }}
            size="md"
            placeholder="클립 제목"
            className="mb-[38px]"
          ></TextInput>
          <Group position="right">
            <Button
              className={
                createModalClipName === "" ? "hover:cursor-not-allowed" : ""
              }
              disabled={createModalClipName === ""}
              leftIcon={<Paperclip />}
              size="lg"
              color="dark"
              radius="xl"
              loading={createBtnLoading}
              onClick={() => {
                setCreateBtnLoading(true);
                triggerCreateClip({
                  requestId: videoInfo.requestId,
                  starts: startRangeValue,
                  ends: endRangeValue,
                  title: createModalClipName,
                });
              }}
            >
              클립 생성
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
};
