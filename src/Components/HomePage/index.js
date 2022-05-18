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

function HomePage() {
    const date = new Date()
    const formatedDate = moment(date).format('MMMM DD, YYYY')
    const client = localStorage.getItem('client')
    const user = JSON.parse(localStorage.getItem('user'))
    const [jobList, setJobList] = React.useState([])
    const [countJobList, setCountJobList] = React.useState([])
    const now = moment(new Date())
    const [filterDialog, setFilterDialog] = React.useState(false)
    const [searchDialog, setSearchDialog] = React.useState(false)
    const [open, setOpen] = React.useState(false)
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
    })
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate()

    const handleOpen = async (row) => {
        setNotesText(row.notes ? row.notes : '')
        await setSelectedRow(row)
        setOpen(true)
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
        const resultCity = uniqBy(City.getCitiesOfCountry('US'), 'name')
        setCityList(resultCity)
        const resultState = uniqBy(State.getStatesOfCountry('US'), 'name')
        setStateList(resultState)
        getMyAllJobs()
    }, [])

    React.useEffect(() => {
        setCountJobList(
            jobList.map((job) => {
                return job.post_job
            })
        )
    }, [jobList])

    const getMyAllJobs = () => {
        const data = {
            clientId: client,
            userId: user.id,
        }
        try {
            axiosClient
                .post('user/profile/getUserCandidates', data, httpOptions)
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

    const getFilterJobs = () => {
        const data = {
            clientId: client,
            filter: filter,
            userId: user.id,
        }
        try {
            axiosClient
                .post('user/profile/showFilterUsersByUser', data, httpOptions)
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

    const getSearchJobs = (term) => {
        const data = {
            clientId: client,
            term: term,
            userId: user.id,
        }
        try {
            axiosClient
                .post('user/profile/showSearchUsersByUser', data, httpOptions)
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

    const handleAddNotes = (selectedRow) => {
        const data = {
            id: selectedRow.id,
            notes: notesText,
        }
        try {
            axiosClient
                .post('user/profile/updateCandidateNotes', data, httpOptions)
                .then((response) => {
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
        { name: 'In-Progress', value: '2' },
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
                <Grid item xs={10}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Job</StyledTableCell>
                                <StyledTableCell>First Name</StyledTableCell>
                                <StyledTableCell>Last Name</StyledTableCell>
                                <StyledTableCell>
                                    Days in Progress
                                </StyledTableCell>
                                <StyledTableCell>Status</StyledTableCell>
                                <StyledTableCell>Notes</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jobList.map((row) => (
                                <StyledTableRow key={row.name}>
                                    <StyledTableCell component="th" scope="row">
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
                                        {moment(new Date(row.updatedAt)).format(
                                            'MMMM DD, YYYY'
                                        )}
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
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
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
                <Grid item xs={10}>
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
                            background: '#3f50b5',
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
                    <ListItem
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
                            value={filter.status}
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
                            onChange={(event, source) => {
                                setFilter({
                                    ...filter,
                                    source: source,
                                })
                            }}
                            value={filter.source}
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
                            onChange={(event, job) => {
                                setFilter({
                                    ...filter,
                                    jobs: job,
                                })
                            }}
                            value={filter.jobs}
                            classes={classes.textField}
                            disableCloseOnSelect
                            options={jobList}
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
                                background: '#3f50b5',
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
            <Loader loading={loading} />
        </div>
    )
}

export default HomePage
