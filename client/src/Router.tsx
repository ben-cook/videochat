import { Container } from "@mui/material";
import { Switch, Route } from "react-router-dom";
import Home from "./components/home/Home";
import EnterRoom from "./components/room/EnterRoom";

const Router = ({ clientID }: { clientID: string }) => {
  return (
    <Container>
      <Switch>
        <Route
          exact
          path="/room/:roomID"
          render={() => <EnterRoom clientID={clientID} />}
        />
        <Route path="/" component={Home} />
      </Switch>
    </Container>
  );
};
export default Router;
