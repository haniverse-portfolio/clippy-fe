import {
  Flex,
  Text,
  Button,
  Card,
  Group,
  Stack,
  Container,
  SimpleGrid,
  Center,
  Avatar,
  ScrollArea,
} from "@mantine/core";
import Head from "next/head";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { apiAddress } from "../../components/constValues";
import { Navbar } from "../../components/common/Navbar";
import { Login } from "tabler-icons-react";
import { useRouter } from "next/router";
import {
  common_searchText,
  search_searchResult,
} from "../../components/states";
import Link from "next/link";
import { useTailwindResponsive } from "../../hooks/useTailwindResponsive";
import { Sidebar } from "../../components/common/Sidebar";
import MainLayout from "../../components/common/MainLayout";

export default function Home() {
  const [searchResult, setSearchResult] = useRecoilState(search_searchResult);
  const [searchText, setSearchText] = useRecoilState(common_searchText);

  const { isSm } = useTailwindResponsive();
  const searchHeaderDivRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const getTwitchChannel = async (routerSearchText: string) => {
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

  useEffect(() => {
    getTwitchChannel(router.query.keyword as string);
  }, [router.isReady]);

  return (
    <div>
      <Head>
        <title>CLIPPY</title>
        <meta name="description" content="CLIPPY" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />
      <Navbar />
      <MainLayout
        content={() => (
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
            <Stack ref={searchHeaderDivRef} mt={80}>
              <div className="text-2xl md:text-3xl lg:text-4xl font-light">
                <strong>{router.query.keyword}</strong>에 대한 검색 결과
              </div>
              <Group position="apart">
                <Group>
                  <Button
                    h={isSm ? 48 : 58}
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
              mt={40}
              cols={4}
              spacing={24}
              p={9}
              breakpoints={[
                { maxWidth: 1400, cols: 3, spacing: "md" },
                { maxWidth: 980, cols: 2, spacing: "sm" },
                { maxWidth: 600, cols: 1, spacing: "sm" },
              ]}
            >
              {searchResult.map((result: any, i) => {
                return (
                  <Card
                    className="animate-fadeUp transition ease-in-out hover:scale-105"
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
                                width: "100%",
                                maxWidth: 280,
                              }}
                            >
                              {result.display_name}
                            </Text>
                          </Center>
                          <Container>
                            <Link href={`/channel/${result.name}`}>
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
        )}
      />
    </div>
  );
}
