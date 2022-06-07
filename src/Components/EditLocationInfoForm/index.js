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

function EditLocationInfoForm({ open, handleClose, row }) {
    const classes = JobFormStyles
    const [loading, setLoading] = React.useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const onSubmit = (formInputs) => {
        setLoading(true)
        const data = {
            id: row.id,
            city: row.city,
            state: row.state,
            state_code: row.state_code,
            hourly_rate: formInputs.rate,
            signin_bonas: formInputs.bonas,
            shift_detail: formInputs.shift.label,
        }
        axiosClient
            .post('user/profile/updateUserSettingLocation', data, httpOptions)
            .then((response) => {
                setLoading(false)
                if (response.status === 200) {
                    enqueueSnackbar('Location Info Updated Successfully', {
                        variant: 'success',
                        autoHideDuration: 3000,
                        preventDuplicate: true,
                    })
                    reset()
                } else {
                    enqueueSnackbar('Failed to Update Location Info', {
                        variant: 'error',
                        autoHideDuration: 3000,
                        preventDuplicate: true,
                    })
                }
            })
            .catch((error) => {
                setLoading(false)
                enqueueSnackbar('Failed to Update Location Info', {
                    variant: 'error',
                    autoHideDuration: 3000,
                    preventDuplicate: true,
                })
                console.log(error.response)
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
            rate: 0,
            bonas: 0,
        },
    })

    React.useEffect(() => {
        setValue('state', row.state)
        setValue('city', row.city)
        setValue('rate', row.hourly_rate)
        setValue('bonas', row.signin_bonas)
        setValue(
            'shift',
            shiftOptions.find((p) => p.label === row.shift_detail)
        )
    }, [row])
    return (
        <Grid>
            <Loader loading={loading} />
            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Edit Location Info</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Edit Location Info by filling out the following fields
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
                                        State
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
                                                error={!!errors.state}
                                                classes={classes.textField}
                                                disabled
                                                helperText={
                                                    errors.state &&
                                                    'State required'
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
                                                placeholder="City"
                                                fullWidth={true}
                                                error={!!errors.city}
                                                classes={classes.textField}
                                                disabled
                                                helperText={
                                                    errors.city &&
                                                    'City required'
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

export default EditLocationInfoForm
