import {
  Button,
  Center,
  Loader,
  Modal,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { Trash } from "tabler-icons-react";
import {
  mypageManage_deleteModalOpened,
  mypageManage_madeClip,
  common_deleteModalStep,
  common_deleteTargetClips,
  common_mypageManageReloadTrigger,
} from "../states";
import axios, { AxiosResponse } from "axios";
import { MypageTableRow } from "./MypageTableRow";
import { apiAddress } from "../constValues";

export const DeleteModal = () => {
  const [deleteModalOpened, setDeleteModalOpened] = useRecoilState(
    mypageManage_deleteModalOpened
  );
  const [deleteTargetClips, setDeleteTargetClips] = useRecoilState(
    common_deleteTargetClips
  );
  const [mypageMadeClip, setMypageMadeClip] = useRecoilState(
    mypageManage_madeClip
  );
  const [isReloadTriggered, setIsReloadTriggered] = useRecoilState(
    common_mypageManageReloadTrigger
  );
  const [step, setStep] = useRecoilState<number>(common_deleteModalStep);

  useEffect(() => {
    if (step === 0 && deleteTargetClips.length <= 0) {
      setDeleteModalOpened(false);
    } else if (step === 1) {
      const deleteReqs: Promise<AxiosResponse<any, any>>[] = [];
      for (const clipId of deleteTargetClips) {
        deleteReqs.push(
          axios.delete(`${apiAddress}/clip/${clipId}`, {
            withCredentials: true,
          })
        );
      }
      Promise.all(deleteReqs).then(() => {
        setStep(2);
      });
    } else if (step === 2) {
      setStep(0);
      showNotification({
        title: "클립 삭제 완료",
        message: `총 ${deleteTargetClips.length}개의 클립이 삭제되었습니다.`,
      });
      setDeleteTargetClips([]);
      setIsReloadTriggered(true);
      setDeleteModalOpened(false);
    }
  }, [step]);

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
      onClose={() => {
        if (step !== 1) {
          setStep(0);
          setDeleteModalOpened(false);
        } else setDeleteModalOpened(true);
      }}
    >
      {step === 0 && (
        <Stack>
          <Text className="text-[20px]">
            <strong>총 {deleteTargetClips.length}개</strong>의 클립을 정말
            삭제하시겠습니까?
          </Text>
          <ScrollArea style={{ height: "calc(100vh - 400px)" }}>
            {mypageMadeClip
              .filter((x) => deleteTargetClips.includes(x.clipId))
              .map((cur, i) => {
                return (
                  <MypageTableRow
                    key={i}
                    title={cur.info}
                    clipId={cur.clipId}
                    imageURL={cur.thumbnail}
                    channel={cur.channel}
                    channelName={cur.channelName}
                    date={cur.date}
                    views={cur.views}
                    disableDelete={true}
                  />
                );
              })}
          </ScrollArea>
          <Button
            onClick={() => setStep(1)}
            leftIcon={<Trash />}
            size="lg"
            color="dark"
            radius="xl"
          >
            선택 클립 삭제
          </Button>
        </Stack>
      )}
      {step === 1 && (
        <Stack
          className="flex items-center justify-center w-full"
          style={{ height: "calc(100vh - 280px)" }}
        >
          <Stack>
            <Center>
              <Loader color="violet" size="xl" />
            </Center>
            <p className="text-center text-xl text-gray-500 font-semibold">
              삭제하는 중...
            </p>
          </Stack>
        </Stack>
      )}
    </Modal>
  );
};
