import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex } from "@mantine/core";
import { useState } from "react";
import { useTailwindResponsive } from "../../hooks/useTailwindResponsive";

// Get Content Component and Aside Component
const MainLayout = ({ content, aside }: any): JSX.Element => {
  const { isSm } = useTailwindResponsive();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Flex justify="space-between" className="relative">
      <div
        className="pb-20"
        style={{ height: "calc(100vh - 120px)", flex: 1, overflow: "auto" }}
      >
        {content()}
      </div>
      {aside && (
        <>
          <div
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex md:hidden justify-center items-center absolute top-[30px] right-[160px] w-[50px] h-[50px] bg-white border-[1px] border-r-0 rounded-tl-2xl rounded-bl-2xl border-gray-300 z-[12] text-black duration-500"
            style={{
              right: (isSidebarOpen && isSm) || !isSm ? "160px" : "0",
            }}
          >
            <FontAwesomeIcon
              icon={isSidebarOpen ? solid("angle-right") : solid("angle-left")}
              width={"50%"}
              color="#666666"
            />
          </div>
          <div
            className="bg-white absolute bottom-0 right-0 md:relative w-[160px] lg:w-[360px] z-10 duration-500"
            style={{
              height: "calc(100vh - 120px)",
              borderLeft: "1px solid rgba(0, 0, 0, 0.1)",
              overflowX: "visible",
              overflowY: "auto",
              right: (isSidebarOpen && isSm) || !isSm ? "0" : "-160px",
            }}
          >
            {aside({ forceLarge: false })}
          </div>
        </>
      )}
    </Flex>
  );
};

export default MainLayout;
