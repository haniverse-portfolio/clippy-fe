import {
  createStyles,
  Container,
  Text,
  Button,
  Group,
  keyframes,
  Badge,
  TextInput,
  Grid,
  Avatar,
  Flex,
  ThemeIcon,
} from "@mantine/core";
import { useRecoilState } from "recoil";
import { recoil_drawerOpened, recoil_isLogined } from "../states";
import Image from "next/image";
import { apiAddress } from "../constValues";
import { IconAt } from "@tabler/icons";
import { CircleX, Paperclip, Search } from "tabler-icons-react";

const goLogin = () => {
  // use authorization code grant flow
  const clientId = "9n3ebjaenen1jipslsk11ufrcfo51t";
  // api.clippy.kr
  const redirectUri = `${apiAddress}/user/login`;
  const url = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=clips:edit+user:read:follows`;

  window.location.href = url;
};

const goLogout = () => {
  const url = `${apiAddress}/user/logout`;
  window.location.href = url;
};

export function Navbar() {
  const [isLogined, setIsLogined] = useRecoilState(recoil_isLogined);
  const [drawerOpened, setDrawerOpened] = useRecoilState(recoil_drawerOpened);

  return (
    <div className="h-[120px] bg-white sticky top-0 z-50 shadow-sm">
      <Group className="p-[36px]" position="apart">
        <Group>
          <ThemeIcon size={48} variant="default" color="dark">
            <Paperclip size={48}></Paperclip>
          </ThemeIcon>
          <span
            className="text-5xl font-extrabold bg-gradient-to-r text-transparent bg-clip-text from-indigo-500 via-purple-500 to-indigo-500 animate-text "
            // variant="gradient"
            // gradient={{ from: "violet", to: "grape" }}
          >
            CLIPPY
          </span>
          <Badge variant="filled" color="green" size="lg" radius="sm">
            Beta
          </Badge>
        </Group>
        <Group>
          <TextInput
            size="lg"
            radius="xl"
            placeholder="닉네임, 제목 키워드"
            icon={<Search size={28} />}
            rightSection={<CircleX color="gray" size="xs" />}
          />
          <Avatar
            onClick={() => {
              setDrawerOpened(true);
            }}
            radius="xl"
            size="lg"
            src={null}
          />
        </Group>
      </Group>
    </div>
  );
}
