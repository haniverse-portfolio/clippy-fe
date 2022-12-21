import { useRecoilState, useSetRecoilState } from "recoil";
import {
  common_createClipModal_error,
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
  const setStreamerInfo = useSetRecoilState(common_createClipModal_streamer);
  const setCreateClipError = useSetRecoilState(common_createClipModal_error);
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
        setCreateClipError({ msg: res.response.data.message });
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
        id: "",
        login: "",
        name: streamerName,
        image: streamerProfileImage,
      });
      setIsClipInitLoading(true);
      setCreateClipIsModalOpen(true);
    }
  };

  const closeCreateClipModal = () => {
    setCreateClipIsModalOpen(false);
    setIsClipInitLoading(false);
    setCreateClipError(null);
    setStreamerInfo(null);
    setLiveVideoInfo(null);
  };

  return { isCreateClipModalOpen, openCreateClipModal, closeCreateClipModal };
};
