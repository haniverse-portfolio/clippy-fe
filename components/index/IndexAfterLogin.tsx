import {
  Container,
  Text,
  Button,
  Group,
  keyframes,
  Stack,
  SimpleGrid,
} from "@mantine/core";
import MainLayout from "../common/MainLayout";
import LiveAside from "../aside/LiveAside";
import { Sidebar } from "../common/Sidebar";
import { useEffect, useState } from "react";
import VideoCard from "../common/VideoCard";
import { getHotclip } from "../../util/clippy";
import { useRouter } from "next/router";
import { useLoginModal } from "../../hooks/useLoginModal";

export const scale = keyframes({
  "from, to": { transform: "scale(0.7)" },
});

export function IndexAfterLogin() {
  const [selectedMenu, setSelectedMenu] = useState("popular");
  const [hotclip, setHotclip] = useState<IClipInfo[]>([]);

  const { openLoginModal } = useLoginModal();

  const router = useRouter();

  useEffect(() => {
    const localStorageLoginRedirectURL = localStorage.getItem("redirect_url");
    if (localStorageLoginRedirectURL) {
      localStorage.removeItem("redirect_url");
      window.location.replace(localStorageLoginRedirectURL);
    }
    getHotclip().then((res) => setHotclip(res));
  }, []);

  useEffect(() => {
    if (router.isReady && router.query.login) {
      openLoginModal();
    }
  }, [router.isReady]);

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
                        getHotclip("popular").then((res) => setHotclip(res));
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
                        getHotclip("new").then((res) => setHotclip(res));
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
