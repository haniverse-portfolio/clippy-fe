import { Container, Flex, SimpleGrid } from "@mantine/core";
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
import { getClip, getHotclip } from "../../../util/clippy";
import GoogleAdsense from "../../../components/common/GoogleAdsense";

const ViewClip = () => {
  // get parameter
  const router = useRouter();
  const { clipId, creating }: any = router.query;

  const [videoCreating, setVideoCreating] = useState<boolean>(
    creating === "true" || creating === true
  );
  const [videoId, setVideoId] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [videoData, setVideoData] = useState<any>({});

  const { isSm } = useTailwindResponsive();
  const scrollDivRef = useRef<HTMLDivElement>(null);
  const [hotclip, setHotclip] = useState<IClipInfo[]>([]);

  useEffect(() => {
    if (clipId) {
      if (scrollDivRef && scrollDivRef.current && isSm)
        scrollDivRef.current.scrollTo({ top: 0, behavior: "smooth" });
      getClip(clipId).then((res) => {
        if (res) {
          setVideoData(res);
          setVideoId(res.cfVideoId);
          setVideoTitle(res.title);
        }
      });
    }
  }, [clipId]);

  useEffect(() => {
    getHotclip().then((res) => {
      setHotclip(res);
    });
  }, []);

  return (
    <>
      <Head>
        <title>{videoTitle !== "" ? `CLIPPY - ${videoTitle}` : "CLIPPY"}</title>
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
            className="relative top-0 left-0 w-full block overflow-auto md:overflow-hidden"
            style={{ height: "calc(100vh - 120px)" }}
          >
            <Flex
              direction={isSm ? "column" : "row"}
              justify="center"
              align="center"
              wrap="nowrap"
              className="w-full h-max md:h-[100%] relative md:absolute top-0 left-0"
            >
              <div className="hidden lg:block h-full pt-5">
                <GoogleAdsense
                  className="google-ad-display-v-1 w-[150px] max-h-[600px] mr-2 hidden sm:block"
                  layoutKey=""
                  slot="5162478170"
                  format="auto"
                  responsive={true}
                />
              </div>
              <div
                className="w-full block"
                style={{
                  height: isSm ? "max-content" : "calc(100vh - 150px)",
                  padding: "20px 20px 0 20px",
                  marginTop: "-30px",
                  overflowY: isSm ? "hidden" : "auto",
                }}
              >
                <div
                  className="h-max mb-5 relative top-0"
                  style={{
                    width: isSm ? "calc(100% + 50px)" : "100%",
                    left: isSm ? "-25px" : "0",
                  }}
                >
                  <GoogleAdsense
                    className="google-ad-display-h-1 min-h-[120px]"
                    layoutKey=""
                    slot="3575980050"
                    format="auto"
                    responsive={true}
                  />
                </div>
                <CloudflareVideo
                  videoId={videoId}
                  clipId={clipId}
                  creating={videoCreating}
                />
                <div className="mt-[25px]">
                  <VideoTitle data={videoData} />
                </div>
              </div>
              <div className="w-full md:w-[350px] h-full block overflow-hidden md:overflow-auto">
                <Flex
                  direction={"column"}
                  justify="flex-start"
                  align="center"
                  className="w-full max-w-[700px] h-max mx-auto p-5 pb-20"
                >
                  <SimpleGrid w={"full"} cols={1} spacing={24}>
                    {hotclip.map((clip: any) => {
                      return <VideoCard key={clip.id} clip={clip} />;
                    })}
                  </SimpleGrid>
                </Flex>
              </div>
            </Flex>
          </div>
        )}
      </Container>
    </>
  );
};

export default ViewClip;
