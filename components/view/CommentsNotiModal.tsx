import { Button, Center, Loader, Modal, Stack, Text } from "@mantine/core";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Ban, CircleCheck, CircleX, Trash } from "tabler-icons-react";
import {
  view_notiModalOpened,
  view_notiModalStep,
  view_actionType,
  view_axiosProgressed,
} from "../states";

export const CommentsNotiModal = () => {
  const actionText = ["신고", "삭제"];

  const [notiModalStep, setNotiModalStep] = useRecoilState(view_notiModalStep);
  const [notiModalOpened, setNotiModalOpened] =
    useRecoilState(view_notiModalOpened);
  const actionType = useRecoilValue(view_actionType);
  const setAxiosProgressed = useSetRecoilState(view_axiosProgressed);

  useEffect(() => {
    setTimeout(() => {
      if (notiModalStep === 2 || notiModalStep === 3) setNotiModalOpened(false);
    }, 1000);
  }, [notiModalStep]);

  useEffect(() => {
    if (notiModalOpened === false)
      setTimeout(() => {
        setNotiModalStep(0);
      }, 100);
  }, [notiModalOpened]);

  return (
    <Modal
      overflow="inside"
      className="h-full"
      size="md"
      title={<strong>{`댓글 ${actionText[actionType]}`}</strong>}
      withCloseButton={true}
      centered
      opened={notiModalOpened}
      onClose={() => {
        setNotiModalOpened(false);
      }}
    >
      {notiModalStep === 0 && (
        <Stack>
          <Text className="text-[20px]">{`댓글을 정말 ${actionText[actionType]}하시겠습니까?`}</Text>
          <Button
            mx={60}
            onClick={() => {
              setNotiModalStep(1);
              setAxiosProgressed(true);
            }}
            leftIcon={actionType === 0 ? <Ban /> : <Trash />}
            size="lg"
            color="dark"
            radius="xl"
          >
            {`댓글 ${actionText[actionType]}`}
          </Button>
        </Stack>
      )}
      {notiModalStep === 1 && (
        <Stack className="flex items-center justify-center w-full">
          <Stack>
            <Center>
              <Loader color="violet" size="lg" />
            </Center>
            <p className="text-center text-xl text-gray-500 font-semibold">
              {`댓글 ${actionText[actionType]}하는 중...`}
            </p>
          </Stack>
        </Stack>
      )}
      {/* success */}
      {notiModalStep === 2 && (
        <Stack className="flex items-center justify-center w-full">
          <Stack>
            <Center>
              <CircleCheck size={48} color="green" />
            </Center>
            <p className="text-center text-xl text-gray-500 font-semibold">
              {`댓글이 ${actionText[actionType]}되었습니다.`}
            </p>
          </Stack>
        </Stack>
      )}
      {/* error */}
      {notiModalStep === 3 && (
        <Stack className="flex items-center justify-center w-full">
          <Stack>
            <Center>
              <CircleX size={48} color="red" />
            </Center>
            <p className="text-center text-xl text-gray-500 font-semibold">
              {`${actionText[actionType]}에 실패 했습니다. 다시 시도해 주세요`}
            </p>
          </Stack>
        </Stack>
      )}
    </Modal>
  );
};
