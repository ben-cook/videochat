import { Grid } from "@mui/material";
import Peer, { MediaConnection } from "peerjs";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import Video from "./Video";

import RoomTitle from "./RoomTitle";

export type RemoteStream = {
  userID: string;
  stream: MediaStream;
  name: string;
};

interface Props {
  clientID: string;
  roomID: string;
  localName: string;
}

const Room = ({ clientID, roomID, localName }: Props) => {
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

  useEffect(() => {
    if (localStream) {
      const socket = io("http://localhost:8000");

      socket.emit("join-room", roomID, clientID, localName);

      socket.on("user-connected", (userID, userName) => {
        if (localStream) {
          connectToNewUser(userID, localStream, userName);
        }
      });

      socket.on("user-disconnected", (userID) => {
        removeVideoStream(userID);
      });

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

          addVideoStream({
            userID: call.peer,
            stream: userVideoStream,
            name: call.metadata.name,
          });
        });
      });

      const connectToNewUser = (
        userID: string,
        stream: MediaStream,
        userName: string
      ) => {
        console.log(`Calling ${userID}`);

        const call = peer.call(userID, stream, {
          metadata: { name: localName },
        });

        call.on("stream", (userVideoStream) => {
          console.log(`Remote peer ${userID} (who we called) added a stream`);
          setVideoStreams((streams) =>
            streams.filter((stream) => stream.userID !== userID)
          );
          addVideoStream({
            userID,
            stream: userVideoStream,
            name: userName,
          });
        });

        call.on("close", () => {
          removeVideoStream(userID);
        });
      };
    }
  }, [clientID, localName, localStream, roomID]);

  return (
    <>
      <RoomTitle roomID={roomID} />

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
            <Video stream={localStream} name={localName} mute={true} />
          </Grid>
        )}

        {videoStreams.map(
          (foreignStream: RemoteStream, idx) =>
            foreignStream &&
            foreignStream.stream.active && (
              <Grid item xs={12} sm={6} md={6}>
                <Video
                  stream={foreignStream.stream}
                  name={foreignStream.name}
                  key={foreignStream.userID}
                  mute={false}
                />
              </Grid>
            )
        )}
      </Grid>
    </>
  );
};
export default Room;
