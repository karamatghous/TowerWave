// import * as React from "react";
// import Grid from "@mui/material/Grid";
// import Typography from "@mui/material/Typography";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// export default function CandidateExternalInput() {
//   const currencies = [
//     {
//       value: "LA",
//       label: "LA",
//     },
//     {
//       value: "AL",
//       label: "AL",
//     },
//     {
//       value: "NE",
//       label: "NE",
//     },
//     {
//       value: "AR",
//       label: "AR",
//     },
//   ];

//   const [currency, setCurrency] = React.useState("EUR");

//   const handleChange = (event) => {
//     setCurrency(event.target.value);
//   };

//   return (
//     <React.Fragment>
//       <Typography variant="h6" gutterBottom>
//         Candidate Form
//       </Typography>
//       <Grid container spacing={3}>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             required
//             // id="firstName"
//             name="firstName"
//             label="First name"
//             fullWidth
//             autoComplete="given-name"
//             variant="standard"
//             id="outlined-basic"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             required
//             id="lastName"
//             name="lastName"
//             label="Last name"
//             fullWidth
//             autoComplete="family-name"
//             variant="standard"
//           />
//         </Grid>

//         <Grid item xs={12} sm={6}>
//           <TextField
//             required
//             id="city"
//             name="city"
//             label="Reference Name"
//             fullWidth
//             autoComplete="shipping address-level2"
//             variant="standard"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             id="standard-select-currency-native"
//             select
//             label="Location"
//             value={currency}
//             onChange={handleChange}
//             SelectProps={{
//               native: true,
//             }}
//             // helperText="Please select location"
//             variant="standard"
//           >
//             {currencies.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </TextField>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             required
//             id="zip"
//             name="zip"
//             label="Phone Number"
//             fullWidth
//             autoComplete="shipping postal-code"
//             variant="standard"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             required
//             id="country"
//             name="country"
//             label="Applied Date"
//             fullWidth
//             autoComplete="shipping country"
//             variant="standard"
//           />
//         </Grid>
//         {/* <Grid item xs={12}>
//           <FormControlLabel
//             control={
//               <Checkbox color="secondary" name="saveAddress" value="yes" />
//             }
//             label="Use this address for payment details"
//           />
//         </Grid> */}
//       </Grid>
//       {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <StaticDatePicker
//           displayStaticWrapperAs="desktop"
//           openTo="year"
//           value={value}
//           onChange={(newValue) => {
//             setValue(newValue);
//           }}
//           renderInput={(params) => <TextField {...params} />}
//         />
//       </LocalizationProvider> */}
//       <Grid>
//         <Button variant="contained">Submit</Button>
//       </Grid>
//     </React.Fragment>
//   );
// }

import * as React from "react";
// import "./App.css";
import {
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  AppBar,
  Toolbar,
} from "@material-ui/core";

function CandidateExternalInput() {
  const displayDesktop = () => {
    return (
      <Typography gutterBottom variant="h3" align="center">
        TowerWav
      </Typography>
    );
  };
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

  const [currency, setCurrency] = React.useState("EUR");

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };
  return (
    <div className="App">
      <header align="center">
        <AppBar>{displayDesktop()}</AppBar>
      </header>
      <Typography gutterBottom variant="h3" align="center">
        React-App
      </Typography>
      <Grid>
        <Card
          style={{
            maxWidth: 450,
            padding: "20px 5px",
            margin: "0 auto",
            marginTop: 50,
          }}
        >
          <CardContent>
            <Typography gutterBottom variant="h5">
              Open Candidates
            </Typography>
            {/* <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              gutterBottom
            >
              Fill up the form and our team will get back to you soon.
            </Typography> */}
            <form>
              <Grid container spacing={1}>
                <Grid xs={12} item>
                  <TextField
                    placeholder="Enter referal name"
                    label="Referal Name"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid xs={12} item>
                  <TextField
                    placeholder="Enter first name"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid xs={12} item>
                  <TextField
                    placeholder="Enter last name"
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    required
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField
                    type="email"
                    placeholder="Enter email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    required
                  />
                </Grid> */}
                <Grid item xs={12}>
                  <TextField
                    type="number"
                    placeholder="Enter phone number"
                    label="Phone"
                    variant="outlined"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
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
                    variant="outlined"
                  >
                    {currencies.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
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

export default CandidateExternalInput;
