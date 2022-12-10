import {
  createStyles,
  Container,
  Text,
  Button,
  Group,
  keyframes,
  Badge,
  Flex,
  Card,
  Stack,
  ActionIcon,
  Drawer,
  ThemeIcon,
} from "@mantine/core";
import { GithubIcon } from "@mantine/ds";
import {
  BrandTwitch,
  Heart,
  Menu2,
  Scale,
  Paperclip,
} from "tabler-icons-react";
import { atom, useRecoilState } from "recoil";
import { drawerOpened, followed, isLogined } from "../states";
import Image from "next/image";
import { apiAddress } from "../constValues";
import axios from "axios";
import { IndexDrawer } from "./IndexDrawer";

const BREAKPOINT = "@media (max-width: 755px)";

export const scale = keyframes({
  "from, to": { transform: "scale(0.7)" },
});

export function IndexAfterLogin() {
  const [indexIsLogined, setIndexIsLogined] = useRecoilState(isLogined);
  const [indexFollowed, setIndexFollowed] = useRecoilState(followed);
  const [indexDrawerOpened, setIndexDrawerOpened] =
    useRecoilState(drawerOpened);

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

  const getFollowed = () => {
    const url = `${apiAddress}/twitch/followed_streams`;
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => {
        setIndexFollowed(res.data.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <IndexDrawer />
      <p className="text-4xl">Hot clip</p>
      <Group position="apart">
        <Group>
          <Button size="lg" color="violet" radius="xl">
            인기
          </Button>
          <Button size="lg" variant="outline" color="dark" radius="xl">
            최근 업로드
          </Button>
        </Group>
        <Button
          leftIcon={<Paperclip></Paperclip>}
          size="lg"
          color="violet"
          radius="xl"
        >
          클립 생성
        </Button>
      </Group>
      <Flex align="center" justify="center" mt={30} dir="row" wrap="wrap">
        {indexFollowed.map((stream: any) => {
          return (
            <Card
              p="md"
              m="md"
              key={stream.id}
              // onClick={() => {
              //   window.location.href = `/create/${stream.user_login}`;
              // }}
            >
              <Flex justify="center" direction="column">
                <Image
                  className="cursor-pointer rounded-md"
                  src={stream.thumbnail_url
                    .replace("{width}", "1920")
                    .replace("{height}", "1080")}
                  alt="clip"
                  width={480}
                  height={320}
                />
                <Group position="apart">
                  <Stack spacing={0}>
                    <Text fz="xl" fw={700} mt={5} align="left">
                      {stream.user_name}
                    </Text>
                    <Text mt={5} align="left">
                      hello
                    </Text>
                    <Text mt={5} align="left">
                      <strong>반응 321 • </strong>14시간 전
                    </Text>
                  </Stack>
                  <ActionIcon variant="transparent" size={36}>
                    <Heart size={36} />
                  </ActionIcon>
                </Group>
              </Flex>
            </Card>
          );
        })}
      </Flex>
    </div>
  );
}
