import { Card, Typography } from "@mui/material";
import { createRef, useEffect } from "react";

interface Props {
  stream: MediaStream;
  name: string;
}

const Video = ({ stream, name }: Props) => {
  const videoRef = createRef<HTMLVideoElement>();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return (
    <Card sx={{ height: "100%", width: "100%", position: "static" }}>
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          zIndex: 0,
        }}
      >
        <video
          ref={videoRef}
          autoPlay={true}
          style={{
            left: "50%",
            minHeight: "100%",
            minWidth: "100%",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
          }}
        />
      </div>
      <div
        style={{
          bottom: 0,
          height: 30,
          background: "rgba(0, 0, 0, 0.2)",
          width: "100%",
          zIndex: 2,
          backfaceVisibility: "hidden",
        }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{ opacity: 1, color: "primary.contrastText" }}
        >
          {name}
        </Typography>
      </div>
    </Card>
  );
};

export default Video;
