import {
  createStyles,
  Container,
  Text,
  Button,
  Group,
  keyframes,
  Badge,
  TextInput,
  Grid,
  Avatar,
  Flex,
  Box,
  ThemeIcon,
} from "@mantine/core";
import { useRecoilState } from "recoil";
import { recoil_drawerOpened, recoil_isLogined } from "../states";
import Image from "next/image";
import { apiAddress } from "../constValues";
import { IconAt } from "@tabler/icons";
import { CircleX, Paperclip, Search } from "tabler-icons-react";
import Logo from "./Logo";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  solid,
  regular,
  brands,
  icon,
} from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used
import { useState } from "react";

const goLogin = () => {
  // use authorization code grant flow
  const clientId = "9n3ebjaenen1jipslsk11ufrcfo51t";
  // api.clippy.kr
  const redirectUri = `${apiAddress}/user/login`;
  const url = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=clips:edit+user:read:follows`;

  window.location.href = url;
};

const goLogout = () => {
  const url = `${apiAddress}/user/logout`;
  window.location.href = url;
};

export function Navbar() {
  const [searchText, setSearchText] = useState<string>("");
  const [isLogined, setIsLogined] = useRecoilState(recoil_isLogined);
  const [drawerOpened, setDrawerOpened] = useRecoilState(recoil_drawerOpened);

  return (
    <div className="h-[120px] bg-white sticky top-0 z-50 shadow-sm">
      <Group position="apart">
        <Flex my={40} ml={48} align="center">
          <Link href="/" className="mr-[125px]">
            <Logo />
          </Link>
          {isLogined && (
            <TextInput
              w={588}
              h={48}
              size="lg"
              radius="xl"
              id="navbar-title"
              placeholder="닉네임, 제목 키워드"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.currentTarget.value);
              }}
              icon={
                <FontAwesomeIcon
                  id="navbar-search-icon"
                  icon={solid("magnifying-glass")}
                  className="w-5 ml-[30px]"
                  fontWeight={900}
                  color="#DEDEDE"
                />
              }
              style={{
                boxShadow: "0px 4px 15px rgba(119, 119, 119, 0.25)",
                borderRadius: "99px",
                border: 0,
              }}
              rightSection={
                searchText.length > 0 && (
                  <FontAwesomeIcon
                    className="w-5 mr-[30px] cursor-pointer"
                    icon={regular("circle-xmark")}
                    onClick={() => {
                      setSearchText("");
                    }}
                  />
                )
              }
            />
          )}
        </Flex>
        {isLogined && (
          <Avatar
            onClick={() => {
              setDrawerOpened(true);
            }}
            radius="xl"
            size="lg"
            w={48}
            h={48}
            mr={48}
            id="navbar-avatar"
            src={null}
          />
        )}
      </Group>
    </div>
  );
}
