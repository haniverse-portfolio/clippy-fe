import { Container, Flex } from "@mantine/core";
import { Navbar } from "../../components/common/Navbar";
import { CloudflareVideo } from "../../components/view/cloudflareVideo";
import VideoTitle from "../../components/view/videoTitle";

const ViewClip = () => {
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
        <Flex mt={32}>
          <Flex style={{ flex: 1 }} direction="column">
            <CloudflareVideo />
            <VideoTitle />
          </Flex>
          <Flex w={350}></Flex>
        </Flex>
      </Container>
    </>
  );
};

export default ViewClip;
