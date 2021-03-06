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
import { Autocomplete, MenuItem, Select } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CreateLocationInfoForm from '../CreateLocationInfoForm'
import EditLocationInfoForm from '../EditLocationInfoForm'
import Loader from '../Loader'
import Snackbar from '../Snackbar'
import { useSnackbar } from 'notistack'

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
        backgroundColor: '#081e5c',
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

const allRoles = [
    {
        value: '1',
        label: 'Admin',
    },
    {
        value: '2',
        label: 'Manager',
    },
    {
        value: '3',
        label: 'Recruiter',
    },
]

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
    const [newPasswordConfirm, setNewPasswordConfirm] = React.useState('')
    const [name, setName] = React.useState(user.name)
    const [firstName, setFirstName] = React.useState(user.first_name)
    const [lastName, setLastName] = React.useState(user.last_name)
    const [roles, setRoles] = React.useState([])
    const [userRoles, setUserRoles] = React.useState([])
    const [settingsInfo, setSettingsInfo] = React.useState([])
    const [open, setOpen] = React.useState(false)
    const [editOpen, setEditOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [email, setEmail] = React.useState('')
    const [newUserpassword, setNewUserPassword] = React.useState('')
    const [newUserpasswordConfirm, setNewUserPasswordConfirm] =
        React.useState('')
    const [newUsername, setNewUserName] = React.useState('')
    const [newUserFirstName, setNewUserFirstName] = React.useState('')
    const [newUserLastName, setNewUserLastName] = React.useState('')
    const [role, setRole] = React.useState(allRoles[2])
    const [signup, setSignup] = React.useState(false)
    const [error, setError] = React.useState(false)

    const { enqueueSnackbar } = useSnackbar()
    const [editLocation, setEditLocation] = React.useState({})
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
    const filterList = [
        { name: 'Location', value: 'location' },
        { name: 'Location', value: 'location' },
        { name: 'Location', value: 'location' },
    ]

    const getMyAllEmployees = () => {
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
        const onChange = (data, row) => {
            setUserRole(row.id, data.id)
        }
        return (
            <Grid
                container
                direction="row"
                justifyContent="start"
                alignItems="center"
            >
                <Grid item xs={6}>
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
                                        <Autocomplete
                                            onChange={(event, data) => {
                                                onChange(data, row)
                                            }}
                                            defaultValue={row.roles[0]?.id}
                                            classes={classes.textField}
                                            options={roles}
                                            value={row.roles[0]}
                                            getOptionLabel={(option) =>
                                                option.name
                                            }
                                            getOptionSelected={(
                                                option,
                                                value
                                            ) =>
                                                value === undefined ||
                                                value === '' ||
                                                option.id === value.id
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="role"
                                                    margin="normal"
                                                    required
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        disableUnderline: true,
                                                    }}
                                                />
                                            )}
                                        />
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

    function ShiftdetailsTables() {
        return (
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={12}>
                    <Table sx={{ maxWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>City</StyledTableCell>
                                <StyledTableCell>State</StyledTableCell>
                                <StyledTableCell>Hourly Rate</StyledTableCell>
                                <StyledTableCell>
                                    Signin Bonus Rate
                                </StyledTableCell>
                                <StyledTableCell>Shift details</StyledTableCell>
                                <StyledTableCell>Edit</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {settingsInfo.map((row) => (
                                <StyledTableRow key={row.name}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.city}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {row.state}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {row.hourly_rate}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {row.signin_bonas}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {row.shift_detail}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        onClick={async () => {
                                            await setEditLocation(row)
                                            setEditOpen(true)
                                        }}
                                    >
                                        Edit
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        )
    }

    const permissions = (admin, manager, recruiter) => {
        if (admin) {
            return 'All Permissions'
        } else if (manager) {
            return 'Manager Permissions'
        } else {
            return 'Only Recruiter Permissions'
        }
    }

    function RolesTables() {
        return (
            <Grid
                container
                direction="row"
                justifyContent="start"
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
                            {roles.map((row) => (
                                <StyledTableRow key={row.name}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.name}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {
                                            userRoles?.filter(
                                                (r) => r.roleId === row.id
                                            ).length
                                        }
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {permissions(
                                            row.isAdmin,
                                            row.isManager,
                                            row.isEmployee
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

    const setUserRole = (userId, roleID) => {
        setLoading(true)
        const data = {
            id: userId,
            roleId: roleID,
        }
        try {
            axiosClient
                .put('user/profile/updateRole', data, httpOptions)
                .then((response) => {
                    if (response.status === 200) {
                        const res = response.data.data
                        getMyAllEmployees()
                        setLoading(false)
                        enqueueSnackbar('User Role Update Successfully', {
                            variant: 'success',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                    } else {
                        // setError(false)
                        setLoading(false)
                        enqueueSnackbar('Failed to Update User Role', {
                            variant: 'error',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                    }
                })
        } catch (err) {
            console.log(err)
            setLoading(false)
            enqueueSnackbar('Failed to Update User Role', {
                variant: 'error',
                autoHideDuration: 3000,
                preventDuplicate: true,
            })
        }
    }

    const setUserPassword = () => {
        setLoading(true)
        const data = {
            email: user.email,
            name: `${firstName} ${lastName}`,
            first_name: firstName,
            last_name: lastName,
            password: password,
            new_password: newPassword,
        }
        if (
            newPassword != newPasswordConfirm ||
            firstName == '' ||
            lastName == '' ||
            newPassword == '' ||
            newPasswordConfirm == ''
        ) {
            setLoading(false)
            enqueueSnackbar('please check your password', {
                variant: 'error',
                autoHideDuration: 3000,
                preventDuplicate: true,
            })
            return
        }
        setLoading(false)
        try {
            axiosClient
                .put('auth/userPasswordUpdate', data, httpOptions)
                .then((response) => {
                    if (response.data.status === 200) {
                        const res = response.data.data
                        getMyAllEmployees()
                        localStorage.setItem(
                            'user',
                            JSON.stringify({
                                ...user,
                                name: `${firstName} ${lastName}`,
                                first_name: firstName,
                                last_name: lastName,
                            })
                        )
                        setLoading(false)
                        enqueueSnackbar('User Profile Update Successfully', {
                            variant: 'success',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                    } else {
                        setLoading(false)
                        enqueueSnackbar('Failed to Update User Profile', {
                            variant: 'error',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                    }
                })
        } catch (err) {
            setLoading(false)
            console.log(err)
            enqueueSnackbar('Failed to Update User Profile', {
                variant: 'error',
                autoHideDuration: 3000,
                preventDuplicate: true,
            })
        }
    }

    const getRoles = () => {
        try {
            axiosClient.get('user/profile/getAllRoles', {}).then((response) => {
                if (response.status === 200) {
                    const res = response.data.data
                    setRoles(res)
                } else {
                    // setError(true)
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    const getAllUsersRoles = () => {
        try {
            axiosClient
                .get('user/profile/getAllUsersRoles', {})
                .then((response) => {
                    if (response.status === 200) {
                        const res = response.data.data
                        setUserRoles(res)
                    } else {
                        // setError(true)
                    }
                })
        } catch (err) {
            console.log(err)
        }
    }

    const getAllSettingsInfo = () => {
        try {
            axiosClient
                .get('user/profile/getSettingLocation', {})
                .then((response) => {
                    if (response.status === 200) {
                        const res = response.data.data
                        setSettingsInfo(res)
                    } else {
                        // setError(true)
                    }
                })
        } catch (err) {
            console.log(err)
        }
    }

    React.useEffect(() => {
        initialize()
    }, [])

    const initialize = async () => {
        setLoading(true)
        await getRoles()
        await getMyAllEmployees()
        await getAllUsersRoles()
        await getAllSettingsInfo()
        setLoading(false)
    }

    const signUpForm = (event) => {
        event.preventDefault()
        if (
            newUserpassword != newUserpasswordConfirm ||
            newUserFirstName == '' ||
            newUserLastName == '' ||
            newPassword == '' ||
            newPasswordConfirm == '' ||
            email == '' ||
            !email.includes('@')
        ) {
            enqueueSnackbar('please check your password', {
                variant: 'error',
                autoHideDuration: 3000,
                preventDuplicate: true,
            })
            return
        }
        setLoading(true)
        try {
            axiosClient
                .post('auth/signup', {
                    username: email,
                    password: newUserpassword,
                    email: email,
                    name: `${newUserFirstName} ${newUserLastName}`,
                    first_name: newUserFirstName,
                    last_name: newUserLastName,
                    roleId: role.value,
                })
                .then((response) => {
                    if (response.status === 200) {
                        setLoading(false)
                        setSignup(!signup)
                        enqueueSnackbar('Account Created Successfully', {
                            variant: 'success',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                    } else {
                        setLoading(false)
                        setError(true)
                        enqueueSnackbar('Failed to Created Account', {
                            variant: 'success',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                    }
                })
        } catch (err) {
            setLoading(false)
            console.log(err)
        }
    }

    return (
        <>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={8}>
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
                                    label="Accounts"
                                    {...a11yProps(1)}
                                    style={{ margin: '0px 10px' }}
                                />
                                {(user.role.isManager || user.role.isAdmin) && (
                                    <Tab
                                        label="Rates and Shift Info"
                                        {...a11yProps(2)}
                                        style={{ margin: '0px 10px' }}
                                    />
                                )}
                                {user.role.isAdmin && (
                                    <Tab
                                        label="Employees"
                                        {...a11yProps(3)}
                                        style={{ margin: '0px 10px' }}
                                    />
                                )}
                                {user.role.isAdmin && (
                                    <Tab
                                        label="Create a New User"
                                        {...a11yProps(4)}
                                        style={{ margin: '0px 10px' }}
                                    />
                                )}
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
                                    justifyContent="start"
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
                                    justifyContent="start"
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
                                            className={
                                                classes.textFieldContainer
                                            }
                                        >
                                            <Typography
                                                className={classes.labelText}
                                            >
                                                First Name
                                            </Typography>
                                            <TextField
                                                value={firstName}
                                                onChange={(event) =>
                                                    setFirstName(
                                                        event.target.value
                                                    )
                                                }
                                                type="name"
                                                placeholder="Enter First Name"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                className={classes.textField}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={8}
                                            className={
                                                classes.textFieldContainer
                                            }
                                        >
                                            <Typography
                                                className={classes.labelText}
                                            >
                                                Last Name
                                            </Typography>
                                            <TextField
                                                value={lastName}
                                                onChange={(event) =>
                                                    setLastName(
                                                        event.target.value
                                                    )
                                                }
                                                type="name"
                                                placeholder="Enter Last Name"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                className={classes.textField}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={8}
                                            className={
                                                classes.textFieldContainer
                                            }
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
                                                    setPassword(
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={8}
                                            className={
                                                classes.textFieldContainer
                                            }
                                        >
                                            <Typography
                                                className={classes.labelText}
                                            >
                                                Enter New Password
                                            </Typography>
                                            <TextField
                                                placeholder="New Password"
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
                                        <Grid
                                            item
                                            xs={8}
                                            className={
                                                classes.textFieldContainer
                                            }
                                        >
                                            <Typography
                                                className={classes.labelText}
                                            >
                                                Confirm New Password
                                            </Typography>
                                            <TextField
                                                placeholder="Confirm Password"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                type="password"
                                                value={newPasswordConfirm}
                                                className={classes.textField}
                                                onChange={(event) =>
                                                    setNewPasswordConfirm(
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                style={{
                                                    backgroundColor: '#081e5c',
                                                    color: 'white',
                                                }}
                                                fullWidth
                                                className={classes.button}
                                                onClick={setUserPassword}
                                            >
                                                Save
                                            </Button>
                                            <br />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    style={{ marginTop: 10 }}
                                ></Grid>
                            </div>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <div
                                style={{
                                    marginTop: 50,
                                }}
                            >
                                <CreateLocationInfoForm
                                    open={open}
                                    handleClose={() => setOpen(false)}
                                />
                                <EditLocationInfoForm
                                    open={editOpen}
                                    row={editLocation}
                                    handleClose={() => setEditOpen(false)}
                                />

                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="flex-end"
                                >
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
                                            All Location Info
                                        </Typography>
                                    </Box>
                                    <Grid item>
                                        <Box
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Box
                                                style={{
                                                    backgroundColor: '#081e5c',
                                                    borderRadius: '9px',
                                                    padding: 5,
                                                }}
                                            >
                                                <AddIcon
                                                    style={{ color: 'white' }}
                                                    onClick={() =>
                                                        setOpen(true)
                                                    }
                                                />
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Grid container style={{ marginTop: 10 }}>
                                    {ShiftdetailsTables()}
                                </Grid>
                            </div>
                        </TabPanel>
                        <TabPanel value={value} index={3}>
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
                                    <Grid item xs={12}>
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
                        <TabPanel value={value} index={4}>
                            <form onSubmit={signUpForm}>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Grid
                                            item
                                            xs={12}
                                            className={
                                                classes.textFieldContainer
                                            }
                                        >
                                            <Typography
                                                className={classes.labelText}
                                            >
                                                First Name
                                            </Typography>
                                            <TextField
                                                value={newUserFirstName}
                                                onChange={(event) =>
                                                    setNewUserFirstName(
                                                        event.target.value
                                                    )
                                                }
                                                type="name"
                                                placeholder="Enter First Name"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                className={classes.textField}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            className={
                                                classes.textFieldContainer
                                            }
                                        >
                                            <Typography
                                                className={classes.labelText}
                                            >
                                                Last Name
                                            </Typography>
                                            <TextField
                                                value={newUserLastName}
                                                onChange={(event) =>
                                                    setNewUserLastName(
                                                        event.target.value
                                                    )
                                                }
                                                type="name"
                                                placeholder="Enter Last Name"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                className={classes.textField}
                                            />
                                        </Grid>

                                        <Grid
                                            item
                                            xs={12}
                                            className={
                                                classes.textFieldContainer
                                            }
                                        >
                                            <Typography
                                                className={classes.labelText}
                                            >
                                                Enter Email
                                            </Typography>
                                            <TextField
                                                value={email}
                                                onChange={(event) =>
                                                    setEmail(event.target.value)
                                                }
                                                type="email"
                                                placeholder="Email"
                                                variant="outlined"
                                                fullWidth
                                                className={classes.textField}
                                                required
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            className={
                                                classes.textFieldContainer
                                            }
                                        >
                                            <Typography
                                                className={classes.labelText}
                                            >
                                                Password
                                            </Typography>
                                            <TextField
                                                placeholder="Enter Password"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                type="password"
                                                value={newUserpassword}
                                                className={classes.textField}
                                                onChange={(event) =>
                                                    setNewUserPassword(
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            className={
                                                classes.textFieldContainer
                                            }
                                        >
                                            <Typography
                                                className={classes.labelText}
                                            >
                                                Confirm Password
                                            </Typography>
                                            <TextField
                                                placeholder="Enter Confirm Password"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                type="password"
                                                value={newUserpasswordConfirm}
                                                className={classes.textField}
                                                onChange={(event) =>
                                                    setNewUserPasswordConfirm(
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            className={
                                                classes.textFieldContainer
                                            }
                                        >
                                            <Typography
                                                className={classes.labelText}
                                            >
                                                Role
                                            </Typography>
                                            <Autocomplete
                                                onChange={(event, data) => {
                                                    setRole(data)
                                                }}
                                                value={role}
                                                classes={classes.textField}
                                                options={allRoles}
                                                getOptionLabel={(option) =>
                                                    option.label
                                                }
                                                getOptionSelected={(
                                                    option,
                                                    value
                                                ) =>
                                                    value === undefined ||
                                                    value === '' ||
                                                    option.label === value.label
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Select a role"
                                                        margin="normal"
                                                        variant="outlined"
                                                        required
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                style={{
                                                    backgroundColor: '#081e5c',
                                                    color: 'white',
                                                }}
                                                fullWidth
                                                className={classes.button}
                                            >
                                                {'Create a new user'}
                                            </Button>
                                            <br />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            style={{ marginTop: 10 }}
                                        >
                                            {error && (
                                                <span
                                                    style={{
                                                        color: 'red',
                                                        marginTop: 10,
                                                    }}
                                                >
                                                    Please check Your Email and
                                                    Password
                                                </span>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </form>
                        </TabPanel>
                    </Box>
                </Grid>
            </Grid>
            <Loader loading={loading} />
        </>
    )
}
