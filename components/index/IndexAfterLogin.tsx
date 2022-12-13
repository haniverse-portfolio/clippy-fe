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
  SimpleGrid,
  Image,
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
import {
  recoil_sidebarOpened,
  recoil_followed,
  recoil_isLogined,
  recoil_loginUserInfo,
} from "../states";
// import Image from "next/image";
import { apiAddress } from "../constValues";
import axios from "axios";
import MainLayout from "../common/MainLayout";
import UserAside from "../aside/UserAside";
import LiveAside from "../aside/LiveAside";
import { Sidebar } from "../common/Sidebar";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import * as util from "../../util/util";
import VideoCard from "../common/VideoCard";

const BREAKPOINT = "@media (max-width: 755px)";

export const scale = keyframes({
  "from, to": { transform: "scale(0.7)" },
});

export function IndexAfterLogin() {
  const router = useRouter();

  const [isLogined, setIsLogined] = useRecoilState(recoil_isLogined);
  const [followed, setFollowed] = useRecoilState(recoil_followed);
  const [drawerOpened, setDrawerOpened] = useRecoilState(recoil_sidebarOpened);
  const [loginUserInfo, setLoginUserInfo] =
    useRecoilState(recoil_loginUserInfo);
  const [selectedMenu, setSelectedMenu] = useState("popular");

  const [hotclip, setHotclip] = useState([]);
  e;
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
        setFollowed(res.data.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getHotclip = (type = "popular") => {
    const url = `${apiAddress}/hotclip/${type}`;
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => {
        setHotclip(res.data.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUserInfo = () => {
    const url = `${apiAddress}/user/me`;
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => {
        setLoginUserInfo(res.data.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getHotclip();
    getUserInfo();
  }, []);

  return (
    <div>
      <Sidebar />
      <MainLayout
        aside={LiveAside}
        content={() => {
          return (
            <Container
              size="xl"
              sizes={{
                xs: 540,
                sm: 720,
                md: 960,
                lg: 1140,
                xl: 1500,
              }}
              mb={100}
            >
              <Stack mt={80}>
                <Text size={36} weight={300}>
                  Hot Clip
                </Text>
                <Group position="apart">
                  <Group>
                    <Button
                      h={58}
                      color="dark"
                      variant={
                        selectedMenu === "popular" ? "filled" : "outline"
                      }
                      radius={99}
                      px={20}
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                      onClick={() => {
                        setSelectedMenu("popular");
                        getHotclip("popular");
                      }}
                    >
                      인기
                    </Button>
                    <Button
                      h={58}
                      color="dark"
                      variant={selectedMenu === "new" ? "filled" : "outline"}
                      radius={99}
                      px={20}
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                      onClick={() => {
                        setSelectedMenu("new");
                        getHotclip("new");
                      }}
                    >
                      최근 업로드
                    </Button>
                  </Group>
                </Group>
              </Stack>
              <SimpleGrid
                cols={4}
                spacing={24}
                mt={40}
                breakpoints={[
                  { maxWidth: 1400, cols: 3, spacing: "md" },
                  { maxWidth: 980, cols: 2, spacing: "sm" },
                  { maxWidth: 600, cols: 1, spacing: "sm" },
                ]}
              >
                {hotclip.map((clip: any) => {
                  return <VideoCard key={clip.id} clip={clip} />;
                })}
              </SimpleGrid>
            </Container>
          );
        }}
      />
    </div>
  );
}
