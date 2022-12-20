import { useRouter } from "next/router";
import { FC, useEffect, useRef, useState } from "react";
import { CloudflareVideo } from "../../../components/view/cloudflareVideo";
import Head from "next/head";
import { NotFoundTitle } from "../../../components/common/NotFound";
import { getClip } from "../../../util/clippy";

const ViewClipEmbed: FC = () => {
  const router = useRouter();
  const { clipId, creating }: any = router.query;

  const [videoWidth, setVideoWidth] = useState("100%");
  const [videoId, setVideoId] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const videoPlayState = useState(false);
  const [isVideoPlay] = videoPlayState;
  const [isError, setIsError] = useState(false);
  const [videoCreating, setVideoCreating] = useState<boolean>(
    creating === "true" || creating === true
  );
  const wrapDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (wrapDivRef.current) {
        setVideoWidth(`${wrapDivRef.current.offsetHeight * 1.777777}px`);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (clipId) {
      getClip(clipId).then((res) => {
        if (res) {
          setVideoId(res.cfVideoId);
          setVideoTitle(res.title);
        } else {
          setIsError(true);
        }
      });
    }
  }, [clipId]);

  return (
    <>
      <Head>
        <title>{videoTitle !== "" ? `CLIPPY - ${videoTitle}` : "CLIPPY"}</title>
      </Head>
      <div
        ref={wrapDivRef}
        className="relative w-full h-[100vh] flex justify-center items-center bg-black"
      >
        {isError ? (
          <NotFoundTitle
            title="클립을 찾을 수 없어요"
            message="요청하신 클립을 찾을 수 없어요. 주소를 정확히 입력하셨는지 확인해주세요."
          />
        ) : (
          <div
            className="relative h-max"
            style={{
              width: videoWidth,
            }}
          >
            <CloudflareVideo
              videoId={videoId}
              clipId={clipId}
              creating={videoCreating}
              videoPlayState={videoPlayState}
            />
            {!isVideoPlay && (
              <>
                <div className="screen-saver absolute top-0 left-0 w-full h-full bg-black pointer-events-none"></div>
                <div className="video-title absolute top-4 left-4 text-white text-3xl">
                  {videoTitle}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <style jsx>{`
        .screen-saver {
          -webkit-mask-image: -webkit-gradient(
            linear,
            left bottom,
            left top,
            from(rgba(0, 0, 0, 0.7)),
            color-stop(0.9, rgba(0, 0, 0, 0)),
            color-stop(0.1, rgba(0, 0, 0, 0)),
            to(rgba(0, 0, 0, 0.7))
          );
        }
        .screen-saver,
        .video-title {
          animation: intro 0.2s ease-in-out;
        }
        @keyframes intro {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default ViewClipEmbed;
