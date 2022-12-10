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
import { followed, isLogined } from "../components/states";
import { apiAddress } from "../components/constValues";
import { IconAt } from "@tabler/icons";
import { Navbar } from "../components/common/Navbar";
import { IndexAfterLogin } from "../components/index/IndexAfterLogin";

export default function Home() {
  /* ***** ***** ***** ***** ***** states ***** ***** ***** ***** ***** */
  const [indexIsLogined, setIndexIsLogined] =
    useRecoilState<boolean>(isLogined);
  const [indexFollowed, setIndexFollowed] = useRecoilState(followed);
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
        setIndexIsLogined(true);
        console.log(res);
        getFollowed();
      })
      .catch((err) => {
        setIndexIsLogined(false);
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
        setIndexFollowed(res.data.data);
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
        <title>CLIPPY</title>
        <meta name="description" content="CLIPPY" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Navbar />
        <div style={{ height: "calc(100vh - 120px)" }}>
          {indexIsLogined === false ? (
            <IndexBeforeLogin />
          ) : (
            <IndexAfterLogin />
          )}
        </div>
        {indexIsLogined === true ? <></> : <></>}
      </main>
    </div>
  );
}

// throw new Error("Sentry Frontend Error");
