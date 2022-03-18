import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { AppBar, Typography } from "@material-ui/core";
import { padding } from "@mui/system";

const columns = [
  { id: "jobname", label: "Job Name", minWidth: 170, align: "center" },
  { id: "source", label: "Source", minWidth: 100, align: "center" },
  { id: "fname", label: "First Name", minWidth: 170, align: "center" },
  { id: "lname", label: "Last Name", minWidth: 170, align: "center" },
  {
    id: "referalname",
    label: "Referal Name",
    minWidth: 170,
    align: "center",
    format: (value) => value,
  },
  {
    id: "location",
    label: "Location",
    minWidth: 170,
    align: "center",
    format: (value) => value,
  },
  {
    id: "number",
    label: "Phone Number",
    minWidth: 170,
    align: "center",
    format: (value) => value,
  },
  { id: "status", label: "Status", minWidth: 100, align: "center" },
  { id: "dateposted", label: "Date Posted", minWidth: 170, align: "center" },
  {
    id: "activitydays",
    label: "Activity Days",
    minWidth: 170,
    align: "center",
  },
  { id: "recruiter", label: "Recruiter", minWidth: 100, align: "center" },
];

function createData(
  jobname,
  source,
  fname,
  lname,
  referalname,
  location,
  number,
  status,
  dateposted,
  activitydays,
  recruiter
) {
  return {
    jobname,
    source,
    fname,
    lname,
    referalname,
    location,
    number,
    status,
    dateposted,
    activitydays,
    recruiter,
  };
}

const rows = [
  createData(
    "Driver",
    "Indeed",
    "Karamat",
    "Ghous",
    "Umair",
    "LA",
    123,
    "Status",
    "11/03/2020",
    3,
    "recruiter"
  ),
  createData(
    "Driver",
    "Indeed",
    "Karamat",
    "Ghous",
    "Umair",
    "LA",
    123,
    "Status",
    "11/03/2020",
    3,
    "recruiter"
  ),
  createData(
    "Driver",
    "Indeed",
    "Karamat",
    "Ghous",
    "Umair",
    "LA",
    123,
    "Status",
    "11/03/2020",
    3,
    "recruiter"
  ),
  createData(
    "Driver",
    "Indeed",
    "Karamat",
    "Ghous",
    "Umair",
    "LA",
    123,
    "Status",
    "11/03/2020",
    3,
    "recruiter"
  ),
  createData(
    "Driver",
    "Indeed",
    "Karamat",
    "Ghous",
    "Umair",
    "LA",
    123,
    "Status",
    "11/03/2020",
    3,
    "recruiter"
  ),
  createData(
    "Driver",
    "Indeed",
    "Karamat",
    "Ghous",
    "Umair",
    "LA",
    123,
    "Status",
    "11/03/2020",
    3,
    "recruiter"
  ),
  createData(
    "Driver",
    "Indeed",
    "Karamat",
    "Ghous",
    "Umair",
    "LA",
    123,
    "Status",
    "11/03/2020",
    3,
    "recruiter"
  ),
  createData(
    "Driver",
    "Indeed",
    "Karamat",
    "Ghous",
    "Umair",
    "LA",
    123,
    "Status",
    "11/03/2020",
    3,
    "recruiter"
  ),
  createData(
    "Driver",
    "Indeed",
    "Karamat",
    "Ghous",
    "Umair",
    "LA",
    123,
    "Status",
    "11/03/2020",
    3,
    "recruiter"
  ),
  createData(
    "Driver",
    "Indeed",
    "Karamat",
    "Ghous",
    "Umair",
    "LA",
    123,
    "Status",
    "11/03/2020",
    3,
    "recruiter"
  ),
  createData(
    "Driver",
    "Indeed",
    "Karamat",
    "Ghous",
    "Umair",
    "LA",
    123,
    "Status",
    "11/03/2020",
    3,
    "recruiter"
  ),
  createData(
    "Driver",
    "Indeed",
    "Karamat",
    "Ghous",
    "Umair",
    "LA",
    123,
    "Status",
    "11/03/2020",
    3,
    "recruiter"
  ),
];

export default function AllCandidatesScreen() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
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
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <header align="center">
        <AppBar>{displayDesktop()}</AppBar>
      </header>
      <TableContainer sx={{ maxHeight: 440, paddingTop: 10 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    fontSize: 20,
                    backgroundColor: "#ff9800",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    onClick={() => console.log(row)}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.code}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={
                            {
                              // backgroundColor: "#81c784",
                              // color: "#fff",
                              // fontWeight: "bold",
                            }
                          }
                        >
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
