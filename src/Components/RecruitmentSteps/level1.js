import * as React from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Grid, Typography, Box } from '@material-ui/core'
import moment from 'moment'
import { useForm, Controller } from 'react-hook-form'
import JobPageStyles from './style'
import { axiosClient, httpOptions } from '../../config'
import { Button } from '@mui/material'

function Level1({ setIndex, location, client }) {
    const user = JSON.parse(localStorage.getItem('user'))

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
                                }}
                            >
                                Hi, this {`is ${user.name} from`} Tower WAV. I
                                am reaching because you applied to our ad to be
                                a driver.
                            </Typography>
                            <Typography
                                style={{
                                    textAlign: 'center',
                                    fontSize: '24px',
                                    marginTop: 20,
                                }}
                            >
                                {`We are a large transportation company servicing
                                people with disabilities. We have partnered with
                                ${client.label} to provide transportation service to
                                wheelchair bound people. We are currently
                                interviewing for drivers in “${location.city}”.`}
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
                                variant="contained"
                                color="success"
                                style={{
                                    fontSize: '14px',
                                    padding: '5px 0px',
                                    textAlign: 'center',
                                    minWidth: 80,
                                    fontWeight: 'bold',
                                    borderRadius: '9px',
                                }}
                                onClick={() => {
                                    setIndex(2)
                                }}
                            >
                                Next
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={3} style={{ marginTop: 10 }}></Grid>
        </div>
    )
}

export default Level1
