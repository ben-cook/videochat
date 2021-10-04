import { Button, TextField, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Room from "./Room";

const EnterRoom = ({ clientID }: { clientID: string }) => {
  const { roomID } = useParams<{ roomID: string }>();

  const [nameText, setNameText] = useState<string>("");
  const [enteredRoom, setEnteredRoom] = useState<boolean>(false);

  if (!enteredRoom) {
    return (
      <Box textAlign="center">
        <Grid container sx={{ width: "100%" }} justifyContent="center">
          <Grid item container direction="column">
            <Grid item>
              <TextField
                value={nameText}
                onChange={(e) => setNameText(e.target.value)}
                label="Name"
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => setEnteredRoom(true)}
                sx={{ marginTop: 2 }}
              >
                <Typography variant="button">Enter Room</Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return <Room clientID={clientID} roomID={roomID} localName={nameText} />;
};

export default EnterRoom;
