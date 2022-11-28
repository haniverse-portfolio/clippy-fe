import { Flex } from "@mantine/core";
import React from "react";

export const Header = () => {
  return (
    <Flex
      pos="fixed"
      top={0}
      w="100%"
      h="50px"
      bg="#fff"
      style={{
        borderBottom: "1px",
        borderBottomColor: "rgba(0,0,0,.08)",
      }}
    ></Flex>
  );
};
