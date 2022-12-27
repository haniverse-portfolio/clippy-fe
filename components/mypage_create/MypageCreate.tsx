import {
  Container,
  Text,
  Stack,
  SimpleGrid,
  Flex,
  Button,
  Group,
  Loader,
} from "@mantine/core";
import MainLayout from "../common/MainLayout";
import UserAside from "../aside/UserAside";
import { Sidebar } from "../common/Sidebar";
import { useEffect, useState } from "react";
import LiveCard from "../common/LiveCard";
import { getDefaultLiveStreamer, getFollowedStreamer } from "../../util/clippy";

export function MypageCreate() {
  const [followedLiveStreamer, setFollowedLiveStreamer] = useState<
    ILiveStreamerInfo[] | null
  >(null);
  const [defaultLiveStreamer, setDefaultLiveStreamer] = useState<
    ILiveStreamerInfo[] | null
  >(null);
  const [selectedTab, setSelectedTab] = useState<"followed" | "default">(
    "followed"
  );

  useEffect(() => {
    getFollowedStreamer().then((res) => {
      setFollowedLiveStreamer(res);
    });
    getDefaultLiveStreamer().then((res) => {
      setDefaultLiveStreamer(res);
    });
  }, []);

  return (
    <div>
      <Sidebar />
      <MainLayout
        aside={UserAside}
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
              <Stack mt={40}>
                <Text size={36} weight={300}>
                  클립 생성
                </Text>
                <Group position="apart" className="relative">
                  <Flex
                    justify="flex-start"
                    align="center"
                    gap="xs"
                    style={{
                      maxWidth: "calc(100% - 80px)",
                      overflowY: "hidden",
                      overflowX: "auto",
                    }}
                  >
                    <Button
                      h={48}
                      color="dark"
                      variant={
                        selectedTab === "followed" ? "filled" : "outline"
                      }
                      radius={99}
                      px={20}
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                      onClick={() => setSelectedTab("followed")}
                    >
                      팔로우한 스트리머
                    </Button>
                    <Button
                      h={48}
                      color="dark"
                      variant={selectedTab === "default" ? "filled" : "outline"}
                      radius={99}
                      px={20}
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                      onClick={() => setSelectedTab("default")}
                    >
                      추천 스트리머
                    </Button>
                  </Flex>
                </Group>
              </Stack>
              {selectedTab === "followed" && (
                <>
                  {followedLiveStreamer === null ? (
                    <div className="w-full h-[300px] flex flex-col gap-4 justify-center items-center text-2xl font-bold">
                      <Loader color="violet" />
                      <div>스트리머 목록 로딩중</div>
                    </div>
                  ) : followedLiveStreamer.length <= 0 ? (
                    <div className="w-full h-[300px] flex justify-center items-center text-2xl font-bold">
                      라이브 중인 팔로우 스트리머가 없어요
                    </div>
                  ) : (
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
                      {followedLiveStreamer.map((stream) => {
                        return <LiveCard key={stream.id} stream={stream} />;
                      })}
                    </SimpleGrid>
                  )}
                </>
              )}
              {selectedTab === "default" && (
                <>
                  {defaultLiveStreamer === null ? (
                    <div className="w-full h-[300px] flex flex-col gap-4 justify-center items-center text-2xl font-bold">
                      <Loader color="violet" />
                      <div>스트리머 목록 로딩중</div>
                    </div>
                  ) : defaultLiveStreamer.length <= 0 ? (
                    <div className="w-full h-[300px] flex justify-center items-center text-2xl font-bold">
                      라이브 중인 스트리머가 없어요
                    </div>
                  ) : (
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
                      {defaultLiveStreamer.map((stream) => {
                        return <LiveCard key={stream.id} stream={stream} />;
                      })}
                    </SimpleGrid>
                  )}
                </>
              )}
            </Container>
          );
        }}
      />
    </div>
  );
}

export default MypageCreate;
