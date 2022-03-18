import * as React from "react";
import {
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  AppBar,
  Container,
} from "@material-ui/core";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";

function LoginForm() {
  const displayDesktop = () => {
    return (
      <Typography
        gutterBottom
        variant="h3"
        align="center"
        style={{ paddingTop: "10px" }}
      >
        TowerWav
      </Typography>
    );
  };

  return (
    <div className="App">
      <header align="center">
        <AppBar>{displayDesktop()}</AppBar>
      </header>

      <Grid>
        <Card
          style={{
            maxWidth: 450,
            padding: " 5px",
            margin: "0 auto",
            marginTop: 150,
          }}
        >
          <CardContent>
            <Container
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Avatar sx={{ bgcolor: "#3f50b5" }}>
                <LockOutlinedIcon />
              </Avatar>
            </Container>

            <Typography gutterBottom variant="h4">
              Login
            </Typography>
            <form>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField
                    type="email"
                    placeholder="Enter email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    placeholder="Enter password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    required
                    type="password"
                  />
                </Grid>

                <Grid item xs={12} style={{ marginTop: 30 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}

export default LoginForm;
