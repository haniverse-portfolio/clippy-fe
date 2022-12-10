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
import { BrandTwitch, Heart, Menu2, Scale } from "tabler-icons-react";
import { atom, useRecoilState } from "recoil";
import { drawerOpened, followed, isLogined } from "../states";
import Image from "next/image";
import { apiAddress } from "../constValues";
import axios from "axios";

const BREAKPOINT = "@media (max-width: 755px)";

export const scale = keyframes({
  "from, to": { transform: "scale(0.7)" },
});

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    boxSizing: "border-box",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },

  inner: {
    position: "relative",
    paddingTop: 200,
    paddingBottom: 120,

    [BREAKPOINT]: {
      paddingBottom: 80,
      paddingTop: 80,
    },
  },

  title: {
    fontSize: 62,
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,

    [BREAKPOINT]: {
      fontSize: 42,
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: 24,

    [BREAKPOINT]: {
      fontSize: 18,
    },
  },

  controls: {
    // animation: `${scale} 3s ease-in-out`,
    marginTop: theme.spacing.xl * 2,

    [BREAKPOINT]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    height: 54,
    paddingLeft: 38,
    paddingRight: 38,

    [BREAKPOINT]: {
      height: 54,
      paddingLeft: 18,
      paddingRight: 18,
      flex: 1,
    },
  },
}));

export function IndexAfterLogin() {
  const { classes } = useStyles();

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
      <Drawer
        className="!p-0 !m-0"
        position="right"
        opened={indexDrawerOpened}
        onClose={() => setIndexDrawerOpened(false)}
        padding="xl"
        size="xl"
        withCloseButton={false}
      >
        <div className="flex justify-between h-[120px] bg-white sticky top-0 z-50 shadow-sm">
          <Group position="apart">
            <Group>
              <Image alt="logo" src="/images/clip.svg" width={30} height={48} />
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
            <ThemeIcon size={48} variant="outline" color="dark">
              <Menu2
                size={48}
                onClick={() => {
                  setIndexDrawerOpened(false);
                }}
              />
            </ThemeIcon>
          </Group>
        </div>
      </Drawer>
      <p className="text-4xl">Hot clip</p>
      <Button size="lg" color="violet" radius="xl">
        인기
      </Button>
      <Button size="lg" variant="outline" color="dark" radius="xl">
        최근 업로드
      </Button>
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
