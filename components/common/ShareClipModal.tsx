import { useRecoilValue } from "recoil";
import {
  recoil_shareClipModal_content,
  recoil_shareClipModal_isOpen,
} from "../states";
import { Modal, TextInput, Textarea } from "@mantine/core";
import { FC, ReactNode, useEffect, useState } from "react";
import { useShareClipModal } from "../../hooks/useShareClipModal";

interface ShareClipModalCircleBtnProps {
  children: ReactNode;
  label: string;
  onClick?: () => void;
}
const ShareClipModalCircleBtn: FC<ShareClipModalCircleBtnProps> = ({
  children,
  label,
  onClick,
}) => {
  return (
    <div
      className="flex flex-col justify-center items-center gap-1 cursor-pointer"
      onClick={onClick}
    >
      <div className="block w-[60px] h-[60px] rounded-full bg-gray-300">
        {children}
      </div>
      <div className="text-[12px]">{label}</div>
    </div>
  );
};

export const ShareClipModal = () => {
  const [URL, setURL] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const [toggleCopyEmbedCode, setToggleCopyEmbedCode] = useState(false);
  const isOpen = useRecoilValue(recoil_shareClipModal_isOpen);
  const shareModalContent = useRecoilValue(recoil_shareClipModal_content);

  const { closeShareClopModal } = useShareClipModal();

  const getShareClipText = () =>
    `[Clippy] ${shareModalContent?.streamer} - ${shareModalContent?.title}`;

  const shareToKakao = () => {
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `📎 ${shareModalContent?.title}`,
        description: `게시자: ${shareModalContent?.clipper}`,
        imageUrl: shareModalContent?.thumbnail,
        link: {
          mobileWebUrl: URL,
          webUrl: URL,
        },
      },
      itemContent: {
        profileText: `[Clippy] ${shareModalContent?.streamer}`,
      },
      social: {
        likeCount: shareModalContent?.like,
        // commentCount: 20,
        // sharedCount: 30,
      },
      buttons: [
        {
          title: "클립 보러가기",
          link: {
            mobileWebUrl: URL,
            webUrl: URL,
          },
        },
      ],
    });
  };

  const shareToTwitter = () => {
    window.open(
      `https://www.twitter.com/intent/tweet?&text=${encodeURIComponent(
        getShareClipText()
      )}&url=${encodeURIComponent(URL)}`
    );
  };

  const shareToFacebook = () => {
    window.open(
      `http://www.facebook.com/share.php?t=${encodeURIComponent(
        getShareClipText()
      )}&u=${encodeURIComponent(URL)}`
    );
  };

  useEffect(() => {
    setURL(window.location.href.split("?")[0]);
    setEmbedCode(
      `<iframe src="${
        window.location.href.split("?")[0] + "/embed"
      }" frameborder="0" width="533" height="300"></iframe>`
    );
  }, []);

  return (
    <>
      <Modal
        closeOnClickOutside
        withCloseButton
        centered
        size="md"
        title="클립 공유하기"
        opened={isOpen}
        onClose={closeShareClopModal}
      >
        <div className="w-full flex justify-center items-center gap-8 py-4">
          <ShareClipModalCircleBtn
            label="퍼가기"
            onClick={() => setToggleCopyEmbedCode((state) => !state)}
          >
            <svg
              viewBox="0 0 36 36"
              preserveAspectRatio="xMidYMid meet"
              focusable="false"
              style={{
                pointerEvents: "none",
                display: "block",
                width: "100%",
                height: "100%",
              }}
            >
              <g viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="17.5"
                  stroke="#E7E7E7"
                  fill="#F4F4F4"
                  stroke-width=".5"
                ></circle>
                <path
                  d="m21.41,23.29l-0.71,-0.71l4.59,-4.58l-4.59,-4.59l0.71,-0.71l5.3,5.3l-5.3,5.29zm-6.12,-0.7l-4.58,-4.59l4.59,-4.59l-0.71,-0.7l-5.3,5.29l5.29,5.29l0.71,-0.7z"
                  fill="#606060"
                ></path>
              </g>
            </svg>
          </ShareClipModalCircleBtn>
          <ShareClipModalCircleBtn label="카카오톡" onClick={shareToKakao}>
            <svg
              viewBox="0 0 60 60"
              preserveAspectRatio="xMidYMid meet"
              focusable="false"
              style={{
                pointerEvents: "none",
                display: "block",
                width: "100%",
                height: "100%",
              }}
            >
              <g>
                <g fill-rule="nonzero" fill="none">
                  <path
                    d="M28.486325 59.9692983c-6.6364044-.569063-11.5630204-2.3269562-16.3219736-5.8239328C4.44376336 48.4721167 0 39.6467923 0 29.9869344 0 15.1115596 10.506778 2.79838844 25.2744118.36718043 31.302519-.62523147 37.978265.41644488 43.5623517 3.2208101 57.138627 10.0389054 63.3436513 25.7618627 58.2050226 40.3239688c-3.5279559 9.9977054-12.7897094 17.6177847-23.3910729 19.2449379-2.0856252.3201125-5.0651487.5086455-6.3276247.4003916z"
                    fill="#FFE812"
                  ></path>
                  <path
                    d="M30.5 14C19.730375 14 11 20.69445394 11 28.952339c0 5.3388968 3.649875 10.0235376 9.14025 12.6688251-.2986875 1.0018068-1.9194375 6.4448229-1.9839375 6.8724233 0 0-.0388125.3212929.175125.4438292.2139375.1225362.4655625.0273518.4655625.0273518.6135-.0833319 7.1143125-4.5241766 8.2395-5.2953162 1.1240625.1548115 2.2815.2352259 3.4635.2352259 10.769625 0 19.5-6.6942716 19.5-14.9523391C50 20.69445394 41.269625 14 30.5 14z"
                    fill="#000"
                  ></path>
                  <path
                    d="M20.11212489 33c-.64033041 0-1.16107056-.4353882-1.16107056-.9707294v-6.0386824h-1.81165709C16.51106456 25.9905882 16 25.5440188 16 24.9952941S16.51125807 24 17.13939724 24h5.94545526c.6283327 0 1.1393973.4465694 1.1393973.9952941s-.5112581.9952941-1.1393973.9952941h-1.8116571v6.0386824c0 .5353412-.5207401.9707294-1.16107051.9707294zm10.18104071-.0132141c-.4841664 0-.8545479-.1721224-.9662042-.4489412l-.5749235-1.3176847-3.5404911-.0001694-.5753105 1.3185318c-.1112692.2763105-.4814572.4482635-.9656237.4482635-.2546749.0002283-.5064123-.0476164-.7380538-.140273-.3200685-.1292611-.6277522-.484687-.2751737-1.4433882l2.7772807-6.3996988c.1956404-.48672.789915-.9881788 1.546159-1.0032565.7583726.0149082 1.3526472.5165365 1.5486746 1.004273l2.7761197 6.3968188c.3533525.9609035.0456688 1.3164988-.2743997 1.4454212-.2316966.0924919-.4834067.1402736-.7380538.1401035-.0001935 0 0 0 0 0zm-2.1516573-3.5671341l-1.1597159-2.8842353-1.159716 2.8842353h2.3194319zm5.0326604 3.4321129c-.6136258 0-1.1126927-.4181082-1.1126927-.9317647v-6.9035294c0-.5605835.5317704-1.0164706 1.1852596-1.0164706s1.1852595.4558871 1.1852595 1.0164706v5.9717647H36.89927c.6136258 0 1.1126926.4181082 1.1126926.9317647s-.4990668.9317647-1.1126926.9317647h-3.7251013zm6.4505209.1350212c-.6403304 0-1.1610705-.4558871-1.1610705-1.0164706v-6.9538447c0-.5605835.5207401-1.0164706 1.1610705-1.0164706.6403305 0 1.1610706.4558871 1.1610706 1.0164706v2.1847341l3.2393869-2.8359529c.1666136-.1458636.395538-.2261647.6440071-.2261647.2898806 0 .5809223.10944.7990101.3001976.2033808.1778824.3247127.4067577.3413547.6444424.0168355.2397176-.0743085.4594447-.2562096.6188611l-2.6458863 2.3160283 2.8579752 3.3147106c.1863887.2147949.2666819.4860225.2229256.7530353-.0418059.2671791-.2040382.5085898-.4504954.6703623-.2007827.1336077-.4461848.2056972-.698384.2051577-.3648049.0014863-.7088533-.1483913-.9275018-.4040471l-2.722904-3.1585129-.4028915.3527152v2.2177695c-.0007462.5613249-.5202804 1.016232-1.1614576 1.0169788z"
                    fill="#FFE812"
                  ></path>
                </g>
              </g>
            </svg>
          </ShareClipModalCircleBtn>

          <ShareClipModalCircleBtn label="트위터" onClick={shareToTwitter}>
            <svg
              viewBox="0 0 60 60"
              preserveAspectRatio="xMidYMid meet"
              focusable="false"
              style={{
                pointerEvents: "none",
                display: "block",
                width: "100%",
                height: "100%",
              }}
            >
              <g>
                <g fill="none" fill-rule="evenodd">
                  <path
                    d="M28.486325 59.969298c-6.636404-.569063-11.56302-2.326956-16.321973-5.823932C4.443764 48.472116 0 39.646792 0 29.986934 0 15.11156 10.506778 2.798388 25.274412.36718c6.028107-.992411 12.703853.049265 18.28794 2.85363 13.576275 6.818095 19.7813 22.541053 14.64267 37.103159-3.527955 9.997705-12.789708 17.617785-23.391072 19.244938-2.085625.320112-5.065149.508645-6.327625.400391z"
                    fill="#1DA1F2"
                    fill-rule="nonzero"
                  ></path>
                  <path
                    d="M45.089067 17.577067c-.929778.595555-3.064534 1.460977-4.117334 1.460977v.001778C39.7696 17.784 38.077156 17 36.200178 17c-3.645511 0-6.6016 2.956089-6.6016 6.600178 0 .50631.058666 1.000178.16711 1.473778h-.001066c-4.945066-.129778-10.353422-2.608356-13.609244-6.85049-2.001778 3.46489-.269511 7.3184 2.002133 8.72249-.7776.058666-2.209067-.0896-2.882844-.747023-.045156 2.299734 1.060622 5.346845 5.092622 6.452267-.776533.417778-2.151111.297956-2.7488.209067.209778 1.941333 2.928355 4.479289 5.901155 4.479289C22.46009 38.565156 18.4736 40.788089 14 40.080889 17.038222 41.929422 20.5792 43 24.327111 43c10.650667 0 18.921956-8.631822 18.4768-19.280356-.001778-.011733-.001778-.023466-.002844-.036266.001066-.027378.002844-.054756.002844-.0832 0-.033067-.002844-.064356-.003911-.096356.9696-.66311 2.270578-1.836089 3.2-3.37991-.539022.296888-2.156089.891377-3.6608 1.038932.965689-.521244 2.396444-2.228266 2.749867-3.585777"
                    fill="#FFF"
                  ></path>
                </g>
              </g>
            </svg>
          </ShareClipModalCircleBtn>

          <ShareClipModalCircleBtn label="페이스북" onClick={shareToFacebook}>
            <svg
              viewBox="0 0 60 60"
              preserveAspectRatio="xMidYMid meet"
              focusable="false"
              style={{
                pointerEvents: "none",
                display: "block",
                width: "100%",
                height: "100%",
              }}
            >
              <g>
                <g fill="none" fill-rule="evenodd">
                  <path
                    d="M28.4863253 59.9692983c-6.6364044-.569063-11.5630204-2.3269561-16.3219736-5.8239327C4.44376366 48.4721168 3e-7 39.6467924 3e-7 29.9869344c0-14.8753747 10.506778-27.18854591 25.2744118-29.61975392 6.0281072-.9924119 12.7038532.04926445 18.2879399 2.85362966C57.1386273 10.0389054 63.3436516 25.7618627 58.2050229 40.3239688 54.677067 50.3216743 45.4153135 57.9417536 34.81395 59.5689067c-2.0856252.3201125-5.0651487.5086456-6.3276247.4003916z"
                    fill="#3B5998"
                    fill-rule="nonzero"
                  ></path>
                  <path
                    d="M25.7305108 45h5.4583577V30.0073333h4.0947673l.8098295-4.6846666h-4.9045968V21.928c0-1.0943333.7076019-2.2433333 1.7188899-2.2433333h2.7874519V15h-3.4161354v.021c-5.3451414.194-6.4433395 3.2896667-6.5385744 6.5413333h-.0099897v3.7603334H23v4.6846666h2.7305108V45z"
                    fill="#FFF"
                  ></path>
                </g>
              </g>
            </svg>
          </ShareClipModalCircleBtn>
        </div>
        <div className="flex justify-between items-center gap-3">
          <TextInput className="w-full" value={URL} readOnly />
          <div
            onClick={() => {
              navigator.clipboard.writeText(URL).then(() => {
                alert("링크가 복사되었습니다.");
              });
            }}
            className="text-[14px] text-white whitespace-nowrap px-4 py-2 rounded-full cursor-pointer bg-black"
          >
            링크복사
          </div>
        </div>
        {toggleCopyEmbedCode && (
          <div className="pt-1 mt-4 border-t-[1px] border-[#ccc]">
            <div className="text-[14px] mt-2">임베드 플레이어 코드</div>
            <Textarea size="xs" mt={10} value={embedCode} />
            <div
              onClick={() => {
                navigator.clipboard.writeText(embedCode).then(() => {
                  alert("임베드 플레이어 코드가 복사되었습니다.");
                });
              }}
              className="text-[14px] w-max mt-2 ml-auto mr-0 text-white whitespace-nowrap px-4 py-2 rounded-full cursor-pointer bg-black"
            >
              코드복사
            </div>
          </div>
        )}
      </Modal>
      <style jsx global>{`
        .mantine-Modal-modal {
          min-height: auto !important;
        }
      `}</style>
    </>
  );
};
