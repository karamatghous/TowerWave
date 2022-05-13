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
    const date = new Date()
    const formatedDate = moment(date).format('MMMM DD, YYYY')
    const [client, setClient] = React.useState({})
    const [location, setLocation] = React.useState({})
    const user = JSON.parse(localStorage.getItem('user'))
    const [jobList, setJobList] = React.useState([])
    const [countJobList, setCountJobList] = React.useState([])
    const now = moment(new Date())

    React.useEffect(() => {
        // getMyAllJobs()
    }, [])

    return (
        <LandingofRecruitment setLocation={setLocation} setClient={setClient} />
    )
}

export default RecruitmentPage
