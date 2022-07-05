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
} from '@material-ui/core'
import Autocomplete from '@mui/material/Autocomplete'
import { Work } from '@mui/icons-material'
import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Country, State, City } from 'country-state-city'
import CadidateFormStyles from './style'
import { axiosClient, httpOptions } from '../../config'
import { useSnackbar } from 'notistack'
import Loader from '../Loader'
import { useSearchParams } from 'react-router-dom'

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

function CadidateForm({}) {
    const [cityList, setCityList] = React.useState([])
    const [state, setState] = React.useState('')
    const classes = CadidateFormStyles
    const [jobList, setJobList] = React.useState([])
    const { enqueueSnackbar } = useSnackbar()
    const [loading, setLoading] = React.useState(false)
    const search = useLocation().search
    const employee = new URLSearchParams(search).get('employee')
    const source = new URLSearchParams(search).get('source')
    const client = new URLSearchParams(search).get('client')
    const onSubmit = (formInputs) => {
        setLoading(true)
        // event.preventDefault();
        const data = {
            jobId: formInputs.job.id,
            client_id: client,
            source: source,
            referral: employee,
            first_name: formInputs.firstName,
            last_name: formInputs.lastName,
            email: formInputs.email,
            phone_number: formInputs.phone,
            status: 'applied',
            status_code: 0,
            state_name: formInputs.state.name,
            city_name: formInputs.city.name,
            service: formInputs.partner,
            shift: formInputs.shift,
        }
        axiosClient
            .post('user/profile/create', data)
            .then((response) => {
                if (response.status === 200) {
                    setLoading(false)
                    reset()
                    enqueueSnackbar('New Candidate Added Successfully', {
                        variant: 'success',
                        autoHideDuration: 3000,
                        preventDuplicate: true,
                    })
                    window.location.replace(document.location.origin)
                } else {
                    setLoading(false)
                    enqueueSnackbar('Failed to Add New Candidate', {
                        variant: 'error',
                        autoHideDuration: 3000,
                        preventDuplicate: true,
                    })
                }
            })
            .catch((error) => {
                setLoading(false)
                enqueueSnackbar('Failed to Add New Candidate', {
                    variant: 'error',
                    autoHideDuration: 3000,
                    preventDuplicate: true,
                })
            })
    }

    const getAllJobs = () => {
        setLoading(true)
        const data = {
            clientId: new URLSearchParams(search).get('client'),
        }
        try {
            axiosClient.post('jobs/list/getAll', data).then((response) => {
                if (response.status === 200) {
                    setLoading(false)
                    const res = response.data.data
                    setJobList(res)
                } else {
                    setLoading(false)
                    // setError(true)
                }
            })
        } catch (err) {
            setLoading(false)
            console.log(err)
        }
    }

    React.useEffect(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('client')
        localStorage.removeItem('user')
        localStorage.setItem('isAuthenticated', false)
        getAllJobs()
    }, [])

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
        reset,
    } = useForm({
        mode: 'onChange',
        defaultValues: { job: null, state: null, city: null, description: '' },
    })

    return (
        <Grid>
            <Loader loading={loading} />
            <Dialog fullWidth={true} maxWidth={'sm'} open={true}>
                <DialogTitle>Welcome To TowerWav</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        filling out the following form and submit then we will
                        reach out to your for further instructions
                    </DialogContentText>
                    <Box
                        noValidate
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            width: 'fit-content',
                        }}
                    >
                        <form>
                            <Grid container spacing={1}>
                                <Grid
                                    item
                                    xs={12}
                                    className={classes.textFieldContainer}
                                >
                                    <Typography className={classes.labelText}>
                                        Enter Your First Name
                                    </Typography>

                                    <Controller
                                        control={control}
                                        name="firstName"
                                        rules={{ required: true }}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <TextField
                                                value={value}
                                                variant="outlined"
                                                placeholder="First Name"
                                                fullWidth={true}
                                                error={!!errors.firstName}
                                                classes={classes.textField}
                                                helperText={
                                                    errors.firstName &&
                                                    'First Name required'
                                                }
                                                onChange={(event) => {
                                                    onChange(event.target.value)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    className={classes.textFieldContainer}
                                >
                                    <Typography className={classes.labelText}>
                                        Enter Your Last Name
                                    </Typography>
                                    <Controller
                                        control={control}
                                        name="lastName"
                                        rules={{ required: true }}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <TextField
                                                value={value}
                                                variant="outlined"
                                                placeholder="Last Name"
                                                fullWidth={true}
                                                classes={classes.textField}
                                                error={!!errors.lastName}
                                                helperText={
                                                    errors.lastName &&
                                                    'Last Name required'
                                                }
                                                onChange={(event) => {
                                                    onChange(event.target.value)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    className={classes.textFieldContainer}
                                >
                                    <Typography className={classes.labelText}>
                                        Enter Your Phone Number
                                    </Typography>
                                    <Controller
                                        control={control}
                                        name="phone"
                                        rules={{ required: true }}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <TextField
                                                value={value}
                                                variant="outlined"
                                                placeholder="Phone Number"
                                                fullWidth={true}
                                                classes={classes.textField}
                                                error={!!errors.phone}
                                                helperText={
                                                    errors.phone &&
                                                    'phone required'
                                                }
                                                onChange={(event) => {
                                                    onChange(event.target.value)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    className={classes.textFieldContainer}
                                >
                                    <Typography className={classes.labelText}>
                                        Enter Your Email
                                    </Typography>
                                    <Controller
                                        control={control}
                                        name="email"
                                        rules={{ required: true }}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <TextField
                                                value={value}
                                                variant="outlined"
                                                placeholder="Email"
                                                fullWidth={true}
                                                classes={classes.textField}
                                                error={!!errors.email}
                                                helperText={
                                                    errors.email &&
                                                    'email required'
                                                }
                                                onChange={(event) => {
                                                    onChange(event.target.value)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    className={classes.textFieldContainer}
                                >
                                    <Typography className={classes.labelText}>
                                        Select Job from Here
                                    </Typography>
                                    <Controller
                                        control={control}
                                        name="job"
                                        rules={{ required: true }}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <Autocomplete
                                                onChange={(event, job) => {
                                                    onChange(job)
                                                }}
                                                value={value}
                                                classes={classes.textField}
                                                options={jobList}
                                                getOptionLabel={(option) => {
                                                    return `${option.job_title} - ${option.city_name}`
                                                }}
                                                getOptionSelected={(
                                                    option,
                                                    value
                                                ) =>
                                                    value === undefined ||
                                                    value === '' ||
                                                    option.job_title ===
                                                        value.job_title
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Select a Job"
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={!!errors.Job}
                                                        helperText={
                                                            errors.Job &&
                                                            'job required'
                                                        }
                                                        required
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    className={classes.textFieldContainer}
                                >
                                    <Typography className={classes.labelText}>
                                        State
                                    </Typography>
                                    <Controller
                                        control={control}
                                        name="state"
                                        rules={{ required: true }}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <Autocomplete
                                                onChange={(event, state) => {
                                                    setState(state.isoCode)
                                                    onChange(state)
                                                }}
                                                value={value}
                                                classes={classes.textField}
                                                options={State.getStatesOfCountry(
                                                    'US'
                                                )}
                                                getOptionLabel={(option) =>
                                                    option.name
                                                }
                                                getOptionSelected={(
                                                    option,
                                                    value
                                                ) =>
                                                    value === undefined ||
                                                    value === '' ||
                                                    option.name === value.name
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="state"
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={!!errors.state}
                                                        helperText={
                                                            errors.state &&
                                                            'state required'
                                                        }
                                                        required
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    className={classes.textFieldContainer}
                                >
                                    <Typography className={classes.labelText}>
                                        City
                                    </Typography>
                                    <Controller
                                        control={control}
                                        name="city"
                                        rules={{ required: true }}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <Autocomplete
                                                onChange={(event, city) => {
                                                    onChange(city)
                                                }}
                                                value={value}
                                                classes={classes.textField}
                                                options={City.getCitiesOfState(
                                                    'US',
                                                    state
                                                )}
                                                getOptionLabel={(option) =>
                                                    option.name
                                                }
                                                getOptionSelected={(
                                                    option,
                                                    value
                                                ) =>
                                                    value === undefined ||
                                                    value === '' ||
                                                    option.name === value.name
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="city"
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={!!errors.city}
                                                        helperText={
                                                            errors.city &&
                                                            'city required'
                                                        }
                                                        required
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    className={classes.textFieldContainer}
                                >
                                    <Typography className={classes.labelText}>
                                        Partner
                                    </Typography>
                                    <Controller
                                        control={control}
                                        name="partner"
                                        rules={{ required: true }}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <Autocomplete
                                                onChange={(event, partner) => {
                                                    onChange(partner)
                                                }}
                                                value={value}
                                                classes={classes.textField}
                                                options={partnerOptions}
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
                                                        placeholder="Select a Partner"
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={!!errors.partner}
                                                        helperText={
                                                            errors.partner &&
                                                            'partner required'
                                                        }
                                                        required
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    className={classes.textFieldContainer}
                                >
                                    <Typography className={classes.labelText}>
                                        Shift
                                    </Typography>
                                    <Controller
                                        control={control}
                                        name="shift"
                                        rules={{ required: true }}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <Autocomplete
                                                onChange={(event, shift) => {
                                                    onChange(shift)
                                                }}
                                                value={value}
                                                classes={classes.textField}
                                                options={shiftOptions}
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
                                                        placeholder="Select a Shift"
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={!!errors.shift}
                                                        helperText={
                                                            errors.shift &&
                                                            'shift required'
                                                        }
                                                        required
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="flex-end"
                                    alignItems="flex-end"
                                    style={{ marginTop: 20, marginBottom: 20 }}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="grey"
                                    >
                                        cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        style={{
                                            marginLeft: 20,
                                            backgroundColor: '#081e5c',
                                            color: 'white',
                                        }}
                                        onClick={handleSubmit((d) =>
                                            onSubmit(d)
                                        )}
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </DialogContent>
            </Dialog>
        </Grid>
    )
}

export default CadidateForm
