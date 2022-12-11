import { solid, regular } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Flex, Text } from "@mantine/core";
import { Footer } from "./LiveAside";

const UserAside = () => {
  return (
    <Flex
      align="center"
      direction="column"
      justify="space-between"
      style={{ height: "calc(100vh - 120px)" }}
    >
      <Flex mt={88} direction="column" align="center" w="100%">
        <Text size={36} fw={300}>
          내 채널
        </Text>
        <Avatar src="/images/mock-user.svg" size={98} mt={18} mb={10}></Avatar>
        <Text weight={300} size={16}>
          닉네임
        </Text>
        <Flex direction="column" mt={50} w="100%">
          <div
            className="w-100% h-[48px] px-[8px] pt-[11px] pb-[15px] mb-[15px]"
            style={{ backgroundColor: "#f2f2f2" }}
          >
            <Flex pl={53} align="center">
              <FontAwesomeIcon
                icon={solid("gear")}
                width={18}
                color="#111111"
              />
              <Text ml={17} size={16} weight={700}>
                클립 관리
              </Text>
            </Flex>
          </div>
          <div
            className="w-100% h-[48px] px-[8px] pt-[11px] pb-[15px] mb-[15px]"
            // style={{ backgroundColor: "#f2f2f2" }}
          >
            <Flex pl={53} align="center">
              <FontAwesomeIcon
                icon={solid("paperclip")}
                width={18}
                color="#111111"
              />
              <Text ml={17} size={16} weight={700}>
                클립 생성
              </Text>
            </Flex>
          </div>
          <div
            className="w-100% h-[48px] px-[8px] pt-[11px] pb-[15px] mb-[15px]"
            // style={{ backgroundColor: "#f2f2f2" }}
          >
            <Flex pl={53} align="center">
              <FontAwesomeIcon
                icon={solid("tower-broadcast")}
                width={18}
                color="#111111"
              />
              <Text ml={17} size={16} weight={700}>
                팔로우 중인 채널
              </Text>
            </Flex>
          </div>
          <div
            className="w-100% h-[48px] px-[8px] pt-[11px] pb-[15px] mb-[15px]"
            // style={{ backgroundColor: "#f2f2f2" }}
          >
            <Flex pl={53} align="center">
              <FontAwesomeIcon
                icon={solid("envelope")}
                width={18}
                color="#111111"
              />
              <Text ml={17} size={16} weight={700}>
                의견 보내기
              </Text>
            </Flex>
          </div>
          <div
            className="w-100% h-[48px] px-[8px] pt-[11px] pb-[15px] mb-[15px]"
            // style={{ backgroundColor: "#f2f2f2" }}
          >
            <Flex pl={53} align="center">
              <FontAwesomeIcon
                icon={solid("arrow-right-from-bracket")}
                width={18}
                color="#111111"
              />
              <Text ml={17} size={16} weight={700}>
                로그아웃
              </Text>
            </Flex>
          </div>
        </Flex>
      </Flex>
      <Footer />
    </Flex>
  );
};

export default UserAside;
