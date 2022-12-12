import { SimpleGrid } from "@mantine/core";
import VideoCard from "../common/VideoCard";

const Explore = ({ clips }: any) => {
  return (
    <SimpleGrid
      cols={4}
      spacing={24}
      mt={40}
      breakpoints={[
        { maxWidth: 1400, cols: 3, spacing: "md" },
        { maxWidth: 980, cols: 2, spacing: "sm" },
        { maxWidth: 600, cols: 1, spacing: "sm" },
      ]}
    >
      {clips.map((clip: any) => {
        return <VideoCard key={clip.id} clip={clip} />;
      })}
    </SimpleGrid>
  );
};

export default Explore;
