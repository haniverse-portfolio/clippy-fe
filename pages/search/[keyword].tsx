import {
  Badge,
  Flex,
  Title,
  Text,
  Button,
  Card,
  Image,
  Grid,
  Group,
  TextInput,
  Stack,
  ActionIcon,
  Container,
  SimpleGrid,
  Center,
  Avatar,
  ScrollArea,
} from "@mantine/core";
import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { apiAddress } from "../../components/constValues";
import { Navbar } from "../../components/common/Navbar";
import { Login, Paperclip } from "tabler-icons-react";

import { useRouter } from "next/router";
import {
  mypageManage_sectionIndex,
  recoil_followed,
  recoil_isLogined,
  recoil_searchText,
  search_searchResult,
} from "../../components/states";
import Link from "next/link";

export default function Home() {
  /* ***** ***** ***** ***** ***** states ***** ***** ***** ***** ***** */
  const [isLogined, setIsLogined] = useRecoilState<boolean>(recoil_isLogined);
  const [followed, setFollowed] = useRecoilState(recoil_followed);
  const [sectionIndex, setSectionIndex] = useRecoilState(
    mypageManage_sectionIndex
  );
  const [searchResult, setSearchResult] = useRecoilState(search_searchResult);
  const [searchText, setSearchText] = useRecoilState(recoil_searchText);
  /* ***** ***** ***** ***** ***** states ***** ***** ***** ***** ***** */

  /* ***** ***** ***** ***** ***** function ***** ***** ***** ***** ***** */

  /* ***** ***** ***** ***** ***** function ***** ***** ***** ***** ***** */

  /* ***** ***** ***** ***** ***** axios call ***** ***** ***** ***** ***** */
  const checkLogin = () => {
    const url = `${apiAddress}/user/check`;
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLogined(true);
        console.log(res);
        getFollowed();
      })
      .catch((err) => {
        setIsLogined(false);
        console.log(err);
      });
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

  const getTwitchChannel = async (routerSearchText: string) => {
    // https://api.clippy.kr/extractor
    const url = apiAddress + `/search/channel?q=${routerSearchText}`;

    const res = await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        setSearchResult(res.data.data);
        return res.data;
      })
      .catch((res) => {
        const errMessage = res.response.data.message;

        // error 표시해주기
      });
  };
  /* ***** ***** ***** ***** ***** axios call ***** ***** ***** ***** ***** */

  /* ***** ***** ***** ***** ***** effect hook ***** ***** ***** ***** ***** */
  const router = useRouter();
  useEffect(() => {
    checkLogin();
    // getTwitchChannel(router.query.keyword as string);
  }, [router.isReady]);
  /* ***** ***** ***** ***** ***** effect hook ***** ***** ***** ***** ***** */
  return (
    <div>
      <Head>
        {/* <script src="https://kit.fontawesome.com/beb5b729ea.js" crossOrigin="anonymous"/> */}
        <title>CLIPPY</title>
        <meta name="description" content="CLIPPY" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Navbar />
        <div style={{ height: "calc(100vh - 120px)" }}>
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
                <strong>{router.query.keyword}</strong>에 대한 검색 결과
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
                    채널
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
              {searchResult.map((result: any, i) => {
                return (
                  <Card
                    className="animate-fadeUp"
                    p={0}
                    m={0}
                    key={i}
                    // onClick={() => {
                    //   window.location.href = `/create/${stream.user_login}`;
                    // }}
                  >
                    <Flex
                      className="h-[260px] border-2 rounded-xl"
                      justify="center"
                      direction="column"
                    >
                      <Center>
                        <Avatar
                          mt={32}
                          radius="xl"
                          size={98}
                          src={result.logo}
                          style={{ borderRadius: 99 }}
                        />
                      </Center>
                      <Center>
                        <Stack spacing={0}>
                          <Center>
                            <Text
                              size={16}
                              weight={700}
                              mt={16}
                              align="center"
                              style={{
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                width:
                                  "calc((100vw - 360px) / 4 - 24px - 60px)",
                                maxWidth: 280,
                              }}
                            >
                              {result.display_name}
                            </Text>
                          </Center>
                          <Container>
                            <Link href={`/channel/${result.display_name}`}>
                              <Button
                                onClick={() => {
                                  setSearchText("");
                                }}
                                mt={40}
                                mb={24}
                                leftIcon={<Login size={20} />}
                                h={58}
                                color="gray"
                                radius="xl"
                                px={20}
                                style={{
                                  height: "34px",
                                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                                  fontSize: 12,
                                  fontWeight: 700,
                                }}
                              >
                                채널 방문
                              </Button>
                            </Link>
                          </Container>
                        </Stack>
                      </Center>
                    </Flex>
                  </Card>
                );
              })}
            </SimpleGrid>
          </Container>
        </div>
      </main>
    </div>
  );
}

// throw new Error("Sentry Frontend Error");
