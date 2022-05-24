import * as React from 'react'
import {
    Grid,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    AppBar,
    Container,
    Box,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    DialogActions,
} from '@material-ui/core'
import Autocomplete from '@mui/material/Autocomplete'
import { Work } from '@mui/icons-material'
import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Country, State, City } from 'country-state-city'
import CadidateFormStyles from './style'
import { axiosClient, httpOptions } from '../../config'
import { useSnackbar } from 'notistack'
import Loader from '../Loader'

function CadidateForm({ open, handleClose, candidate }) {
    const classes = CadidateFormStyles
    const client = localStorage.getItem('client')
    const user = JSON.parse(localStorage.getItem('user'))
    const { enqueueSnackbar } = useSnackbar()
    const [loading, setLoading] = React.useState(false)
    console.log(candidate)

    const onClose = () => {
        handleClose(false)
    }

    React.useEffect(() => {}, [])

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
        reset,
    } = useForm({
        mode: 'onChange',
        defaultValues: { job: null, state: null, city: null, description: '' },
    })

    return (
        candidate && (
            <Grid>
                <Loader loading={loading} />
                <Dialog
                    fullWidth={true}
                    maxWidth={'xs'}
                    open={open}
                    onClose={onClose}
                >
                    <DialogTitle>View Cadidate Details</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={1}>
                            <Grid item xs={4}>
                                <Typography
                                    component={'span'}
                                    className={classes.labelText}
                                >
                                    Name
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={8}
                                className={classes.textFieldContainer}
                            >
                                <Typography
                                    component={'span'}
                                    className={classes.labelTextValue}
                                >
                                    {`${candidate.first_name} ${candidate.last_name}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography
                                    component={'span'}
                                    className={classes.labelText}
                                >
                                    Job
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={8}
                                className={classes.textFieldContainer}
                            >
                                <Typography
                                    component={'span'}
                                    className={classes.labelTextValue}
                                >
                                    {candidate?.post_job?.job_title}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography
                                    component={'span'}
                                    className={classes.labelText}
                                >
                                    Email
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={8}
                                className={classes.textFieldContainer}
                            >
                                <Typography
                                    component={'span'}
                                    className={classes.labelTextValue}
                                >
                                    {candidate.email}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography
                                    component={'span'}
                                    className={classes.labelText}
                                >
                                    Phone Number
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={8}
                                className={classes.textFieldContainer}
                            >
                                <Typography
                                    component={'span'}
                                    className={classes.labelTextValue}
                                >
                                    {candidate.phone_number}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography
                                    component={'span'}
                                    className={classes.labelText}
                                >
                                    Status
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={8}
                                className={classes.textFieldContainer}
                            >
                                <Typography
                                    component={'span'}
                                    className={classes.labelTextValue}
                                >
                                    {candidate.status}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography
                                    component={'span'}
                                    className={classes.labelText}
                                >
                                    Referral
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={8}
                                className={classes.textFieldContainer}
                            >
                                <Typography
                                    component={'span'}
                                    className={classes.labelTextValue}
                                >
                                    {candidate.referral}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography
                                    component={'span'}
                                    className={classes.labelText}
                                >
                                    Source
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={8}
                                className={classes.textFieldContainer}
                            >
                                <Typography
                                    component={'span'}
                                    className={classes.labelTextValue}
                                >
                                    {candidate.source}
                                </Typography>
                            </Grid>
                            {candidate.status_code > 2 && (
                                <>
                                    <Grid item xs={4}>
                                        <Typography
                                            component={'span'}
                                            className={classes.labelText}
                                        >
                                            Driving License #
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={8}
                                        className={classes.textFieldContainer}
                                    >
                                        <Typography
                                            component={'span'}
                                            className={classes.labelTextValue}
                                        >
                                            {candidate.DLN && candidate.DLN}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography
                                            component={'span'}
                                            className={classes.labelText}
                                        >
                                            Date of Birth
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={8}
                                        className={classes.textFieldContainer}
                                    >
                                        <Typography
                                            component={'span'}
                                            className={classes.labelTextValue}
                                        >
                                            {candidate.DOB && candidate.DOB}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography
                                            component={'span'}
                                            className={classes.labelText}
                                        >
                                            Zip Code
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={8}
                                        className={classes.textFieldContainer}
                                    >
                                        <Typography
                                            component={'span'}
                                            className={classes.labelTextValue}
                                        >
                                            {candidate.zip_code &&
                                                candidate.zip_code}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography
                                            component={'span'}
                                            className={classes.labelText}
                                        >
                                            Shift
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={8}
                                        className={classes.textFieldContainer}
                                    >
                                        <Typography
                                            component={'span'}
                                            className={classes.labelTextValue}
                                        >
                                            {candidate.shift && candidate.shift}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography
                                            component={'span'}
                                            className={classes.labelText}
                                        >
                                            Type
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={8}
                                        className={classes.textFieldContainer}
                                    >
                                        <Typography
                                            component={'span'}
                                            className={classes.labelTextValue}
                                        >
                                            {candidate.candidate_type &&
                                                candidate.candidate_type}
                                        </Typography>
                                    </Grid>
                                </>
                            )}
                            {candidate.status_code >= 3 && (
                                <>
                                    <Grid item xs={4}>
                                        <Typography
                                            component={'span'}
                                            className={classes.labelText}
                                        >
                                            Documents Check
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={8}
                                        className={classes.textFieldContainer}
                                    >
                                        Pass
                                    </Grid>
                                </>
                            )}
                            {candidate.status_code >= 4 && (
                                <>
                                    <Grid item xs={4}>
                                        <Typography
                                            component={'span'}
                                            className={classes.labelText}
                                        >
                                            Background Check
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={8}
                                        className={classes.textFieldContainer}
                                    >
                                        Pass
                                    </Grid>
                                </>
                            )}
                            {candidate.status_code >= 5 && (
                                <>
                                    <Grid item xs={4}>
                                        <Typography
                                            component={'span'}
                                            className={classes.labelText}
                                        >
                                            Drug Test
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={8}
                                        className={classes.textFieldContainer}
                                    >
                                        Pass
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </DialogContent>
                </Dialog>
            </Grid>
        )
    )
}

export default CadidateForm
