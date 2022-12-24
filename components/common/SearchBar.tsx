import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Image, TextInput } from "@mantine/core";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  memo,
  useEffect,
  useState,
} from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { common_searchText, common_showMobileSearchBar } from "../states";
import { useInterval } from "../../hooks/useInterval";
import { getTwitchChannel } from "../../util/clippy";

const addSearchHistory = (keyword: string) => {
  const history = localStorage.getItem("search-history");
  localStorage.setItem(
    "search-history",
    JSON.stringify(
      history
        ? [keyword, ...JSON.parse(history).filter((x: string) => x !== keyword)]
        : [keyword]
    )
  );
};

const saveSearchHistory = (keywords: string[]) => {
  localStorage.setItem("search-history", JSON.stringify(keywords));
};

interface SearchBarProps {
  className?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyUp: (event: KeyboardEvent<HTMLInputElement>) => void;
  clearInputText: () => void;
}

const SearchBarBottomList = ({
  isEmpty,
  searchText,
  channelList,
  closeSearchList,
}: {
  isEmpty: boolean;
  searchText: string;
  channelList: ISearchChannelInfo[];
  closeSearchList: () => void;
}) => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const history = localStorage.getItem("search-history");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    saveSearchHistory(searchHistory);
  }, [searchHistory]);

  return (
    <div
      className="max-h-[calc(100vh-150px)] block w-full bg-white z-0 overflow-x-hidden overflow-y-auto"
      style={{ borderRadius: "0 0 28px 28px" }}
    >
      {isEmpty && (
        <>
          {searchHistory.length > 0 &&
            searchHistory
              .filter((_, idx) => idx < 10)
              .map((itm, idx) => (
                <div
                  key={idx}
                  className="w-full py-3 pl-[70px] pr-5 hover:bg-gray-100 cursor-pointer duration-200 flex justify-start items-center gap-[20px] relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeSearchList();
                    router.push(`/search/${itm}`);
                  }}
                >
                  <FontAwesomeIcon
                    icon={regular("clock")}
                    color="#7a7a7a"
                    width="20px"
                    className="ml-[-38px] mb-[-2px]"
                  />
                  <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis text-lg">
                    {itm}
                  </div>
                  <FontAwesomeIcon
                    className="cursor-pointer w-5 mb-[-2px]"
                    icon={regular("circle-xmark")}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchHistory((state) => {
                        const arr = [...state];
                        arr.splice(idx, 1);
                        return arr;
                      });
                    }}
                  />
                </div>
              ))}
        </>
      )}
      {!isEmpty && channelList.length === 0 && (
        <div className="w-full py-3 pl-[70px] pr-5">
          <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis text-lg">
            검색결과가 없습니다.
          </div>
        </div>
      )}
      {!isEmpty && channelList.length > 0 && (
        <>
          <>
            {channelList
              .filter((_, idx) => idx < 10)
              .map((itm, idx) => (
                <div
                  key={idx}
                  className="w-full py-3 pl-[70px] pr-5 hover:bg-gray-100 cursor-pointer duration-200 flex justify-start items-center gap-[10px] relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeSearchList();
                    router.push(`/channel/${itm.name}`);
                  }}
                >
                  <Image
                    src={itm.logo}
                    width="32px"
                    className="rounded-full overflow-hidden ml-[-42px]"
                    alt="search-result-profile-image"
                  />
                  <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis text-lg">
                    {itm.display_name} ({itm.name})
                  </div>
                </div>
              ))}
          </>
          <div
            className="w-full py-3 pl-[70px] pr-5 hover:bg-gray-100 cursor-pointer duration-200 flex justify-start items-center gap-[10px] relative border-t-[1px]"
            onClick={(e) => {
              e.stopPropagation();
              closeSearchList();
              addSearchHistory(searchText.trim());
              router.push(`/search/${searchText.trim()}`);
            }}
          >
            <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis text-lg">
              검색결과 더보기
            </div>
          </div>
        </>
      )}
    </div>
  );
};
const MemoSearchBarBottomList = memo(SearchBarBottomList);

const SearchBarTextInput: FC<SearchBarProps> = ({
  className = "",
  value,
  onChange,
  onKeyUp,
  clearInputText,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [channelList, setChannelList] = useState<ISearchChannelInfo[]>([]);
  const setIsMobileSearchBarOpen = useSetRecoilState(
    common_showMobileSearchBar
  );

  const searchTwitchChannel = () => {
    if (value.trim() !== "") {
      getTwitchChannel(value).then((res) => setChannelList(res));
    }
  };

  const closeSearchList = () => {
    setIsFocused(false);
    setIsMouseOver(false);
    setIsMobileSearchBarOpen(false);
  };

  useEffect(() => {
    setIsEmpty(value.trim() === "");
  }, [value]);

  useEffect(() => {
    if (isFocused) searchTwitchChannel();
  }, [isFocused]);

  useInterval(searchTwitchChannel, isFocused ? 500 : null);

  return (
    <>
      <div
        className={`search-bar-input-wrap rounded-[25px] bg-white h-max box-content absolute ${className}`}
        style={{
          border: isFocused || isMouseOver ? "1px solid black" : "",
          boxShadow: "0px 4px 15px rgba(119, 119, 119, 0.25)",
        }}
        onClick={() => {
          setIsMouseOver(true);
        }}
        onMouseLeave={() => {
          setIsMouseOver(false);
        }}
      >
        <TextInput
          className={`search-bar-input relative p-0 pr-[50px] z-10 bg-white ${
            isFocused || isMouseOver ? "focused" : ""
          } ${isEmpty ? "empty" : ""}`}
          style={{
            width: "100%",
            border: 0,
            borderRadius: "28px",
          }}
          autoComplete="off"
          size="lg"
          radius="xl"
          placeholder="닉네임, 제목 키워드"
          icon={
            <FontAwesomeIcon
              className="search-bar-input-icon w-5 ml-[30px]"
              icon={solid("magnifying-glass")}
              fontWeight={900}
            />
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          onChange={onChange}
          onKeyUp={(e) => {
            onKeyUp(e);
            if (e.key === "Enter" && value.trim() !== "") {
              closeSearchList();
            }
          }}
        />
        {(isFocused || isMouseOver) && value.trim().length > 0 && (
          <div
            className="absolute top-[16px] right-[30px] w-[20px] h-[20px] z-10"
            onClick={clearInputText}
          >
            <FontAwesomeIcon
              className="w-5 cursor-pointer"
              icon={regular("circle-xmark")}
            />
          </div>
        )}
        {(isFocused || isMouseOver) && (
          <MemoSearchBarBottomList
            isEmpty={isEmpty}
            closeSearchList={closeSearchList}
            searchText={value}
            channelList={channelList}
          />
        )}
      </div>
      <style jsx global>{`
        .search-bar-input input {
          border: none !important;
          padding-left: 70px;
        }

        .search-bar-input .search-bar-input-icon {
          color: #dedede;
          transition: 0.2s;
        }

        .search-bar-input.focused .search-bar-input-icon {
          color: black !important;
        }
      `}</style>
    </>
  );
};

const SearchBarMobile: FC<SearchBarProps> = ({
  className = "",
  value,
  onChange,
  onKeyUp,
  clearInputText,
}) => {
  const [isOpen, setIsOpen] = useRecoilState(common_showMobileSearchBar);

  return (
    <>
      {isOpen && (
        <div className="absolute top-0 left-0 w-full h-full z-20 bg-white p-5 flex justify-end items-center gap-5 animate-fadeIn md:hidden">
          <SearchBarTextInput
            className={className}
            value={value}
            onChange={onChange}
            onKeyUp={onKeyUp}
            clearInputText={clearInputText}
          />
          <Button
            h={48}
            color="dark"
            radius={99}
            px={20}
            style={{
              fontSize: 16,
              fontWeight: 700,
            }}
            onClick={() => setIsOpen(false)}
          >
            닫기
          </Button>
        </div>
      )}
    </>
  );
};

export const SearchBar = () => {
  const [searchText, setSearchText] = useRecoilState(common_searchText);
  const setIsMobileSearchBarOpen = useSetRecoilState(
    common_showMobileSearchBar
  );

  const router = useRouter();

  const searchBarOnChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value.replace(/ /g, "")); //공백문자 제거
  };

  const searchBarOnKeyUpHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchText.trim() !== "") {
      event.currentTarget.blur();
      setIsMobileSearchBarOpen(false);
      addSearchHistory(searchText.trim());
      router.push(`/search/${searchText.trim()}`);
    }
  };

  const clearInputText = () => {
    setSearchText("");
  };

  return (
    <>
      <SearchBarMobile
        className="w-[calc(100vw-130px)] top-[calc(60px-24px)] left-5"
        value={searchText}
        onChange={searchBarOnChangeHandler}
        onKeyUp={searchBarOnKeyUpHandler}
        clearInputText={clearInputText}
      />
      <div className="relative w-full h-[50px] px-0 md:px-10 lg:px-20">
        <SearchBarTextInput
          className="hidden md:block w-[calc(100vw-500px)] max-w-[min(45vw,588px)] top-0 left-10 lg:left-20"
          value={searchText}
          onChange={searchBarOnChangeHandler}
          onKeyUp={searchBarOnKeyUpHandler}
          clearInputText={clearInputText}
        />
      </div>
    </>
  );
};
