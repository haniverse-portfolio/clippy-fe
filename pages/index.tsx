import { Badge, Flex, Title, Text, Button, Card, Image } from "@mantine/core";
import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import { IndexHero } from "../components/Hero/IndexHero";
import { atom, useRecoilState } from "recoil";
import { isLogined } from "../components/states";

export default function Home() {
  /* ***** ***** ***** ***** ***** states ***** ***** ***** ***** ***** */
  const [indexIsLogined, setIndexIsLogined] =
    useRecoilState<boolean>(isLogined);
  const [followed, setFollowed] = useState<any>([]);
  /* ***** ***** ***** ***** ***** states ***** ***** ***** ***** ***** */

  /* ***** ***** ***** ***** ***** function ***** ***** ***** ***** ***** */
  const goLogin = () => {
    // use authorization code grant flow
    const clientId = "9n3ebjaenen1jipslsk11ufrcfo51t";
    // api.clippy.kr
    const redirectUri = "http://api.clippy.kr/user/login";
    const url = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=clips:edit+user:read:follows`;

    window.location.href = url;
  };

  const goLogout = () => {
    const url = "https://api.clippy.kr/user/logout";
    window.location.href = url;
  };
  /* ***** ***** ***** ***** ***** function ***** ***** ***** ***** ***** */

  /* ***** ***** ***** ***** ***** axios call ***** ***** ***** ***** ***** */
  const checkLogin = () => {
    const url = "https://api.clippy.kr/user/check";
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
    const url = "https://api.clippy.kr/twitch/followed_streams";
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
        <title>CLIPPY</title>
        <meta name="description" content="CLIPPY" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Flex my={30} align="center" justify="center">
          <IndexHero />
        </Flex>
        {indexIsLogined === true ? (
          <>
            <Title size={20} align="center" mt={50}>
              팔로우 중인 실시간 방송 (누르면 클립 생성)
            </Title>
            <Flex align="center" justify="center" mt={30} dir="row" wrap="wrap">
              {followed.map((stream: any) => {
                return (
                  <Card
                    shadow="sm"
                    p="md"
                    m="md"
                    radius="md"
                    withBorder
                    key={stream.id}
                    onClick={() => {
                      window.location.href = `/create/${stream.user_login}`;
                    }}
                  >
                    <Flex align="center" justify="center" direction="column">
                      <Image
                        src={stream.thumbnail_url
                          .replace("{width}", "1920")
                          .replace("{height}", "1080")}
                        alt="clip"
                        width={240}
                        height={160}
                      />
                      <Text mt={10} align="center">
                        {stream.user_name}
                      </Text>
                    </Flex>
                  </Card>
                );
              })}
            </Flex>
          </>
        ) : (
          <></>
        )}
      </main>
    </div>
  );
}

// throw new Error("Sentry Frontend Error");
