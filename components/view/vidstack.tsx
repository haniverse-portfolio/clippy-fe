import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import { useEffect, useState } from "react";

export const VidStackVideo = ({ data }: any) => {
  const [plyrProps, setPlyrProps] = useState<any>(null);

  useEffect(() => {
    if (data) {
      setPlyrProps({
        source: {
          type: "video",
          sources: data.videos.map((video: any) => {
            return {
              src: video.proxyUrl,
              type: "video/mp4",
              size: video.quality,
            };
          }),
          poster: data.meta.thumbnail
            .replace("clips-media-assets2.twitch.tv", "videoproxy.clippy.kr")
            .replace(/-\d+x\d+(?=\.jpg)/, ""),
          title: data.meta.title,
        }, // https://github.com/sampotts/plyr#the-source-setter
        options: {
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "settings",
            "pip",
            "airplay",
            "fullscreen",
          ],
          autoplay: true,
          keyboard: {
            focused: true,
            global: true,
          },
          tooltips: {
            controls: true,
            seek: true,
          },
        }, // https://github.com/sampotts/plyr#options
      });
    }
  }, [data]);

  return (
    <div className="w-full h-full">
      <Plyr {...plyrProps} />
    </div>
  );
};
