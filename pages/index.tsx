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
} from "@mantine/core";
import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import { IndexBeforeLogin } from "../components/index/IndexBeforeLogin";
import { atom, useRecoilState } from "recoil";
import { recoil_followed, recoil_isLogined } from "../components/states";
import { apiAddress } from "../components/constValues";
import { IconAt } from "@tabler/icons";
import { Navbar } from "../components/common/Navbar";
import { IndexAfterLogin } from "../components/index/IndexAfterLogin";

export default function Home() {
  /* ***** ***** ***** ***** ***** states ***** ***** ***** ***** ***** */
  const [isLogined, setIsLogined] = useRecoilState<boolean>(recoil_isLogined);
  const [followed, setFollowed] = useRecoilState(recoil_followed);
  /* ***** ***** ***** ***** ***** states ***** ***** ***** ***** ***** */

  /* ***** ***** ***** ***** ***** function ***** ***** ***** ***** ***** */
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

      <main className="relative">
        <Navbar />
        <div
          style={{
            height: "calc(100vh - 120px)",
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          {isLogined === false ? <IndexBeforeLogin /> : <IndexAfterLogin />}
        </div>
        {isLogined === true ? <></> : <></>}
      </main>
    </div>
  );
}

// throw new Error("Sentry Frontend Error");
