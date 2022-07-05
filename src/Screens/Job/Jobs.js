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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'

function LoginForm() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [signup, setSignup] = React.useState(false)
    const [error, setError] = React.useState(false)
    const navigate = useNavigate()
    const signInForm = (event) => {
        setError(false)
        event.preventDefault()

        axios
            .post('http://localhost:8001/api/auth/signin', {
                password: password,
                email: email,
            })
            .then((response) => {
                if (response.status === 200) {
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
            axios
                .post('http://localhost:8001/api/auth/signup', {
                    username: email,
                    password: password,
                    email: email,
                })
                .then((response) => {
                    if (response.status === 200) {
                        setSignup(!signup)
                    } else {
                        setError(true)
                    }
                })
        } catch (err) {
            console.log(err)
        }
    }
    const displayDesktop = () => {
        return (
            <Typography
                gutterBottom
                variant="h3"
                align="center"
                style={{ paddingTop: '10px' }}
            >
                TowerWav
            </Typography>
        )
    }
    console.log(error)
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
                                <LockOutlinedIcon />
                            </Avatar>
                        </Container>

                        <Typography gutterBottom variant="h4">
                            {signup ? 'Sign Up' : 'Login'}
                        </Typography>
                        <form onSubmit={signup ? signUpForm : signInForm}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <TextField
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        type="email"
                                        placeholder="Enter email"
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        placeholder="Enter password"
                                        label="Password"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
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

                                <Grid
                                    item
                                    xs={12}
                                    style={{ marginTop: 30, cursor: 'pointer' }}
                                >
                                    <span
                                        onClick={() => {
                                            setSignup(!signup)
                                            setError(false)
                                        }}
                                    >
                                        {signup
                                            ? `Already have an account `
                                            : `Don't have an account yet? click here to Sign Up`}
                                    </span>
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
