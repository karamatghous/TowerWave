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
} from '@material-ui/core'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import LoginStyles from './style'
import { Box } from '@mui/system'
import { axiosClient } from '../../config/index'
import { Autocomplete } from '@mui/material'
import { useSnackbar } from 'notistack'

const roles = [
    {
        value: 'admin',
        label: 'Admin',
    },
    {
        value: 'manager',
        label: 'Manager',
    },
    {
        value: 'recruiter',
        label: 'Recruiter',
    },
]

function LoginForm() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [name, setName] = React.useState('')
    const [role, setRole] = React.useState({
        value: 'recruiter',
        label: 'Recruiter',
    })
    const [signup, setSignup] = React.useState(false)
    const [error, setError] = React.useState(false)
    const [splash, setSplash] = React.useState(true)
    const navigate = useNavigate()
    const classes = LoginStyles()
    const client = localStorage.getItem('client')
    const { enqueueSnackbar } = useSnackbar()

    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            navigate('/dashboard')
        }
    }, [])

    const signInForm = (event) => {
        setError(false)
        event.preventDefault()

        axiosClient
            .post('auth/signin', {
                password: password,
                email: email,
            })
            .then((response) => {
                if (response.status === 200) {
                    localStorage.setItem(
                        'token',
                        'Bearer ' + response.data.data.token
                    )
                    localStorage.setItem(
                        'user',
                        JSON.stringify(response.data.data)
                    )
                    navigate('/dashboard')
                }
            })
            .catch((error) => {
                console.log(error.response)
                setError(true)
            })
    }
    const signUpForm = (event) => {
        event.preventDefault()
        try {
            axiosClient
                .post('auth/signup', {
                    username: email,
                    password: password,
                    email: email,
                    name: name,
                    roles: [role.value],
                })
                .then((response) => {
                    if (response.status === 200) {
                        setSignup(!signup)
                        enqueueSnackbar('Account Created Successfully', {
                            variant: 'success',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                    } else {
                        setError(true)
                        enqueueSnackbar('Failed to Created Account', {
                            variant: 'success',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                    }
                })
        } catch (err) {
            console.log(err)
        }
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    }

    return (
        <div>
            <Grid>
                <Card className={classes.mainCard}>
                    <CardContent style={{ padding: 0 }}>
                        <Grid container spacing={1}>
                            <Grid
                                container
                                spacing={1}
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Box>
                                    <Typography
                                        component="span"
                                        className={classes.welcomeText}
                                    >
                                        Welcome to
                                    </Typography>
                                    <Typography
                                        component="span"
                                        className={classes.welcomeClientText}
                                    >
                                        {` ${client}`}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        component="p"
                                        className={classes.donotHaveAccountText}
                                    >
                                        {signup
                                            ? `Have an Account ?`
                                            : `No Account?`}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        onClick={() => {
                                            setSignup(!signup)
                                            setError(false)
                                        }}
                                        className={
                                            classes.donotHaveAccountButton
                                        }
                                    >
                                        {signup ? `Sign In` : `Sign Up`}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid xs={12}>
                                <Typography className={classes.signinText}>
                                    {signup ? 'Sign Up' : 'Login'}
                                </Typography>
                            </Grid>
                        </Grid>

                        <form onSubmit={signup ? signUpForm : signInForm}>
                            <Grid container spacing={1}>
                                {signup && (
                                    <Grid
                                        item
                                        xs={12}
                                        className={classes.textFieldContainer}
                                    >
                                        <Typography
                                            className={classes.labelText}
                                        >
                                            Enter Your Name
                                        </Typography>
                                        <TextField
                                            value={name}
                                            onChange={(event) =>
                                                setName(event.target.value)
                                            }
                                            type="name"
                                            placeholder="Name"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            className={classes.textField}
                                        />
                                    </Grid>
                                )}
                                <Grid
                                    item
                                    xs={12}
                                    className={classes.textFieldContainer}
                                >
                                    <Typography className={classes.labelText}>
                                        Enter Your Email
                                    </Typography>
                                    <TextField
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        type="email"
                                        placeholder="Email"
                                        variant="outlined"
                                        fullWidth
                                        className={classes.textField}
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    className={classes.textFieldContainer}
                                >
                                    <Typography className={classes.labelText}>
                                        Enter Your Password
                                    </Typography>
                                    <TextField
                                        placeholder="Password"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        type="password"
                                        value={password}
                                        className={classes.textField}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                    />
                                </Grid>
                                {signup && (
                                    <Grid
                                        item
                                        xs={12}
                                        className={classes.textFieldContainer}
                                    >
                                        <Typography
                                            className={classes.labelText}
                                        >
                                            Role
                                        </Typography>
                                        <Autocomplete
                                            onChange={(event, data) => {
                                                setRole(data)
                                            }}
                                            value={role}
                                            classes={classes.textField}
                                            options={roles}
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
                                                    placeholder="Select a role"
                                                    margin="normal"
                                                    variant="outlined"
                                                    required
                                                />
                                            )}
                                        />
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        className={classes.button}
                                    >
                                        {signup ? 'Sign Up' : 'Login'}
                                    </Button>
                                    <br />
                                </Grid>
                                <Grid item xs={12} style={{ marginTop: 10 }}>
                                    {error && (
                                        <span
                                            style={{
                                                color: 'red',
                                                marginTop: 10,
                                            }}
                                        >
                                            Please check Your Email and Password
                                        </span>
                                    )}
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </div>
    )
}

export default LoginForm
