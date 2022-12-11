import { Stream } from "@cloudflare/stream-react";

export const CloudflareVideo = () => {
  const videoId = "05939ba6196ad522078c70bd7c8d5408";

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Stream src={videoId} controls={true} responsive={true}></Stream>
    </div>
  );
};
