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
import Loader from '../Loader'

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

function EditJobForm({ open, handleClose, job }) {
    const [state, setState] = React.useState('')
    const classes = JobFormStyles

    const [defaultCity, setDefaultCity] = React.useState(null)
    const [defaultState, setDefaultState] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const onSubmit = (formInputs) => {
        setLoading(true)
        const data = {
            id: job.id,
            clientId: job.clientId,
            employerId: job.employerId,
            job_title: formInputs.job,
            job_description: formInputs.description,
            state_code: formInputs.state.isoCode,
            state_name: formInputs.state.name,
            city_name: formInputs.city.name,
            shift: formInputs.shift.value,
            partner: formInputs.partner.value,
        }
        axiosClient
            .post('job/application/edit', data, httpOptions)
            .then((response) => {
                setLoading(false)
                if (response.status === 200) {
                    reset()
                    enqueueSnackbar('Job Update Successfully', {
                        variant: 'success',
                        autoHideDuration: 3000,
                        preventDuplicate: true,
                    })
                } else {
                    enqueueSnackbar('Failed to Edit Job', {
                        variant: 'error',
                        autoHideDuration: 3000,
                        preventDuplicate: true,
                    })
                }
            })
            .catch((error) => {
                setLoading(false)
                enqueueSnackbar('Failed to Edit Job', {
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
        defaultValues: {
            job: job?.job_title,
            state: defaultState,
            city: defaultCity,
            description: job?.job_description,
        },
    })

    React.useEffect(() => {
        State.getStatesOfCountry('US')
    }, [getValues('state')])

    React.useEffect(() => {
        setValue('job', job?.job_title)
        setValue('description', job?.job_description)
        setValue(
            'city',
            City.getCitiesOfState('US', job?.state_code).find(
                (city) => city.name === job.city_name
            )
        )
        setValue(
            'state',
            State.getStatesOfCountry('US').find(
                (state) => state.isoCode === job?.state_code
            )
        )
        setValue(
            'partner',
            partnerOptions.find((p) => p.label === job?.partner)
        )
        setValue(
            'shift',
            shiftOptions.find((p) => p.label === job?.shift)
        )
    }, [job])

    return (
        <Grid>
            <Loader loading={loading} />
            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Edit Job</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Edit a job by filling out the following fields
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
                                                    setValue('city', null)
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

export default EditJobForm
