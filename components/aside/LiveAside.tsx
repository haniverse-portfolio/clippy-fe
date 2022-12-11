import { Avatar, Flex, Text } from "@mantine/core";
import { Link } from "tabler-icons-react";

interface LiveProps {
  profileImage: string;
  id: number;
  name: string;
  displayName: string;
}

interface LiveItemProps {
  item: LiveProps;
}

const LiveItem = ({ item }: LiveItemProps) => {
  return (
    <Flex>
      <div>
        <Avatar src={item.profileImage}></Avatar>
        <Text>{item.displayName}</Text>
      </div>
      <Link href={`/create/${item.name}`}>
        <Text>CLIP</Text>
      </Link>
    </Flex>
  );
};

interface LivePropsWrapper {
  data: LiveProps[];
}

const Live = ({ data }: LivePropsWrapper) => {
  return (
    <Flex className="flex-1" direction="column" justify="space-around">
      <div>
        <Text align="center">어떤 스트리머의 클립을 만들까요?</Text>
        <Flex>
          {data.map((item) => (
            <LiveItem key={item.id} item={item} />
          ))}
        </Flex>
        <Link href="/">
          <Text align="center">팔로우 중인 스트리머 모두 보기</Text>
        </Link>
      </div>
      <div>&nbsp;</div>
    </Flex>
  );
};

const Footer = () => {
  return (
    <div className="py-[50px]">
      <Text align="center">© CLIPPY 2022. MADE IN SEOUL</Text>
    </div>
  );
};

const itemMock = [
  {
    profileImage:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/8b0b0b0f-1b1c-4b1a-8c1a-8b1b1b1b1b1b-profile_image-300x300.png",
    id: 1,
    name: "clippykr",
    displayName: "CLIPPY1",
  },
  {
    profileImage:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/8b0b0b0f-1b1c-4b1a-8c1a-8b1b1b1b1b1b-profile_image-300x300.png",
    id: 1,
    name: "clippykr",
    displayName: "CLIPPY2",
  },
];

const LiveAside = () => {
  return (
    <Flex direction="column" align="center" h="100%" justify="space-between">
      <Live data={itemMock} />
      <Footer />
    </Flex>
  );
};

export default LiveAside;
