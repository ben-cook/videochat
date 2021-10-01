import { Card, CardContent, CardMedia, Grid } from "@mui/material";
import { createRef, useEffect } from "react";
import { RemoteStream } from "./Room";

const Video = ({ stream, userID }: RemoteStream) => {
  const videoRef = createRef<HTMLVideoElement>();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return (
    <Grid item xs={12} sm={6} md={6}>
      <Card>
        <CardMedia>
          <video
            ref={videoRef}
            autoPlay={true}
            style={{ objectFit: "cover" }}
          />
        </CardMedia>
        <CardContent>{userID}</CardContent>
      </Card>
    </Grid>
  );
};

export default Video;
