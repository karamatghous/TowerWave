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
            msg: '"Are you at least 25 years old?"',
            type: 'question',
            action: false,
            next: 4,
        },
        {
            msg: '"Do you have a driver’s license for at least 1 year?"',
            type: 'question',
            action: true,
            next: 0,
        },
        {
            msg: '"What is the issue date?"',
            type: 'text',
            action: false,
            next: 0,
        },
        {
            msg: 'If less than 1 year they will need to upload previous DL or DMV licensing abstract when uploading to uber platform',
            type: 'text',
            action: false,
            next: 100,
        },
        {
            msg: '"Are you at least 23 years old?"',
            type: 'question',
            action: true,
            next: 0,
        },
        {
            msg: '"Do you have a clean driving record with no moving violations or accidents?"',
            type: 'question',
            action: true,
            next: 0,
        },
        {
            msg: 'If yes, must provide DL#, Date of Birth, and Zip Code to confirm they will pass our Insurance check – send info to Jamie.lara@towerwav.com',
            type: 'text',
            action: true,
            next: 0,
        },
        {
            msg: '"Have you had a driver’s license for at least 3 years?"',
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
