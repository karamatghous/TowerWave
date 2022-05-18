import * as React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Autocomplete, tableCellClasses } from '@mui/material'
import {
    Box,
    styled,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@material-ui/core'
import { useSetRecoilState, useRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'
import { axiosClient } from '../../config'

export default function LandingofRecruitment({
    setLocation,
    location,
    client,
    setClient,
}) {
    const [loading, setLoading] = React.useState(false)
    const [settingsInfo, setSettingsInfo] = React.useState([])

    const currencies = [
        {
            value: 'uber',
            label: 'Uber',
        },
        {
            value: 'lyft',
            label: 'Lyft',
        },
    ]

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

    const getAllSettingsInfo = () => {
        setLoading(true)
        try {
            axiosClient
                .get('user/profile/getSettingLocation', {})
                .then((response) => {
                    if (response.status === 200) {
                        const res = response.data.data
                        setSettingsInfo(res)
                        setLoading(false)
                    } else {
                        // setError(true)
                        setLoading(false)
                    }
                })
        } catch (err) {
            setLoading(false)
            console.log(err)
        }
    }

    React.useEffect(() => {
        getAllSettingsInfo()
        const client = localStorage.getItem('client')
    }, [])

    function ShiftdetailsTables() {
        return (
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={12}>
                    <Table sx={{ maxWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>City</StyledTableCell>
                                <StyledTableCell>State</StyledTableCell>
                                <StyledTableCell>Hourly Rate</StyledTableCell>
                                <StyledTableCell>
                                    Signin Bonus Rate
                                </StyledTableCell>
                                <StyledTableCell>Shift details</StyledTableCell>
                                <StyledTableCell>Edit</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {settingsInfo.map((row) => (
                                <StyledTableRow key={row.name}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.city}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {row.state}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {row.hourly_rate}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {row.signin_bonas}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {row.shift_detail}
                                    </StyledTableCell>
                                    <StyledTableCell
                                        onClick={async () => {
                                            await setLocation(row)
                                        }}
                                        style={{
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Select
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
        <div style={{ width: '100%' }}>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid margin={10} width={'100%'} textAlign={'center'}>
                    {/* <Typography
                        variant="h3"
                        style={{ color: 'white', fontFamily: 'Poppins' }}
                    >
                        HRDSP DRIVERS HIRING AGENCY HUMAN RESOURCES FOR DIRECT
                        SERVICE PROVIDERS
                    </Typography> */}
                    <Typography
                        variant="h6"
                        style={{ color: '#000000', fontFamily: 'Poppins' }}
                    >
                        Select a Client Your are Hiring For
                    </Typography>
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Box style={{ width: '300px' }}>
                            <Autocomplete
                                onChange={(event, data) => {
                                    setClient(data)
                                }}
                                options={currencies}
                                getOptionLabel={(option) => option.label}
                                getOptionSelected={(option, value) =>
                                    value === undefined ||
                                    value === '' ||
                                    option.label === value.label
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        margin="normal"
                                        variant="outlined"
                                        placeholder="Select a Client"
                                        style={{
                                            color: 'white',
                                            backgroundColor: 'white',
                                            fontFamily: 'Poppins',
                                            borderRadius: '9px',
                                        }}
                                    />
                                )}
                            />
                        </Box>
                    </Grid>
                    {client && Object.entries(client).length !== 0 && (
                        <div
                            style={{
                                marginTop: 50,
                            }}
                        >
                            <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Grid item xs={8}>
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
                                            All Location Info
                                        </Typography>
                                    </Box>{' '}
                                </Grid>
                                <Grid xs={8} style={{ marginTop: 10 }}>
                                    {ShiftdetailsTables()}
                                </Grid>
                            </Grid>
                        </div>
                    )}
                </Grid>
            </Grid>
        </div>
    )
}
