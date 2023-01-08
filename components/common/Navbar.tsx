import {
  Button,
  Group,
  TextInput,
  Avatar,
  Flex,
  AspectRatio,
  Image,
} from "@mantine/core";
import { useRecoilState } from "recoil";
import {
  common_sidebarOpened,
  search_searchResult,
  common_searchText,
  common_showMobileSearchBar,
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
import { SearchBar } from "./SearchBar";
import { useTailwindResponsive } from "../../hooks/useTailwindResponsive";

export function Navbar() {
  const [isMobileSearchaBarOpen, setIsMobileSearchaBarOpen] = useRecoilState(
    common_showMobileSearchBar
  );
  const [drawerOpened, setDrawerOpened] = useRecoilState(common_sidebarOpened);
  const [searchResult, setSearchResult] = useRecoilState(search_searchResult);

  const { isSm, isMd } = useTailwindResponsive();

  const {
    isClippyLogined,
    loginedClippyUserInfo,
    checkClipyLogin,
    goClippyLogin,
  } = useClippyLogin();

  useEffect(() => {
    checkClipyLogin();
  }, []);

  useEffect(() => {
    setIsMobileSearchaBarOpen(false);
  }, [isSm]);

  return (
    <>
      <TopNotice />
      <CreateClipModal />
      <div
        className="h-[120px] bg-white sticky top-0 z-50 flex justify-between items-center p-5 md:p-10"
        style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
      >
        <Link href="/">
          <Logo className="w-[150px] md:w-[200px]" />
        </Link>

        <SearchBar />

        <Flex justify="flex-end" align="center">
          <div
            onClick={() => setIsMobileSearchaBarOpen(true)}
            className="md:hidden w-[48px] h-[48px] mr-[10px] rounded-full bg-gray-100 flex justify-center items-center hover:cursor-pointer"
          >
            <FontAwesomeIcon
              icon={solid("magnifying-glass")}
              width="50%"
              className="text-gray-400"
            />
          </div>
          {isClippyLogined ? (
            <div
              className="w-[48px] h-[48px] rounded-full cursor-pointer"
              onClick={() => {
                setDrawerOpened(true);
              }}
            >
              <AspectRatio ratio={1 / 1}>
                <Image
                  className="rounded-full"
                  src={loginedClippyUserInfo?.profileImageUrl}
                  alt="user-profile"
                />
              </AspectRatio>
            </div>
          ) : (
            <Button
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
      </div>
    </>
  );
}
