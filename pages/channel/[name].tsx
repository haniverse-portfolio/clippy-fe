import { Avatar, Badge, Button, Container, Flex, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Paperclip } from "tabler-icons-react";
import Explore from "../../components/channel/Explore";
import TwitchLive from "../../components/channel/TwitchLive";
import { Navbar } from "../../components/common/Navbar";
import { NotFoundTitle } from "../../components/common/NotFound";
import { Sidebar } from "../../components/common/Sidebar";
import { useCreateClipModal } from "../../hooks/useCreateClipModal";
import {
  checkStreamerIsLive,
  getStreamerClips,
  getStreamerLegacyClips,
  getTwitchUserInfoByName,
} from "../../util/clippy";
import { useClippyLogin } from "../../hooks/useClippyAPI";
import MainLayout from "../../components/common/MainLayout";
import loadCustomRoutes from "next/dist/lib/load-custom-routes";

const ViewChannel = () => {
  const [streamerInfo, setStreamerInfo] = useState<ITwitchUserInfo | null>(
    null
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("explore");
  const [clips, setClips] = useState<IClipInfo[]>([]);
  const [legacyClips, setLegacyClips] = useState<IClipInfo[]>([]);
  const [legacyCursor, setLegacyCursor] = useState<string>("");
  const [isLegacyLoading, setIsLegacyLoading] = useState<boolean>(false);

  const { openCreateClipModal } = useCreateClipModal();

  const { isClippyLogined, goClippyLogin } = useClippyLogin();

  const router = useRouter();
  const { name }: any = router.query;

  useEffect(() => {
    if (name) {
      getTwitchUserInfoByName(name).then((res) => {
        setStreamerInfo(res);
        if (!res) setIsError(true);
        else
          checkStreamerIsLive(res.login).then((res) => {
            console.log("streamer is live", res);
            setIsLive(res);
            if (res) setTab("live");
          });
      });
    }
  }, [name]);

  useEffect(() => {
    if (streamerInfo) {
      getStreamerClips(streamerInfo.id).then((res) => {
        setClips(res);
      });
      getStreamerLegacyClips(streamerInfo.id).then((res) => {
        setLegacyClips(res[0]);
        setLegacyCursor(res[1]);
      });
    }
  }, [streamerInfo]);

  const legacyLoadMore = async () => {
    if (streamerInfo) {
      setIsLegacyLoading(true);
      const data = await getStreamerLegacyClips(streamerInfo?.id, legacyCursor);

      setLegacyClips([...legacyClips, ...data[0]]);
      setLegacyCursor(data[1]);
      setIsLegacyLoading(false);
    }
  };

  return (
    <>
      <Sidebar />
      <Navbar />
      <MainLayout
        content={() => (
          <Container
            size="xl"
            sizes={{
              xs: 540,
              sm: 740,
              md: 980,
              lg: 1200,
              xl: 1320,
            }}
            pb={"50px"}
          >
            {isError ? (
              <NotFoundTitle
                title="스트리머를 찾을 수 없어요"
                message="요청하신 정보를 찾을 수 없어요. 주소를 정확히 입력하셨는지 확인해주세요."
              />
            ) : (
              <>
                {streamerInfo && (
                  <div className="relative w-full h-full block overflow-auto">
                    <Flex my={40} direction="column">
                      <Flex align="center">
                        <Avatar
                          size={40}
                          src={streamerInfo.profile_image_url || ""}
                          radius={99}
                          mr={16}
                        ></Avatar>
                        <Text size={36} weight={300}>
                          {streamerInfo.display_name || ""}
                        </Text>
                      </Flex>
                      <Flex mt={30} mb={30} h={65} align="center">
                        <Button
                          h={58}
                          color="dark"
                          variant={tab === "live" ? "filled" : "outline"}
                          radius={99}
                          px={20}
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                          onClick={() => {
                            setTab("live");
                          }}
                          mr={8}
                        >
                          {isLive ? "방송중" : "오프라인"}
                        </Button>
                        <Button
                          h={58}
                          color="dark"
                          variant={tab === "explore" ? "filled" : "outline"}
                          radius={99}
                          px={20}
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                          onClick={() => {
                            setTab("explore");
                          }}
                          mr={8}
                        >
                          클리피 클립
                        </Button>
                        <Button
                          h={58}
                          color="dark"
                          variant={tab === "legacy" ? "filled" : "outline"}
                          radius={99}
                          px={20}
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                          onClick={() => {
                            setTab("legacy");
                          }}
                          mr={8}
                        >
                          <Badge
                            color="green"
                            variant={tab === "legacy" ? "light" : "filled"}
                            mr={4}
                          >
                            NEW
                          </Badge>{" "}
                          트위치 클립
                        </Button>
                        <Button
                          h={58}
                          color="dark"
                          variant={tab === "vod" ? "filled" : "outline"}
                          radius={99}
                          px={20}
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                          onClick={() => {
                            setTab("vod");
                          }}
                        >
                          <Badge color="dark" variant="light" mr={4}>
                            COMING SOON
                          </Badge>{" "}
                          다시보기
                        </Button>
                      </Flex>

                      {tab === "live" && (
                        <>
                          {/* {isLive ? ( */}
                          <TwitchLive user={name} />
                          {/* ) : (
                  <div className="w-full h-[400px]  border-gray-300 border-[1px] rounded-md flex justify-center items-center text-xl">
                    {streamerInfo.display_name} 님은 오프라인 상태입니다
                  </div>
                )} */}

                          <Flex align="right" mt={30} justify="flex-end">
                            <Button
                              leftIcon={isClippyLogined && <Paperclip />}
                              size="lg"
                              color="dark"
                              disabled={!isLive}
                              radius="xl"
                              onClick={() => {
                                if (isClippyLogined) {
                                  openCreateClipModal(
                                    parseInt(streamerInfo.id),
                                    streamerInfo.display_name,
                                    streamerInfo.profile_image_url
                                  );
                                } else {
                                  goClippyLogin(window.location.href);
                                }
                              }}
                            >
                              {isClippyLogined ? "클립 생성" : "트위치 로그인"}
                            </Button>
                          </Flex>
                        </>
                      )}

                      {tab === "explore" && (
                        <>
                          {clips && clips.length > 0 ? (
                            <Explore clips={clips} />
                          ) : (
                            <div className="w-full h-[400px]  border-gray-300 border-[1px] rounded-md flex justify-center items-center text-xl">
                              등록된 클립이 없습니다
                            </div>
                          )}
                        </>
                      )}

                      {tab === "legacy" && (
                        <>
                          {legacyClips && legacyClips.length > 0 ? (
                            <div>
                              <Explore clips={legacyClips} />
                              {legacyCursor !== "" && legacyCursor !== null && (
                                <Flex justify="center">
                                  <Button
                                    h={58}
                                    color="dark"
                                    variant="outline"
                                    radius={99}
                                    px={20}
                                    mt={40}
                                    style={{
                                      fontSize: 16,
                                      fontWeight: 700,
                                    }}
                                    onClick={() => {
                                      legacyLoadMore();
                                    }}
                                    loading={isLegacyLoading}
                                  >
                                    + 더 불러오기
                                  </Button>
                                </Flex>
                              )}
                            </div>
                          ) : (
                            <div className="w-full h-[400px]  border-gray-300 border-[1px] rounded-md flex justify-center items-center text-xl">
                              등록된 클립이 없습니다
                            </div>
                          )}
                        </>
                      )}

                      {tab === "vod" && (
                        <>
                          {/* {legacyClips && legacyClips.length > 0 ? (
                            <Explore clips={legacyClips} />
                          ) : ( */}
                          <div className="w-full h-[400px]  border-gray-300 border-[1px] rounded-md flex justify-center items-center text-xl">
                            다시보기 서비스 오픈 준비 중입니다
                          </div>
                          {/* )} */}
                        </>
                      )}
                    </Flex>
                  </div>
                )}
              </>
            )}
          </Container>
        )}
      />
    </>
  );
};

export default ViewChannel;
