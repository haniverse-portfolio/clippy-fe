import { Flex } from "@mantine/core";

// Get Content Component and Aside Component
const MainLayout = ({ content, aside }: any): JSX.Element => {
  return (
    <Flex justify="space-between">
      <div style={{ height: "calc(100vh - 120px)", flex: 1, overflow: "auto" }}>
        {content()}
      </div>
      <div
        className="w-[160px] lg:w-[360px]"
        style={{
          height: "calc(100vh - 120px)",
          borderLeft: "1px solid rgba(0, 0, 0, 0.1)",
          overflow: "auto",
        }}
      >
        {aside({ forceLarge: false })}
      </div>
    </Flex>
  );
};

export default MainLayout;
