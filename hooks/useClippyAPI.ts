import { useRecoilState } from "recoil";
import { common_isLogined, common_loginUserInfo } from "../components/states";
import axios from "axios";
import { apiAddress } from "../components/constValues";
import { useCallback } from "react";

export const useClippyLogin = () => {
  const [isClippyLogined, setIsClippyLogined] =
    useRecoilState(common_isLogined);
  const [loginedClippyUserInfo, setLoginedClippyUserInfo] =
    useRecoilState(common_loginUserInfo);

  const checkClipyLogin = () => {
    return axios
      .get(`${apiAddress}/user/check`, { withCredentials: true })
      .then(() => {
        setIsClippyLogined(true);
        return axios
          .get(`${apiAddress}/user/me`, { withCredentials: true })
          .then((res) => {
            setLoginedClippyUserInfo(res.data.data);
            return true;
          })
          .catch((err) => {
            console.log("cannot load logined user info", err);
            return false;
          });
      })
      .catch(() => {
        setIsClippyLogined(false);
        return false;
      });
  };

  const goClippyLogin = useCallback((redirectURL?: string) => {
    redirectURL && localStorage.setItem("redirect_url", redirectURL);
    window.location.replace(
      `https://id.twitch.tv/oauth2/authorize?client_id=9n3ebjaenen1jipslsk11ufrcfo51t&redirect_uri=${apiAddress}/user/login&response_type=code&scope=clips:edit+user:read:follows`
    );
  }, []);

  const goClippyLogout = useCallback(() => {
    localStorage.removeItem("redirect_url");
    window.location.replace(`${apiAddress}/user/logout`);
  }, []);

  return {
    isClippyLogined,
    loginedClippyUserInfo,
    checkClipyLogin,
    goClippyLogin,
    goClippyLogout,
  };
};
