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
import {
  recoil_sidebarOpened,
  recoil_isLogined,
  recoil_loginUserInfo,
} from "../states";
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
import { useEffect, useState } from "react";
import { CreateModal } from "./CreateModal";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import axios from "axios";

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
  const [searchBarHidden, setSearchBarHidden] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [isLogined, setIsLogined] = useRecoilState(recoil_isLogined);
  const [drawerOpened, setDrawerOpened] = useRecoilState(recoil_sidebarOpened);
  const [loginUserInfo, setLoginUserInfo] =
    useRecoilState(recoil_loginUserInfo);
  const { width } = useWindowDimensions();

  useEffect(() => {
    console.log(width, searchBarHidden);
    if (width && width <= 640 && !searchBarHidden) {
      console.log("hello");
      setSearchBarOpen(false);
      setSearchBarHidden(true);
    } else if (width && width > 640 && searchBarHidden) {
      console.log("world");
      setSearchBarHidden(false);
    }
  }, [width]);

  const getUserInfo = () => {
    const url = `${apiAddress}/user/me`;
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => {
        setLoginUserInfo(res.data.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div
      className="h-[120px] bg-white sticky top-0 z-50"
      style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
    >
      <CreateModal />
      <Group position="apart">
        <Flex
          w={`calc(100% - ${searchBarHidden ? "300px" : "200px"})`}
          my={36}
          ml={30}
          align="center"
        >
          <Link href="/" className="lg:mr-[125px] md:mr-[50px] sm:mr-[50px]">
            <Logo />
          </Link>
          {isLogined && (!searchBarHidden || searchBarOpen) && (
            <TextInput
              className="max-w-[588px] animate-fadeIn"
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
                width: searchBarHidden ? "calc(100% - 200px)" : "100%",
                left: searchBarHidden ? "30px" : "auto",
                animation: "fadeIn .4s ease-in-out",
                position: searchBarHidden ? "absolute" : "relative",
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
          <Flex justify="flex-end" align="center">
            {searchBarHidden && (
              <div
                onClick={() => setSearchBarOpen(!searchBarOpen)}
                className="w-[44px] h-[44px] mr-[10px] rounded-full bg-gray-100 flex justify-center align-middle hover:cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={
                    searchBarOpen ? solid("check") : solid("magnifying-glass")
                  }
                  width="50%"
                  className="text-gray-400"
                />
              </div>
            )}
            <Avatar
              onClick={() => {
                setDrawerOpened(true);
              }}
              radius="xl"
              size="lg"
              w={48}
              h={48}
              mr={30}
              id="navbar-avatar"
              src={loginUserInfo.profileImageUrl}
            />
          </Flex>
        )}
      </Group>
    </div>
  );
}
