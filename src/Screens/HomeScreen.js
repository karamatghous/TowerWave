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
import CustomAppBar from "../Components/CustomAppBar";

const columns = [
  { id: "jobname", label: "Job", minWidth: 100, align: "center" },
  { id: "fname", label: "First Name", minWidth: 170, align: "center" },
  { id: "lname", label: "Last Name", minWidth: 170, align: "center" },
  {
    id: "activitydays",
    label: "Days in Progress",
    minWidth: 170,
    align: "center",
  },
  { id: "status", label: "Status", minWidth: 100, align: "center" },
];

function createData(jobname, fname, lname, status, activitydays) {
  return {
    jobname,
    fname,
    lname,
    status,
    activitydays,
  };
}

const rows = [
  createData("Driver", "Karamat", "Ghous", "Status", 3),
  createData("Driver", "Karamat", "Ghous", "Status", 3),
  createData("Driver", "Karamat", "Ghous", "Status", 3),
  createData("Driver", "Karamat", "Ghous", "Status", 3),
  createData("Driver", "Karamat", "Ghous", "Status", 3),
  createData("Driver", "Karamat", "Ghous", "Status", 3),
  createData("Driver", "Karamat", "Ghous", "Status", 3),
  createData("Driver", "Karamat", "Ghous", "Status", 3),
];
function myJobData(job, candidates) {
  return {
    job,
    candidates,
  };
}
const my_job_rows = [myJobData("Driver - LA", 3), myJobData("Manager - LA", 5)];

const my_job_columns = [
  { id: "job", label: "Job", minWidth: 100, align: "center" },
  { id: "candidates", label: "Candidates", minWidth: 170, align: "center" },
];

export default function HomeScreen() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // const displayDesktop = () => {
  //   return (
  //     <>
  //       <Typography
  //         gutterBottom
  //         variant="h3"
  //         align="center"
  //         style={{ paddingTop: "10px" }}
  //       >
  //         TowerWav
  //       </Typography>

  //     </>
  //   );
  // };
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <header align="center">
        {/* <AppBar>{displayDesktop()}</AppBar> */}
        <CustomAppBar />
      </header>

      <div align="center">
        <TableContainer sx={{ maxHeight: 250, marginTop: 0 }}>
          <Table stickyHeader aria-label="sticky table" style={{ width: 500 }}>
            <TableHead>
              <TableRow>
                {my_job_columns.map((column) => (
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
              {my_job_rows
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
                      {my_job_columns.map((column) => {
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
      </div>
      <div>
        <Typography
          gutterBottom
          variant="h5"
          align="center"
          style={{ marginTop: 50 }}
        >
          My Candidates
        </Typography>
      </div>

      <TableContainer sx={{ maxHeight: 340, marginTop: 0, borderRadius: 5 }}>
        <div align="center">
          <Table stickyHeader aria-label="sticky table" style={{ width: 1200 }}>
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
        </div>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ maxWidth: "70%" }}
      /> */}
    </Paper>
  );
}
