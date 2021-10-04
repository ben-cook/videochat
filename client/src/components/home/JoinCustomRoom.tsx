import { Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const JoinCustomRoom = () => {
  const history = useHistory();
  const [roomCode, setRoomCode] = useState<string>("");

  const handleClick = () => {
    if (/[a-zA-Z0-9]{4,}/.test(roomCode)) {
      history.push(`/room/${roomCode.toLocaleUpperCase()}`);
    }
  };

  return (
    <Grid container>
      <Grid item container direction="column">
        <Grid item>
          <TextField
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleClick}
            sx={{ marginTop: 2 }}
          >
            <Typography variant="button">Join a custom room</Typography>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default JoinCustomRoom;
