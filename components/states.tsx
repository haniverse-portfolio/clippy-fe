import { atom } from "recoil";

/* *** common *** */
export const isLogined = atom({
  key: "isLogined",
  default: false,
});

export const followed = atom({
  key: "followed",
  default: [],
});

export const drawerOpened = atom({
  key: "drawerOpened",
  default: false,
});
