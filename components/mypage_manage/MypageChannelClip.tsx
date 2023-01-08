import { Text, keyframes, Stack } from "@mantine/core";
import { useRecoilState } from "recoil";
import { mypageManage_channelClip } from "../states";
import MainLayout from "../common/MainLayout";
import UserAside from "../aside/UserAside";
import { Sidebar } from "../common/Sidebar";
import { MypageManageCommon } from "./MypageManageCommon";
import { MypageTableRow } from "./MypageTableRow";

export const scale = keyframes({
  "from, to": { transform: "scale(0.7)" },
});

export function MypageChannelClip() {
  const [mypageChannelClip, setMypageChannelClip] = useRecoilState(
    mypageManage_channelClip
  );

  return (
    <div>
      <Sidebar />
      <MainLayout
        aside={UserAside}
        content={() => {
          return (
            <>
              <MypageManageCommon />
              {mypageChannelClip.length === 0 ? (
                <Stack>
                  <Text mt={142} c="gray" className="text-[36px] text-center">
                    생성된 클립이 없습니다.
                  </Text>
                </Stack>
              ) : (
                mypageChannelClip.map((cur, i) => {
                  return (
                    <MypageTableRow
                      key={i}
                      title={cur.info}
                      clipId={cur.clipId}
                      imageURL={cur.thumbnail}
                      channel={cur.channel}
                      channelId={cur.channelId}
                      channelName={cur.channelName}
                      date={cur.date}
                      views={cur.views}
                    />
                  );
                })
              )}
            </>
          );
        }}
      />
    </div>
  );
}
