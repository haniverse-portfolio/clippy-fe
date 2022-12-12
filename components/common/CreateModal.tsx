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
import { Paperclip } from "tabler-icons-react";
import {
  recoil_createModalIsLoading,
  recoil_createModalOpened,
  recoil_createModalStreamerInfo,
  recoil_videoInfo,
} from "../states";
import ReactPlayer from "react-player";
import axios from "axios";

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

  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);

  // useRef
  const playerRef = useRef<ReactPlayer>(null);

  // const []

  useEffect(() => {
    if (createModalOpened === false) setIsLoading(true);
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

          {/* <video
            poster={videoInfo.thumbnailUrl}
            controls
            autoPlay
            src={videoInfo.rawMediaUrl}
            preload="none"
            data-video="0"
          /> */}
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
            >
              클립 생성
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
};
