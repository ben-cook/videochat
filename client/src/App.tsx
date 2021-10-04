import Router from "./Router";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import Nav from "./components/Nav";

function App() {
  const clientID = uuidV4();

  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Nav />
        <Router clientID={clientID} />
      </BrowserRouter>
    </>
  );
}

export default App;
