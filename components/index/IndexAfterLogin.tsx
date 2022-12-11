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
} from "../states";
import Image from "next/image";
import { apiAddress } from "../constValues";
import axios from "axios";
import MainLayout from "../common/MainLayout";
import UserAside from "../aside/UserAside";
import LiveAside from "../aside/LiveAside";
import { Sidebar } from "../common/Sidebar";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

const BREAKPOINT = "@media (max-width: 755px)";

export const scale = keyframes({
  "from, to": { transform: "scale(0.7)" },
});

export function IndexAfterLogin() {
  const [isLogined, setIsLogined] = useRecoilState(recoil_isLogined);
  const [followed, setFollowed] = useRecoilState(recoil_followed);
  const [drawerOpened, setDrawerOpened] = useRecoilState(recoil_sidebarOpened);

  const [hotclip, setHotclip] = useState([]);

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

  const getHotclip = () => {
    const url = "/api/hotclip";
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

  useEffect(() => {
    getHotclip();
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
                      radius={99}
                      px={20}
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                    >
                      인기
                    </Button>
                    <Button
                      h={58}
                      color="dark"
                      variant="outline"
                      radius={99}
                      px={20}
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
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
                  return (
                    <Card
                      p={0}
                      m={0}
                      key={clip.id}
                      // onClick={() => {
                      //   window.location.href = `/create/${stream.user_login}`;
                      // }}
                    >
                      <Flex justify="center" direction="column">
                        <div style={{ position: "relative" }}>
                          <div
                            style={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              height: 34,
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              zIndex: 1,
                              borderRadius: 99,
                            }}
                          >
                            <Flex h={34} align="center" px={16}>
                              <FontAwesomeIcon
                                icon={solid("eye")}
                                style={{
                                  width: 14,
                                  height: 12,
                                  color: "white",
                                  marginRight: 4,
                                }}
                              />
                              <Text
                                size={12}
                                weight={700}
                                color="white"
                                style={
                                  {
                                    // lineHeight: "34px",
                                    // padding: "0 15px",
                                  }
                                }
                              >
                                {Intl.NumberFormat("ko-KR").format(
                                  clip.viewCount
                                )}
                              </Text>
                            </Flex>
                          </div>
                        </div>
                        <Image
                          className="cursor-pointer rounded-md"
                          src={clip.imageURL}
                          alt="clip"
                          width={480}
                          height={320}
                        />
                        <Group position="apart">
                          <Stack spacing={0}>
                            <Text
                              size={16}
                              weight={700}
                              mt={5}
                              align="left"
                              style={{
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                width:
                                  "calc((100vw - 360px) / 4 - 24px - 60px)",
                                maxWidth: 280,
                              }}
                            >
                              {clip.title}
                            </Text>
                            <Text mt={5} align="left" size={14} weight={400}>
                              {clip.streamer.displayName}
                            </Text>
                            <Text mt={5} align="left">
                              <strong>
                                반응 {clip.commentCount + clip.likeCount} •{" "}
                              </strong>
                              14시간 전
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
              </SimpleGrid>
            </Container>
          );
        }}
      />
    </div>
  );
}
