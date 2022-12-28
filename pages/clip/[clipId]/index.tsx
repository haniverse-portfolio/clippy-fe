import { Button, Container, Flex, SimpleGrid } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "../../../components/common/Navbar";
import { NotFoundTitle } from "../../../components/common/NotFound";
import { Sidebar } from "../../../components/common/Sidebar";
import VideoCard from "../../../components/common/VideoCard";
import { CloudflareVideo } from "../../../components/view/cloudflareVideo";
import VideoTitle from "../../../components/view/videoTitle";
import { useTailwindResponsive } from "../../../hooks/useTailwindResponsive";
import Head from "next/head";
import { ShareClipModal } from "../../../components/common/ShareClipModal";
import {
  getClip,
  getHotclip,
  getStreamerClips,
  getTwitchUserInfoById,
} from "../../../util/clippy";
import GoogleAdsense from "../../../components/common/GoogleAdsense";
import { GetServerSideProps } from "next";
import VideoComments from "../../../components/view/videoComments";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (params?.clipId) {
    const clipInfo = await getClip(params.clipId as string);
    if (clipInfo) {
      const ogTitle = `[Clippy] ${clipInfo.title}`;
      const ogURL = `https://clippy.kr/clip/${clipInfo.key}`;
      const ogType = "website";
      const ogImageURL = `https://clippy.kr/api/thumbnail/${clipInfo.key}`;
      const ogDescription =
        "클립 생성할땐? 클리피! - 지상 최고의 클립 생성/공유 서비스";
      return {
        props: {
          ogTitle,
          ogURL,
          ogType,
          ogImageURL,
          ogDescription,
        },
      };
    }
  }
  return {
    props: {},
  };
};

interface ViewClipProps {
  ogTitle?: string;
  ogURL?: string;
  ogType?: string;
  ogImageURL?: string;
  ogDescription?: string;
}

const ViewClip = ({
  ogTitle,
  ogURL,
  ogType,
  ogImageURL,
  ogDescription,
}: ViewClipProps) => {
  type TSideClipMenu = "hotclip" | "streamer";

  const [videoId, setVideoId] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [videoData, setVideoData] = useState<IClipInfo | null>(null);
  const [selectedSideClipMenu, setSelectedSideClipMenu] =
    useState<TSideClipMenu>("hotclip");
  const [hotClip, setHotClip] = useState<IClipInfo[]>([]);
  const [streamerClip, setStreamerClip] = useState<IClipInfo[]>([]);
  const [streamerName, setStreamerName] = useState("");

  const router = useRouter();
  const { clipId, start }: any = router.query;
  const { isSm, isMd } = useTailwindResponsive();
  const scrollDivRef = useRef<HTMLDivElement>(null);
  const sideClipMenuMap: Record<TSideClipMenu, IClipInfo[]> = {
    hotclip: hotClip,
    streamer: streamerClip,
  };

  useEffect(() => {
    if (clipId) {
      if (scrollDivRef && scrollDivRef.current && (isSm || isMd))
        scrollDivRef.current.scrollTo({ top: 0, behavior: "smooth" });
      getClip(clipId).then((res) => {
        if (res) {
          setVideoData(res);
          setVideoId(res.cfVideoId);
          setVideoTitle(res.title);

          getStreamerClips(res.targetUserId.toString()).then((res) => {
            setStreamerClip(res);
          });
          getTwitchUserInfoById(res.targetUserId).then((res) => {
            if (res) {
              setStreamerName(res.display_name);
            }
          });
        }
      });
    }
  }, [clipId]);

  useEffect(() => {
    getHotclip().then((res) => {
      setHotClip(res);
    });
  }, []);

  return (
    <>
      <Head>
        <title>{videoTitle !== "" ? `CLIPPY - ${videoTitle}` : "CLIPPY"}</title>
        {ogTitle && ogURL && ogType && ogImageURL && ogDescription && (
          <>
            <meta property="og:title" content={ogTitle} />
            <meta property="twitter:title" content={ogTitle} />

            <meta property="og:url" content={ogURL} />

            <meta property="og:type" content={ogType} />

            <meta property="og:image" content={ogImageURL} />
            <meta property="twitter:image" content={ogImageURL} />

            <meta property="description" content={ogDescription} />
            <meta property="og:description" content={ogDescription} />
            <meta property="twitter:description" content={ogDescription} />

            <meta property="twitter:card" content="summary" />
          </>
        )}
      </Head>
      <Navbar />
      <Sidebar />
      <ShareClipModal />
      <Container size="lg">
        {isError ? (
          <NotFoundTitle
            title="클립을 찾을 수 없어요"
            message="요청하신 클립을 찾을 수 없어요. 주소를 정확히 입력하셨는지 확인해주세요."
          />
        ) : (
          <div
            ref={scrollDivRef}
            className="relative top-0 left-0 w-full block overflow-auto lg:overflow-hidden"
            style={{ height: "calc(100vh - 120px)" }}
          >
            <Flex
              direction={isSm || isMd ? "column" : "row"}
              justify="center"
              align="center"
              wrap="nowrap"
              className="w-full h-max lg:h-[100%] relative lg:absolute top-0 left-0"
            >
              <div
                className="w-full block overflow-hidden"
                style={{
                  height: isSm || isMd ? "max-content" : "calc(100vh - 150px)",
                  padding: "20px 20px 0 20px",
                  marginTop: "-30px",
                  overflowY: isSm || isMd ? "hidden" : "auto",
                }}
              >
                <div
                  className="h-[120px] mb-5 relative top-0 max-h-[120px]"
                  style={{
                    width: isSm || isMd ? "calc(100% + 50px)" : "100%",
                    left: isSm || isMd ? "-25px" : "0",
                  }}
                >
                  <GoogleAdsense
                    className="google-ad-display-h-1 max-h-[120px]"
                    layoutKey="-h2+d+5c-9-3e"
                    slot="3846624551"
                    format="fluid"
                    responsive={true}
                  />
                </div>
                <CloudflareVideo
                  videoId={videoId}
                  clipId={clipId}
                  autoPlay={true}
                  startAt={
                    start && (start as string).match(/^[0-9]+$/)
                      ? parseInt(start as string)
                      : 0
                  }
                />
                <div className="mt-[25px]">
                  <VideoTitle data={videoData} />
                  <VideoComments />
                </div>
              </div>
              <div className="w-full lg:min-w-[350px] lg:max-w-[350px] h-full block lg:border-l-[1px] lg:border-gray-200">
                <div className="w-full h-[80px] px-5 flex justify-start items-center gap-2 overflow-y-hidden overflow-x-auto">
                  <Button
                    color="dark"
                    variant={
                      selectedSideClipMenu === "hotclip" ? "filled" : "outline"
                    }
                    radius={99999}
                    onClick={() => setSelectedSideClipMenu("hotclip")}
                  >
                    Hot Clip
                  </Button>
                  <Button
                    color="dark"
                    variant={
                      selectedSideClipMenu === "streamer" ? "filled" : "outline"
                    }
                    radius={99999}
                    onClick={() => setSelectedSideClipMenu("streamer")}
                  >
                    {streamerName} Clip
                  </Button>
                </div>
                <div className="w-full h-[calc(100%-60px)] block overflow-hidden lg:overflow-auto">
                  <Flex
                    direction={"column"}
                    justify="flex-start"
                    align="center"
                    className="w-full h-max mx-auto pl-5 pb-20"
                  >
                    <SimpleGrid className="w-full" cols={1} spacing={14}>
                      {sideClipMenuMap[selectedSideClipMenu].map((clip) => {
                        return (
                          <VideoCard
                            mode="horizontal"
                            key={clip.id}
                            clip={clip}
                          />
                        );
                      })}
                    </SimpleGrid>
                  </Flex>
                </div>
              </div>
            </Flex>
          </div>
        )}
      </Container>
    </>
  );
};

export default ViewClip;
