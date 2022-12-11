import { Flex } from "@mantine/core";

// Get Content Component and Aside Component
const MainLayout = ({ content, aside }: any): JSX.Element => {
  return (
    <Flex justify="space-between">
      <div style={{ height: "calc(100vh - 120px)", flex: 1, overflow: "auto" }}>
        {content()}
      </div>
      <div className="w-[360px]" style={{ height: "calc(100vh - 120px)" }}>
        {aside()}
      </div>
    </Flex>
  );
};

export default MainLayout;
