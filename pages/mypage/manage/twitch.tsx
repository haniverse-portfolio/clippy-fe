import {
  Avatar,
  Badge,
  Button,
  Container,
  Flex,
  Group,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Eye, Paperclip } from "tabler-icons-react";
import Explore from "../../../components/channel/Explore";
import TwitchLive from "../../../components/channel/TwitchLive";
import { Navbar } from "../../../components/common/Navbar";
import { NotFoundTitle } from "../../../components/common/NotFound";
import { Sidebar } from "../../../components/common/Sidebar";
import { useCreateClipModal } from "../../../hooks/useCreateClipModal";
import {
  checkStreamerIsLive,
  getStreamerClips,
  getStreamerLegacyClips,
  getStreamerManageClips,
  getTwitchUserInfoByName,
} from "../../../util/clippy";
import { useClippyLogin } from "../../../hooks/useClippyAPI";
import MainLayout from "../../../components/common/MainLayout";
import loadCustomRoutes from "next/dist/lib/load-custom-routes";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import VideoManageCard from "../../../components/common/VideoManageCard";
import { apiAddress } from "../../../components/constValues";
import axios from "axios";
import { useRecoilState } from "recoil";
import { mypageManage_twitch_legacyClipPolicy } from "../../../components/states";

const ViewChannel = () => {
  const [streamerInfo, setStreamerInfo] = useState<ITwitchUserInfo | null>(
    null
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [clips, setClips] = useState<IClipInfo[]>([]);
  const [legacyClips, setLegacyClips] = useState<IClipInfo[]>([]);
  const [legacyCursor, setLegacyCursor] = useState<string>("");
  const [isLegacyLoading, setIsLegacyLoading] = useState<boolean>(false);
  const [legacyClipPolicy, setLegacyClipPolicy] = useRecoilState(
    mypageManage_twitch_legacyClipPolicy
  );
  const [isLegacyClipPolicyLoading, setIsLegacyClipPolicyLoading] =
    useState<boolean>(false);

  const { openCreateClipModal } = useCreateClipModal();

  const { isClippyLogined, goClippyLogin } = useClippyLogin();

  const router = useRouter();
  const { loginedClippyUserInfo, goClippyLogout } = useClippyLogin();
  const name = loginedClippyUserInfo?.twitchName;

  const getLegacyClipPolicy = async () => {
    const url = `${apiAddress}/user/me/legacy-policy`;
    const res = await axios.get(url, { withCredentials: true });
    setLegacyClipPolicy(res.data.data);
    setIsLegacyClipPolicyLoading(false);
  };

  const legacyClipPolicyShow = async () => {
    setIsLegacyClipPolicyLoading(true);
    const url = `${apiAddress}/user/me/legacy-policy/hide`;
    const res = await axios.delete(url, { withCredentials: true });
    await getLegacyClipPolicy();
  };

  const legacyClipPolicyHide = async () => {
    setIsLegacyClipPolicyLoading(true);
    const url = `${apiAddress}/user/me/legacy-policy/hide`;
    const res = await axios
      .post(url, {}, { withCredentials: true })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
    await getLegacyClipPolicy();
  };

  useEffect(() => {
    getLegacyClipPolicy();
  }, []);

  useEffect(() => {
    if (name) {
      getTwitchUserInfoByName(name).then((res) => {
        setStreamerInfo(res);
        if (!res) setIsError(true);
        else
          checkStreamerIsLive(res.login).then((res) => {
            console.log("streamer is live", res);
            setIsLive(res);
          });
      });
    }
  }, [name]);

  useEffect(() => {
    if (streamerInfo) {
      getStreamerClips(streamerInfo.id).then((res) => {
        setClips(res);
      });
      getStreamerManageClips().then((res) => {
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
                      <Group position="apart">
                        <Flex
                          mt={30}
                          mb={30}
                          h={65}
                          align="center"
                          style={{ overflowX: "auto" }}
                        >
                          <Button
                            h={48}
                            color="dark"
                            variant="filled"
                            radius={99}
                            px={20}
                            style={{
                              fontSize: 16,
                              fontWeight: 700,
                            }}
                            onClick={() => {}}
                            mr={8}
                          >
                            <Badge color="green" variant="light" mr={8}>
                              NEW
                            </Badge>{" "}
                            트위치 클립
                          </Button>
                        </Flex>
                        <Button
                          h={48}
                          color="dark"
                          variant={
                            legacyClipPolicy.hideAll ? "filled" : "outline"
                          }
                          radius={99}
                          px={20}
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                          onClick={() => {
                            if (legacyClipPolicy.hideAll === true)
                              legacyClipPolicyShow();
                            else legacyClipPolicyHide();
                          }}
                          mr={8}
                          loading={isLegacyClipPolicyLoading}
                        >
                          <FontAwesomeIcon
                            icon={
                              legacyClipPolicy.hideAll
                                ? solid("eye-slash")
                                : solid("eye")
                            }
                            style={{
                              width: 14,
                              height: 12,
                              color: legacyClipPolicy.hideAll
                                ? "white"
                                : "black",
                              marginRight: 4,
                            }}
                          />
                          {`전체 클립 ${legacyClipPolicy ? "공개" : "비공개"}`}
                        </Button>
                      </Group>

                      {legacyClips && legacyClips.length > 0 ? (
                        <div>
                          <SimpleGrid
                            cols={4}
                            spacing={24}
                            breakpoints={[
                              { maxWidth: 1400, cols: 3, spacing: "md" },
                              { maxWidth: 980, cols: 2, spacing: "sm" },
                              { maxWidth: 600, cols: 1, spacing: "sm" },
                            ]}
                          >
                            {legacyClips.map((clip: any) => {
                              return (
                                <VideoManageCard key={clip.key} clip={clip} />
                              );
                            })}
                          </SimpleGrid>
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
