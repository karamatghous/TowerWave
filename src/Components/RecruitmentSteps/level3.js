import * as React from 'react'
import { Grid, Typography, Box } from '@material-ui/core'
import moment from 'moment'
import { useForm, Controller } from 'react-hook-form'
import JobPageStyles from './style'
import { axiosClient, httpOptions } from '../../config'
import { Button } from '@mui/material'

function Level2({ setIndex }) {
    const date = new Date()
    const user = JSON.parse(localStorage.getItem('user'))
    const [answer, setAnswer] = React.useState(true)
    const [disabledAnswer, setDisabledAnswer] = React.useState(false)
    const [disabledBtn, setDisabledBtn] = React.useState(false)
    const [questionIndex, setQuestionIndex] = React.useState(0)
    const question = [
        {
            msg: '"Although marijuana is legal in many states, we operate under a State TCP license and all drivers must pass a drug test.   Are you okay with taking and passing a drug test?"',
            type: 'question',
            action: true,
            next: 4,
        },
        {
            msg: 'As a driver you will be responsible for providing transportation service using the Uber app.   We will provide you with a car, gasoline, insurance, training, and certification, so no out of pocket costs to you, and you will be paid as an employee at a base rate of $____ per hour plus tips, whether or not you get any rides.  Depending on the shift you choose, you may get additional pay per hour.  In addition, you will be eligible to participate in weekly performance bonuses.',
            type: 'text',
            action: false,
            next: 0,
        },
        {
            msg: 'You will have access to healthcare after 90 days of employment. Right now we are also offering a $___ sign-on bonus paid after 6 weeks of employment. "',
            type: 'text',
            action: false,
            next: 0,
        },
        {
            msg: 'We are running 8-to-10-hour shifts. However, you can also work part-time, and we can be flexible with your time.',
            type: 'text',
            action: false,
            next: 100,
        },
        {
            msg: '"Does this sound like a position you would be interested in?"',
            type: 'question',
            action: true,
            next: 0,
        },
        {
            msg: '"Were you ever an Uber Driver?"',
            type: 'question',
            action: false,
            next: 0,
        },
        {
            msg: '"Were you Deactivated?"',
            type: 'question',
            action: true,
            next: 0,
        },
        {
            msg: '"what the issue date is on the current state license?"',
            type: 'text',
            action: false,
            next: 0,
        },
        {
            msg: 'If less than 1 year they will need to , upload previous DL or DMV licensing abstract when uploading to uber platform',
            type: 'text',
            action: false,
            next: 100,
        },
    ]

    React.useEffect(() => {
        // getMyAllJobs()
    }, [])

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
                                        }}
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
                                        )
                                            setQuestionIndex(questionIndex + 1)
                                        else setAnswer(true)
                                    }}
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
                                color={answer ? 'success' : 'error'}
                                style={{
                                    fontSize: '14px',
                                    padding: '5px 0px',
                                    textAlign: 'center',
                                    minWidth: 80,
                                    fontWeight: 'bold',
                                    borderRadius: '9px',
                                }}
                                onClick={() => {
                                    setIndex(3)
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
