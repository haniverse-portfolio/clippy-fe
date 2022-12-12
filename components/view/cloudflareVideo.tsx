import { Stream } from "@cloudflare/stream-react";
import { Skeleton } from "@mantine/core";
import { useState } from "react";

export const CloudflareVideo = ({ videoId }: any) => {
  console.log(videoId);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {videoId !== "" ? (
        <div style={{ height: 460 }}>
          {isLoaded || <Skeleton width="100%" height={460}></Skeleton>}

          <Stream
            src={videoId}
            controls={true}
            responsive={true}
            onLoadStart={() => {
              setIsLoaded(true);
            }}
          ></Stream>
        </div>
      ) : (
        <Skeleton width="100%" height={460}></Skeleton>
      )}
    </div>
  );
};
