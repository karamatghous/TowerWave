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
import { Dialog, DialogTitle, Modal } from '@mui/material'
import TextField from '@mui/material/TextField'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#3f50b5',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}))

function HomePage() {
    const date = new Date()
    const formatedDate = moment(date).format('MMMM DD, YYYY')
    const client = localStorage.getItem('client')
    const user = JSON.parse(localStorage.getItem('user'))
    const [jobList, setJobList] = React.useState([])
    const [countJobList, setCountJobList] = React.useState([])
    const now = moment(new Date())

    const [open, setOpen] = React.useState(false)
    const [selectedRow, setSelectedRow] = React.useState({})

    const handleOpen = (row) => {
        setOpen(true)
        // setSelectedRow(row)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const classes = JobPageStyles

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

    const filterList = [
        { name: 'Location', value: 'location' },
        { name: 'Location', value: 'location' },
        { name: 'Location', value: 'location' },
    ]

    React.useEffect(() => {
        getMyAllJobs()
    }, [])

    React.useEffect(() => {
        setCountJobList(
            jobList.map((job) => {
                return job.post_job
            })
        )
    }, [jobList])

    const getMyAllJobs = () => {
        const data = {
            clientId: client,
            userId: user.id,
        }
        try {
            axiosClient
                .post('user/profile/getUserCandidates', data, httpOptions)
                .then((response) => {
                    if (response.status === 200) {
                        const res = response.data.data
                        setJobList(res)
                    } else {
                        // setError(true)
                    }
                })
        } catch (err) {
            console.log(err)
        }
    }

    function CustomizedTables() {
        return (
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={10}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Job</StyledTableCell>
                                <StyledTableCell>First Name</StyledTableCell>
                                <StyledTableCell>Last Name</StyledTableCell>
                                <StyledTableCell>
                                    Days in Progress
                                </StyledTableCell>
                                <StyledTableCell>Status</StyledTableCell>
                                <StyledTableCell>Notes</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jobList.map((row) => (
                                <StyledTableRow key={row.name}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.post_job.job_title}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {row.first_name}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {row.last_name}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {moment(new Date(row.updatedAt)).format(
                                            'MMMM DD, YYYY'
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        In Progress
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <span
                                            onClick={() => {
                                                handleOpen(row)
                                            }}
                                        >
                                            Notes
                                        </span>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        )
    }

    function JobTables() {
        return (
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={4}>
                    <Table sx={{ minWidth: 500 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Job</StyledTableCell>
                                <StyledTableCell>Candidates</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {countJobList.map((row) => (
                                <StyledTableRow key={row.name}>
                                    <StyledTableCell component="th" scope="row">
                                        {`${row.job_title} - ${row.city_name} `}
                                    </StyledTableCell>
                                    <StyledTableCell>1</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        )
    }

    return (
        <div
            style={{
                padding: `0px 10%`,
                marginTop: 50,
            }}
        >
            <Grid
                container
                spacing={3}
                style={{ marginTop: 10, marginBottom: 50 }}
            >
                {JobTables()}
            </Grid>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={10}>
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
                            My Candidates
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={3} style={{ marginTop: 10 }}>
                {CustomizedTables()}
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add noted Here</DialogTitle>
                <TextField
                    id="outlined-multiline-static"
                    label="Notes"
                    multiline
                    rows={4}
                    variant={'outlined'}
                    fullWidth
                />
            </Dialog>
        </div>
    )
}

export default HomePage
