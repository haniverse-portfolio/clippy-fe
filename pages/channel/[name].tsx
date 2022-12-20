import { Avatar, Button, Container, Flex, Text } from "@mantine/core";
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
  getTwitchUserInfoByName,
} from "../../util/clippy";
import { useClippyLogin } from "../../hooks/useClippyAPI";

const ViewChannel = () => {
  const [streamerInfo, setStreamerInfo] = useState<ITwitchUserInfo | null>(
    null
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("explore");
  const [clips, setClips] = useState<IClipInfo[]>([]);

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
    }
  }, [streamerInfo]);

  return (
    <>
      <Sidebar />
      <Navbar />
      <Container
        size="lg"
        h={"calc(100vh - 120px)"}
        // sizes={{
        //   xs: 540,
        //   sm: 740,
        //   md: 980,
        //   lg: 1200,
        //   xl: 1320,
        // }}
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
                    >
                      클립구경
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
                </Flex>
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default ViewChannel;
