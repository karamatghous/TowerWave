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
import Loader from '../Loader'

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

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein }
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
]

function HomePage() {
    const date = new Date()
    const formatedDate = moment(date).format('MMMM DD, YYYY')
    const client = localStorage.getItem('client')
    const user = JSON.parse(localStorage.getItem('user'))
    const [jobList, setJobList] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const now = moment(new Date())

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

    const getMyAllJobs = () => {
        setLoading(true)
        const data = {
            clientId: client,
            userId: user.id,
        }
        try {
            axiosClient
                .post('user/profile/getAllEmployees', data, httpOptions)
                .then((response) => {
                    setLoading(false)
                    if (response.status === 200) {
                        const res = response.data.data
                        setJobList(res)
                    } else {
                        // setError(true)
                    }
                })
        } catch (err) {
            setLoading(false)
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
                <Grid item xs={6}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell>Role</StyledTableCell>
                                <StyledTableCell>Joining Date</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jobList.map((row) => (
                                <StyledTableRow key={row.name}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.name}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {row.roles[0].name}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {moment(new Date(row.createdAt)).format(
                                            'MMMM DD, YYYY'
                                        )}
                                    </StyledTableCell>
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
            <Loader loading={loading} />
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={6}>
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
                            All Employees
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={3} style={{ marginTop: 10 }}>
                {CustomizedTables()}
            </Grid>
        </div>
    )
}

export default HomePage
