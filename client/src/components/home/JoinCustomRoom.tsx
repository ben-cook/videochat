import { Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const JoinCustomRoom = () => {
  const [roomCode, setRoomCode] = useState<string>("");

  return (
    <Grid container>
      <Grid item container direction="column">
        <Grid item>
          <TextField
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          ></TextField>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            component={RouterLink}
            to={`/room/${roomCode}`}
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
