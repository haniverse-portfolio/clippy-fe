import { Container, Text, Stack, SimpleGrid } from "@mantine/core";
import MainLayout from "../common/MainLayout";
import UserAside from "../aside/UserAside";
import { Sidebar } from "../common/Sidebar";
import { useEffect, useState } from "react";
import LiveCard from "../common/LiveCard";
import { getFollowedStreamer } from "../../util/clippy";

export function MypageCreate() {
  const [followed, setFollowed] = useState<IFollowedStreamerInfo[]>([]);

  useEffect(() => {
    getFollowedStreamer().then((res) => {
      setFollowed(res);
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
              <Stack mt={80}>
                <Text size={36} weight={300}>
                  클립 생성
                </Text>
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
                {followed.map((stream: any) => {
                  return <LiveCard key={stream.id} stream={stream} />;
                })}
              </SimpleGrid>
            </Container>
          );
        }}
      />
    </div>
  );
}

export default MypageCreate;
