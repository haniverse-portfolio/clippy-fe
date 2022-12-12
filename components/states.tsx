import { atom } from "recoil";
import { mypageMadeClipDummy, selectedClipDefault } from "./constValues";

/* ***** ***** ***** ***** ***** common ***** ***** ***** ***** ***** */
export const recoil_isLogined = atom({
  key: "recoil_isLogined",
  default: false,
}); // 로그인 여부

export const recoil_followed = atom({
  key: "recoil_followed",
  default: [],
}); // 팔로우 목록

/* *** 사이드 바 *** */
export const recoil_sidebarOpened = atom({
  key: "recoil_sidebarOpened",
  default: false,
}); // 사이드바 여닫힘 여부

export const recoil_sidebarIndex = atom({
  key: "recoil_sidebarIndex",
  default: 0,
}); // 사이드바 항목 인덱스

export const recoil_createModalOpened = atom({
  key: "recoil_createModalOpened",
  default: false,
}); // 사이드바 항목 인덱스

export const recoil_createModalIsLoading = atom({
  key: "recoil_createModalIsLoading",
  default: false,
});

export const recoil_createModalStreamerInfo = atom({
  key: "recoil_createModalStreamerInfo",
  default: { id: "", login: "", name: "", image: "" },
}); // 생성 modal
interface videoType {
  thumbnailUrl: string;
  rawMediaUrl: string;
  requestId: string;
  clip: {
    clipId: string;
    editUrl: string;
  };
}

export const recoil_videoInfo = atom({
  key: "recoil_videoInfo",
  default: {} as videoType,
}); // 생성 - 비디오 정보

export const recoil_createBtnLoading = atom({
  key: "recoil_createBtnLoading",
  default: false,
}); // 생성 - 버튼 로딩 여부

export interface clipType {
  requestId: string;
  starts: number;
  ends: number;
  title: string;
}
export const recoil_createClip = atom({
  key: "recoil_createClip",
  default: {} as clipType,
}); // 생성 - 클립 정보
export const recoil_createClipTrigger = atom({
  key: "recoil_createClipTrigger",
  default: false,
}); // 생성 - 클립 생성 트리거

/* ***** ***** ***** ***** ***** common ***** ***** ***** ***** ***** */

/* ***** ***** ***** ***** ***** mypage_manage ***** ***** ***** ***** ***** */
export const recoil_deleteModalStep = atom({
  key: "recoil_deleteModalStep",
  default: 0,
}); // 삭제 modal 화면 인덱스

export const mypageManage_deleteModalOpened = atom({
  key: "mypageManage_deleteModalOpened",
  default: false,
});

export const mypageManage_sectionIndex = atom({
  key: "mypageManage_sectionIndex",
  default: 0,
});

export const mypageManage_selectedClip = atom({
  key: "mypageManage_selectedClip",
  default: selectedClipDefault,
});

export const mypageManage_madeClip = atom({
  key: "mypageManage_madeClip",
  default: mypageMadeClipDummy,
});

export const mypageManage_channelClip = atom({
  key: "mypageManage_channelClip",
  default: mypageMadeClipDummy,
});
/* ***** ***** ***** ***** ***** mypage_manage ***** ***** ***** ***** ***** */

/* ***** ***** ***** ***** ***** create ***** ***** ***** ***** ***** */
/* ***** ***** ***** ***** ***** create ***** ***** ***** ***** ***** */
