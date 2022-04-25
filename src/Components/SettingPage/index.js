import * as React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Grid, Typography, Box, TextField, Button } from '@material-ui/core'
import moment from 'moment'
import { useForm, Controller } from 'react-hook-form'
import JobPageStyles from './style'
import { axiosClient, httpOptions } from '../../config'
import styles from './style'

function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#3f50b5',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}))

export default function BasicTabs() {
    const [value, setValue] = React.useState(0)
    const date = new Date()
    const classes = styles()
    const formatedDate = moment(date).format('MMMM DD, YYYY')
    const client = localStorage.getItem('client')
    const user = JSON.parse(localStorage.getItem('user'))
    const [jobList, setJobList] = React.useState([])
    const [password, setPassword] = React.useState('')
    const [newPassword, setNewPassword] = React.useState('')
    const [name, setName] = React.useState('')
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const filterList = [
        { name: 'Location', value: 'location' },
        { name: 'Location', value: 'location' },
        { name: 'Location', value: 'location' },
    ]

    React.useEffect(() => {
        getMyAllJobs()
    }, [])

    const getMyAllJobs = () => {
        const data = {
            clientId: client,
            userId: user.id,
        }
        try {
            axiosClient
                .post('user/profile/getAllEmployees', data, httpOptions)
                .then((response) => {
                    if (response.status === 200) {
                        const res = response.data.data
                        setJobList(res)
                    } else {
                        // setError(true)
                    }
                })
        } catch (err) {
            console.log(err)
        }
    }

    function CustomizedTables() {
        return (
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={8}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell>Role</StyledTableCell>
                                <StyledTableCell>Joining Date</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jobList.map((row) => (
                                <StyledTableRow key={row.name}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.name}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {row.roles[0].name}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {moment(new Date(row.createdAt)).format(
                                            'MMMM DD, YYYY'
                                        )}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        )
    }

    const roleList = [
        {
            role: 'Admin',
            employ: 1,
            permission: 'All Rights',
        },
        {
            role: 'Manager',
            employ: 1,
            permission: 'All Manager Rights',
        },
        {
            role: 'Recruiter',
            employ: 1,
            permission: 'All Recruiter Right',
        },
    ]

    function RolesTables() {
        return (
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={8}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Role</StyledTableCell>
                                <StyledTableCell>
                                    Number of Employees
                                </StyledTableCell>
                                <StyledTableCell>Permissions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {roleList.map((row) => (
                                <StyledTableRow key={row.name}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.role}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {row.employ}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {row.permission}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        )
    }

    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            <Grid item xs={6}>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                        >
                            <Tab
                                label="All Roles"
                                {...a11yProps(0)}
                                style={{ margin: '0px 10px' }}
                            />
                            <Tab
                                label="Employees"
                                {...a11yProps(1)}
                                style={{ margin: '0px 10px' }}
                            />
                            <Tab
                                label="Accounts"
                                {...a11yProps(2)}
                                style={{ margin: '0px 10px' }}
                            />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <div
                            style={{
                                marginTop: 50,
                            }}
                        >
                            <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Grid item xs={8}>
                                    <Box component={'span'}>
                                        <Typography
                                            component={'span'}
                                            style={{
                                                fontFamily: 'Poppins',
                                                fontWeight: 'bolder',
                                                fontSize: '33px',
                                                color: '#000000',
                                            }}
                                        >
                                            All Roles
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid container style={{ marginTop: 10 }}>
                                {RolesTables()}
                            </Grid>
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <div
                            style={{
                                marginTop: 50,
                            }}
                        >
                            <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Grid item xs={8}>
                                    <Box component={'span'}>
                                        <Typography
                                            component={'span'}
                                            style={{
                                                fontFamily: 'Poppins',
                                                fontWeight: 'bolder',
                                                fontSize: '33px',
                                                color: '#000000',
                                            }}
                                        >
                                            All Employees
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid container style={{ marginTop: 10 }}>
                                {CustomizedTables()}
                            </Grid>
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <div
                            style={{
                                marginTop: 50,
                            }}
                        >
                            <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Grid item xs={8}>
                                    <Box component={'span'}>
                                        <Typography
                                            component={'span'}
                                            style={{
                                                fontFamily: 'Poppins',
                                                fontWeight: 'bolder',
                                                fontSize: '33px',
                                                color: '#000000',
                                            }}
                                        >
                                            Account Settings
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={8}>
                                    <Grid
                                        item
                                        xs={8}
                                        className={classes.textFieldContainer}
                                    >
                                        <Typography
                                            className={classes.labelText}
                                        >
                                            Enter Your Name
                                        </Typography>
                                        <TextField
                                            value={name}
                                            onChange={(event) =>
                                                setName(event.target.value)
                                            }
                                            type="name"
                                            placeholder="Name"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            className={classes.textField}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={8}
                                        className={classes.textFieldContainer}
                                    >
                                        <Typography
                                            className={classes.labelText}
                                        >
                                            Enter Your Password
                                        </Typography>
                                        <TextField
                                            placeholder="Password"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            type="password"
                                            value={password}
                                            className={classes.textField}
                                            onChange={(event) =>
                                                setPassword(event.target.value)
                                            }
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={8}
                                        className={classes.textFieldContainer}
                                    >
                                        <Typography
                                            className={classes.labelText}
                                        >
                                            Enter New Password
                                        </Typography>
                                        <TextField
                                            placeholder="Password"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            type="password"
                                            value={newPassword}
                                            className={classes.textField}
                                            onChange={(event) =>
                                                setNewPassword(
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            className={classes.button}
                                        >
                                            Save
                                        </Button>
                                        <br />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container style={{ marginTop: 10 }}></Grid>
                        </div>
                    </TabPanel>
                </Box>
            </Grid>
        </Grid>
    )
}
