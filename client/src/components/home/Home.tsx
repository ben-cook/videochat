import { Button, Typography } from "@mui/material";
import { useHistory } from "react-router";
import { v4 as uuidV4 } from "uuid";

const Home = () => {
  const history = useHistory();

  return (
    <>
      <Typography variant="h1">Home</Typography>
      <Button
        variant="contained"
        onClick={() => history.push(`/room/${uuidV4()}`)}
      >
        Join a new room
      </Button>
    </>
  );
};
export default Home;
