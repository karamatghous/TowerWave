import * as React from 'react'
import {
    Grid,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    AppBar,
    Container,
    Box,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    DialogActions,
    List,
    ListItem,
} from '@material-ui/core'
import { uniqBy } from 'lodash'
import moment from 'moment'
import SearchIcon from '@mui/icons-material/Search'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import AddIcon from '@mui/icons-material/Add'
import LinkIcon from '@mui/icons-material/Link'
import EditIcon from '@mui/icons-material/Edit'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Country, State, City } from 'country-state-city'
import JobPageStyles from './style'
import CreateJobForm from '../CreateJobForm'
import { axiosClient, httpOptions } from '../../config'
import EditJobForm from '../EditJobForm'
import { Autocomplete } from '@mui/material'
import { useSnackbar } from 'notistack'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import PersonIcon from '@mui/icons-material/Person'
import { blue } from '@mui/material/colors'

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

const sources = [
    { label: 'Indeed', value: 'Indeed' },
    { label: 'Facebook', value: 'Facebook' },
]

function JobsPage() {
    const [cityList, setCityList] = React.useState([])
    const [stateList, setStateList] = React.useState([])
    const [filter, setFilter] = React.useState({
        city: [],
        state: [],
        user: [],
        partner: {},
        shift: {},
    })
    const [userList, setUserList] = React.useState([])
    const [search, setSearch] = React.useState('')
    const [filterDialog, setFilterDialog] = React.useState(false)
    const [searchDialog, setSearchDialog] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [editOpen, setEditOpen] = React.useState(false)
    const date = new Date()
    const formatedDate = moment(date).format('MMMM DD, YYYY')
    const client = localStorage.getItem('client')
    const user = JSON.parse(localStorage.getItem('user'))
    const [jobList, setJobList] = React.useState([])
    const [editJob, editJobList] = React.useState(null)
    const { enqueueSnackbar } = useSnackbar()
    const [loading, setLoading] = React.useState(false)
    const [selectedValue, setSelectedValue] = React.useState(sources[0])
    const [selectedJob, setSelectedJob] = React.useState(sources[0])
    const [openDialog, setOpenDialog] = React.useState(false)

    const classes = JobPageStyles
    const copyJob = (job) => {
        setLoading(true)
        // event.preventDefault();
        const data = {
            clientId: job.clientId,
            employerId: job.employerId,
            job_title: job.job_title,
            job_description: job.job_description,
            state_code: job.state_code,
            state_name: job.state_name,
            city_name: job.city_name,
            shift: job.shift,
            partner: job.partner,
        }
        axiosClient
            .post('job/application/create', data, httpOptions)
            .then((response) => {
                setLoading(false)
                if (response.status === 200) {
                    reset()
                    enqueueSnackbar('New Copy of Job is Created Successfully', {
                        variant: 'success',
                        autoHideDuration: 3000,
                        preventDuplicate: true,
                    })
                } else {
                    enqueueSnackbar('Failed to create new Copy of Job', {
                        variant: 'error',
                        autoHideDuration: 3000,
                        preventDuplicate: true,
                    })
                }
            })
            .catch((error) => {
                setLoading(false)
                console.log(error.response)
                enqueueSnackbar('Failed to create new Copy of Job', {
                    variant: 'error',
                    autoHideDuration: 3000,
                    preventDuplicate: true,
                })
            })
        getAllJobs()
    }

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
        getAllJobs()
    }, [open])

    React.useEffect(() => {
        const resultCity = uniqBy(City.getCitiesOfCountry('US'), 'name')
        setCityList(resultCity)
        const resultState = uniqBy(State.getStatesOfCountry('US'), 'name')
        setStateList(resultState)
        getAllJobs()
    }, [])

    const getAllJobs = () => {
        setLoading(true)
        const data = {
            clientId: client,
        }
        try {
            axiosClient.post('jobs/list/getAll', data).then((response) => {
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
        }
        try {
            axiosClient
                .post('jobs/list/getSearchJob', data, httpOptions)
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

    const getFilterJobs = () => {
        setLoading(true)
        const data = {
            clientId: client,
            filter: filter,
        }
        try {
            axiosClient
                .post('jobs/list/getFilterJob', data, httpOptions)
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

    const CopyLink = (value) => {
        navigator.clipboard.writeText(
            `${document.location.origin}/candidate-redirect?employee=${user.name}&source=${value}&client=${client}`
        )
        setOpenDialog(false)
        enqueueSnackbar('Link Copyed Successfully', {
            variant: 'success',
            autoHideDuration: 3000,
            preventDuplicate: true,
        })
    }

    return (
        <div
            style={{
                padding: `0px 10%`,
                marginTop: 100,
            }}
        >
            <CreateJobForm open={open} handleClose={() => setOpen(false)} />
            <EditJobForm
                open={editOpen}
                handleClose={() => setEditOpen(false)}
                job={editJob}
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
                        Jobs
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
                                            getAllJobs()
                                        }
                                    }}
                                    onKeyPress={(event) => {
                                        if (event.key === 'Enter') {
                                            getSearchJobs(event.target.value)
                                        }
                                    }}
                                    type="string"
                                    placeholder="Search"
                                    className={classes.searchTextField}
                                />
                            </Box>
                        )}
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
                                            setFilter({ ...filter, city: city })
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
                                    key={'partnerfilter'}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingTop: 0,
                                        paddingBottom: 0,
                                    }}
                                >
                                    <Autocomplete
                                        onChange={(event, partner) => {
                                            setFilter({
                                                ...filter,
                                                partner: partner,
                                            })
                                        }}
                                        classes={classes.textField}
                                        disableCloseOnSelect
                                        options={partnerOptions}
                                        getOptionLabel={(option) =>
                                            option.label
                                        }
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
                                                placeholder="Select a partner"
                                                margin="normal"
                                                variant="outlined"
                                            />
                                        )}
                                        fullWidth
                                    />
                                </ListItem>

                                <ListItem
                                    key={'partnerfilter'}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingTop: 0,
                                        paddingBottom: 0,
                                    }}
                                >
                                    <Autocomplete
                                        onChange={(event, shift) => {
                                            setFilter({
                                                ...filter,
                                                shift: shift,
                                            })
                                        }}
                                        classes={classes.textField}
                                        disableCloseOnSelect
                                        options={shiftOptions}
                                        getOptionLabel={(option) =>
                                            option.label
                                        }
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
                                                placeholder="Select a shift"
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
                                            getAllJobs()
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
                                onClick={() => setSearchDialog(!searchDialog)}
                                style={{ margin: '0px 5px' }}
                            />
                            <FilterAltIcon
                                onClick={() => setFilterDialog(!filterDialog)}
                                style={{ margin: '0px 5px' }}
                            />
                        </Box>
                        <Box
                            style={{
                                backgroundColor: '#081e5c',
                                borderRadius: '9px',
                                padding: 5,
                            }}
                        >
                            <AddIcon
                                style={{ color: 'white' }}
                                onClick={() => setOpen(true)}
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            {/* <Grid item xs={6} style={{ marginTop: '20px' }}> */}
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{ marginTop: '20px' }}
            >
                <Box
                    component={'div'}
                    style={{
                        height: 20,
                        display: 'flex',
                        margin: '0px 5px',
                    }}
                >
                    <FiberManualRecordIcon
                        fontSize="small"
                        style={{
                            color: '#6495ED',
                            marginRight: 5,
                        }}
                    />
                    <Typography component={'span'}>Total</Typography>
                </Box>
                <Box
                    component={'div'}
                    style={{
                        height: 20,
                        display: 'flex',
                        margin: '0px 5px',
                    }}
                >
                    <FiberManualRecordIcon
                        fontSize="small"
                        style={{
                            color: '#696969',
                            marginRight: 5,
                        }}
                    />
                    <Typography component={'span'}> In-Progress</Typography>
                </Box>
                <Box
                    component={'div'}
                    style={{
                        height: 20,
                        display: 'flex',
                        margin: '0px 5px',
                    }}
                >
                    <FiberManualRecordIcon
                        fontSize="small"
                        style={{
                            color: '#00FF00',
                            marginRight: 5,
                        }}
                    />
                    <Typography component={'span'}>Hired</Typography>
                </Box>
                <Box
                    component={'div'}
                    style={{
                        height: 20,
                        display: 'flex',
                        margin: '0px 5px',
                    }}
                >
                    <FiberManualRecordIcon
                        fontSize="small"
                        style={{
                            color: '#800000',
                            marginRight: 5,
                        }}
                    />
                    <Typography component={'span'}>Rejected</Typography>
                </Box>
            </Grid>
            {/* </Grid> */}
            <Grid container spacing={3} style={{ marginTop: 50 }}>
                {jobList.map((job) => (
                    <Grid
                        item
                        xs={12}
                        style={{
                            backgroundcolor: '#FFFFFF',
                            borderRadius: 15,
                            boxShadow: '0 0 5px',
                            margin: '0px 0px 10px',
                        }}
                    >
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            style={{ padding: '10px 20px 10px 20px' }}
                        >
                            <Grid
                                item
                                xs={2}
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography
                                    component={'span'}
                                    style={{
                                        fontFamily: 'Poppins',
                                        fontWeight: 'bold',
                                        fontSize: 18,
                                        color: '#000000',
                                    }}
                                >
                                    {job.job_title}
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={3}
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-evenly"
                                    alignItems="center"
                                >
                                    <Box
                                        component={'div'}
                                        style={{
                                            height: 20,
                                            display: 'flex',
                                        }}
                                    >
                                        <FiberManualRecordIcon
                                            fontSize="small"
                                            style={{
                                                color: '#6495ED',
                                                marginRight: 5,
                                            }}
                                        />
                                        <Typography component={'span'}>
                                            {job.candidate_profiles
                                                ? job.candidate_profiles.length
                                                : `0`}
                                        </Typography>
                                    </Box>
                                    <Box
                                        component={'div'}
                                        style={{
                                            height: 20,
                                            display: 'flex',
                                        }}
                                    >
                                        <FiberManualRecordIcon
                                            fontSize="small"
                                            style={{
                                                color: '#696969',
                                                marginRight: 5,
                                            }}
                                        />
                                        <Typography component={'span'}>
                                            {job.candidate_profiles
                                                ? job.candidate_profiles.filter(
                                                      (cand) =>
                                                          cand.status_code ===
                                                              1 ||
                                                          cand.status_code ===
                                                              0 ||
                                                          cand.status_code === 3
                                                  ).length
                                                : `0`}
                                        </Typography>
                                    </Box>
                                    <Box
                                        component={'div'}
                                        style={{
                                            height: 20,
                                            display: 'flex',
                                        }}
                                    >
                                        <FiberManualRecordIcon
                                            fontSize="small"
                                            style={{
                                                color: '#00FF00',
                                                marginRight: 5,
                                            }}
                                        />
                                        <Typography component={'span'}>
                                            {job.candidate_profiles
                                                ? job.candidate_profiles.filter(
                                                      (cand) =>
                                                          cand.status_code === 4
                                                  ).length
                                                : `0`}
                                        </Typography>
                                    </Box>
                                    <Box
                                        component={'div'}
                                        style={{
                                            height: 20,
                                            display: 'flex',
                                        }}
                                    >
                                        <FiberManualRecordIcon
                                            fontSize="small"
                                            style={{
                                                color: '#800000',
                                                marginRight: 5,
                                            }}
                                        />
                                        <Typography component={'span'}>
                                            {job.candidate_profiles
                                                ? job.candidate_profiles.filter(
                                                      (cand) =>
                                                          cand.status_code === 2
                                                  ).length
                                                : `0`}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid item xs={2} style={{}}>
                                <Typography
                                    component={'span'}
                                    style={{
                                        fontFamily: 'Poppins',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {moment(job.createdAt).format(
                                        'MMMM DD, YYYY'
                                    )}
                                </Typography>
                            </Grid>
                            <Grid item xs={2} style={{}}>
                                <Typography
                                    component={'span'}
                                    style={{
                                        fontFamily: 'Poppins',
                                        fontWeight: '400',
                                    }}
                                >
                                    {`${job.city_name}, ${job.state_name}`}
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={2}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography
                                    component={'span'}
                                    style={{
                                        fontFamily: 'Poppins',
                                        fontWeight: '400',
                                    }}
                                >
                                    {job.user.name}
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={1}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                    alignItems: 'center',
                                }}
                            >
                                <Box
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: `3px 5px`,
                                    }}
                                    component={'span'}
                                >
                                    <LinkIcon
                                        onClick={() => {
                                            setOpenDialog(true)
                                        }}
                                        style={{
                                            margin: '0px 5px',
                                            cursor: 'pointer',
                                        }}
                                    />
                                    <EditIcon
                                        onClick={() => {
                                            editJobList(job)
                                            setEditOpen(true)
                                        }}
                                        style={{
                                            margin: '0px 5px',
                                            cursor: 'pointer',
                                        }}
                                    />
                                    <ContentCopyIcon
                                        onClick={() => copyJob(job)}
                                        style={{
                                            margin: '0px 5px',
                                            cursor: 'pointer',
                                        }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
            <SimpleDialog
                open={openDialog}
                onClose={CopyLink}
                selectedValue={selectedValue}
            />
        </div>
    )
}

function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props
    const handleClose = () => {
        onClose(selectedValue)
    }

    const handleListItemClick = (value) => {
        onClose(value)
    }

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Select Link Source</DialogTitle>
            <List sx={{ pt: 0 }}>
                {sources.map((source) => (
                    <ListItem
                        button
                        onClick={() => handleListItemClick(source.label)}
                        key={source.label}
                        style={{ textAlign: 'center' }}
                    >
                        <ListItemText primary={source.label} />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    )
}

export default JobsPage
