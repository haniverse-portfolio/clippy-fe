import { Text, Stack } from "@mantine/core";
import { useRecoilState } from "recoil";
import { mypageManage_madeClip } from "../states";
import MainLayout from "../common/MainLayout";
import UserAside from "../aside/UserAside";
import { Sidebar } from "../common/Sidebar";
import { MypageManageCommon } from "./MypageManageCommon";
import { MypageTableRow } from "./MypageTableRow";

export function MypageMadeClip() {
  const [mypageMadeClip, setMypageMadeClip] = useRecoilState(
    mypageManage_madeClip
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
              {mypageMadeClip.length === 0 ? (
                <Stack>
                  <Text mt={142} c="gray" className="text-[36px] text-center">
                    생성된 클립이 없습니다.
                  </Text>
                </Stack>
              ) : (
                mypageMadeClip.map((cur, i) => {
                  return (
                    <MypageTableRow
                      key={i}
                      title={cur.info}
                      clipId={cur.clipId}
                      imageURL={cur.thumbnail}
                      channel={cur.channel}
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
