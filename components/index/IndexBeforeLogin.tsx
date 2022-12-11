import {
  createStyles,
  Container,
  Text,
  Button,
  Group,
  keyframes,
  Badge,
  Flex,
} from "@mantine/core";
import { GithubIcon } from "@mantine/ds";
import { BrandTwitch, Scale } from "tabler-icons-react";
import { atom, useRecoilState } from "recoil";
import { recoil_isLogined } from "../states";
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

const FooterMain = () => {
  return (
    <div className="p-[50px] w-[100vw]">
      <Text align="right">© CLIPPY 2022. MADE IN SEOUL</Text>
    </div>
  );
};

export function IndexBeforeLogin() {
  const { classes } = useStyles();

  const [isLogined, setIsLogined] = useRecoilState(recoil_isLogined);

  return (
    <Flex
      align="center"
      justify="space-between"
      direction="column"
      style={{ height: "calc(100vh - 120px)" }}
    >
      <Flex justify="center" style={{ flex: 1 }}>
        <Flex direction="column" align="center" justify="center">
          <Text size={64} weight={300}>
            클립생성 할 땐? 클리피!
          </Text>
          <Button
            mt={40}
            style={{
              backgroundColor: "black",
              color: "white",
              fontWeight: 700,
              fontSize: 24,
              padding: "24px 40px",
              width: 218,
              height: 84,
              borderRadius: 99,
              boxShadow: "0px 4px 15px rgba(119, 119, 119, 0.25)",
            }}
            onClick={goLogin}
          >
            트위치 로그인
          </Button>
        </Flex>
      </Flex>
      <FooterMain />
    </Flex>
  );
}
