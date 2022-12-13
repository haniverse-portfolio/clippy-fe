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
  recoil_followed,
  recoil_isLogined,
  recoil_loginUserInfo,
} from "../../components/states";
import { CloudflareVideo } from "../../components/view/cloudflareVideo";
import VideoTitle from "../../components/view/videoTitle";

const ViewChannel = () => {
  // get parameter
  const router = useRouter();
  const { name }: any = router.query;

  const [userData, setUserData] = useState<any>({});
  const [isError, setIsError] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("explore");
  const [clips, setClips] = useState<any[]>([]);
  const [clipsCount, setClipsCount] = useState<number>(-1);

  const [isLogined, setIsLogined] = useRecoilState(recoil_isLogined);
  const [followed, setFollowed] = useRecoilState(recoil_followed);
  const [loginUserInfo, setLoginUserInfo] =
    useRecoilState(recoil_loginUserInfo);

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
      .get(`${apiAddress}/clip/user/${userData.id}`)
      .then((res) => {
        setClips(res.data.data);
        setClipsCount(res.data.data.length);
      })
      .catch((err) => {
        console.log(err);
        setClipsCount(0);
      });
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
  }, []);

  return (
    <>
      <Sidebar />
      <Navbar />
      <Container
        size="lg"
        sizes={{
          xs: 540,
          sm: 740,
          md: 980,
          lg: 1200,
          xl: 1320,
        }}
      >
        {isError ? (
          <NotFoundTitle
            title="스트리머를 찾을 수 없어요"
            message="요청하신 정보를 찾을 수 없어요. 주소를 정확히 입력하셨는지 확인해주세요."
          />
        ) : (
          <Flex mt={80} direction="column">
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
              {isLive && (
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
                  방송중
                </Button>
              )}
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
                <TwitchLive user={name} />
                <Flex align="right" mt={30} justify="flex-end">
                  <Button
                    leftIcon={<Paperclip />}
                    size="lg"
                    color="dark"
                    radius="xl"
                  >
                    클립 생성
                  </Button>
                </Flex>
              </>
            )}

            {tab === "explore" && <Explore clips={clips} />}
          </Flex>
        )}
      </Container>
    </>
  );
};

export default ViewChannel;
