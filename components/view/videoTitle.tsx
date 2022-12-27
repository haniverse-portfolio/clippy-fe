import {
  ActionIcon,
  Alert,
  Avatar,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Stack,
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
  ChevronDown,
  ChevronUp,
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
import { showNotification } from "@mantine/notifications";
import { LoginModal } from "../common/LoginModal";

import {
  common_loginModal_isOpen,
  view_actionType,
  view_axiosProgressed,
  view_notiModalOpened,
  view_notiModalStep,
} from "../states";
import { NotiModal } from "./NotiModal";

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
  const { closeLoginModal, openLoginModal } = useLoginModal();
  const { openShareClipModal } = useShareClipModal();
  const { isClippyLogined } = useClippyLogin();
  const [commentText, setCommentText] = useState("");
  const [editText, setEditText] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentCursor, setCurrentCursor] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useRecoilState(
    common_loginModal_isOpen
  );
  const [notiModalStep, setNotiModalStep] =
    useRecoilState<number>(view_notiModalStep);
  const [notiModalOpened, setNotiModalOpened] =
    useRecoilState<boolean>(view_notiModalOpened);
  const [actionType, setActionType] = useRecoilState(view_actionType);
  const [axiosProgressed, setAxiosProgressed] =
    useRecoilState<boolean>(view_axiosProgressed);
  const [commentIsFolded, setCommentIsFolded] = useState<boolean>(true);
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

  const getNotification = (apiNameIdx: number, isSuccess: boolean) => {
    let apiNameSet = ["신고", "삭제", "작성", "수정"];
    let messageContents =
      "댓글이 정상적으로 " + apiNameSet[apiNameIdx] + "되었습니다.";
    if (!isSuccess)
      messageContents =
        "댓글이 " +
        apiNameSet[apiNameIdx] +
        "되지 않았습니다. 다시 시도해주세요.";
    showNotification({
      color: isSuccess ? "green" : "red",
      title: `댓글 ${apiNameSet[apiNameIdx]} ${isSuccess ? "성공" : "실패"}`,
      message: messageContents,
    });
  };

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
    const res = await axios
      .delete(url, { withCredentials: true })
      .then((res) => {
        setTimeout(() => {
          getNotification(1, true);
          setNotiModalStep(2);
        }, 500);
        getComments(clipId);
      })
      .catch((err) => {
        setTimeout(() => {
          getNotification(1, false);
          setNotiModalStep(3);
        }, 500);
        getComments(clipId);
      });
  };

  const reportComments = async (clipId: string, clipCommentId: number) => {
    const url = `${apiAddress}/clip/${clipId}/comment/${clipCommentId}/report`;
    const res = await axios
      .post(url, {}, { withCredentials: true })
      .then((res) => {
        getNotification(0, true);
        setNotiModalStep(2);
        getComments(clipId);
      })
      .catch((err) => {
        getNotification(0, false);
        setNotiModalStep(3);
        getComments(clipId);
      });
  };

  const postComments = async (clipId: string) => {
    const url = `${apiAddress}/clip/${clipId}/comment`;
    const res = await axios
      .post(url, { comment: commentText }, { withCredentials: true })
      .then((res) => {
        getNotification(2, true);
        setCurrentDate(new Date());
      })
      .catch((error) => {
        getNotification(2, true);
      });
    getComments(clipId);
    setCommentText("");
  };

  const editComments = async (clipId: string, commentId: number) => {
    const url = `${apiAddress}/clip/${clipId}/comment/${commentId}`;
    const res = await axios
      .put(url, { comment: editText }, { withCredentials: true })
      .then((res) => {
        getNotification(3, true);
        setEditMode(false);
        getComments(clipId);
      })
      .catch((error) => {
        getNotification(3, false);
      });
  };
  
  const getLogDestructor = (arg: string) => {
    // object consists of number
    return {
      year: parseInt(arg.substring(0, 4)),
      month: parseInt(arg.substring(5, 7)),
      day: parseInt(arg.substring(8, 10)),
      hour: parseInt(arg.substring(11, 13)),
      minute: parseInt(arg.substring(14, 16)),
      second: parseInt(arg.substring(17, 19)),
    };
  };

  const getDateToUTC = (arg: Date) => {
    // object consists of number
    return {
      year: arg.getUTCFullYear(),
      month: arg.getUTCMonth() + 1,
      day: arg.getUTCDate(),
      hour: arg.getUTCHours(),
      minute: arg.getUTCMinutes(),
      second: arg.getUTCSeconds(),
    };
  };

  const getCommentDate = (
    updatedDate: string,
    createdDate: string,
    commentState: boolean
  ) => {
    let prev = getLogDestructor(createdDate);
    let cur = getDateToUTC(currentDate);
    let flag = [
      cur.year - prev.year,
      cur.month - prev.month,
      cur.day - prev.day,
      cur.hour - prev.hour,
      cur.minute - prev.minute,
      cur.second - prev.second,
    ];
    let stringSet = ["년", "달", "일", "시간", "분", "초"];
    let rt = "방금";
    for (let i = 0; i < 5; i++) {
      if (flag[i] > 0) {
        rt = flag[i] + stringSet[i] + " 전";
        break;
      }
    }
    if (updatedDate !== createdDate && !commentState) rt += "(수정됨)";
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
    if (axiosProgressed === false) return;
    if (actionType === 0) {
      reportComments(
        router.query.clipId as string,
        comments[Math.abs(currentCursor + 1)]?.commentId
      );
    } else if (actionType === 1) {
      deleteComments(
        router.query.clipId as string,
        comments[Math.abs(currentCursor + 1)]?.commentId
      );
    }
    setAxiosProgressed(false);
  }, [axiosProgressed]);

  useEffect(() => {
    if (data.targetUserId) {
      getUserData();
    }
    if (data.id && isClippyLogined) {
      getLikeStatus();
    }
  }, [data]);

  const {clipId} = router.query;
useEffect(() => {
  if(!clipId) return;
  getComments(clipId as string);
}, [clipId]);

  return (
    <>
      <NotiModal />
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
      <Grid className="w-full" mt={20}>
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
            className="border-b-2 border-gray-300"
            maxLength={10000}
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
      </Grid>
      <Group my={12} position="right">
        {commentText.length === 0 ? (
          <></>
        ) : (
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
        )}
        <Button
          disabled={commentText.length === 0}
          leftIcon={<BrandTelegram />}
          color="dark"
          radius="xl"
          h={40}
          onClick={() => {
            if (isClippyLogined === false) {
              localStorage.setItem("redirect_url", window.location.href);
              setIsLoginModalOpen(true);
              return;
            }
            if (commentText.length === 0) {
              return;
            }
            setEditMode(false);
            setCurrentCursor(0);
            postComments(router.query.clipId as string);
          }}
        >
          게시
        </Button>
      </Group>
      {comments.length !== 0 ? (
      <Divider
        my="xs"
        label={
          <Button
            leftIcon={
              commentIsFolded === true ? <ChevronUp /> : <ChevronDown />
            }
            color="dark"
            variant="outline"
            radius="xl"
            h={40}
            onClick={() => {
              setCommentIsFolded(!commentIsFolded);
            }}
          >
            {commentIsFolded === true ? "댓글 접기" : "댓글 펼치기"}
          </Button>
        }
        labelPosition="center"
      />
      ) : (
        <Text mt={12} align="center" size={16} weight={300} ml={8}>
          댓글을 작성하고 첫번째 댓글의 주인공이 돼보세요!
        </Text>
      )}
      {commentIsFolded === true ? (
        <>
      {comments.map((cur, i: number) => {
        return (
          <Flex
            className={`${
              editMode && currentCursor === i + 1
                ? "bg-gray-200"
                : "hover:bg-gray-100"
            } rounded-md`}
            onMouseOver={() => {
              if (!editMode) setCurrentCursor(i + 1);
            }}
            onMouseLeave={() => {
              if (!editMode) setCurrentCursor(-(i + 1));
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
                  {getCommentDate(
                    cur.updatedAt,
                    cur.createdAt,
                    cur.isBlocked || cur.isDeleted
                  )}
                </Text>
              </Flex>
              {editMode === true && currentCursor === i + 1 ? (
                <Group mr={8}>
                  <ArrowBackUp
                    size={20}
                    className="cursor-pointer"
                    onClick={() => {
                      setEditMode(false);
                    }}
                  >
                    취소
                  </ArrowBackUp>
                  {cur.comment === editText ? (
                    <Edit
                      color="gray"
                      size={20}
                      className="cursor-pointer"
                      onClick={() => {
                        if (editText === cur.comment) return;
                        editComments(
                          router.query.clipId as string,
                          cur.commentId
                        );
                        setEditMode(false);
                      }}
                    >
                      수정
                    </Edit>
                  ) : (
                    <Edit
                      color="black"
                      size={20}
                      className="cursor-pointer"
                      onClick={() => {
                        if (editText === cur.comment) return;
                        editComments(
                          router.query.clipId as string,
                          cur.commentId
                        );
                        setEditMode(false);
                      }}
                    >
                      수정
                    </Edit>
                  )}
                </Group>
              ) : (
                <></>
              )}
              {isClippyLogined && !editMode && currentCursor === i + 1 ? (
                <Group mr={8}>
                  {cur.userId === loginedClippyUserInfo?.twitchId &&
                  !cur.isDeleted &&
                  !cur.isBlocked ? (
                    <Edit
                      onClick={() => {
                        setEditText(cur.comment);
                        setEditMode(true);
                      }}
                      className="cursor-pointer"
                      size={20}
                    />
                  ) : (
                    <></>
                  )}
                  {cur.userId === loginedClippyUserInfo?.twitchId ||
                  cur.isDeleted ||
                  cur.isBlocked ? (
                    <></>
                  ) : (
                    <Ban
                      onClick={() => {
                        setActionType(0);
                        reportComments(
                          router.query.clipId as string,
                          cur.commentId
                        );
                      }}
                      className="cursor-pointer"
                      size={20}
                    />
                  )}
                  {cur.userId === loginedClippyUserInfo?.twitchId &&
                  !cur.isDeleted &&
                  !cur.isBlocked ? (
                    <Trash
                      onClick={() => {
                        setActionType(1);
                        if (notiModalOpened === false) setNotiModalOpened(true);
                      }}
                      className="cursor-pointer"
                      size={20}
                    />
                  ) : (
                    <></>
                  )}
                </Group>
              ) : (
                <></>
              )}
              {/* <DotsVertical className="cursor-pointer" size={20} /> */}
            </Group>
            {editMode === true && currentCursor === i + 1 ? (
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
                    className="border-b-2 border-gray-300"
                    spellCheck="false"
                    autosize
                    minRows={1}
                    maxRows={64}
                    value={editText}
                    onChange={(e) => {
                      setEditText(e.currentTarget.value);
                    }}
                    id=""
                    variant="unstyled"
                    placeholder="댓글 수정"
                  />
                </Grid.Col>
              </Grid>
            ) : (
              <Text size={16} weight={400} ml={32} mt={12} mb={10}>
                {cur.comment}
              </Text>
            )}
          </Flex>
        );
      })}</>):(<></>)}
      <Stack mb={20} />
    </>
  );
};

export default VideoTitle;
