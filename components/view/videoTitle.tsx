import {
  ActionIcon,
  Alert,
  Avatar,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Text,
  Textarea,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ArrowBackUp,
  Ban,
  BrandTelegram,
  Edit,
  Heart,
  Trash,
  X,
} from "tabler-icons-react";
import { useRouter } from "next/router";
import { apiAddress } from "../constValues";
import { useShareClipModal } from "../../hooks/useShareClipModal";
import { getTwitchUserInfoById } from "../../util/clippy";
import { useClippyLogin } from "../../hooks/useClippyAPI";
import { useLoginModal } from "../../hooks/useLoginModal";
import { useRecoilState } from "recoil";

interface VideoTitleProps {
  data: IClipInfo;
}

const VideoTitle = ({ data }: VideoTitleProps) => {
  const router = useRouter();

  const [userIcon, setUserIcon] = useState("");
  const [userLogin, setUserLogin] = useState("");
  const [userName, setUserName] = useState("");
  const [clipperName, setClipperName] = useState("");
  const [isLike, setIsLike] = useState(false);

  const { openLoginModal } = useLoginModal();
  const { openShareClipModal } = useShareClipModal();
  const { isClippyLogined } = useClippyLogin();
  const [commentText, setCommentText] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentCursor, setCurrentCursor] = useState(-1);
  const [editMode, setEditMode] = useState(false);
  const { loginedClippyUserInfo, goClippyLogout } = useClippyLogin();
  interface commentsUserType {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    created_at: string;
  }
  interface commentsUserList extends Array<commentsUserType> {}
  const [commentsUserInfo, setCommentsUserInfo] = useState<commentsUserList>(
    []
  );
  interface commentsType {
    commentId: number;
    clipId: string;
    comment: string;
    userId: number;
    isBlocked: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  }
  interface commentsTypes extends Array<commentsType> {}
  const [comments, setComments] = useState<commentsTypes>([]);

  const getApi = async (userId: number) => {
    const res = await axios.get(`https://twapi.haenu.com/user/id/${userId}`);
    return res.data;
  };

  const getComments = async (clipId: string) => {
    const url = `${apiAddress}/clip/${clipId}/comment`;
    const res = await axios
      .get(url, { withCredentials: true })
      .then((res) => {
        setComments(res.data.data.comments);
        getCommentsUserInfo(res.data.data.comments);
        setCurrentDate(new Date());
      })
      .catch((error) => {});
  };

  const getCommentsUserInfo = async (commentsArg: []) => {
    const userInfoArray = commentsArg.map(async ({ userId }, i) => {
      const url: string = `https://twapi.haenu.com/user/id/${userId}`;
      const res = await axios.get(url);
      return res.data;
    });
    // promise array
    Promise.all(userInfoArray).then((res) => {
      setCommentsUserInfo(res);
    });
  };

  const deleteComments = async (clipId: string, clipCommentId: number) => {
    const url = `${apiAddress}/clip/${clipId}/comment/${clipCommentId}`;
    const res = await axios.delete(url, { withCredentials: true });
  };

  const reportComments = async (clipId: string, clipCommentId: number) => {
    const url = `${apiAddress}/clip/${clipId}/comment/${clipCommentId}/report`;
    const res = await axios.post(url, { withCredentials: true });
  };

  const postComments = async (clipId: string) => {
    const url = `${apiAddress}/clip/${clipId}/comment`;
    const res = await axios
      .post(url, { comment: commentText }, { withCredentials: true })
      .then((res) => {
        setCurrentDate(new Date());
      })
      .catch((error) => {});
    getComments(clipId);
    setCommentText("");
  };

  const editComments = async (clipId: string, editText: string) => {
    const url = `${apiAddress}/clip/${clipId}/comment`;
    const res = await axios
      .put(url, { comment: commentText }, { withCredentials: true })
      .then((res) => {
        setEditMode(false);
        getComments(clipId);
      })
      .catch((error) => {});
  };

  const getCommentDate = (updatedDate: string, createdDate: string) => {
    let prev = {
      year: updatedDate.substring(0, 4),
      month: updatedDate.substring(5, 7),
      day: updatedDate.substring(8, 10),
      hour: updatedDate.substring(11, 13),
      minute: updatedDate.substring(14, 16),
      second: updatedDate.substring(17, 19),
    };
    let cur = {
      year: currentDate.getUTCFullYear(),
      month: currentDate.getUTCMonth() + 1,
      day: currentDate.getUTCDate(),
      hour: currentDate.getUTCHours(),
      minute: currentDate.getUTCMinutes(),
      second: currentDate.getUTCSeconds(),
    };
    let flag = [
      cur.year - parseInt(prev.year),
      cur.month - parseInt(prev.month),
      cur.day - parseInt(prev.day),
      cur.hour - parseInt(prev.hour),
      cur.minute - parseInt(prev.minute),
      cur.second - parseInt(prev.second),
    ];
    let stringSet = ["년", "달", "일", "시간", "분", "초"];
    let rt = "방금";
    for (let i = 0; i < 5; i++) {
      if (flag[i] > 0) {
        rt = flag[i] + stringSet[i] + " 전";
        break;
      }
    }
    if (updatedDate !== createdDate) rt += "(수정됨)";
    return rt;
  };

  const getUserData = () => {
    getTwitchUserInfoById(data.targetUserId).then((res) => {
      if (res) {
        setUserIcon(res.profile_image_url);
        setUserLogin(res.login);
        setUserName(res.display_name);
      }
    });
    getTwitchUserInfoById(data.createUserId).then((res) => {
      if (res) {
        setClipperName(res.display_name);
      }
    });
  };

  const getLikeStatus = async () => {
    const url = `${apiAddress}/clip/${data.key}/like`;
    const res = await axios.get(url, { withCredentials: true });
    setIsLike(res.data.data);
  };

  const toggleLike = () => {
    const url = `${apiAddress}/clip/${data.key}/like`;

    if (isLike) {
      axios
        .delete(url, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
          setIsLike(!isLike);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .post(url, {}, { withCredentials: true })
        .then((res) => {
          console.log(res);
          setIsLike(!isLike);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (data.targetUserId) {
      getUserData();
    }
    if (data.id && isClippyLogined) {
      getLikeStatus();
    }
    console.log(data);
  }, [data]);

  useEffect(() => {
    const clipId: string = router.query.clipId as string;
    if (clipId === undefined) return;
    getComments(clipId);
  }, [router.isReady]);

  return (
    <>
      <div>
        <Flex direction="row" justify="space-between" align="center">
          <Text size={28} weight={300}>
            {data.title}
          </Text>
        </Flex>
      </div>

      <div className="mt-[20px]">
        <Flex direction="row" justify="space-between" align="center">
          <Flex direction={"column"} justify={"center"} align={"flex-start"}>
            <Flex
              align="center"
              style={{ cursor: "pointer" }}
              onClick={() => {
                router.push(`/channel/${userLogin}`);
              }}
            >
              <Avatar src={userIcon} size={24} mr={8} radius={99} />
              <Text size={20} weight={700}>
                {userName}
              </Text>
            </Flex>
            <Flex direction="column" mt={8}>
              <Flex mr={16}>
                <Text size={12} weight={300} mr={4}>
                  게시자
                </Text>
                <Text size={12} weight={400}>
                  {clipperName}
                </Text>
              </Flex>
              <Flex>
                <Flex mr={16}>
                  <Text size={12} weight={300} mr={4}>
                    조회수
                  </Text>
                  <Text size={12} weight={400}>
                    {data.viewCount}
                  </Text>
                </Flex>
                <Flex>
                  <Text size={12} weight={300} mr={4}>
                    좋아요
                  </Text>
                  <Text size={12} weight={400}>
                    {data.likeCount}개
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Flex align="center">
            {/* <Button>Thanks</Button> */}
            <Button
              py={8}
              px={15}
              style={{
                fontSize: 14,
                borderRadius: 99,
                backgroundColor: "#F0F0F0",
                color: "black",
                fontWeight: 400,
              }}
              h={40}
              onClick={() => {
                // don't copy query string
                const url = window.location.href.split("?")[0];
                navigator.clipboard.writeText(url).then(() => {
                  alert("링크가 복사되었습니다.");
                });
              }}
            >
              링크 복사
            </Button>
            <ActionIcon
              variant="transparent"
              size={32}
              mx={20}
              className="duration-100"
              style={isLike ? { color: "#000000" } : {}}
              onClick={toggleLike}
            >
              <Heart
                size={36}
                className="duration-100"
                style={isLike ? { fill: "#000000" } : { fill: "#FFFFFF" }}
              />
            </ActionIcon>
          </Flex>
        </Flex>
      </div>

      <div className="mt-[20px]">
        <Flex>
          <Text size={16} weight={300} mr={4}>
            댓글
          </Text>
          <Text size={16} weight={400}>
            {comments.length}개
          </Text>
        </Flex>
      </div>
      <Grid mt={20}>
        <Grid.Col span="content">
          <Avatar
            mt={10}
            src={loginedClippyUserInfo?.profileImageUrl}
            size={24}
            radius={99}
          />
        </Grid.Col>
        <Grid.Col span="auto">
          <Textarea
            spellCheck="false"
            autosize
            minRows={1}
            maxRows={64}
            value={commentText}
            onChange={(e) => {
              setCommentText(e.currentTarget.value);
            }}
            id=""
            variant="unstyled"
            placeholder="댓글 추가"
          />
        </Grid.Col>
        <Grid.Col span="content">
          <Group>
            <Button
              style={{
                fontSize: 14,
                borderRadius: 99,
                backgroundColor: "white",
                color: "black",
                fontWeight: 700,
              }}
              h={40}
              onClick={() => {
                setCommentText("");
              }}
            >
              취소
            </Button>
            <Button
              leftIcon={<BrandTelegram />}
              style={{
                fontSize: 14,
                borderRadius: 99,
                backgroundColor: "black",
                color: "white",
                fontWeight: 700,
              }}
              h={40}
              onClick={() => {
                postComments(router.query.clipId as string);
              }}
            >
              게시
            </Button>
          </Group>
        </Grid.Col>
      </Grid>

      <Divider mt={12} mb={16} size="xs" />

      {comments.map((cur, i: number) => {
        return (
          <Flex
            className={`${
              editMode && currentCursor === i
                ? "bg-gray-200"
                : "hover:bg-gray-100"
            } rounded-md`}
            onMouseOver={() => {
              if (!editMode) setCurrentCursor(i);
            }}
            onMouseLeave={() => {
              if (!editMode) setCurrentCursor(-1);
            }}
            key={i}
            direction={"column"}
            justify={"center"}
            align={"flex-start"}
          >
            <Group mt={10} className="w-full" align="center" position="apart">
              <Flex align="center">
                <Avatar
                  src={
                    (commentsUserInfo[i] || { profile_image_url: "" })
                      .profile_image_url
                  }
                  size={24}
                  radius={99}
                />
                <Text size={16} weight={500} ml={8}>
                  {(commentsUserInfo[i] || { display_name: "" }).display_name}
                </Text>
                <Text size={12} weight={300} ml={8}>
                  {getCommentDate(cur.updatedAt, cur.createdAt)}
                </Text>
              </Flex>
              {!editMode && currentCursor === i ? (
                <Group mr={8}>
                  <Edit
                    onClick={() => {
                      setEditMode(true);
                    }}
                    className="cursor-pointer"
                    size={20}
                  />
                  <Ban
                    onClick={() => {
                      reportComments(
                        router.query.clipId as string,
                        cur.commentId
                      );
                    }}
                    className="cursor-pointer"
                    size={20}
                  />
                  <Trash
                    onClick={() => {
                      deleteComments(
                        router.query.clipId as string,
                        cur.commentId
                      );
                    }}
                    className="cursor-pointer"
                    size={20}
                  />
                </Group>
              ) : (
                <></>
              )}
              {/* <DotsVertical className="cursor-pointer" size={20} /> */}
            </Group>
            {editMode === true && currentCursor === i ? (
              <Grid className="w-full">
                <Grid.Col span="content">
                  <Avatar
                    className="invisible"
                    mt={10}
                    src={""}
                    size={24}
                    radius={99}
                  />
                </Grid.Col>
                <Grid.Col span="auto">
                  <Textarea
                    spellCheck="false"
                    autosize
                    minRows={1}
                    maxRows={64}
                    defaultValue={cur.comment}
                    id=""
                    variant="unstyled"
                    placeholder="댓글 수정"
                  />
                </Grid.Col>
                <Grid.Col span="content">
                  <Group>
                    <X
                      className="cursor-pointer"
                      onClick={() => {
                        setEditMode(false);
                      }}
                    >
                      취소
                    </X>
                    <Edit
                      className="cursor-pointer"
                      onClick={() => {
                        editComments(
                          router.query.clipId as string,
                          cur.comment
                        );
                        setEditMode(false);
                      }}
                    >
                      수정
                    </Edit>
                  </Group>
                </Grid.Col>
              </Grid>
            ) : (
              <Text size={16} weight={400} ml={32} mt={12} mb={10}>
                {cur.comment}
              </Text>
            )}
          </Flex>
        );
      })}
    </>
  );
};

export default VideoTitle;
