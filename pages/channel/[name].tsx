import { Avatar, Button, Container, Flex, Text } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Paperclip } from "tabler-icons-react";
import Explore from "../../components/channel/Explore";
import TwitchLive from "../../components/channel/TwitchLive";
import { Navbar } from "../../components/common/Navbar";
import { NotFoundTitle } from "../../components/common/NotFound";
import { Sidebar } from "../../components/common/Sidebar";
import { apiAddress } from "../../components/constValues";
import {
  recoil_createModalIsLoading,
  recoil_createModalIsLoadingError,
  recoil_createModalIsLoadingErrorMessage,
  recoil_createModalOpened,
  recoil_createModalStreamerInfo,
  recoil_followed,
  recoil_isLogined,
  recoil_loginUserInfo,
  recoil_videoInfo,
} from "../../components/states";
import { CloudflareVideo } from "../../components/view/cloudflareVideo";
import VideoTitle from "../../components/view/videoTitle";
import { useTailwindResponsive } from "../../hooks/useTailwindResponsive";

const ViewChannel = () => {
  // get parameter
  const router = useRouter();
  const { name }: any = router.query;

  const { isSm, isMd } = useTailwindResponsive();

  const [userData, setUserData] = useState<any>({});
  const [isError, setIsError] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("explore");
  const [clips, setClips] = useState<any[]>([]);
  const [loginStatus, setLoginStatus] = useState<
    "loading" | "authorized" | "unauthorized"
  >("loading");
  const [clipsCount, setClipsCount] = useState<number>(-1);

  const [isLogined, setIsLogined] = useRecoilState(recoil_isLogined);
  const [followed, setFollowed] = useRecoilState(recoil_followed);
  const [loginUserInfo, setLoginUserInfo] =
    useRecoilState(recoil_loginUserInfo);

  const [extractorErrorStatus, setExtractorErrorStatus] = useState(false);
  const [extractorErrorMessage, setExtractorErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useRecoilState<boolean>(
    recoil_createModalIsLoading
  );
  const [videoInfo, setVideoInfo] = useRecoilState(recoil_videoInfo);
  const [isLoadingError, setIsLoadingError] = useRecoilState<boolean>(
    recoil_createModalIsLoadingError
  );
  const [isLoadingErrorMessage, setIsLoadingErrorMessage] =
    useRecoilState<string>(recoil_createModalIsLoadingErrorMessage);
  const [createModalOpened, setCreateModalOpened] = useRecoilState(
    recoil_createModalOpened
  );
  const [createModalStreamerInfo, setCreateModalStreamerInfo] = useRecoilState(
    recoil_createModalStreamerInfo
  );

  const postExtractor = async (streamerId: number) => {
    setExtractorErrorStatus(false);
    setExtractorErrorMessage("");

    // https://api.clippy.kr/extractor
    const url = apiAddress + "/extractor";

    const res = await axios
      .post(
        url,
        { streamerId: streamerId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setIsLoading(false);
        setVideoInfo(res.data.data);
        return res.data;
      })
      .catch((res) => {
        const errMessage = res.response.data.message;
        // alert(errMessage);
        setIsLoadingError(true);
        setIsLoadingErrorMessage(errMessage);
        // setExtractorErrorStatus(true);
        // setExtractorErrorMessage(errMessage);

        // error 표시해주기
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

  const getVideo = async () => {
    await axios
      .get(`https://api.partyview.tv/streamer/name/${name}`)
      .then((res) => {
        setUserData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        setIsError(true);
      });
  };

  const checkIsLive = async () => {
    await axios
      .get(`https://api.partyview.tv/streamer/name/${name}/live`)
      .then((res) => {
        setIsLive(true);
        setTab("live");
      })
      .catch((err) => {
        setIsLive(false);
      });
  };

  const getClips = async () => {
    await axios
      .get(`${apiAddress}/clip/user/${userData.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setClips(res.data.data);
        setClipsCount(res.data.data.length);
      })
      .catch((err) => {
        console.log(err);
        setClipsCount(0);
      });
  };
  const getLoginStatus = async () => {
    await axios
      .get(`${apiAddress}/user/check`, {
        withCredentials: true,
      })
      .then((res) => {
        setLoginStatus("authorized");
      })
      .catch((err) => {
        setLoginStatus("unauthorized");
      });
  };
  const goLogin = () => {
    // use authorization code grant flow
    const clientId = "9n3ebjaenen1jipslsk11ufrcfo51t";
    // api.clippy.kr
    const redirectUri = `${apiAddress}/user/login`;
    const url = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=clips:edit+user:read:follows`;

    window.location.href = url;
  };

  useEffect(() => {
    if (name) {
      getVideo();
      checkIsLive();
    }
  }, [name]);

  useEffect(() => {
    if (userData.id) {
      getClips();
    }
  }, [userData]);

  useEffect(() => {
    getUserInfo();
    getLoginStatus();
  }, []);

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
          <div className="relative w-full h-full block overflow-auto">
            <Flex my={40} direction="column">
              <Flex align="center">
                <Avatar
                  size={40}
                  src={userData.profile_image_url || ""}
                  radius={99}
                  mr={16}
                ></Avatar>
                <Text size={36} weight={300}>
                  {userData.display_name || ""}
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
                      {userData.display_name} 님은 오프라인 상태입니다
                    </div>
                  )} */}

                  <Flex align="right" mt={30} justify="flex-end">
                    <Button
                      leftIcon={loginStatus === "authorized" && <Paperclip />}
                      size="lg"
                      color="dark"
                      disabled={!isLive}
                      radius="xl"
                      onClick={() => {
                        if (loginStatus === "authorized") {
                          postExtractor(userData.id);
                          setCreateModalOpened(true);
                          let copyStreamerInfo = JSON.parse(
                            JSON.stringify(createModalStreamerInfo)
                          );
                          copyStreamerInfo.name = userData.display_name;
                          copyStreamerInfo.image = userData.profile_image_url;
                          setCreateModalStreamerInfo(copyStreamerInfo);
                        } else if (loginStatus === "unauthorized") {
                          localStorage.setItem(
                            "redirect_url",
                            window.location.href
                          );
                          goLogin();
                        }
                      }}
                    >
                      {loginStatus === "authorized"
                        ? "클립 생성"
                        : loginStatus === "unauthorized"
                        ? "트위치 로그인"
                        : "..."}
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
      </Container>
    </>
  );
};

export default ViewChannel;
