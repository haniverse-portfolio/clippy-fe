import { AspectRatio } from "@mantine/core";

const TwitchLive = ({ user }: any) => {
  return (
    <AspectRatio ratio={16 / 9}>
      <iframe
        title="embed"
        id={"embed_" + user}
        src={
          "https://player.twitch.tv/?muted=true&channel=" +
          user +
          "&parent=localhost&parent=clippy.kr&parent=develop.clippy.kr"
        }
        className="stream"
        allowFullScreen={true}
        style={{
          width: "100%",
          height: "100%",
        }}
      ></iframe>
    </AspectRatio>
  );
};

export default TwitchLive;
