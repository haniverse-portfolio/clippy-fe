import {
  Container,
  Text,
  Button,
  Group,
  keyframes,
  Stack,
  SimpleGrid,
  Flex,
} from "@mantine/core";
import MainLayout from "../common/MainLayout";
import LiveAside from "../aside/LiveAside";
import { Sidebar } from "../common/Sidebar";
import { useEffect, useState } from "react";
import VideoCard from "../common/VideoCard";
import { getHotclip } from "../../util/clippy";
import { useRouter } from "next/router";
import { useLoginModal } from "../../hooks/useLoginModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

export const scale = keyframes({
  "from, to": { transform: "scale(0.7)" },
});

export function IndexAfterLogin() {
  const tabNames = {
    suggest: "추천",
    popular: "인기",
    new: "최근 업로드",
  };
  const [selectedMenu, setSelectedMenu] = useState("suggest");
  const [hotclip, setHotclip] = useState<IClipInfo[]>([]);
  const [isReloading, setIsReloading] = useState(false);

  const { openLoginModal } = useLoginModal();

  const router = useRouter();

  useEffect(() => {
    const localStorageLoginRedirectURL = localStorage.getItem("redirect_url");
    const currentHotClipTabName = localStorage.getItem(
      "current_hotclip_tab_name"
    );
    if (localStorageLoginRedirectURL) {
      localStorage.removeItem("redirect_url");
      window.location.replace(localStorageLoginRedirectURL);
    }
    if (
      currentHotClipTabName &&
      Object.keys(tabNames).includes(currentHotClipTabName)
    ) {
      setSelectedMenu(() => currentHotClipTabName);
      getHotclip(currentHotClipTabName).then((res) => setHotclip(res));
    } else getHotclip(selectedMenu).then((res) => setHotclip(res));
  }, []);

  useEffect(() => {
    if (router.isReady && router.query.login) {
      openLoginModal();
    }
  }, [router.isReady]);

  const selectHotClipTab = (tabName: string) => {
    if (!isReloading) {
      localStorage.setItem("current_hotclip_tab_name", tabName);
      setIsReloading(() => true);
      setSelectedMenu(tabName);
      getHotclip(tabName).then((res) => {
        setHotclip(res);
        setIsReloading(() => false);
      });
    }
  };

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
              <Stack mt={40}>
                <Text size={36} weight={300}>
                  Hot Clip
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
                    {Object.keys(tabNames).map((itm, idx) => (
                      <Button
                        key={idx}
                        h={48}
                        color="dark"
                        variant={selectedMenu === itm ? "filled" : "outline"}
                        radius={99}
                        px={20}
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                        }}
                        onClick={() => selectHotClipTab(itm)}
                      >
                        {tabNames[itm as keyof typeof tabNames]}
                      </Button>
                    ))}
                    <Button
                      w={70}
                      h={48}
                      color="dark"
                      variant="outline"
                      radius={99}
                      px={20}
                      pos="absolute"
                      right={0}
                      onClick={() => {
                        if (!isReloading) {
                          setIsReloading(() => true);
                          getHotclip(selectedMenu).then((res) => {
                            setHotclip(res);
                            setIsReloading(() => false);
                          });
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        icon={
                          isReloading
                            ? solid("ellipsis")
                            : solid("rotate-right")
                        }
                        color="#000"
                        height="24px"
                      />
                    </Button>
                  </Flex>
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
