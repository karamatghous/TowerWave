import * as React from 'react'
import { Grid, Typography, Box } from '@material-ui/core'
import moment from 'moment'
import { useForm, Controller } from 'react-hook-form'
import JobPageStyles from './style'
import { axiosClient, httpOptions } from '../../config'
import { Autocomplete, Button, TextField } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import ReplayIcon from '@mui/icons-material/Replay'

function Level2({ setIndex, location, client }) {
    const date = new Date()
    const user = JSON.parse(localStorage.getItem('candidate'))
    const [answer, setAnswer] = React.useState(true)
    const [disabledAnswer, setDisabledAnswer] = React.useState(true)
    const [disabledBtn, setDisabledBtn] = React.useState(false)
    const [questionIndex, setQuestionIndex] = React.useState(0)
    const [shift, setShift] = React.useState({})
    const [type, setType] = React.useState('')
    const { enqueueSnackbar } = useSnackbar()
    const navigate = useNavigate()
    const question = [
        {
            msg: '"Although marijuana is legal in many states, we operate under a State TCP license and all drivers must pass a drug test. Are you okay with taking and passing a drug test?"',
            type: 'question',
            action: true,
            next: 0,
        },
        {
            msg: '"Continue Interview ?"',
            type: 'question',
            action: true,
            next: 0,
        },
        {
            msg: `As a driver you will be responsible for providing transportation service using the ${client.label} app. We will provide you with a car, gasoline, insurance, training, and certification, so no out of pocket costs to you, and you will be paid as an employee at a base rate of $${location.hourly_rate} per hour plus tips, whether or not you get any rides.  Depending on the shift you choose, you may get additional pay per hour.  In addition, you will be eligible to participate in weekly performance bonuses.`,
            type: 'text',
            action: false,
            next: 0,
        },
        {
            msg: `You will have access to healthcare after 90 days of employment. Right now we are also offering a $${location.signin_bonas} sign-on bonus paid after 90 days of employment.`,
            type: 'text',
            action: false,
            next: 0,
        },
        {
            msg: 'We are running 8-to-10-hour shifts. However, you can also work part-time, and we can be flexible with your time.',
            type: 'text',
            action: false,
            next: 0,
        },
        {
            msg: '"Does this sound like a position you would be interested in?"',
            type: 'question',
            action: true,
            next: 0,
        },
        {
            msg: `"Were you ever an ${client.label} Driver?"`,
            type: 'question',
            action: false,
            next: 0,
        },
        {
            msg: '"Were you Deactivated?"',
            type: 'question',
            action: true,
            next: 8,
        },
        {
            msg: '"Are you OK working with people in wheelchairs?"',
            type: 'question',
            action: false,
            next: 0,
        },
        {
            msg: '"Can you lift up to 40lbs, as you may need to move luggage or packages?"',
            type: 'question',
            action: false,
            next: 0,
        },
        {
            msg: 'Are you interested in working Full Time or Part Time?"',
            type: 'question',
            action: false,
            next: 0,
        },
        {
            msg: '"What shifts are you looking to work?"',
            type: 'text',
            action: false,
            next: 100,
        },
    ]

    React.useEffect(() => {
        // getMyAllJobs()
    }, [])

    const getbuttonBackground = () => {
        if (disabledAnswer) return '#E0E0E0'
        else {
            if (answer) {
                return '#66BE6A'
            } else return '#F44336'
        }
    }

    const currencies = [
        {
            value: 'Day Shift',
            label: 'Day Shift',
        },
        {
            value: 'Afternoon/Evening Shift',
            label: 'Afternoon/Evening Shift',
        },
        {
            value: 'Overnight Shift (where applicable)',
            label: 'Overnight Shift (where applicable)',
        },
        {
            value: 'Weekend Shift',
            label: 'Weekend Shift',
        },
    ]

    console.log(type, shift)

    const setDLDetail = () => {
        const data = {
            id: user.id,
            candidate_type: type,
            shift: shift ? shift.value : '',
        }
        try {
            axiosClient
                .put('user/profile/updateTypeShift', data, httpOptions)
                .then((response) => {
                    if (response.status === 200) {
                        const res = response.data.data
                        enqueueSnackbar(`Driver's Details Set Successfully`, {
                            variant: 'success',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                    } else {
                        enqueueSnackbar('Failed to set Driver Details', {
                            variant: 'error',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                        // setError(true)
                    }
                })
        } catch (err) {
            enqueueSnackbar('Failed Reject', {
                variant: 'error',
                autoHideDuration: 3000,
                preventDuplicate: true,
            })
            console.log(err)
        }
    }

    const setRejectUser = () => {
        const data = {
            id: user.id,
            employerId: user.employerId,
            status: 'rejected',
            status_code: 2,
        }
        try {
            axiosClient
                .put('user/profile/update', data, httpOptions)
                .then((response) => {
                    if (response.status === 200) {
                        const res = response.data.data
                        enqueueSnackbar('Rejected Successfully', {
                            variant: 'success',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                    } else {
                        enqueueSnackbar('Failed Reject', {
                            variant: 'error',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                        // setError(true)
                    }
                })
        } catch (err) {
            enqueueSnackbar('Failed Reject', {
                variant: 'error',
                autoHideDuration: 3000,
                preventDuplicate: true,
            })
            console.log(err)
        }
    }

    const setPassUser = () => {
        const data = {
            id: user.id,
            employerId: user.employerId,
            status: 'Waitlisted',
            status_code: 3,
        }
        try {
            axiosClient
                .put('user/profile/update', data, httpOptions)
                .then((response) => {
                    if (response.status === 200) {
                        const res = response.data.data
                        enqueueSnackbar('Waitlisted Successfully', {
                            variant: 'success',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                    } else {
                        enqueueSnackbar('Waitlisted Reject', {
                            variant: 'error',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                        // setError(true)
                    }
                })
        } catch (err) {
            enqueueSnackbar('Failed Reject', {
                variant: 'error',
                autoHideDuration: 3000,
                preventDuplicate: true,
            })
            console.log(err)
        }
    }

    return (
        <div
            style={{
                padding: `0px 20%`,
                marginTop: 50,
            }}
        >
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={12}>
                    <Box component={'span'}>
                        <Typography
                            component={'span'}
                            style={{
                                fontFamily: 'Poppins',
                                fontWeight: 'bolder',
                                fontSize: '33px',
                                color: '#000000',
                            }}
                        >
                            Interview
                        </Typography>
                        {!answer && (
                            <Typography
                                component={'span'}
                                style={{
                                    color: '#000000',
                                    float: 'right',
                                    cursor: 'pointer',
                                }}
                            >
                                <ReplayIcon
                                    onClick={() => {
                                        setAnswer(true)
                                        setDisabledAnswer(true)
                                    }}
                                />
                            </Typography>
                        )}
                    </Box>
                </Grid>
                <Grid
                    container
                    direction="column"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{
                        padding: 40,
                        border: '2px solid #3f50b5',
                        borderRadius: 15,
                        minHeight: 500,
                    }}
                >
                    <Grid item xs={12}>
                        <Box
                            style={{
                                marginTop: 50,
                            }}
                        >
                            <Typography
                                style={{
                                    textAlign: 'center',
                                    fontSize: '24px',
                                    fontWeight: `${
                                        question[questionIndex].type ===
                                        'question'
                                    } ? bold : normal`,
                                }}
                            >
                                {question[questionIndex].msg}
                            </Typography>
                            {questionIndex === question.length - 1 && (
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Box style={{ width: '350px' }}>
                                        <Autocomplete
                                            onChange={(event, data) => {
                                                setShift(data)
                                            }}
                                            options={currencies}
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
                                                    margin="normal"
                                                    variant="outlined"
                                                    placeholder="Select a Shift"
                                                    style={{
                                                        color: 'white',
                                                        backgroundColor:
                                                            'white',
                                                        fontFamily: 'Poppins',
                                                        borderRadius: '9px',
                                                    }}
                                                />
                                            )}
                                        />
                                    </Box>
                                </Grid>
                            )}

                            <Typography style={{ textAlign: 'center' }}>
                                {question[questionIndex].type ===
                                    'question' && (
                                    <Button
                                        style={{
                                            fontSize: '14px',
                                            padding: '5px 10px',
                                            textAlign: 'center',
                                            minWidth: 80,
                                            fontWeight: 'bold',
                                            borderRadius: '9px',
                                            margin: '10px',
                                            border: '2px solid #d32f2f',
                                        }}
                                        variant={'outlined'}
                                        color={'error'}
                                        onClick={() => {
                                            questionIndex === 10 &&
                                                setType(`Part Time`)
                                            if (
                                                questionIndex === 7 ||
                                                questionIndex === 6 ||
                                                !question[questionIndex].status
                                            ) {
                                                setQuestionIndex(
                                                    questionIndex + 1
                                                )
                                                return
                                            }
                                            if (
                                                question[questionIndex].next > 0
                                            ) {
                                                setQuestionIndex(
                                                    question[questionIndex].next
                                                )
                                                return
                                            }
                                            setAnswer(false)
                                            setDisabledAnswer(false)
                                        }}
                                    >
                                        {questionIndex === 10
                                            ? `Part Time`
                                            : `No`}
                                    </Button>
                                )}
                                {console.log(
                                    question[questionIndex],
                                    questionIndex
                                )}
                                <Button
                                    style={{
                                        fontSize: '14px',
                                        padding: '5px 10px',
                                        textAlign: 'center',
                                        minWidth: 80,
                                        fontWeight: 'bold',
                                        borderRadius: '9px',
                                        margin: '10px',
                                        border: '2px solid #2E7D32',
                                    }}
                                    variant={'outlined'}
                                    color={'success'}
                                    onClick={() => {
                                        questionIndex === 10 &&
                                            setType(`Full Time`)
                                        if (questionIndex === 7) {
                                            setAnswer(false)
                                            setDisabledAnswer(false)
                                        } else if (
                                            question[questionIndex].next !== 100
                                        )
                                            setQuestionIndex(questionIndex + 1)
                                        else {
                                            setAnswer(true)
                                            setDisabledAnswer(false)
                                        }
                                    }}
                                >
                                    {questionIndex === 10
                                        ? `Full Time`
                                        : question[questionIndex].type ===
                                          'question'
                                        ? 'Yes'
                                        : 'Next'}
                                </Button>
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                        spacing={1}
                    >
                        <Grid item xs={'auto'}>
                            <Button
                                color="info"
                                variant="contained"
                                style={{
                                    fontSize: '14px',
                                    padding: '5px 0px',
                                    textAlign: 'center',
                                    minWidth: 80,
                                    fontWeight: 'bold',
                                    borderRadius: '9px',
                                }}
                                onClick={() => {
                                    setIndex(1)
                                }}
                            >
                                Back
                            </Button>
                        </Grid>
                        <Grid item xs={'auto'}>
                            <Button
                                variant="contained"
                                color="error"
                                style={{
                                    fontSize: '14px',
                                    padding: '5px 0px',
                                    textAlign: 'center',
                                    minWidth: 80,
                                    fontWeight: 'bold',
                                    borderRadius: '9px',
                                    color: '#000000DE',
                                    backgroundColor: getbuttonBackground(),
                                }}
                                onClick={() => {
                                    if (answer) {
                                        setDLDetail()
                                        setPassUser()
                                        navigate('/dashboard')
                                    } else {
                                        setRejectUser()
                                        navigate('/dashboard')
                                    }
                                }}
                                disabled={disabledAnswer}
                            >
                                {answer ? 'Next' : 'Reject'}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={3} style={{ marginTop: 10 }}></Grid>
        </div>
    )
}

export default Level2
