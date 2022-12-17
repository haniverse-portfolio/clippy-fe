import { useRecoilState, useSetRecoilState } from "recoil";
import {
  IStreamerInfo,
  recoil_createClipModal_error,
  recoil_createClipModal_isClipInitLoading,
  recoil_createClipModal_isOpen,
  recoil_createClipModal_liveVideoInfo,
  recoil_createClipModal_streamer,
} from "../components/states";
import axios from "axios";
import { apiAddress } from "../components/constValues";

export const useCreateClipModal = () => {
  const [isModalOpen, setIsModalOpen] = useRecoilState(
    recoil_createClipModal_isOpen
  );
  const setIsClipInitLoading = useSetRecoilState(
    recoil_createClipModal_isClipInitLoading
  );
  const setStreamerInfo = useSetRecoilState(recoil_createClipModal_streamer);
  const setCreateClipError = useSetRecoilState(recoil_createClipModal_error);
  const setLiveVideoInfo = useSetRecoilState(
    recoil_createClipModal_liveVideoInfo
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
    if (!isModalOpen) {
      postExtractor(streamerId);
      setStreamerInfo({
        id: "",
        login: "",
        name: streamerName,
        image: streamerProfileImage,
      });
      setIsClipInitLoading(true);
      setIsModalOpen(true);
    }
  };

  const closeCreateClipModal = () => {
    setIsModalOpen(false);
    setIsClipInitLoading(false);
    setCreateClipError(null);
    setStreamerInfo(null);
    setLiveVideoInfo(null);
  };

  return { openCreateClipModal, closeCreateClipModal };
};
