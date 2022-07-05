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
} from '@material-ui/core'
import Autocomplete from '@mui/material/Autocomplete'
import { Work } from '@mui/icons-material'
import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { registerValidationSchema } from './hookFormData.js'
import { yupResolver } from '@hookform/resolvers/yup'
import { Country, State, City } from 'country-state-city'

function CreateJobForm() {
    const [cityList, setCityList] = React.useState([])
    const [state, setState] = React.useState('')
    const httpOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers':
                'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method',
            Authorization: localStorage.getItem('token'),
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
            Allow: 'GET, POST, OPTIONS, PUT, DELETE',
        },
    }
    const onSubmit = (formInputs) => {
        // event.preventDefault();
        const data = {
            clientId: 'towerwav',
            job_title: formInputs.job,
            job_description: formInputs.description,
            state_code: formInputs.state.isoCode,
            state_name: formInputs.state.name,
            city_name: formInputs.city.name,
        }
        axios
            .post(
                'http://localhost:8001/api/job/application/create',
                data,
                httpOptions
            )
            .then((response) => {
                if (response.status === 200) {
                    reset()
                }
            })
            .catch((error) => {
                console.log(error.response)
            })
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
        if (getValues('state')?.isoCode) {
            // setState(getValues("state").isoCode);
            //   console.log(City.getCitiesOfState("CA"))
            // setCityList(City.getCitiesOfState(getValues("state").isoCode));
        }
    }, [getValues('state')])

    return (
        <div className="App">
            <header align="center">
                <AppBar>{displayDesktop()}</AppBar>
            </header>

            <Grid>
                <Card
                    style={{
                        maxWidth: 450,
                        padding: ' 5px',
                        margin: '0 auto',
                        marginTop: 150,
                    }}
                >
                    <CardContent>
                        <Container
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <Avatar sx={{ bgcolor: '#081e5c' }}>
                                <Work />
                            </Avatar>
                        </Container>

                        <Typography gutterBottom variant="h4">
                            New Job
                        </Typography>
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
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
                                                label="Job Name"
                                                fullWidth={true}
                                                error={!!errors.job}
                                                helperText={
                                                    errors.job && 'job required'
                                                }
                                                onChange={(event) => {
                                                    onChange(event.target.value)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
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
                                                        label="state"
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
                                <Grid item xs={12}>
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
                                                        label="city"
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
                                <Grid item xs={12}>
                                    <Controller
                                        control={control}
                                        name="description"
                                        rules={{ required: true }}
                                        render={({
                                            field: { onChange, value },
                                        }) => (
                                            <TextField
                                                variant="outlined"
                                                label="Description"
                                                fullWidth={true}
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

                                <Grid item xs={12} style={{ marginTop: 30 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        style={{
                                            backgroundColor: '#081e5c',
                                            color: 'white',
                                        }}
                                        fullWidth
                                    >
                                        submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </div>
    )
}

export default CreateJobForm
