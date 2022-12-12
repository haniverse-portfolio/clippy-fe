import { ActionIcon, Alert, Avatar, Button, Flex, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { Heart, Router } from "tabler-icons-react";
import { useRouter } from "next/router";

const VideoTitle = ({ data }: any) => {
  const router = useRouter();

  const [userIcon, setUserIcon] = useState("");
  const [userLogin, setUserLogin] = useState("");
  const [userName, setUserName] = useState("");
  const [clipperName, setClipperName] = useState("");

  const getApi = async (userId: number) => {
    const res = await axios.get(`https://twapi.haenu.com/user/id/${userId}`);
    return res.data;
  };

  const getUserData = () => {
    getApi(data.targetUserId).then((res) => {
      setUserIcon(res.profile_image_url);
      setUserLogin(res.login);
      setUserName(res.display_name);
    });
    getApi(data.createUserId).then((res) => {
      setClipperName(res.display_name);
    });
  };

  useEffect(() => {
    if (data.targetUserId) {
      getUserData();
    }
  }, [data]);

  return (
    <>
      <div>
        <Flex direction="row" justify="space-between" align="center">
          <Text size={36} weight={300}>
            {data.title}
          </Text>
          <Flex align="center">
            {/* <Button>Thanks</Button> */}
            <Button
              py={12}
              px={20}
              style={{
                fontSize: 16,
                borderRadius: 99,
                backgroundColor: "#F0F0F0",
                color: "black",
                fontWeight: 400,
              }}
              h={50}
            >
              링크 복사
            </Button>
            <ActionIcon variant="transparent" size={32} mx={40}>
              <Heart size={36} />
            </ActionIcon>
          </Flex>
        </Flex>
      </div>

      <div style={{ marginTop: 40 }}>
        <Flex direction="row" justify="space-between" align="center">
          <Flex
            align="center"
            style={{ cursor: "pointer" }}
            onClick={() => {
              router.push(`/channel/${userLogin}`);
            }}
          >
            <Avatar src={userIcon} size={24} mr={8} radius={99}></Avatar>
            <Text size={20} weight={700}>
              {userName}
            </Text>
          </Flex>
          <Flex>
            <Flex mr={16}>
              <Text size={16} weight={300} mr={4}>
                게시자
              </Text>
              <Text size={16} weight={400}>
                {clipperName}
              </Text>
            </Flex>
            <Flex mr={16}>
              <Text size={16} weight={300} mr={4}>
                조회수
              </Text>
              <Text size={16} weight={400}>
                {data.viewCount}
              </Text>
            </Flex>
            <Flex>
              <Text size={16} weight={300} mr={4}>
                좋아요
              </Text>
              <Text size={16} weight={400}>
                {data.likeCount}개
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </div>

      <div style={{ marginTop: 40 }}>
        <Flex>
          <Text size={16} weight={300} mr={4}>
            댓글
          </Text>
          <Text size={16} weight={400}>
            0개
          </Text>
        </Flex>
      </div>

      <div style={{ marginTop: 20 }}>
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="댓글 기능 지원예정"
          color="gray"
        >
          Clippy 서비스는 아직 초기 단계로 개발되지 않은 부분이 많습니다. 빠른
          시일 내에 댓글 기능을 이용하실 수 있도록 준비하겠습니다.
        </Alert>
      </div>
    </>
  );
};

export default VideoTitle;
