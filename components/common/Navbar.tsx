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
  Stack,
} from "@mantine/core";
import { useRecoilState } from "recoil";
import {
  recoil_sidebarOpened,
  recoil_isLogined,
  recoil_loginUserInfo,
  search_searchResult,
  recoil_searchText,
} from "../states";
import Image from "next/image";
import { apiAddress } from "../constValues";
import { IconAt } from "@tabler/icons";
import { CircleX, Paperclip, Router, Search } from "tabler-icons-react";
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
import { CreateClipModal } from "./CreateClipModal";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import axios from "axios";
import { useRouter } from "next/router";

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
  const [searchText, setSearchText] = useRecoilState(recoil_searchText);
  const [searchBarHidden, setSearchBarHidden] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [isLogined, setIsLogined] = useRecoilState(recoil_isLogined);
  const [drawerOpened, setDrawerOpened] = useRecoilState(recoil_sidebarOpened);
  const [loginUserInfo, setLoginUserInfo] =
    useRecoilState(recoil_loginUserInfo);
  const [searchResult, setSearchResult] = useRecoilState(search_searchResult);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (width && width <= 640 && !searchBarHidden) {
      setSearchBarOpen(false);
      setSearchBarHidden(true);
    } else if (width && width > 640 && searchBarHidden) {
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
  const checkLogin = () => {
    const url = `${apiAddress}/user/check`;
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLogined(true);
      })
      .catch((err) => {
        setIsLogined(false);
        console.log(err);
      });
  };
  useEffect(() => {
    getUserInfo();
    checkLogin();
  }, []);
  const router = useRouter();

  const getTwitchChannel = async (routerSearchText: string) => {
    // https://api.clippy.kr/extractor
    const url = apiAddress + `/search/channel?q=${routerSearchText}`;

    const res = await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        setSearchResult(res.data.data);
        return res.data;
      })
      .catch((res) => {
        const errMessage = res.response.data.message;

        // error 표시해주기
      });
  };
  return (
    <div
      className="h-[120px] bg-white sticky top-0 z-50"
      style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
    >
      <CreateClipModal />
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
                let changedText = e.currentTarget.value as string;
                let textLength = changedText.length;
                // if (textLength === 0) {
                //   setSearchText(changedText);
                //   return;
                // }
                // let lastWord = changedText[textLength - 1];
                // let ac = lastWord.charCodeAt(0); // ascii_code
                // let validFlag =
                //   (ac >= 48 && ac <= 57) ||
                //   (ac >= 65 && ac <= 90) ||
                //   (ac >= 97 && ac <= 122) ||
                //   ac === 95;
                // if (validFlag) setSearchText(changedText);
                setSearchText(changedText);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (searchText === "") return;
                  getTwitchChannel(searchText);
                  router.push(`/search/${searchText}`);
                }
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
      {/* <Stack className="h-[60px] bg-[#63C81B]">
        <span className="ml-8 my-auto text-xl text-white font-semibold">
          [공지] 12월 14일 오후 6시까지{" "}
          <span className="underline">클립 생성</span> 기능이 일시적으로
          제한됩니다.
        </span>
      </Stack> */}
    </div>
  );
}
