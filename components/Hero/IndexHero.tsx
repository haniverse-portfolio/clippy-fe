import {
  createStyles,
  Container,
  Text,
  Button,
  Group,
  keyframes,
  Badge,
} from "@mantine/core";
import { GithubIcon } from "@mantine/ds";
import { BrandTwitch, Scale } from "tabler-icons-react";
import { atom, useRecoilState } from "recoil";
import { isLogined } from "../states";
import Image from "next/image";
import { apiAddress } from "../constValues";

const BREAKPOINT = "@media (max-width: 755px)";

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

export function IndexHero() {
  const { classes } = useStyles();

  const [indexIsLogined, setIndexIsLogined] = useRecoilState(isLogined);

  return (
    <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        <h1 className={classes.title}>
          {" "}
          <Group>
            <Image alt="logo" src="/images/clip.svg" width={35} height={56} />
            <span
              className="bg-gradient-to-r text-transparent bg-clip-text from-indigo-500 via-purple-500 to-indigo-500 animate-text "
              // variant="gradient"
              // gradient={{ from: "violet", to: "grape" }}
            >
              CLIPPY
            </span>
            <Badge variant="filled" color="green" size="lg" radius="sm">
              Beta
            </Badge>
          </Group>
          <Text>클립생성 할 땐? 클리피!</Text>
        </h1>

        <Text className={classes.description} color="dimmed">
          끊김 없이 클립을 생성하고, 소중한 순간을 간직하세요
        </Text>

        <Group className={classes.controls}>
          {indexIsLogined ? (
            <Button color="red" onClick={goLogout}>
              로그아웃
            </Button>
          ) : (
            <Button
              onClick={goLogin}
              size="xl"
              className={classes.control}
              variant="gradient"
              gradient={{ from: "violet", to: "grape" }}
              leftIcon={<BrandTwitch size={20} />}
            >
              트위치로 로그인하기
            </Button>
          )}

          <Button
            component="a"
            href="https://github.com/mantinedev/mantine"
            size="xl"
            variant="default"
            className={classes.control}
            leftIcon={<GithubIcon size={20} />}
          >
            현우 집으로 들어가기
          </Button>
        </Group>
      </Container>
    </div>
  );
}
