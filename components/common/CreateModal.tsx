import {
  Avatar,
  Button,
  Group,
  Modal,
  RangeSlider,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { Paperclip } from "tabler-icons-react";
import {
  recoil_createModalOpened,
  recoil_createModalStreamerName,
} from "../states";

export const CreateModal = () => {
  const [createModalOpened, setCreateModalOpened] = useRecoilState(
    recoil_createModalOpened
  );
  const [createModalStreamerName, setCreateModalStreamerName] = useRecoilState(
    recoil_createModalStreamerName
  );
  const [createModalClipName, setCreateModalClipName] = useState("");
  const [rangeValue, setRangeValue] = useState<[number, number]>([0, 10]);

  return (
    <Modal
      closeOnClickOutside={false}
      overflow="inside"
      className="h-full"
      size="xl"
      title={
        <Group>
          <Avatar src={null} size={32} radius="xl"></Avatar>
          <Text className="text-[20px]">
            <strong>{createModalStreamerName}</strong>의 클립 생성
          </Text>
        </Group>
      }
      withCloseButton={true}
      centered
      opened={createModalOpened}
      onClose={() => setCreateModalOpened(false)}
    >
      <Stack>
        <Stack className="my-[30px] w-[828px] h-[440px] bg-gray-300"></Stack>
        <RangeSlider
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
      </Stack>
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
    </Modal>
  );
};
