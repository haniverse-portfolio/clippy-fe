import { Container, Flex } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Navbar } from "../../components/common/Navbar";
import { NotFoundTitle } from "../../components/common/NotFound";
import { apiAddress } from "../../components/constValues";
import { CloudflareVideo } from "../../components/view/cloudflareVideo";
import VideoTitle from "../../components/view/videoTitle";

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

  return (
    <>
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
            title="클립을 찾을 수 없어요"
            message="요청하신 클립을 찾을 수 없어요. 주소를 정확히 입력하셨는지 확인해주세요."
          />
        ) : (
          <Flex mt={32}>
            <Flex style={{ flex: 1 }} direction="column">
              <CloudflareVideo
                videoId={videoId}
                clipId={clipId}
                creating={videoCreating}
              />
              <div className="mt-[25px]">
                <VideoTitle data={videoData} />
              </div>
            </Flex>
            <Flex w={350}></Flex>
          </Flex>
        )}
      </Container>
    </>
  );
};

export default ViewClip;
