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
import Loader from '../Loader'
import { useSnackbar } from 'notistack'

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

function CreateJobForm({ open, handleClose }) {
    const [state, setState] = React.useState('')
    const classes = JobFormStyles
    const [loading, setLoading] = React.useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const onSubmit = (formInputs) => {
        setLoading(true)
        const data = {
            city: formInputs.city.name,
            state: formInputs.state.name,
            state_code: formInputs.state.isoCode,
            hourly_rate: formInputs.rate,
            signin_bonas: formInputs.bonas,
            shift_detail: formInputs.shift?.label,
        }
        axiosClient
            .post('user/profile/createSettingLocation', data, httpOptions)
            .then((response) => {
                if (response.status === 200) {
                    reset()
                    setLoading(false)
                    enqueueSnackbar('New Location Info Added Successfully', {
                        variant: 'success',
                        autoHideDuration: 3000,
                        preventDuplicate: true,
                    })
                } else {
                    setLoading(false)
                    enqueueSnackbar('Failed to Add New Location Info', {
                        variant: 'error',
                        autoHideDuration: 3000,
                        preventDuplicate: true,
                    })
                }
                setLoading(false)
            })
            .catch((error) => {
                console.log(error.response)
                setLoading(false)
                enqueueSnackbar('Failed to Add New Location Info', {
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
            state: null,
            city: null,
            description: '',
            rate: 0,
            bonas: 0,
        },
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
            <Loader loading={loading} />
            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>New Location Info</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You can create a New Location Info by filling out the
                        following fields
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
                                        Hourly Rate
                                    </Typography>

                                    <Controller
                                        control={control}
                                        name="rate"
                                        rules={{ required: true }}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <TextField
                                                value={value}
                                                variant="outlined"
                                                placeholder="Hourly Rate"
                                                fullWidth={true}
                                                type="number"
                                                error={!!errors.rate}
                                                classes={classes.textField}
                                                helperText={
                                                    errors.rate &&
                                                    'Hourly Rate required'
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
                                        Signin Bonus
                                    </Typography>

                                    <Controller
                                        control={control}
                                        name="bonas"
                                        rules={{ required: true }}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <TextField
                                                value={value}
                                                variant="outlined"
                                                placeholder="Signin Bonus"
                                                fullWidth={true}
                                                type="number"
                                                error={!!errors.rate}
                                                classes={classes.textField}
                                                helperText={
                                                    errors.rate &&
                                                    'Signin Bonus Name required'
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
