import * as React from 'react'
import { Grid, Typography, Box } from '@material-ui/core'
import moment from 'moment'
import { useForm, Controller } from 'react-hook-form'
import JobPageStyles from './style'
import { axiosClient, httpOptions } from '../../config'
import { Button, TextField } from '@mui/material'
import { KeyboardDatePicker } from '@material-ui/pickers'
import ReplayIcon from '@mui/icons-material/Replay'
import styles from './style'
import { useSnackbar } from 'notistack'
import { Details } from '@mui/icons-material'

function Level2({ setIndex, client, location }) {
    const date = new Date()
    const classes = styles()
    const user = JSON.parse(localStorage.getItem('candidate'))
    const [answer, setAnswer] = React.useState(true)
    const [disabledAnswer, setDisabledAnswer] = React.useState(true)
    const [disabledBtn, setDisabledBtn] = React.useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const [questionIndex, setQuestionIndex] = React.useState(0)
    const [selectedDate, setSelectedDate] = React.useState(
        new Date('2014-08-18T21:11:54')
    )
    const [DOB, setDOB] = React.useState(new Date('2014-08-18T21:11:54'))
    const [zipcode, setZipcode] = React.useState('')
    const [drivingLN, setDrivingLN] = React.useState('')

    const handleDateChange = (date) => {
        setSelectedDate(date)
    }

    const handleDOBChange = (date) => {
        setDOB(date)
    }

    const question = [
        {
            msg: '"Are you at least 25 years old?"',
            type: 'question',
            action: false,
            next: 4,
            client: 'everyone',
        },
        {
            msg: '"Do you have a driver’s license for at least 1 year?"',
            type: 'question',
            action: true,
            next: 0,
            client: 'everyone',
        },
        {
            msg: '"What is the issue date?"',
            type: 'text',
            action: false,
            next: 9,
            client: 'uber',
        },
        {
            msg: 'If less than 1 year they will need to upload previous DL or DMV licensing abstract when uploading to uber platform',
            type: 'text',
            action: false,
            next: 9,
            client: 'uber',
        },
        {
            msg: '"Are you at least 23 years old?"',
            type: 'question',
            action: true,
            next: 0,
            client: 'uber',
        },
        {
            msg: '"Do you have a clean driving record with no moving violations or accidents?"',
            type: 'question',
            action: true,
            next: 0,
            client: 'uber',
        },
        {
            msg: '"Have you had a driver’s license for at least 3 years?"',
            type: 'question',
            action: true,
            next: 0,
            client: 'uber',
        },
        {
            msg: '"what the issue date is on the current state license?"',
            type: 'text',
            action: false,
            next: 0,
            client: 'uber',
        },
        {
            msg: 'If less than 1 year they will need to , upload previous DL or DMV licensing abstract when uploading to uber platform',
            type: 'text',
            action: false,
            next: 0,
            client: 'uber',
        },
        {
            msg: 'If yes, must provide DL#, Date of Birth, and Zip Code to confirm they will pass our Insurance check – send info to Jamie.lara@towerwav.com',
            type: 'text',
            action: false,
            next: 100,
            client: 'everyone',
        },
    ]

    React.useEffect(() => {
        if (questionIndex === 2) {
            if (client.value === 'lyft') setQuestionIndex(question.length - 1)
        }
    }, [questionIndex])

    const getbuttonBackground = () => {
        if (disabledAnswer) return '#E0E0E0'
        else {
            if (answer) {
                return '#66BE6A'
            } else return '#F44336'
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

    const setDLDetail = () => {
        const data = {
            id: user.id,
            DLN: drivingLN,
            DOB: DOB,
            zip_code: zipcode,
        }
        try {
            axiosClient
                .put('user/profile/updateDLDetail', data, httpOptions)
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
                            {(questionIndex === 2 || questionIndex === 7) && (
                                <Typography style={{ textAlign: 'center' }}>
                                    <KeyboardDatePicker
                                        variant="inline"
                                        format="MM/DD/yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        label="issue date"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Typography>
                            )}
                            {questionIndex === question.length - 1 && (
                                <>
                                    <Typography style={{ textAlign: 'center' }}>
                                        <KeyboardDatePicker
                                            variant="inline"
                                            format="MM/DD/yyyy"
                                            margin="normal"
                                            id="date-picker-inline"
                                            label="Date of Birth"
                                            value={DOB}
                                            onChange={handleDOBChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </Typography>
                                    <Typography style={{ textAlign: 'center' }}>
                                        <TextField
                                            value={drivingLN}
                                            variant="standard"
                                            placeholder="Driver's License#"
                                            classes={classes.textField}
                                            onChange={(event) => {
                                                setDrivingLN(event.target.value)
                                            }}
                                            style={{
                                                minWidth: '223px',
                                                marginBottom: '10px',
                                            }}
                                        />
                                    </Typography>
                                    <Typography style={{ textAlign: 'center' }}>
                                        <TextField
                                            value={zipcode}
                                            variant="standard"
                                            placeholder="Zipcode"
                                            classes={classes.textField}
                                            onChange={(event) => {
                                                setZipcode(event.target.value)
                                            }}
                                            style={{
                                                minWidth: '223px',
                                                marginBottom: '10px',
                                            }}
                                        />
                                    </Typography>
                                </>
                            )}

                            <Typography style={{ textAlign: 'center' }}>
                                {question[questionIndex].type ===
                                    'question' && (
                                    <Button
                                        style={{
                                            fontSize: '14px',
                                            padding: '5px 0px',
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
                                        disabled={!disabledAnswer}
                                    >
                                        No
                                    </Button>
                                )}
                                <Button
                                    style={{
                                        fontSize: '14px',
                                        padding: '5px 0px',
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
                                        if (
                                            question[questionIndex].next !== 100
                                        ) {
                                            if (
                                                question[questionIndex].next > 4
                                            ) {
                                                setQuestionIndex(
                                                    question[questionIndex].next
                                                )
                                                return
                                            } else
                                                setQuestionIndex(
                                                    questionIndex + 1
                                                )
                                        } else {
                                            setDisabledAnswer(false)
                                            setAnswer(true)
                                        }
                                    }}
                                    disabled={!disabledAnswer}
                                >
                                    {question[questionIndex].type === 'question'
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
                                        setIndex(3)
                                    } else {
                                        setRejectUser()
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
