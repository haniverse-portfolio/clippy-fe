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
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Paperclip } from "tabler-icons-react";
import {
  recoil_createModalIsLoading,
  recoil_createModalOpened,
  recoil_createModalStreamerInfo,
  recoil_videoInfo,
} from "../states";
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
  const [isLoading, setIsLoading] = useRecoilState<boolean>(
    recoil_createModalIsLoading
  );

  useEffect(() => {
    if (createModalOpened === false) setIsLoading(true);
  }, [createModalOpened]);

  return (
    <Modal
      closeOnClickOutside={false}
      overflow="inside"
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
          <video
            poster={videoInfo.thumbnailUrl}
            controls
            autoPlay
            src={videoInfo.rawMediaUrl}
            preload="none"
            data-video="0"
          />
          {/* <Stack className="my-[30px] w-[828px] h-[440px] bg-gray-300"></Stack> */}
          <RangeSlider
            mt={42}
            value={rangeValue}
            onChange={setRangeValue}
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
