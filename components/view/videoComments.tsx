import {
  Avatar,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Text,
  Textarea,
} from "@mantine/core";
import {
  ArrowBackUp,
  Ban,
  BrandTelegram,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash,
} from "tabler-icons-react";
import { useClippyLogin } from "../../hooks/useClippyAPI";
import { useEffect, useState } from "react";
import { useLoginModal } from "../../hooks/useLoginModal";
import { apiAddress } from "../constValues";
import axios from "axios";
import { showNotification } from "@mantine/notifications";
import {
  view_actionType,
  view_axiosProgressed,
  view_notiModalOpened,
  view_notiModalStep,
} from "../states";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import { CommentsNotiModal } from "./CommentsNotiModal";
import { showTime } from "../../util/util";

const VideoComments = () => {
  const [commentText, setCommentText] = useState("");
  const [editText, setEditText] = useState("");
  const [comments, setComments] = useState<IComments[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [currentCursor, setCurrentCursor] = useState(0);
  const [commentsUserInfo, setCommentsUserInfo] = useState<ITwitchUserInfo[]>(
    []
  );
  const [commentIsFolded, setCommentIsFolded] = useState(true);

  const setNotiModalStep = useSetRecoilState(view_notiModalStep);
  const [actionType, setActionType] = useRecoilState(view_actionType);
  const [axiosProgressed, setAxiosProgressed] =
    useRecoilState<boolean>(view_axiosProgressed);
  const [notiModalOpened, setNotiModalOpened] =
    useRecoilState<boolean>(view_notiModalOpened);

  const router = useRouter();
  const { clipId } = router.query;
  const { openLoginModal } = useLoginModal();
  const { isClippyLogined, loginedClippyUserInfo } = useClippyLogin();

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

  const getComments = async (clipId: string) => {
    const url = `${apiAddress}/clip/${clipId}/comment`;
    axios
      .get(url, { withCredentials: true })
      .then((res) => {
        setComments(res.data.data.comments);
        getCommentsUserInfo(res.data.data.comments);
      })
      .catch(() => {});
  };

  const getCommentsUserInfo = (commentsArg: IComments[]) => {
    const userInfoArray = commentsArg.map(({ userId }) => {
      return axios.get(`https://twapi.haenu.com/user/id/${userId}`);
    });
    Promise.all(userInfoArray)
      .then((res) => res.map((itm) => itm.data))
      .then((res) => setCommentsUserInfo(res));
  };

  const deleteComments = (clipId: string, clipCommentId: number) => {
    const url = `${apiAddress}/clip/${clipId}/comment/${clipCommentId}`;
    axios
      .delete(url, { withCredentials: true })
      .then(() => {
        setTimeout(() => {
          getNotification(1, true);
          setNotiModalStep(2);
        }, 500);
        getComments(clipId);
      })
      .catch(() => {
        setTimeout(() => {
          getNotification(1, false);
          setNotiModalStep(3);
        }, 500);
        getComments(clipId);
      });
  };

  const reportComments = (clipId: string, clipCommentId: number) => {
    const url = `${apiAddress}/clip/${clipId}/comment/${clipCommentId}/report`;
    axios
      .post(url, {}, { withCredentials: true })
      .then(() => {
        getNotification(0, true);
        setNotiModalStep(2);
        getComments(clipId);
      })
      .catch(() => {
        getNotification(0, false);
        setNotiModalStep(3);
        getComments(clipId);
      });
  };

  const postComments = (clipId: string) => {
    const url = `${apiAddress}/clip/${clipId}/comment`;
    axios
      .post(url, { comment: commentText }, { withCredentials: true })
      .then(() => {
        getNotification(2, true);
        getComments(clipId);
      })
      .catch(() => {
        getNotification(2, true);
        getComments(clipId);
      });
    setCommentText("");
  };

  const editComments = (clipId: string, commentId: number) => {
    const url = `${apiAddress}/clip/${clipId}/comment/${commentId}`;
    axios
      .put(url, { comment: editText }, { withCredentials: true })
      .then(() => {
        getNotification(3, true);
        setEditMode(false);
        getComments(clipId);
      })
      .catch(() => {
        getNotification(3, false);
      });
  };

  const getCommentDate = (
    updatedDate: string,
    createdDate: string,
    commentState: boolean
  ) => {
    let rt = showTime(createdDate);
    if (updatedDate !== createdDate && !commentState) rt += "(수정됨)";
    return rt;
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
    if (!clipId) return;
    getComments(clipId as string);
  }, [clipId]);

  return (
    <>
      <CommentsNotiModal />
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
              openLoginModal(window.location.href);
              return;
            }
            if (commentText.length === 0) {
              return;
            }
            setEditMode(false);
            setCurrentCursor(0);
            postComments(clipId as string);
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
        <Text pt={24} align="center" size={16} weight={300}>
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
                <Group
                  mt={10}
                  className="w-full"
                  align="center"
                  position="apart"
                >
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
                      {
                        (commentsUserInfo[i] || { display_name: "" })
                          .display_name
                      }
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
                            editComments(clipId as string, cur.commentId);
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
                            editComments(clipId as string, cur.commentId);
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
                            reportComments(clipId as string, cur.commentId);
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
                            if (notiModalOpened === false)
                              setNotiModalOpened(true);
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
          })}
        </>
      ) : (
        <></>
      )}
      <div className="h-[60px]"></div>
    </>
  );
};

export default VideoComments;
