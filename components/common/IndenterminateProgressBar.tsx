interface IndenterminateProgressBarProps {
  className?: string;
  width?: string;
  height?: string;
  position?: "static" | "relative" | "absolute" | "sticky" | "fixed";
  wrapBg?: string;
  innerBg?: string;
}

export const IndenterminateProgressBar = ({
  className = "",
  width = "100%",
  height = "8px",
  position = "relative",
  wrapBg = "#d1d5db",
  innerBg = "#9F7AEA",
}: IndenterminateProgressBarProps) => {
  return (
    <>
      <div
        className={`progress-wrap ${className}`}
        style={{ width, height, position, backgroundColor: wrapBg }}
      >
        <div
          className="progress-inner"
          style={{ backgroundColor: innerBg }}
        ></div>
      </div>
      <style jsx>{`
        @keyframes indeterminate-progress-bar {
          from {
            left: -50%;
          }
          to {
            left: 100%;
          }
        }
        .progress-wrap {
          pointer-events: none;
          border-radius: 9999999px;
        }
        .progress-inner {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50%;
          height: 100%;
          border-radius: 9999999px;
          animation-duration: 2s;
          animation-iteration-count: infinite;
          animation-name: indeterminate-progress-bar;
        }
      `}</style>
    </>
  );
};
