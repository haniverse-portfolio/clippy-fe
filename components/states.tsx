import { atom } from "recoil";

/* ***** ***** ***** ***** ***** common ***** ***** ***** ***** ***** */
export const recoil_isLogined = atom({
  key: "recoil_isLogined",
  default: false,
}); // 로그인 여부

export const recoil_followed = atom({
  key: "recoil_followed",
  default: [],
}); // 팔로우 목록

export const recoil_sidebarOpened = atom({
  key: "recoil_sidebarOpened",
  default: false,
}); // 사이드바 여닫힘 여부

export const recoil_sidebarIndex = atom({
  key: "recoil_sidebarIndex",
  default: 0,
}); // 사이드바 항목 인덱스
/* ***** ***** ***** ***** ***** common ***** ***** ***** ***** ***** */
