import * as React from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import {
    Grid,
    Typography,
    Box,
    List,
    ListItem,
    Button,
} from '@material-ui/core'
import moment from 'moment'
import { useForm, Controller } from 'react-hook-form'
import JobPageStyles from './style'
import { axiosClient, httpOptions } from '../../config'
import { Autocomplete, Dialog, DialogTitle, Modal } from '@mui/material'
import TextField from '@mui/material/TextField'
import { City, State } from 'country-state-city'
import { uniqBy } from 'lodash'
import SearchIcon from '@mui/icons-material/Search'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import Loader from '../Loader'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import CadidateView from '../CadidateView'
import events from './events'

import Calendar from './calender'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'

// const locales = {
//     'en-US': enUS,
// }

// const localizer = dateFnsLocalizer({
//     format,
//     parse,
//     startOfWeek,
//     getDay,
//     locales,
// })

// const MyCalendar = (props) => (
//     <div>
//         <Calendar
//             localizer={localizer}
//             events={events}
//             startAccessor="start"
//             endAccessor="end"
//             style={{ height: 500 }}
//         />
//     </div>
// )

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

const filteroptions = [
    {
        value: 'Pending',
        label: 'Pending',
    },
    {
        value: 'Active',
        label: 'Active',
    },
    {
        value: 'Approved',
        label: 'Approved',
    },
    {
        value: 'Rejected',
        label: 'Rejected',
    },
]

const hiringList = [
    {
        value: 'Pending',
        label: 'Pending',
    },
    {
        value: 'Hired',
        label: 'Hired',
    },
    {
        value: 'Terminated',
        label: 'Terminated',
    },
    {
        value: 'Rejected',
        label: 'Rejected',
    },
]

const trainingList = [
    {
        value: 'Pending',
        label: 'Pending',
    },
    {
        value: 'Active',
        label: 'Active',
    },
    {
        value: 'Passed',
        label: 'Passed',
    },
    {
        value: 'Failed',
        label: 'Failed',
    },
]

const partnerOptions = [
    {
        label: 'Uber',
        value: 'Uber',
    },
    {
        label: 'Lyft',
        value: 'Lyft',
    },
    {
        label: 'Waymo',
        value: 'Waymo',
    },
]

const shiftOptions = [
    {
        label: 'Weekday 1st Shift',
        value: 'Weekday 1st Shift',
        code: 1,
    },
    {
        label: 'Weekday 2nd Shift',
        value: 'Weekday 2nd Shift',
        code: 2,
    },
    {
        label: 'Weekday 3rd Shift',
        value: 'Weekday 3rd Shift',
        code: 3,
    },
    {
        label: 'Weekend 1st Shift',
        value: 'Weekend 1st Shift',
        code: 4,
    },
    {
        label: 'Weekend 2nd Shift',
        value: 'Weekend 2nd Shift',
        code: 5,
    },
    {
        label: 'Weekend 3rd Shift',
        value: 'Weekend 3rd Shift',
        code: 6,
    },
]

function HomePage() {
    const date = new Date()
    const formatedDate = moment(date).format('MMMM DD, YYYY')
    const client = localStorage.getItem('client')
    const user = JSON.parse(localStorage.getItem('user'))
    const [jobList, setJobList] = React.useState([])
    const [allJobs, setAllJobs] = React.useState([])
    const [countJobList, setCountJobList] = React.useState([])
    const now = moment(new Date())
    const [filterDialog, setFilterDialog] = React.useState(false)
    const [searchDialog, setSearchDialog] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [openViewDialog, setOpenViewDialog] = React.useState(false)
    const [selectedRow, setSelectedRow] = React.useState({})
    const [search, setSearch] = React.useState('')
    const [cityList, setCityList] = React.useState([])
    const [stateList, setStateList] = React.useState([])
    const [notesText, setNotesText] = React.useState('')
    const { enqueueSnackbar } = useSnackbar()
    const [filter, setFilter] = React.useState({
        city: [],
        state: [],
        user: [],
        jobs: [],
        status: '',
        source: '',
        profile: '',
        DL: '',
        BC: '',
        DT: '',
        Training: '',
        hiring: '',
        partner: '',
        shift: '',
    })
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate()

    const handleOpen = async (row) => {
        setNotesText(row.notes ? row.notes : '')
        await setSelectedRow(row)
        setOpen(true)
    }

    const handleViewClose = () => {
        setOpenViewDialog(false)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const classes = JobPageStyles

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
        reset,
    } = useForm({
        mode: 'onChange',
        defaultValues: { job: '', state: null, city: null, description: '' },
    })

    React.useEffect(() => {
        firstRenderFunction()
    }, [])

    const firstRenderFunction = async () => {
        setLoading(true)
        const resultCity = uniqBy(City.getCitiesOfCountry('US'), 'name')
        setCityList(resultCity)
        const resultState = uniqBy(State.getStatesOfCountry('US'), 'name')
        setStateList(resultState)
        await getJobList()
        await getMyAllJobs()
        setLoading(false)
    }

    React.useEffect(() => {
        setCountJobList(
            jobList.map((job) => {
                return job.post_job
            })
        )
    }, [jobList])

    const getMyAllJobs = () => {
        setLoading(true)
        const data = {
            clientId: client,
            userId: user.id,
        }
        try {
            axiosClient
                .post('user/profile/getUserCandidates', data, httpOptions)
                .then((response) => {
                    setLoading(false)
                    if (response.status === 200) {
                        const res = response.data.data
                        setJobList(res)
                    } else {
                        // setError(true)
                    }
                })
        } catch (err) {
            setLoading(false)
            console.log(err)
        }
    }

    const getJobList = () => {
        const data = {
            clientId: client,
        }
        try {
            axiosClient.post('jobs/list/getAll', data).then((response) => {
                if (response.status === 200) {
                    const res = response.data.data
                    setAllJobs(res)
                } else {
                    // setError(true)
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    const getFilterJobs = () => {
        setLoading(true)
        const data = {
            clientId: client,
            filter: filter,
            userId: user.id,
        }
        try {
            axiosClient
                .post('user/profile/showFilterUsersByUser', data, httpOptions)
                .then((response) => {
                    setLoading(false)
                    if (response.status === 200) {
                        const res = response.data.data
                        setJobList(res)
                    } else {
                        // setError(true)
                    }
                })
        } catch (err) {
            setLoading(false)
            console.log(err)
        }
    }

    const getSearchJobs = (term) => {
        setLoading(true)
        const data = {
            clientId: client,
            term: term,
            userId: user.id,
        }
        try {
            axiosClient
                .post('user/profile/showSearchUsersByUser', data, httpOptions)
                .then((response) => {
                    setLoading(false)
                    if (response.status === 200) {
                        const res = response.data.data
                        setJobList(res)
                    } else {
                        // setError(true)
                    }
                })
        } catch (err) {
            setLoading(false)
            console.log(err)
        }
    }

    const handleAddNotes = (selectedRow) => {
        setLoading(true)
        const data = {
            id: selectedRow.id,
            attributes: {
                notes: notesText,
            },
        }
        try {
            axiosClient
                .put('user/profile/updateCandidate', data, httpOptions)
                .then((response) => {
                    setLoading(false)
                    if (response.status === 200) {
                        const res = response.data.data
                        getMyAllJobs()
                        enqueueSnackbar('New Notes Added Successfully', {
                            variant: 'success',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                    } else {
                        enqueueSnackbar('Failed to Update Notes', {
                            variant: 'error',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                        // setError(true)
                    }
                })
        } catch (err) {
            setLoading(false)
            enqueueSnackbar('Failed to Update Notes', {
                variant: 'error',
                autoHideDuration: 3000,
                preventDuplicate: true,
            })
            console.log(err)
        }
    }

    const statusList = [
        { name: 'Applied', value: '0' },
        { name: 'Assigned', value: '1' },
        { name: 'Rejected', value: '2' },
        { name: 'Waitlisted', value: '3' },
        { name: 'Training', value: '4' },
        { name: 'Hired', value: '5' },
    ]

    const sourceList = [
        { name: 'Admin Panel', value: 'Admin panel' },
        { name: 'Facebook', value: 'Facebook' },
        { name: 'Indeed', value: 'Indeed' },
    ]
    function CustomizedTables() {
        return (
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Loader loading={loading} />
                <Grid item xs={10} md={12}>
                    <TableContainer style={{ maxHeight: 450 }}>
                        <Table
                            stickyHeader
                            sx={{ minWidth: 700 }}
                            aria-label="customized table"
                        >
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Job</StyledTableCell>
                                    <StyledTableCell>
                                        First Name
                                    </StyledTableCell>
                                    <StyledTableCell>Last Name</StyledTableCell>
                                    <StyledTableCell>
                                        Days in Progress
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Profile Photo
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Driving License
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Background Check
                                    </StyledTableCell>
                                    <StyledTableCell>Drug Test</StyledTableCell>
                                    <StyledTableCell>Training</StyledTableCell>
                                    <StyledTableCell>Status</StyledTableCell>
                                    <StyledTableCell>Notes</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {jobList.map((row, index) => (
                                    <StyledTableRow key={row.name + index}>
                                        <StyledTableCell
                                            component="th"
                                            scope="row"
                                        >
                                            {row.post_job.job_title}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            onClick={() => {
                                                localStorage.setItem(
                                                    'candidate',
                                                    JSON.stringify(row)
                                                )
                                                navigate('/recruitment')
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {row.first_name}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {row.last_name}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {moment(
                                                new Date(row.updatedAt)
                                            ).format('MMMM DD, YYYY')}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {row.profile_photo
                                                ? row.profile_photo
                                                : 'pending'}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {row.DLN_status
                                                ? row.DLN_status
                                                : 'pending'}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {row.BGC ? row.BGC : 'pending'}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {row.drug_test
                                                ? row.drug_test
                                                : 'pending'}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {row.training
                                                ? row.training
                                                : 'pending'}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {row.status}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            onClick={() => {
                                                handleOpen(row)
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <span>{row.notes}</span>
                                        </StyledTableCell>
                                        <StyledTableCell
                                            onClick={() => {
                                                setSelectedRow(row)
                                                setOpenViewDialog(true)
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <span>View</span>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        )
    }

    function JobTables() {
        return (
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={4}>
                    <Table sx={{ minWidth: 500 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Job</StyledTableCell>
                                <StyledTableCell>Candidates</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {countJobList.map((row) => (
                                <StyledTableRow key={row.name}>
                                    <StyledTableCell component="th" scope="row">
                                        {`${row.job_title} - ${row.city_name} `}
                                    </StyledTableCell>
                                    <StyledTableCell>1</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        )
    }

    return (
        <div
            style={{
                padding: `0px 10%`,
                marginTop: 50,
            }}
        >
            <Grid
                container
                spacing={3}
                style={{ marginTop: 10, marginBottom: 50 }}
            >
                {JobTables()}
            </Grid>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={10} md={12}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Grid item>
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
                                    My Candidates
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {searchDialog && (
                                    <Box
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: '0px 10px',
                                        }}
                                    >
                                        <TextField
                                            value={search}
                                            onChange={(event) => {
                                                setSearch(event.target.value)
                                                if (event.target.value === '') {
                                                    getMyAllJobs()
                                                }
                                            }}
                                            onKeyPress={(event) => {
                                                if (event.key === 'Enter') {
                                                    getSearchJobs(
                                                        event.target.value
                                                    )
                                                }
                                            }}
                                            type="string"
                                            placeholder="Search"
                                            className={classes.searchTextField}
                                        />
                                    </Box>
                                )}

                                <Box
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#cecece',
                                        borderRadius: '15px',
                                        padding: `3px 5px`,
                                        marginRight: '10px',
                                        width: 80,
                                    }}
                                >
                                    <SearchIcon
                                        onClick={() =>
                                            setSearchDialog(!searchDialog)
                                        }
                                        style={{ margin: '0px 5px' }}
                                    />
                                    <FilterAltIcon
                                        onClick={() =>
                                            setFilterDialog(!filterDialog)
                                        }
                                        style={{ margin: '0px 5px' }}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={3} style={{ marginTop: 10 }}>
                {CustomizedTables()}
            </Grid>
            <Grid container spacing={3} style={{ marginTop: 50 }}>
                <Calendar />
            </Grid>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle sx={{ padding: 0 }}>Add noted Here</DialogTitle>
                <TextField
                    id="outlined-multiline-static"
                    multiline
                    rows={4}
                    variant={'outlined'}
                    style={{ padding: '20px 10px' }}
                    value={notesText}
                    onChange={(event) => setNotesText(event.target.value)}
                />
                <Grid item xs={12}>
                    <Button
                        onClick={() => {
                            handleAddNotes(selectedRow)
                        }}
                        style={{
                            background: '#081e5c',
                            color: '#FFFFFF',
                            margin: '10px',
                            textTransform: 'capitalize',
                            float: 'right',
                        }}
                    >
                        Save
                    </Button>
                </Grid>
            </Dialog>
            <Dialog
                onClose={() => setFilterDialog(false)}
                open={filterDialog}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Select a Filter</DialogTitle>
                <List sx={{ padding: 0 }}>
                    <ListItem
                        key={'cityfilter'}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                    >
                        <Autocomplete
                            multiple
                            onChange={(event, city) => {
                                setFilter({
                                    ...filter,
                                    city: city,
                                })
                            }}
                            value={filter.city}
                            classes={classes.textField}
                            disableCloseOnSelect
                            options={cityList}
                            getOptionLabel={(option) => option.name}
                            key="autocomplete"
                            getOptionSelected={(option, value) =>
                                value === undefined ||
                                value === '' ||
                                option.name === value.name
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="City"
                                    placeholder="city"
                                    margin="normal"
                                    variant="outlined"
                                />
                            )}
                            fullWidth
                        />
                    </ListItem>
                    <ListItem
                        key={'statefilter'}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                    >
                        <Autocomplete
                            multiple
                            onChange={(event, state) => {
                                setFilter({
                                    ...filter,
                                    state: state,
                                })
                            }}
                            value={filter.state}
                            classes={classes.textField}
                            disableCloseOnSelect
                            options={stateList}
                            getOptionLabel={(option) => option.name}
                            key="autocomplete"
                            getOptionSelected={(option, value) =>
                                value === undefined ||
                                value === '' ||
                                option.name === value.name
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="State"
                                    placeholder="State"
                                    margin="normal"
                                    variant="outlined"
                                />
                            )}
                            fullWidth
                        />
                    </ListItem>
                    {/* <ListItem
                        key={'statusfilter'}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                    >
                        <Autocomplete
                            onChange={(event, status) => {
                                setFilter({
                                    ...filter,
                                    status: status,
                                })
                            }}
                            classes={classes.textField}
                            disableCloseOnSelect
                            options={statusList}
                            getOptionLabel={(option) => option.name}
                            key="autocomplete"
                            getOptionSelected={(option, value) =>
                                value === undefined ||
                                value === '' ||
                                option.name === value.name
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Status"
                                    placeholder="Status"
                                    margin="normal"
                                    variant="outlined"
                                />
                            )}
                            fullWidth
                        />
                    </ListItem> */}

                    <ListItem
                        key={'filter'}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                    >
                        <Autocomplete
                            onChange={(event, source) => {
                                setFilter({
                                    ...filter,
                                    source: source,
                                })
                            }}
                            classes={classes.textField}
                            disableCloseOnSelect
                            options={sourceList}
                            getOptionLabel={(option) => option.name}
                            key="autocomplete"
                            getOptionSelected={(option, value) =>
                                value === undefined ||
                                value === '' ||
                                option.name === value.name
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Source"
                                    placeholder="Source"
                                    margin="normal"
                                    variant="outlined"
                                />
                            )}
                            fullWidth
                        />
                    </ListItem>
                    <ListItem
                        key={'filter'}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                    >
                        <Autocomplete
                            multiple
                            onChange={(event, job) => {
                                setFilter({
                                    ...filter,
                                    jobs: job,
                                })
                            }}
                            value={filter.jobs}
                            classes={classes.textField}
                            disableCloseOnSelect
                            options={allJobs}
                            getOptionLabel={(option) => option.job_title}
                            key="autocomplete"
                            getOptionSelected={(option, value) =>
                                value === undefined ||
                                value === '' ||
                                option.job_title === value.job_title
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select a Job"
                                    placeholder="Job"
                                    margin="normal"
                                    variant="outlined"
                                />
                            )}
                            fullWidth
                        />
                    </ListItem>

                    <ListItem
                        key={'partner'}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                    >
                        <Autocomplete
                            onChange={(event, job) => {
                                setFilter({
                                    ...filter,
                                    partner: job,
                                })
                            }}
                            classes={classes.textField}
                            disableCloseOnSelect
                            options={partnerOptions}
                            getOptionLabel={(option) => option.label}
                            key="autocomplete"
                            getOptionSelected={(option, value) =>
                                value === undefined ||
                                value === '' ||
                                option.label === value.label
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Partner"
                                    placeholder="Select a Partner"
                                    margin="normal"
                                    variant="outlined"
                                />
                            )}
                            fullWidth
                        />
                    </ListItem>

                    <ListItem
                        key={'filter'}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                    >
                        <Autocomplete
                            onChange={(event, job) => {
                                setFilter({
                                    ...filter,
                                    shift: job,
                                })
                            }}
                            classes={classes.textField}
                            disableCloseOnSelect
                            options={shiftOptions}
                            getOptionLabel={(option) => option.label}
                            key="autocomplete"
                            getOptionSelected={(option, value) =>
                                value === undefined ||
                                value === '' ||
                                option.label === value.label
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Shift"
                                    placeholder="Select a Shift"
                                    margin="normal"
                                    variant="outlined"
                                />
                            )}
                            fullWidth
                        />
                    </ListItem>

                    <ListItem
                        key={'filter'}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                    >
                        <Autocomplete
                            onChange={(event, job) => {
                                setFilter({
                                    ...filter,
                                    profile: job,
                                })
                            }}
                            classes={classes.textField}
                            disableCloseOnSelect
                            options={filteroptions}
                            getOptionLabel={(option) => option.label}
                            key="autocomplete"
                            getOptionSelected={(option, value) =>
                                value === undefined ||
                                value === '' ||
                                option.label === value.label
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Profile Photo"
                                    placeholder="Profile Photo"
                                    margin="normal"
                                    variant="outlined"
                                />
                            )}
                            fullWidth
                        />
                    </ListItem>

                    <ListItem
                        key={'filter'}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                    >
                        <Autocomplete
                            onChange={(event, job) => {
                                setFilter({
                                    ...filter,
                                    Dl: job,
                                })
                            }}
                            classes={classes.textField}
                            disableCloseOnSelect
                            options={filteroptions}
                            getOptionLabel={(option) => option.label}
                            key="autocomplete"
                            getOptionSelected={(option, value) =>
                                value === undefined ||
                                value === '' ||
                                option.label === value.label
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Driving License"
                                    placeholder="Driving License"
                                    margin="normal"
                                    variant="outlined"
                                />
                            )}
                            fullWidth
                        />
                    </ListItem>

                    <ListItem
                        key={'filter'}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                    >
                        <Autocomplete
                            onChange={(event, job) => {
                                setFilter({
                                    ...filter,
                                    BC: job,
                                })
                            }}
                            classes={classes.textField}
                            disableCloseOnSelect
                            options={filteroptions}
                            getOptionLabel={(option) => option.label}
                            key="autocomplete"
                            getOptionSelected={(option, value) =>
                                value === undefined ||
                                value === '' ||
                                option.label === value.label
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Background Check"
                                    placeholder="Background Check"
                                    margin="normal"
                                    variant="outlined"
                                />
                            )}
                            fullWidth
                        />
                    </ListItem>

                    <ListItem
                        key={'filter'}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                    >
                        <Autocomplete
                            onChange={(event, job) => {
                                setFilter({
                                    ...filter,
                                    DT: job,
                                })
                            }}
                            classes={classes.textField}
                            disableCloseOnSelect
                            options={filteroptions}
                            getOptionLabel={(option) => option.label}
                            key="autocomplete"
                            getOptionSelected={(option, value) =>
                                value === undefined ||
                                value === '' ||
                                option.label === value.label
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Drug Test"
                                    placeholder="Drug Test"
                                    margin="normal"
                                    variant="outlined"
                                />
                            )}
                            fullWidth
                        />
                    </ListItem>

                    <ListItem
                        key={'filter'}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                    >
                        <Autocomplete
                            onChange={(event, job) => {
                                setFilter({
                                    ...filter,
                                    Training: job,
                                })
                            }}
                            classes={classes.textField}
                            disableCloseOnSelect
                            options={trainingList}
                            getOptionLabel={(option) => option.label}
                            key="autocomplete"
                            getOptionSelected={(option, value) =>
                                value === undefined ||
                                value === '' ||
                                option.label === value.label
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Training"
                                    placeholder="Training"
                                    margin="normal"
                                    variant="outlined"
                                />
                            )}
                            fullWidth
                        />
                    </ListItem>

                    <ListItem
                        key={'filter'}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                    >
                        <Autocomplete
                            onChange={(event, job) => {
                                setFilter({
                                    ...filter,
                                    hiring: job,
                                })
                            }}
                            classes={classes.textField}
                            disableCloseOnSelect
                            options={hiringList}
                            getOptionLabel={(option) => option.label}
                            key="autocomplete"
                            getOptionSelected={(option, value) =>
                                value === undefined ||
                                value === '' ||
                                option.label === value.label
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Hiring Status"
                                    placeholder="Hiring Status"
                                    margin="normal"
                                    variant="outlined"
                                />
                            )}
                            fullWidth
                        />
                    </ListItem>

                    <ListItem
                        key="btn"
                        style={{
                            display: 'flex',
                            justifyContent: 'end',
                            alignItems: 'center',
                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                    >
                        <Button
                            onClick={() => {
                                getFilterJobs()
                                setFilterDialog(false)
                            }}
                            style={{
                                background: '#081e5c',
                                color: '#FFFFFF',
                                textTransform: 'capitalize',
                            }}
                        >
                            Filter
                        </Button>
                        <Button
                            onClick={() => {
                                getMyAllJobs()
                                setFilterDialog(false)
                            }}
                            style={{
                                background: '#CECECE',
                                color: '#FFFFFF',
                                marginLeft: '10px',
                                textTransform: 'capitalize',
                            }}
                        >
                            Cancel
                        </Button>
                    </ListItem>
                </List>
            </Dialog>
            {selectedRow && (
                <CadidateView
                    open={openViewDialog}
                    handleClose={handleViewClose}
                    candidate={selectedRow}
                />
            )}
            <Loader loading={loading} />
        </div>
    )
}

export default HomePage
