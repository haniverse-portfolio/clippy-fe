import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, TextInput } from "@mantine/core";
import { useRouter } from "next/router";
import { ChangeEvent, FC, KeyboardEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { common_searchText, common_showMobileSearchBar } from "../states";

interface SearchBarProps {
  className?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  clearInputText: () => void;
}

const SearchBarTextInput: FC<SearchBarProps> = ({
  className = "",
  value,
  onChange,
  onKeyDown,
  clearInputText,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <TextInput
        className={`search-bar-input relative p-0 ${
          isFocused ? "focused" : ""
        } ${className}`}
        style={{
          width: "100%",
          height: 48,
          border: 0,
          boxShadow: "0px 4px 15px rgba(119, 119, 119, 0.25)",
          borderRadius: "99999px",
        }}
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
        rightSection={
          value.trim().length > 0 && (
            <FontAwesomeIcon
              className="w-5 mr-[30px] cursor-pointer"
              icon={regular("circle-xmark")}
              onClick={clearInputText}
            />
          )
        }
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <style jsx global>{`
        .search-bar-input input {
          border-color: white;
          padding-left: 70px;
          transition: 0.2s;
        }

        .search-bar-input.focused input {
          border-color: black;
          color: black;
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
  onKeyDown,
  clearInputText,
}) => {
  const [isOpen, setIsOpen] = useRecoilState(common_showMobileSearchBar);

  return (
    <>
      {isOpen && (
        <div
          className={`absolute top-0 left-0 w-full h-full z-20 bg-white p-5 flex justify-between items-center gap-5 animate-fadeIn ${className}`}
        >
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
            {/* <FontAwesomeIcon
              icon={solid("arrow-left")}
              color="#fff"
              height="32px"
            /> */}
            닫기
          </Button>
          <SearchBarTextInput
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            clearInputText={clearInputText}
          />
        </div>
      )}
    </>
  );
};

export const SearchBar = () => {
  const [searchText, setSearchText] = useRecoilState(common_searchText);

  const router = useRouter();

  const searchBarOnChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value.replace(/ /g, "")); //공백문자 제거
  };

  const searchBarOnKeyDownHandler = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      router.push(`/search/${searchText.trim()}`);
    }
  };

  const clearInputText = () => {
    setSearchText("");
  };

  return (
    <>
      <SearchBarTextInput
        className="hidden md:block max-w-[588px]"
        value={searchText}
        onChange={searchBarOnChangeHandler}
        onKeyDown={searchBarOnKeyDownHandler}
        clearInputText={clearInputText}
      />
      <SearchBarMobile
        className="block md:hidden"
        value={searchText}
        onChange={searchBarOnChangeHandler}
        onKeyDown={searchBarOnKeyDownHandler}
        clearInputText={clearInputText}
      />
    </>
  );
};
