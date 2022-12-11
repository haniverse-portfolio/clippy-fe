import {
  Badge,
  Flex,
  Title,
  Text,
  Button,
  Card,
  Image,
  Grid,
  Group,
  TextInput,
  Stack,
} from "@mantine/core";
import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import { IndexBeforeLogin } from "../components/index/IndexBeforeLogin";
import { atom, useRecoilState } from "recoil";
import {
  mypageManage_sectionIndex,
  recoil_followed,
  recoil_isLogined,
} from "../components/states";
import { apiAddress } from "../components/constValues";
import { Navbar } from "../components/common/Navbar";
import { MypageMadeClip } from "../components/mypage_manage/MypageMadeClip";
import { MypageManageCommon } from "../components/mypage_manage/MypageManageCommon";
import { MypageChannelClip } from "../components/mypage_manage/MypageChannelClip";

export default function Home() {
  /* ***** ***** ***** ***** ***** states ***** ***** ***** ***** ***** */
  const [isLogined, setIsLogined] = useRecoilState<boolean>(recoil_isLogined);
  const [followed, setFollowed] = useRecoilState(recoil_followed);
  const [sectionIndex, setSectionIndex] = useRecoilState(
    mypageManage_sectionIndex
  );
  /* ***** ***** ***** ***** ***** states ***** ***** ***** ***** ***** */

  /* ***** ***** ***** ***** ***** function ***** ***** ***** ***** ***** */

  /* ***** ***** ***** ***** ***** function ***** ***** ***** ***** ***** */

  /* ***** ***** ***** ***** ***** axios call ***** ***** ***** ***** ***** */
  const checkLogin = () => {
    const url = `${apiAddress}/user/check`;
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLogined(true);
        console.log(res);
        getFollowed();
      })
      .catch((err) => {
        setIsLogined(false);
        console.log(err);
      });
  };

  const getFollowed = () => {
    const url = `${apiAddress}/twitch/followed_streams`;
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => {
        setFollowed(res.data.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  /* ***** ***** ***** ***** ***** axios call ***** ***** ***** ***** ***** */

  /* ***** ***** ***** ***** ***** effect hook ***** ***** ***** ***** ***** */
  useEffect(() => {
    checkLogin();
  }, []);
  /* ***** ***** ***** ***** ***** effect hook ***** ***** ***** ***** ***** */

  return (
    <div>
      <Head>
        {/* <script src="https://kit.fontawesome.com/beb5b729ea.js" crossOrigin="anonymous"/> */}
        <title>CLIPPY</title>
        <meta name="description" content="CLIPPY" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Navbar />
        <div style={{ height: "calc(100vh - 120px)" }}>
          {sectionIndex === 0 ? <MypageMadeClip /> : <MypageChannelClip />}
        </div>
        {isLogined === true ? <></> : <></>}
      </main>
    </div>
  );
}

// throw new Error("Sentry Frontend Error");
