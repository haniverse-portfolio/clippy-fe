import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { FC, useEffect, useRef, useState } from "react";

export const TopNotice: FC = () => {
  const [notice, setNotice] = useState<string | null>(null);
  const [noticeLink, setNoticeLink] = useState("#");
  const [noticeStartsAt, setNoticeStartAt] = useState("");
  const [isIncident, setIsIncident] = useState(false);
  const [isClosable, setIsClosable] = useState(false);
  const [isClose, setIsClose] = useState(false);
  const [isScrollable, setScrollable] = useState(false);

  const wrapDivRef = useRef<HTMLDivElement>(null);
  const [wrapDivWidth, setWrapDivWidth] = useState(1);
  const msgSpanRef = useRef<HTMLSpanElement>(null);
  const [msgSpanWidth, setMsgSpanWidth] = useState(0);

  const windowResizeEventHandler = () => {
    if (wrapDivRef.current && msgSpanRef.current) {
      setWrapDivWidth(wrapDivRef.current.offsetWidth);
      setMsgSpanWidth(msgSpanRef.current.offsetWidth);
    }
  };

  const getNotice = async () => {
    await axios
      .get(`${window.location.origin}/api/notice`)
      .then((res) => {
        console.log("notice", res);
        if (
          localStorage.getItem("clippy-top-notice-latest") !==
          res.data.starts_at
        ) {
          const now = new Date();
          const noticeStartTime = new Date(res.data.starts_at);
          const noticeEndTime = new Date(res.data.ends_at);
          if (
            now.getTime() >= noticeStartTime.getTime() &&
            now.getTime() < noticeEndTime.getTime()
          ) {
            setIsIncident(res.data.type === "incident");
            setNotice(res.data.title);
            setNoticeLink(res.data.link);
            setIsClosable(res.data.closable);
            setNoticeStartAt(res.data.starts_at);
          }
        }
      })
      .catch((err) => {
        console.error("cannot load notice", err);
      });
  };

  useEffect(() => {
    getNotice();
    window.addEventListener("resize", windowResizeEventHandler);
    return () => {
      window.removeEventListener("resize", windowResizeEventHandler);
    };
  }, []);

  useEffect(() => {
    if (wrapDivWidth < msgSpanWidth) {
      !isScrollable && setScrollable(true);
    } else {
      isScrollable && setScrollable(false);
    }
  }, [wrapDivWidth, msgSpanWidth]);

  useEffect(() => {
    if (wrapDivRef.current && msgSpanRef.current) {
      windowResizeEventHandler();
    }
  }, [wrapDivRef, msgSpanRef]);

  return (
    <>
      {notice && !isClose && (
        <>
          <div
            className="relative w-full h-[30px] duration-200 px-16"
            style={{ backgroundColor: isIncident ? "#d9571f" : "#75D91F" }}
          >
            <div
              ref={wrapDivRef}
              className="relative w-full h-full flex justify-center items-center overflow-hidden"
            >
              <a
                href={noticeLink}
                target="_blank"
                rel="noreferrer"
                className={`clippy-notice-msg ${
                  isScrollable ? "scrollable" : ""
                } whitespace-nowrap text-white font-bold text-[16px] mt-[-2px]`}
                data-notice-msg={notice}
              >
                <span ref={msgSpanRef} className="whitespace-nowrap">
                  {notice}
                </span>
              </a>
            </div>
            {!isIncident && isClosable && (
              <FontAwesomeIcon
                icon={solid("xmark")}
                color="white"
                height="18px"
                className="absolute top-[50%] right-4 translate-y-[-50%] cursor-pointer"
                onClick={() => {
                  localStorage.setItem(
                    "clippy-top-notice-latest",
                    noticeStartsAt
                  );
                  setIsClose(true);
                }}
              />
            )}
          </div>
          <style jsx>{`
            .clippy-notice-msg.scrollable {
              position: absolute !important;
              left: 0 !important;
              top: 50% !important;
              transform: translateY(calc(-50% + 2px));
              animation: notice-scroll 20s 3s linear infinite;
            }
            .clippy-notice-msg.scrollable::after {
              content: attr(data-notice-msg);
              margin-left: 30px;
            }
            @keyframes notice-scroll {
              from {
                transform: translate(0, calc(-50% + 2px));
              }
              to {
                transform: translate(calc(-100% - 30px), calc(-50% + 2px));
              }
            }
          `}</style>
        </>
      )}
    </>
  );
};
