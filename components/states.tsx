import { atom } from "recoil";
import { mypageMadeClipDummy } from "./constValues";

/* ***** ***** ***** ***** ***** common ***** ***** ***** ***** ***** */
export const recoil_isLogined = atom({
  key: "recoil_isLogined",
  default: false,
}); // 로그인 여부

export const recoil_loginUserInfo = atom<ILoginedUserInfo | null>({
  key: "recoil_loginUserInfo",
  default: null,
}); // 로그인 유저 정보

export const recoil_searchText = atom({
  key: "recoil_searchText",
  default: "",
}); // 내비게이션바 - 검색 텍스트

export const recoil_followed = atom<IFollowedStreamerInfo[]>({
  key: "recoil_followed",
  default: [],
}); // 사이드바 - 팔로우 목록

/* *** 사이드 바 *** */
export const recoil_sidebarOpened = atom({
  key: "recoil_sidebarOpened",
  default: false,
}); // 사이드바 - 여닫힘 여부

export const recoil_sidebarIndex = atom({
  key: "recoil_sidebarIndex",
  default: 0,
}); // 사이드바 - 항목 인덱스

/**
 * 클립생성모달 - Open 여부
 */
export const recoil_createClipModal_isOpen = atom({
  key: "recoil_createClipModal_isOpen",
  default: false,
});

/**
 * 클립생성모달 - 클립을 생성할 스트리머 정보
 */
export const recoil_createClipModal_streamer =
  atom<ICreateClipStreamerInfo | null>({
    key: "recoil_createClipModal_streamer",
    default: null,
  });

/**
 * 클립생성모달 - 초기 로딩 여부
 */
export const recoil_createClipModal_isClipInitLoading = atom({
  key: "recoil_createClipModal_isClipInitLoading",
  default: true,
});

/**
 * 클립생성모달 - 클립생성 오류 상태
 */
export const recoil_createClipModal_error = atom<ICreateClipModalError | null>({
  key: "recoil_createClipModal_error",
  default: null,
});

/**
 * 클립생성모달 - 클립생성을 위해 획득한 라이브 비디오 정보
 */
export const recoil_createClipModal_liveVideoInfo = atom<ILiveVideoInfo | null>(
  {
    key: "recoil_createClipModal_liveVideoInfo",
    default: null,
  }
);

/**
 * 클립공유모달 - Open 여부
 */
export const recoil_shareClipModal_isOpen = atom({
  key: "recoil_shareClipModal_isOpen",
  default: false,
});
/**
 * 클립공유모달 - 공유할 클립정보 interface
 */
interface IShareClipModalContent {
  streamer: string;
  thumbnail: string;
  title: string;
  like: number;
  clipper: string;
}
/**
 * 클립공유모달 - 공유할 클립정보
 */
export const recoil_shareClipModal_content =
  atom<IShareClipModalContent | null>({
    key: "recoil_shareClipModal_content",
    default: null,
  });

/**
 * 로그인모달 - Open 여부
 */
export const recoil_loginModal_isOpen = atom({
  key: "recoil_loginModal_isOpen",
  default: false,
});
/* ***** ***** ***** ***** ***** common ***** ***** ***** ***** ***** */

/* ***** ***** ***** ***** ***** mypage_manage ***** ***** ***** ***** ***** */
export const recoil_deleteModalStep = atom({
  key: "recoil_deleteModalStep",
  default: 0,
}); // 삭제 - 모달 화면 인덱스

export const recoil_deleteTargetClips = atom({
  key: "recoil_deleteTargetClips",
  default: [] as string[],
}); // 삭제 - 대상 클립 배열

export const recoil_mypageManageReloadTrigger = atom({
  key: "recoil_mypageManageReloadTrigger",
  default: true,
}); // 관리 - 리로딩 트리거

export const mypageManage_deleteModalOpened = atom({
  key: "mypageManage_deleteModalOpened",
  default: false,
}); // 삭제 - 모달 여닫힘 여부

export const mypageManage_sectionIndex = atom({
  key: "mypageManage_sectionIndex",
  default: 0,
}); // 관리 - 항목 인덱스

export const mypageManage_selectedClip = atom({
  key: "mypageManage_selectedClip",
  default: [] as string[],
}); // 관리 - 선택된 클립 배열

interface mypage_clipTypes extends Array<mypage_clipType> {}
export const mypageManage_madeClip = atom({
  key: "mypageManage_madeClip",
  default: [] as mypage_clipTypes,
}); // 관리 - 내가 만든 클립

export const mypageManage_channelClip = atom({
  key: "mypageManage_channelClip",
  default: [] as mypage_clipTypes,
}); // 관리 - 내 채널의 클립
/* ***** ***** ***** ***** ***** mypage_manage ***** ***** ***** ***** ***** */

/* ***** ***** ***** ***** ***** search ***** ***** ***** ***** ***** */
interface searchResultType {
  id: string;
  name: string;
  display_name: string;
  logo: string;
  url: string;
}
interface searchResultsType extends Array<searchResultType> {}
export const search_searchResult = atom({
  key: "search_searchResult",
  default: [] as searchResultsType,
}); // 검색 - 검색 결과 채널목록
/* ***** ***** ***** ***** ***** search ***** ***** ***** ***** ***** */
