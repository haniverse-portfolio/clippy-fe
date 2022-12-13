import { Container, Flex, SimpleGrid } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Navbar } from "../../components/common/Navbar";
import { NotFoundTitle } from "../../components/common/NotFound";
import VideoCard from "../../components/common/VideoCard";
import { apiAddress } from "../../components/constValues";
import { CloudflareVideo } from "../../components/view/cloudflareVideo";
import VideoTitle from "../../components/view/videoTitle";
import { useTailwindResponsive } from "../../hooks/useTailwindResponsive";

const ViewClip = () => {
  // get parameter
  const router = useRouter();
  const { clipId, creating }: any = router.query;

  const [videoCreating, setVideoCreating] = useState<boolean>(
    creating === "true" || creating === true
  );
  const [videoId, setVideoId] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("d");
  const [isError, setIsError] = useState<boolean>(false);
  const [videoData, setVideoData] = useState<any>({});

  const { isSm, isMd } = useTailwindResponsive();
  const [hotclip, setHotclip] = useState([]);

  const getHotclip = (type = "popular") => {
    const url = `${apiAddress}/hotclip/${type}`;
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => {
        setHotclip(res.data.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getVideo = async () => {
    await axios
      .get(`${apiAddress}/clip/${clipId}`)
      .then((res) => {
        setVideoData(res.data.data);
        setVideoId(res.data.data.cfVideoId);
        setVideoTitle(res.data.data.title);
      })
      .catch((err) => {
        console.log(err);
        setIsError(true);
      });
  };

  useEffect(() => {
    if (clipId) {
      getVideo();
    }
  }, [clipId]);

  useEffect(() => {
    getHotclip();
  }, []);

  return (
    <>
      <Navbar />
      <Container size="lg">
        {isError ? (
          <NotFoundTitle
            title="클립을 찾을 수 없어요"
            message="요청하신 클립을 찾을 수 없어요. 주소를 정확히 입력하셨는지 확인해주세요."
          />
        ) : (
          <div
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
              <div className="w-full h-full block p-5">
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
