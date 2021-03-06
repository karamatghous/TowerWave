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
import Steps from '../RecruitmentSteps'
import LandingofRecruitment from '../LandingofRecruitment'

function RecruitmentPage() {
    const [client, setClient] = React.useState({})
    const [location, setLocation] = React.useState({})
    const [showInterview, setShowInterview] = React.useState(false)

    React.useEffect(() => {
        if (client && Object.entries(location).length !== 0) {
            setShowInterview(true)
        }
    }, [location])

    return (
        <>
            {!showInterview && (
                <LandingofRecruitment
                    setLocation={setLocation}
                    setClient={setClient}
                    client={client}
                    location={location}
                />
            )}
            {showInterview && <Steps client={client} location={location} />}
        </>
    )
}

export default RecruitmentPage
