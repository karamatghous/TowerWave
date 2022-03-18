import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
export default function InputForm() {
  const currencies = [
    {
      value: "LA",
      label: "LA",
    },
    {
      value: "AL",
      label: "AL",
    },
    {
      value: "NE",
      label: "NE",
    },
    {
      value: "AR",
      label: "AR",
    },
  ];

  const yes_no = [
    {
      value: "yes",
      label: "Yes",
    },
    {
      value: "no",
      label: "No",
    },
  ];

  const [currency, setCurrency] = React.useState("EUR");

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Input Form
      </Typography>
      <div style={{ margin: 20 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="city"
              name="city"
              label="Reference Name"
              fullWidth
              autoComplete="shipping address-level2"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="standard-select-currency-native"
              select
              label="Location"
              value={currency}
              onChange={handleChange}
              SelectProps={{
                native: true,
              }}
              // helperText="Please select location"
              variant="standard"
            >
              {currencies.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="standard-select-currency-native"
              select
              label="Location"
              value={currency}
              onChange={handleChange}
              SelectProps={{
                native: true,
              }}
              // helperText="Please select location"
              variant="standard"
            >
              {yes_no.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="country"
              name="country"
              label="Applied Date"
              fullWidth
              autoComplete="shipping country"
              variant="standard"
            />
          </Grid>
        </Grid>
      </div>

      <Grid>
        <Button variant="contained">Submit</Button>
      </Grid>
    </React.Fragment>
  );
}
