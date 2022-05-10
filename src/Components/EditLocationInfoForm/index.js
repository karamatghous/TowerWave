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

function EditLocationInfoForm({ open, handleClose, row }) {
    const classes = JobFormStyles
    const onSubmit = (formInputs) => {
        const data = {
            id: row.id,
            city: row.city,
            state: row.state,
            state_code: row.state_code,
            hourly_rate: formInputs.rate,
            signin_bonas: formInputs.bonuses,
            shift_detail: formInputs.description,
        }
        axiosClient
            .post('user/profile/updateUserSettingLocation', data, httpOptions)
            .then((response) => {
                if (response.status === 200) {
                    reset()
                }
            })
            .catch((error) => {
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
            description: '',
            rate: 0,
            bonas: 0,
        },
    })

    React.useEffect(() => {
        setValue('state', row.state)
        setValue('city', row.city)
        setValue('description', row.shift_detail)
        setValue('rate', row.hourly_rate)
        setValue('bonas', row.signin_bonas)
    }, [row])
    console.log(row)
    return (
        <Grid>
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
                                        Signin Bonas
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
                                                placeholder="Signin Bonas"
                                                fullWidth={true}
                                                type="number"
                                                error={!!errors.rate}
                                                classes={classes.textField}
                                                helperText={
                                                    errors.rate &&
                                                    'Signin Bonas Name required'
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

export default EditLocationInfoForm
