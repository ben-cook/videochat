import { Button, Grid, Typography } from "@mui/material";
import Peer, { MediaConnection } from "peerjs";
import { useParams } from "react-router";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import Video from "./Video";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SaveIcon from "@mui/icons-material/Save";

export type RemoteStream = {
  userID: string;
  stream: MediaStream;
};

const Room = ({ clientID }: { clientID: string }) => {
  const { roomID } = useParams<{ roomID: string }>();
  // const videoRef = createRef<HTMLVideoElement>();
  // const [videos, setVideos] = useState<any>([]);
  const [videoStreams, setVideoStreams] = useState<RemoteStream[]>([]);
  const addVideoStream = (newStream: RemoteStream) =>
    setVideoStreams((streams: RemoteStream[]) => [...streams, newStream]);
  const removeVideoStream = (userID: string) =>
    setVideoStreams((remoteStreams: RemoteStream[]) =>
      remoteStreams.filter((remoteStream) => remoteStream.userID !== userID)
    );

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // const localPeer = useRef<Peer>(
  //   new Peer(clientID, {
  //     host: "localhost",
  //     port: 9000,
  //     path: "/myapp",
  //   })
  // );

  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setLocalStream(stream);
      });
  }, []);

  // console.log(peer);

  const connectToRoom = () => {
    const socket = io("http://localhost:8000");

    // socket.

    socket.emit("join-room", roomID, clientID);

    socket.on("user-connected", (userID) => {
      if (localStream) {
        connectToNewUser(userID, localStream);
      }
    });

    socket.on("user-disconnected", (userID) => {
      removeVideoStream(userID);
    });

    setConnected(true);

    const peer = new Peer(clientID, {
      host: "localhost",
      port: 9000,
      path: "/myapp",
    });

    peer.on("call", (call: MediaConnection): void => {
      console.log(`Answering a call from ${call.peer}`);

      call.answer(localStream!);

      call.on("stream", (userVideoStream: MediaStream): void => {
        setVideoStreams((streams) =>
          streams.filter((stream) => stream.userID !== call.peer)
        );

        addVideoStream({ userID: call.peer, stream: userVideoStream });
      });
    });

    const connectToNewUser = (userID: string, stream: MediaStream) => {
      console.log(`Calling ${userID}`);

      const call = peer.call(userID, stream);

      call.on("stream", (userVideoStream) => {
        console.log(`Remote peer ${userID} (who we called) added a stream`);
        setVideoStreams((streams) =>
          streams.filter((stream) => stream.userID !== userID)
        );
        addVideoStream({ userID, stream: userVideoStream });
      });

      call.on("close", () => {
        removeVideoStream(userID);
      });
    };
  };

  return (
    <>
      <Typography variant="h2">
        Room {roomID.split("-")[0]} - {connected ? "connected" : "disconnected"}
      </Typography>
      <Typography variant="h6">Client ID: {clientID.split("-")[0]}</Typography>

      <Button variant="contained" onClick={connectToRoom} disabled={connected}>
        Connect
      </Button>

      <Button
        variant="contained"
        onClick={() => console.log("disconnect")}
        disabled={connected}
      >
        Disconnect
      </Button>

      {/* <Button
        variant="contained"
        onClick={disconnectFromRoom}
        disabled={connected}
      >
        Mute
      </Button> */}

      <Grid container spacing={2}>
        {localStream && localStream.active && (
          <Grid item xs={12} sm={6} md={6}>
            <Video stream={localStream} name={"LOCAL"} />
          </Grid>
        )}

        {videoStreams.map(
          (foreignStream: RemoteStream, idx) =>
            foreignStream &&
            foreignStream.stream.active && (
              <Grid item xs={12} sm={6} md={6}>
                <Video
                  stream={foreignStream.stream}
                  name={foreignStream.userID}
                  key={idx}
                />
              </Grid>
            )
        )}
      </Grid>
    </>
  );
};
export default Room;
