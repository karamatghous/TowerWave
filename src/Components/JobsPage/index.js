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

function JobsPage() {
    const [cityList, setCityList] = React.useState([])
    const [search, setSearch] = React.useState('')
    const [filter, setFilter] = React.useState(null)
    const [filterDialog, setFilterDialog] = React.useState(false)
    const [searchDialog, setSearchDialog] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const date = new Date()
    const formatedDate = moment(date).format('MMMM DD, YYYY')
    const client = localStorage.getItem('client')
    const [jobList, setJobList] = React.useState([])
    const [editJob, editJobList] = React.useState(null)

    const classes = JobPageStyles
    const copyJob = (job) => {
        // event.preventDefault();
        const data = {
            clientId: job.clientId,
            employerId: job.employerId,
            job_title: job.job_title,
            job_description: job.job_description,
            state_code: job.state_code,
            state_name: job.state_name,
            city_name: job.city_name,
        }
        console.log(data)
        axiosClient
            .post('job/application/create', data, httpOptions)
            .then((response) => {
                if (response.status === 200) {
                    reset()
                }
            })
            .catch((error) => {
                console.log(error.response)
            })
        getAllJobs()
    }
    const displayDesktop = () => {
        return (
            <Typography
                gutterBottom
                variant="h3"
                align="center"
                style={{ paddingTop: '10px' }}
            >
                {localStorage.getItem('client')}
            </Typography>
        )
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

    const filterList = [
        { name: 'Location', value: 'location' },
        { name: 'Location', value: 'location' },
        { name: 'Location', value: 'location' },
    ]

    React.useEffect(() => {
        getAllJobs()
    }, [])

    const getAllJobs = () => {
        const data = {
            clientId: client,
        }
        try {
            axiosClient
                .post('jobs/list/getAll', data, httpOptions)
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

    return (
        <div
            style={{
                padding: `0px 10%`,
                marginTop: 100,
            }}
        >
            <CreateJobForm open={open} handleClose={() => setOpen(false)} />
            <EditJobForm
                open={open}
                handleClose={() => setOpen(false)}
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
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    type="string"
                                    placeholder="Search"
                                    className={classes.searchTextField}
                                />
                            </Box>
                        )}
                        <Dialog
                            onClose={() => setFilterDialog(false)}
                            open={filterDialog}
                        >
                            <DialogTitle>Select a Filter</DialogTitle>
                            <List sx={{ pt: 0 }}>
                                {filterList.map((item) => (
                                    <ListItem
                                        button
                                        onClick={() => {
                                            setFilterDialog(false)
                                            setFilter(item.value)
                                        }}
                                        key={item.value}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {item.name}
                                    </ListItem>
                                ))}
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
                                backgroundColor: '#3f50b5',
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
            <Grid container spacing={3} style={{ marginTop: 50 }}>
                {jobList.map((job) => (
                    <Grid
                        item
                        xs={12}
                        style={{
                            backgroundColor: '#ffffff',
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
                                            0
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
                                            0
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
                                            0
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
                                            0
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
                                    {formatedDate}
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
                                            navigator.clipboard.writeText(
                                                `http://localhost:3000/candidate-redirect?jobId:${job.id}`
                                            )
                                        }}
                                        style={{
                                            margin: '0px 5px',
                                            cursor: 'pointer',
                                        }}
                                    />
                                    <EditIcon
                                        onClick={() => console.log('hi')}
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
        </div>
    )
}

export default JobsPage
