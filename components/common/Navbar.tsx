import { Button, Group, TextInput, Avatar, Flex } from "@mantine/core";
import { useRecoilState } from "recoil";
import {
  common_sidebarOpened,
  search_searchResult,
  common_searchText,
} from "../states";
import { apiAddress } from "../constValues";
import Logo from "./Logo";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular } from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used
import { useEffect, useState } from "react";
import { CreateClipModal } from "./CreateClipModal";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import axios from "axios";
import { useRouter } from "next/router";
import { TopNotice } from "./TopNotice";
import { useClippyLogin } from "../../hooks/useClippyAPI";

export function Navbar() {
  const [searchText, setSearchText] = useRecoilState(common_searchText);
  const [searchBarHidden, setSearchBarHidden] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [drawerOpened, setDrawerOpened] = useRecoilState(common_sidebarOpened);
  const [searchResult, setSearchResult] = useRecoilState(search_searchResult);

  const { width } = useWindowDimensions();

  const {
    isClippyLogined,
    loginedClippyUserInfo,
    checkClipyLogin,
    goClippyLogin,
  } = useClippyLogin();

  useEffect(() => {
    if (width && width <= 640 && !searchBarHidden) {
      setSearchBarOpen(false);
      setSearchBarHidden(true);
    } else if (width && width > 640 && searchBarHidden) {
      setSearchBarHidden(false);
    }
  }, [width]);

  useEffect(() => {
    checkClipyLogin();
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
    <>
      <TopNotice />
      <div
        className="h-[120px] bg-white sticky top-0 z-50"
        style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
      >
        <CreateClipModal />
        <Group position="apart" noWrap>
          <Flex
            w={`calc(100% - ${searchBarHidden ? "300px" : "200px"})`}
            my={36}
            ml={30}
            align="center"
          >
            <Link href="/" className="lg:mr-[125px] md:mr-[50px] sm:mr-[50px]">
              <Logo />
            </Link>
            {(!searchBarHidden || searchBarOpen) && (
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
                  width: searchBarHidden ? "calc(100% - 260px)" : "100%",
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

          <Flex justify="flex-end" align="center">
            {searchBarHidden && (
              <div
                onClick={() => setSearchBarOpen(!searchBarOpen)}
                className="w-[44px] h-[44px] mr-[10px] rounded-full bg-gray-100 flex justify-center items-center hover:cursor-pointer"
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
            {isClippyLogined ? (
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
                src={loginedClippyUserInfo?.profileImageUrl}
              />
            ) : (
              <Button
                mr={30}
                h={42}
                color="dark"
                radius={99}
                px={20}
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                }}
                onClick={() => goClippyLogin()}
              >
                <span className="hidden sm:inline mr-[.3em]">트위치</span>
                로그인
              </Button>
            )}
          </Flex>
        </Group>
      </div>
    </>
  );
}
