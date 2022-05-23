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
import { Navigate, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Country, State, City } from 'country-state-city'
import CadidateFormStyles from './style'
import { axiosClient, httpOptions } from '../../config'
import { useSnackbar } from 'notistack'
import Loader from '../Loader'

function CadidateForm({ open, handleClose }) {
    const [cityList, setCityList] = React.useState([])
    const [state, setState] = React.useState('')
    const classes = CadidateFormStyles
    const client = localStorage.getItem('client')
    const user = JSON.parse(localStorage.getItem('user'))
    const [jobList, setJobList] = React.useState([])
    const source = 'Admin panel'
    const { enqueueSnackbar } = useSnackbar()
    const [loading, setLoading] = React.useState(false)
    const referral = user.name
    const onSubmit = (formInputs) => {
        setLoading(true)
        // event.preventDefault();
        const data = {
            jobId: formInputs.job.id,
            client_id: client,
            source: source,
            referral: referral,
            first_name: formInputs.firstName,
            last_name: formInputs.lastName,
            email: formInputs.email,
            phone_number: formInputs.phone,
            status: 'applied',
            status_code: 0,
        }
        axiosClient
            .post('user/profile/create', data, httpOptions)
            .then((response) => {
                if (response.status === 200) {
                    setLoading(false)
                    reset()
                    enqueueSnackbar('New Candidate Added Successfully', {
                        variant: 'success',
                        autoHideDuration: 3000,
                        preventDuplicate: true,
                    })
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
            clientId: client,
        }
        try {
            axiosClient
                .post('jobs/list/getAll', data, httpOptions)
                .then((response) => {
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
            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Welcome To Client</DialogTitle>
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
                                                    console.log(job)
                                                    setValue(
                                                        'state',
                                                        job.state_name
                                                    )
                                                    setValue(
                                                        'city',
                                                        job.city_name
                                                    )
                                                }}
                                                value={value}
                                                classes={classes.textField}
                                                options={jobList}
                                                getOptionLabel={(option) =>
                                                    option.job_title
                                                }
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
                                        Job State
                                    </Typography>
                                    <Controller
                                        control={control}
                                        name="state"
                                        rules={{ required: true }}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <TextField
                                                value={value}
                                                variant="outlined"
                                                placeholder="State"
                                                fullWidth={true}
                                                classes={classes.textField}
                                                error={!!errors.state}
                                                helperText={
                                                    errors.state &&
                                                    'state required'
                                                }
                                                disabled={true}
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
                                        Job City
                                    </Typography>
                                    <Controller
                                        control={control}
                                        name="city"
                                        rules={{ required: true }}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <TextField
                                                value={value}
                                                variant="outlined"
                                                placeholder="city"
                                                fullWidth={true}
                                                classes={classes.textField}
                                                error={!!errors.city}
                                                disabled={true}
                                                helperText={
                                                    errors.city &&
                                                    'city required'
                                                }
                                                onChange={(event) => {
                                                    onChange(event.target.value)
                                                }}
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
                                        color="primary"
                                        style={{ marginLeft: 20 }}
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
