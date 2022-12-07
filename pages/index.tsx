import { Badge, Flex, Title, Text, Button, Card, Image } from "@mantine/core";
import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const [followed, setFollowed] = useState([]);

  const goLogin = () => {
    // use authorization code grant flow
    const clientId = "9n3ebjaenen1jipslsk11ufrcfo51t";
    const redirectUri = "https://api.clippy.kr/user/login";
    const url = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=clips:edit+user:read:follows`;

    window.location.href = url;
  };

  const goLogout = () => {
    const url = "https://api.clippy.kr/user/logout";
    window.location.href = url;
  };

  const checkLogin = () => {
    const url = "https://api.clippy.kr/user/check";
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLogin(true);
        console.log(res);
      })
      .catch((err) => {
        setIsLogin(false);
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

  useEffect(() => {
    checkLogin();
    getFollowed();
  }, []);

  return (
    <div>
      <Head>
        <title>CLIPPY</title>
        <meta name="description" content="CLIPPY" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Flex my={30} align="center" justify="center">
          <Title align="center" mr={5}>
            CLIPPY
          </Title>
          <Badge size="xl" color="grape">
            BETA
          </Badge>
        </Flex>
        <Text align="center">
          끊김 없이 클립을 생성하고, 소중한 순간을 간직하세요
        </Text>
        <Flex align="center" justify="center" mt={30}>
          {isLogin ? (
            <Button color="red" onClick={goLogout}>
              로그아웃
            </Button>
          ) : (
            <Button onClick={goLogin}>트위치로 로그인</Button>
          )}
        </Flex>

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
      </main>
    </div>
  );
}
