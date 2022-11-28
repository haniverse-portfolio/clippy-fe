import { Flex } from "@mantine/core";
import React from "react";
import { Header } from "../../components/Header/Header";

import { Range, getTrackBackground } from "react-range";

const STEP = 0.1;
const MIN = 0;
const MAX = 90;

const ClipCreatePage = () => {
  const [values, setValues] = React.useState([20, 40]);

  return (
    <Flex align="center" direction="column" bg="#f7f7f8">
      <Header />
      <Flex maw="760px" w="100%" px="20px" mt="80px" direction="column">
        <video
          style={{ width: "100%" }}
          src="https://clips-media-assets2.twitch.tv/raw_media/6xNItE1icUIyRgORZ8faOA/39873829639-offset-4510.mp4"
          controls
        />

        <Flex w="100%">
          <Range
            values={values}
            step={STEP}
            min={MIN}
            max={MAX}
            onChange={(values) => setValues(values)}
            renderTrack={({ props, children }) => (
              <div
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                style={{
                  ...props.style,
                  height: "36px",
                  display: "flex",
                  width: "100%",
                }}
              >
                <div
                  ref={props.ref}
                  style={{
                    height: "5px",
                    width: "100%",
                    borderRadius: "4px",
                    background: getTrackBackground({
                      values,
                      colors: ["#ccc", "#548BF4", "#ccc"],
                      min: MIN,
                      max: MAX,
                    }),
                    alignSelf: "center",
                  }}
                >
                  {children}
                </div>
              </div>
            )}
            renderThumb={({ index, props, isDragged }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: "42px",
                  width: "42px",
                  borderRadius: "4px",
                  backgroundColor: "#FFF",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0px 2px 6px #AAA",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-28px",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "14px",
                    fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                    padding: "4px",
                    borderRadius: "4px",
                    backgroundColor: "#548BF4",
                  }}
                >
                  {values[index].toFixed(1)}
                </div>
                <div
                  style={{
                    height: "16px",
                    width: "5px",
                    backgroundColor: isDragged ? "#548BF4" : "#CCC",
                  }}
                />
              </div>
            )}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ClipCreatePage;
