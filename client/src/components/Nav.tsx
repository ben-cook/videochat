import { AppBar, Container, Link, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Link as RouterLink } from "react-router-dom";

const Nav = () => {
  return (
    <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
      <AppBar position="static">
        <Container>
          <Toolbar
            sx={{
              "@media (min-width: 600px)": { padding: 0 },
            }}
          >
            <Link
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 1,
                color: "primary.contrastText",
                textDecoration: "none",
              }}
            >
              <Typography variant="h4">Videochat</Typography>
            </Link>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Nav;
