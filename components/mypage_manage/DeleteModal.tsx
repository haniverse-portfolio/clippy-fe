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
import { Paperclip, Trash } from "tabler-icons-react";
import {
  mypageManage_deleteModalOpened,
  recoil_createModalIsLoading,
  recoil_createModalOpened,
  recoil_createModalStreamerInfo,
  recoil_deleteModalStep,
  recoil_videoInfo,
} from "../states";
import axios from "axios";

export const DeleteModal = () => {
  const [deleteModalOpened, setDeleteModalOpened] = useRecoilState(
    mypageManage_deleteModalOpened
  );
  const [step, setStep] = useRecoilState<number>(recoil_deleteModalStep);

  return (
    <Modal
      closeOnClickOutside={false}
      overflow="inside"
      className="h-full"
      size="xl"
      title="클립 삭제"
      withCloseButton={true}
      centered
      opened={deleteModalOpened}
      onClose={() => setDeleteModalOpened(false)}
    >
      {step === 0 ? (
        <Stack>
          <Text className="text-[20px]">
            <strong>총 3건</strong>의 클립을 정말 삭제하시겠습니까?
          </Text>
          <Button leftIcon={<Trash />} size="lg" color="dark" radius="xl">
            선택 클립 삭제
          </Button>
        </Stack>
      ) : (
        <></>
      )}
      {step === 1 ? (
        <Stack className="flex items-center justify-center h-[200px]">
          <Stack>
            <Center>
              <Loader color="violet" size="xl" />
            </Center>
            <p className="text-center text-xl text-gray-500 font-semibold">
              삭제하는 중...
            </p>
          </Stack>
        </Stack>
      ) : (
        <></>
      )}
      {step === 2 ? (
        <Stack className="flex items-center justify-center h-[200px]">
          <Stack>
            <Center>
              <Loader color="violet" size="xl" />
            </Center>
            <p className="text-center text-xl text-gray-500 font-semibold">
              삭제하는 중...
            </p>
          </Stack>
        </Stack>
      ) : (
        <></>
      )}
    </Modal>
  );
};
