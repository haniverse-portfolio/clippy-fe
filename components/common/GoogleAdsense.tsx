import { FC, useEffect } from "react";

interface GoogleAdsenseProps {
  className: string;
  layoutKey: string;
  slot: string;
  responsive?: boolean;
  format?: string;
}

const GoogleAdsense: FC<GoogleAdsenseProps> = ({
  className,
  layoutKey,
  slot,
  format = "fluid",
  responsive = true,
}) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdvertiseError", e);
      }
    }
  }, []);

  //production이 아닌 경우 대체 컴포넌트 표시
  if (process.env.NODE_ENV !== "production")
    return (
      <div
        className={`${className} bg-[#e9e9e9] text-black text-[18px] font-bold p-[16px] w-full h-full flex justify-center items-center`}
      >
        광고 표시 영역
      </div>
    );

  //production인 경우 구글 광고 표시
  return (
    <ins
      className={className}
      style={{
        overflowX: "auto",
        overflowY: "hidden",
        display: "block",
        textAlign: "center",
      }}
      data-ad-format={format}
      data-ad-layout-key={layoutKey}
      data-ad-client="ca-pub-3857090800854368"
      data-full-width-responsive={responsive ? "true" : "false"}
      data-ad-slot={slot}
    />
  );
};

export default GoogleAdsense;
