import { atom } from "recoil";

/* *** common *** */
export const recoil_isLogined = atom({
  key: "recoil_isLogined",
  default: false,
});

export const recoil_followed = atom({
  key: "recoil_followed",
  default: [],
});

export const recoil_drawerOpened = atom({
  key: "recoil_drawerOpened",
  default: false,
});

export const recoil_drawerIndex = atom({
  key: "recoil_drawerIndex",
  default: 0,
});
