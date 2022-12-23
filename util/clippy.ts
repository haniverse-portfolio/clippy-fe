import axios from "axios";
import { apiAddress } from "../components/constValues";

/**
 * 핫클립을 요청하는 함수
 * @param type 핫클립 타입
 * @returns 클립 정보 배열
 */
export const getHotclip = (type = "popular"): Promise<IClipInfo[]> => {
  return axios
    .get(`${apiAddress}/hotclip/${type}`, {
      withCredentials: true,
    })
    .then((res) => res.data.data)
    .catch((err) => {
      console.error("cannot load hot-clip list", err);
      return [];
    });
};

/**
 * 특정 스트리머의 클립들을 요청하는 함수
 * @param streamerNumericId 스트리머 숫자형 ID
 * @returns 클립 정보 배열
 */
export const getStreamerClips = (
  streamerNumericId: string
): Promise<IClipInfo[]> => {
  return axios
    .get(`${apiAddress}/clip/user/${streamerNumericId}`, {
      withCredentials: true,
    })
    .then((res) => res.data.data)
    .catch((err) => {
      console.error("cannot load streamer clips", err);
      return [];
    });
};

/**
 * 특정 클립의 정보를 요청하는 함수
 * @param clipId 클립 ID
 * @returns 클립 정보
 */
export const getClip = (clipId: string): Promise<IClipInfo | null> => {
  return axios
    .get(`${apiAddress}/clip/${clipId}`)
    .then((res) => res.data.data)
    .catch((err) => {
      console.error("cannot load clip", err);
      return null;
    });
};

/**
 * 트위치 로그인 ID로 사용자 정보를 요청하는 함수
 * @param userName 트위치 사용자 로그인 ID
 * @returns 트위치 사용자 정보
 */
export const getTwitchUserInfoByName = (
  userName: string
): Promise<ITwitchUserInfo | null> => {
  return axios
    .get(`https://api.partyview.tv/streamer/name/${userName}`)
    .then((res) => res.data.data)
    .catch((err) => {
      console.error("cannot load streamer info", err);
      return null;
    });
};

/**
 * 트위치 숫자형 ID로 사용자 정보를 요청하는 함수
 * @param userId 트위치 숫자형 ID
 * @returns 트위치 사용자 정보
 */
export const getTwitchUserInfoById = (
  userId: number
): Promise<ITwitchUserInfo | null> => {
  return axios
    .get(`https://api.partyview.tv/streamer/id/${userId}`)
    .then((res) => res.data.data)
    .catch((err) => {
      console.error("cannot load streamer info", err);
      return null;
    });
};

/**
 * 트위치 스트리머의 라이브 여부를 요청하는 함수
 * @param streamerLoginId 트위치 사용자 로그인 ID
 * @returns
 */
export const checkStreamerIsLive = (
  streamerLoginId: string
): Promise<boolean> => {
  return axios
    .get(`https://api.partyview.tv/streamer/name/${streamerLoginId}/live`)
    .then((res) => {
      console.log(res);
      return true;
    })
    .catch(() => false);
};

/**
 * Clippy에 로그인한 사용자가 팔로우 중인 스트리머 정보를 요청하는 함수
 * @returns 팔로우 스트리머 정보 배열
 */
export const getFollowedStreamer = (): Promise<ILiveStreamerInfo[]> => {
  return axios
    .get(`${apiAddress}/twitch/followed_streams`, {
      withCredentials: true,
    })
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.error("cannot load followed streamer", err);
      return [];
    });
};

export const getDefaultLiveStreamer = (): Promise<ILiveStreamerInfo[]> => {
  return axios
    .get(`${apiAddress}/twitch/followed_streams/default`)
    .then((res) => res.data.data)
    .catch((err) => {
      console.error("cannot load default live streamer", err);
      return [];
    });
};
