import * as React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Autocomplete } from '@mui/material'
import { Box } from '@material-ui/core'
import { useSetRecoilState, useRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
    const navigate = useNavigate()
    const currencies = [
        {
            value: 'TowerWav',
            label: 'TowerWav',
        },
    ]

    React.useEffect(() => {
        const client = localStorage.getItem('client')
        if (client?.length > 1) {
            navigate('/login')
        }
    }, [])
    return (
        <div style={{ background: '#3f50b5', height: '100vh', width: '100%' }}>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid margin={30} width={'100%'} textAlign={'center'}>
                    <Typography
                        variant="h3"
                        style={{ color: 'white', fontFamily: 'Poppins' }}
                    >
                        HRDSP DRIVERS HIRING AGENCY HUMAN RESOURCES FOR DIRECT
                        SERVICE PROVIDERS
                    </Typography>
                    <Typography
                        variant="h6"
                        style={{ color: 'white', fontFamily: 'Poppins' }}
                    >
                        Select a Company Your are Hiring For
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
                                    if (data.value.length > 1) {
                                        localStorage.setItem(
                                            'client',
                                            data.value
                                        )
                                        navigate('/login')
                                    }
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
                                        placeholder="Select a Company"
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
                </Grid>
            </Grid>
        </div>
    )
}
