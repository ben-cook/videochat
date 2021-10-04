import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Link as RouterLink } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

import JoinCustomRoom from "./JoinCustomRoom";

const Home = () => {
  return (
    <Box textAlign="center">
      <div style={{ display: "block" }}>
        <Typography variant="h4" display="inline">
          Welcome to{" "}
          <Typography
            variant="h4"
            display="inline"
            sx={{ color: "primary.main" }}
          >
            {" "}
            videochat
          </Typography>
        </Typography>
      </div>

      <Button
        variant="contained"
        component={RouterLink}
        to={`/room/${uuidV4()}`}
        sx={{ marginTop: 2 }}
      >
        <Typography variant="button">Make a new room</Typography>
      </Button>

      <Typography variant="h4" sx={{ margin: 3 }}>
        OR
      </Typography>

      <JoinCustomRoom />
    </Box>
  );
};
export default Home;
