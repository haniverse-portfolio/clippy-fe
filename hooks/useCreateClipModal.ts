import { useRecoilState, useSetRecoilState } from "recoil";
import {
  common_createClipModal_error,
  common_createClipModal_isClipInitDone,
  common_createClipModal_isClipInitLoading,
  common_createClipModal_isOpen,
  common_createClipModal_liveVideoInfo,
  common_createClipModal_streamer,
} from "../components/states";
import axios from "axios";
import { apiAddress } from "../components/constValues";
import { useClippyLogin } from "./useClippyAPI";

export const useCreateClipModal = () => {
  const { isClippyLogined } = useClippyLogin();
  const [isCreateClipModalOpen, setCreateClipIsModalOpen] = useRecoilState(
    common_createClipModal_isOpen
  );
  const setIsClipInitLoading = useSetRecoilState(
    common_createClipModal_isClipInitLoading
  );
  const setIsClipInitDone = useSetRecoilState(
    common_createClipModal_isClipInitDone
  );
  const setStreamerInfo = useSetRecoilState(common_createClipModal_streamer);
  const [createClipError, setCreateClipError] = useRecoilState(
    common_createClipModal_error
  );
  const setLiveVideoInfo = useSetRecoilState(
    common_createClipModal_liveVideoInfo
  );

  const postExtractor = async (streamerId: number) => {
    axios
      .post(
        `${apiAddress}/extractor`,
        { streamerId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setIsClipInitLoading(false);
        setLiveVideoInfo(res.data.data);
      })
      .catch((res) => {
        setCreateClipError({
          msg: res.response.data.message,
          statusCode: res.response.data.statusCode,
        });
      });
  };

  const openCreateClipModal = (
    streamerId: number,
    streamerName: string,
    streamerProfileImage: string
  ) => {
    if (!isCreateClipModalOpen && isClippyLogined) {
      postExtractor(streamerId);
      setStreamerInfo({
        id: streamerId,
        login: "",
        name: streamerName,
        image: streamerProfileImage,
      });
      setIsClipInitLoading(true);
      setIsClipInitDone(false);
      setCreateClipIsModalOpen(true);
    }
  };

  const closeCreateClipModal = () => {
    setCreateClipIsModalOpen(false);
    setIsClipInitLoading(true);
    setIsClipInitDone(false);
    setCreateClipError(null);
    setStreamerInfo(null);
    setLiveVideoInfo(null);
  };

  const retryCreateClip = (streamerId: number) => {
    if (createClipError && createClipError.statusCode === 500) {
      setIsClipInitLoading(true);
      setIsClipInitDone(false);
      setCreateClipError(null);
      setLiveVideoInfo(null);
      postExtractor(streamerId);
    }
  };

  return {
    isCreateClipModalOpen,
    openCreateClipModal,
    closeCreateClipModal,
    retryCreateClip,
  };
};
