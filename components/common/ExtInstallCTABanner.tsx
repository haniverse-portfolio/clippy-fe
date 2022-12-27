import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Paper,
  Text,
  Group,
  CloseButton,
  Checkbox,
} from "@mantine/core";
import { useEffect, useState } from "react";

export const ExtInstallCTABanner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const closeBanner = () => {
    if (isChecked)
      localStorage.setItem(
        "ext-inst-cta-banner-block-date",
        new Date().toISOString()
      );
    setIsOpen(false);
  };

  useEffect(() => {
    setTimeout(() => {
      const userAgent = window.navigator.userAgent;
      const isChrome = !!userAgent.match(/Chrome/i);
      const isDesktop = !userAgent.match(/(iPhone|iPad|iPod|Android)/i);
      const isInstalled =
        document.documentElement.getAttribute("extension-installed") !== null;

      const extInstCTABannerBlockDate = localStorage.getItem(
        "ext-inst-cta-banner-block-date"
      );
      if (
        (extInstCTABannerBlockDate &&
          new Date(extInstCTABannerBlockDate).getDate() ===
            new Date().getDate()) ||
        !isChrome ||
        !isDesktop ||
        isInstalled
      ) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    }, 3000);
  }, []);

  return (
    <>
      {isOpen && (
        <Paper
          withBorder
          p="lg"
          radius="md"
          shadow="md"
          pos="fixed"
          className="z-20 bottom-4 right-4 max-w-[min(80vw,400px)] animate-fadeUp"
        >
          <Group position="apart" mb="xs">
            <Text size="md" weight={500}>
              📎 Clippy 확장 프로그램
            </Text>
            <CloseButton mr={-9} mt={-9} onClick={closeBanner} />
          </Group>
          <Text color="dimmed" size="xs" mt="md">
            클릭 한 번으로{" "}
            <strong className="font-bold text-black">
              Twitch에서 Clippy를 간편하게 사용
            </strong>
            해보세요!
            <br />
            Clippy로 빠르고 쉽게 소중한 순간을 간직하세요 😄
          </Text>
          <Text color="lime" size="md" weight="bold" my="md">
            <FontAwesomeIcon
              icon={solid("circle-check")}
              height={16}
              color="#82C91E"
              className="inline-block mt-[-3px]"
            />{" "}
            현재 브라우저와 호환됨
          </Text>
          <Group position="right">
            <Checkbox
              color="dark"
              size="xs"
              label="오늘하루보지않기"
              checked={isChecked}
              onChange={(e) => {
                setIsChecked(e.currentTarget.checked);
              }}
            />
            <Button
              variant="outline"
              color="gray"
              size="xs"
              radius={9999}
              onClick={closeBanner}
            >
              닫기
            </Button>
            <Button
              variant="filled"
              color="dark"
              size="xs"
              radius={9999}
              onClick={() => window.open("https:/extension.clippy.kr")}
            >
              설치하기
            </Button>
          </Group>
        </Paper>
      )}
    </>
  );
};
