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
import { useForm, Controller } from 'react-hook-form'
import { Country, State, City } from 'country-state-city'
import JobFormStyles from './style'
import { axiosClient, httpOptions } from '../../config'
import { useSnackbar } from 'notistack'

function CreateJobForm({ open, handleClose }) {
    const [cityList, setCityList] = React.useState([])
    const [state, setState] = React.useState('')
    const classes = JobFormStyles
    const client = localStorage.getItem('client')
    const user = JSON.parse(localStorage.getItem('user'))
    const { enqueueSnackbar } = useSnackbar()
    const onSubmit = (formInputs) => {
        const data = {
            clientId: client,
            employerId: user.id,
            job_title: formInputs.job,
            job_description: formInputs.description,
            state_code: formInputs.state.isoCode,
            state_name: formInputs.state.name,
            city_name: formInputs.city.name,
        }
        axiosClient
            .post('job/application/create', data, httpOptions)
            .then((response) => {
                if (response.status === 200) {
                    reset()
                    enqueueSnackbar('New Job is Created Successfully', {
                        variant: 'success',
                        autoHideDuration: 3000,
                        preventDuplicate: true,
                    })
                } else {
                    enqueueSnackbar('Failed to Create New Job', {
                        variant: 'error',
                        autoHideDuration: 3000,
                        preventDuplicate: true,
                    })
                }
            })
            .catch((error) => {
                console.log(error.response)
                enqueueSnackbar('Failed to Create New Job', {
                    variant: 'error',
                    autoHideDuration: 3000,
                    preventDuplicate: true,
                })
            })
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
        if (getValues('state')?.isoCode) {
            // setState(getValues("state").isoCode);
            //   console.log(City.getCitiesOfState("CA"))
            // setCityList(City.getCitiesOfState(getValues("state").isoCode));
        }
    }, [getValues('state')])

    return (
        <Grid>
            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>New Job</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You can create a new job by filling out the following
                        fields
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
                        <form noValidate>
                            <Grid container spacing={1}>
                                <Grid
                                    item
                                    xs={12}
                                    className={classes.textFieldContainer}
                                >
                                    <Typography className={classes.labelText}>
                                        Job Name
                                    </Typography>

                                    <Controller
                                        control={control}
                                        name="job"
                                        rules={{ required: true }}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <TextField
                                                value={value}
                                                variant="outlined"
                                                placeholder="Job Name"
                                                fullWidth={true}
                                                error={!!errors.job}
                                                classes={classes.textField}
                                                helperText={
                                                    errors.job &&
                                                    'Job Name required'
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
                                        Job State
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
                                        Job City
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
                                        Enter Your Description
                                    </Typography>
                                    <Controller
                                        control={control}
                                        name="description"
                                        rules={{ required: true }}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <TextField
                                                variant="outlined"
                                                placeholder="Description"
                                                fullWidth={true}
                                                classes={classes.textField}
                                                value={value}
                                                error={!!errors.description}
                                                helperText={
                                                    errors.description &&
                                                    'description required'
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
                                        save
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

export default CreateJobForm
