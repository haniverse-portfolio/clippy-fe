import { Avatar, Button, Flex, Text } from "@mantine/core";

const VideoTitle = () => {
  return (
    <>
      <div>
        <Flex direction="row" justify="space-between">
          <Text size={36} weight={300}>
            분노장애 고3 여고생
          </Text>
          <Flex>
            <Button>Thanks</Button>
            <Button>링크 복사</Button>
          </Flex>
        </Flex>
      </div>

      <div>
        <Flex direction="row" justify="space-between">
          <Flex>
            <Avatar></Avatar>
            <Text>갓세희</Text>
          </Flex>
          <Flex>
            <div>
              <Text>게시자</Text>
              <Text>닉네임</Text>
            </div>
            <div>
              <Text>조회수</Text>
              <Text>30,000</Text>
            </div>
            <div>
              <Text>좋아요</Text>
              <Text>3,600개</Text>
            </div>
          </Flex>
        </Flex>
      </div>
    </>
  );
};

export default VideoTitle;
