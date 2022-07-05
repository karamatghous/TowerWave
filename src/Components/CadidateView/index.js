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
import moment from 'moment'

const filter = [
    {
        value: 'Pending',
        label: 'Pending',
    },
    {
        value: 'Active',
        label: 'Active',
    },
    {
        value: 'Approved',
        label: 'Approved',
    },
    {
        value: 'Rejected',
        label: 'Rejected',
    },
]

const hiringList = [
    {
        value: 3,
        label: 'Pending',
    },
    {
        value: 4,
        label: 'Hired',
    },
    {
        value: 5,
        label: 'Terminated',
    },
    {
        value: 2,
        label: 'Rejected',
    },
]

const trainingList = [
    {
        value: 'Pending',
        label: 'Pending',
    },
    {
        value: 'Active',
        label: 'Active',
    },
    {
        value: 'Passed',
        label: 'Passed',
    },
    {
        value: 'Failed',
        label: 'Failed',
    },
]

function CadidateForm({ open, handleClose, candidate }) {
    const classes = CadidateFormStyles
    const client = localStorage.getItem('client')
    const user = JSON.parse(localStorage.getItem('user'))
    const { enqueueSnackbar } = useSnackbar()
    const [loading, setLoading] = React.useState(false)
    const [profileStatus, setProfileStatus] = React.useState(
        candidate.profile_photo
            ? filter.find((f) => f.label === candidate.profile_photo)
            : filter[0]
    )

    const [DLStatus, setDLStatus] = React.useState(
        candidate.DLN_status
            ? filter.find((f) => f.label === candidate.DLN_status)
            : filter[0]
    )

    const [DTStatus, setDTStatus] = React.useState(
        candidate.drug_test
            ? filter.find((f) => f.label === candidate.drug_test)
            : filter[0]
    )

    const [BCStatus, setBCStatus] = React.useState(
        candidate.BGC
            ? filter.find((f) => f.label === candidate.BGC)
            : filter[0]
    )

    const [trainingStatus, setTrainingStatus] = React.useState(
        candidate.training
            ? trainingList.find((f) => f.label === candidate.training)
            : trainingList[0]
    )

    const [hiringStatus, setHiringStatus] = React.useState(
        candidate.hire_or_not
            ? hiringList.find((f) => f.label === candidate.hire_or_not)
            : hiringList[0]
    )

    const onClose = () => {
        handleClose()
    }

    React.useEffect(() => {
        setProfileStatus(
            candidate.profile_photo
                ? filter.find((f) => f.label === candidate.profile_photo)
                : filter[0]
        )
        setDLStatus(
            candidate.DLN_status
                ? filter.find((f) => f.label === candidate.DLN_status)
                : filter[0]
        )
        setBCStatus(
            candidate.BGC
                ? filter.find((f) => f.label === candidate.BGC)
                : filter[0]
        )
        setTrainingStatus(
            candidate.training
                ? trainingList.find((f) => f.label === candidate.training)
                : trainingList[0]
        )
        setHiringStatus(
            candidate.hire_or_not
                ? hiringList.find((f) => f.label === candidate.hire_or_not)
                : hiringList[0]
        )
        setDTStatus(
            candidate.drug_test
                ? filter.find((f) => f.label === candidate.drug_test)
                : filter[0]
        )
    }, [candidate])

    const handleProfileHiringStatus = (result) => {
        setLoading(true)
        const data = {
            id: candidate.id,
            attributes: {
                hire_or_not: result.label,
                hire_date: new Date().toISOString(),
                status: result.label,
                status_code: result.value,
            },
        }
        try {
            axiosClient
                .put('user/profile/updateCandidate', data, httpOptions)
                .then((response) => {
                    setLoading(false)
                    if (response.status === 200) {
                        const res = response.data.data
                        enqueueSnackbar('Profile Updated Successfully', {
                            variant: 'success',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                    } else {
                        enqueueSnackbar('Failed to Update Profile', {
                            variant: 'error',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                        // setError(true)
                    }
                })
        } catch (err) {
            setLoading(false)
            enqueueSnackbar('Failed to Update Profile', {
                variant: 'error',
                autoHideDuration: 3000,
                preventDuplicate: true,
            })
            console.log(err)
        }
    }

    const handleProfileTrainingStatus = (value) => {
        setLoading(true)
        const data = {
            id: candidate.id,
            attributes: {
                training: value,
            },
        }
        try {
            axiosClient
                .put('user/profile/updateCandidate', data, httpOptions)
                .then((response) => {
                    setLoading(false)
                    if (response.status === 200) {
                        const res = response.data.data
                        enqueueSnackbar('Profile Updated Successfully', {
                            variant: 'success',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                    } else {
                        enqueueSnackbar('Failed to Update Profile', {
                            variant: 'error',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                        // setError(true)
                    }
                })
        } catch (err) {
            setLoading(false)
            enqueueSnackbar('Failed to Update Profile', {
                variant: 'error',
                autoHideDuration: 3000,
                preventDuplicate: true,
            })
            console.log(err)
        }
    }

    const handleProfileBCStatus = (value) => {
        setLoading(true)
        const data = {
            id: candidate.id,
            attributes: {
                BGC: value,
            },
        }
        try {
            axiosClient
                .put('user/profile/updateCandidate', data, httpOptions)
                .then((response) => {
                    setLoading(false)
                    if (response.status === 200) {
                        const res = response.data.data
                        enqueueSnackbar('Profile Updated Successfully', {
                            variant: 'success',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                    } else {
                        enqueueSnackbar('Failed to Update Profile', {
                            variant: 'error',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                        // setError(true)
                    }
                })
        } catch (err) {
            setLoading(false)
            enqueueSnackbar('Failed to Update Profile', {
                variant: 'error',
                autoHideDuration: 3000,
                preventDuplicate: true,
            })
            console.log(err)
        }
    }

    const handleProfileDTStatus = (value) => {
        setLoading(true)
        const data = {
            id: candidate.id,
            attributes: {
                drug_test: value,
            },
        }
        try {
            axiosClient
                .put('user/profile/updateCandidate', data, httpOptions)
                .then((response) => {
                    setLoading(false)
                    if (response.status === 200) {
                        const res = response.data.data
                        enqueueSnackbar('Profile Updated Successfully', {
                            variant: 'success',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                    } else {
                        enqueueSnackbar('Failed to Update Profile', {
                            variant: 'error',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                        // setError(true)
                    }
                })
        } catch (err) {
            setLoading(false)
            enqueueSnackbar('Failed to Update Profile', {
                variant: 'error',
                autoHideDuration: 3000,
                preventDuplicate: true,
            })
            console.log(err)
        }
    }

    const handleProfilePhotoStatus = (value) => {
        setLoading(true)
        const data = {
            id: candidate.id,
            attributes: {
                profile_photo: value,
            },
        }
        try {
            axiosClient
                .put('user/profile/updateCandidate', data, httpOptions)
                .then((response) => {
                    setLoading(false)
                    if (response.status === 200) {
                        const res = response.data.data
                        enqueueSnackbar('Profile Updated Successfully', {
                            variant: 'success',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                    } else {
                        enqueueSnackbar('Failed to Update Profile', {
                            variant: 'error',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                        // setError(true)
                    }
                })
        } catch (err) {
            setLoading(false)
            enqueueSnackbar('Failed to Update Profile', {
                variant: 'error',
                autoHideDuration: 3000,
                preventDuplicate: true,
            })
            console.log(err)
        }
    }

    const handleProfileDLStatus = (value) => {
        setLoading(true)
        const data = {
            id: candidate.id,
            attributes: {
                DLN_status: value,
            },
        }
        try {
            axiosClient
                .put('user/profile/updateCandidate', data, httpOptions)
                .then((response) => {
                    setLoading(false)
                    if (response.status === 200) {
                        const res = response.data.data
                        enqueueSnackbar('Profile Updated Successfully', {
                            variant: 'success',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                    } else {
                        enqueueSnackbar('Failed to Update Profile', {
                            variant: 'error',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                        // setError(true)
                    }
                })
        } catch (err) {
            setLoading(false)
            enqueueSnackbar('Failed to Update Profile', {
                variant: 'error',
                autoHideDuration: 3000,
                preventDuplicate: true,
            })
            console.log(err)
        }
    }

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
                    <DialogTitle>View Candidate Details</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={1}>
                            <Grid item xs={5}>
                                <Typography
                                    component={'span'}
                                    className={classes.labelText}
                                >
                                    Name
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={7}
                                className={classes.textFieldContainer}
                            >
                                <Typography
                                    component={'span'}
                                    className={classes.labelTextValue}
                                >
                                    {`${candidate.first_name} ${candidate.last_name}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography
                                    component={'span'}
                                    className={classes.labelText}
                                >
                                    Job
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={7}
                                className={classes.textFieldContainer}
                            >
                                <Typography
                                    component={'span'}
                                    className={classes.labelTextValue}
                                >
                                    {candidate?.post_job?.job_title}
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography
                                    component={'span'}
                                    className={classes.labelText}
                                >
                                    Email
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={7}
                                className={classes.textFieldContainer}
                            >
                                <Typography
                                    component={'span'}
                                    className={classes.labelTextValue}
                                >
                                    {candidate.email}
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography
                                    component={'span'}
                                    className={classes.labelText}
                                >
                                    Phone Number
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={7}
                                className={classes.textFieldContainer}
                            >
                                <Typography
                                    component={'span'}
                                    className={classes.labelTextValue}
                                >
                                    {candidate.phone_number}
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography
                                    component={'span'}
                                    className={classes.labelText}
                                >
                                    Status
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={7}
                                className={classes.textFieldContainer}
                            >
                                <Typography
                                    component={'span'}
                                    className={classes.labelTextValue}
                                >
                                    {candidate.status}
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography
                                    component={'span'}
                                    className={classes.labelText}
                                >
                                    Referral
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={7}
                                className={classes.textFieldContainer}
                            >
                                <Typography
                                    component={'span'}
                                    className={classes.labelTextValue}
                                >
                                    {candidate.referral}
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography
                                    component={'span'}
                                    className={classes.labelText}
                                >
                                    Source
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={7}
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
                                    <Grid item xs={5}>
                                        <Typography
                                            component={'span'}
                                            className={classes.labelText}
                                        >
                                            Driving License #
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={7}
                                        className={classes.textFieldContainer}
                                    >
                                        <Typography
                                            component={'span'}
                                            className={classes.labelTextValue}
                                        >
                                            {candidate.DLN && candidate.DLN}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography
                                            component={'span'}
                                            className={classes.labelText}
                                        >
                                            Date of Birth
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={7}
                                        className={classes.textFieldContainer}
                                    >
                                        <Typography
                                            component={'span'}
                                            className={classes.labelTextValue}
                                        >
                                            {candidate.DOB &&
                                                moment(candidate.DOB).format(
                                                    'MMMM DD, YYYY'
                                                )}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography
                                            component={'span'}
                                            className={classes.labelText}
                                        >
                                            Zip Code
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={7}
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
                                    <Grid item xs={5}>
                                        <Typography
                                            component={'span'}
                                            className={classes.labelText}
                                        >
                                            Shift
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={7}
                                        className={classes.textFieldContainer}
                                    >
                                        <Typography
                                            component={'span'}
                                            className={classes.labelTextValue}
                                        >
                                            {candidate.shift && candidate.shift}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography
                                            component={'span'}
                                            className={classes.labelText}
                                        >
                                            Type
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={7}
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
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center"
                                        style={{ margin: '4px' }}
                                    >
                                        <Grid item xs={5}>
                                            <Typography
                                                component={'span'}
                                                className={classes.labelText}
                                            >
                                                Profile Photo
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={7}
                                            className={
                                                classes.textFieldContainer
                                            }
                                        >
                                            <Autocomplete
                                                onChange={(event, city) => {
                                                    setProfileStatus(city)
                                                    handleProfilePhotoStatus(
                                                        city.label
                                                    )
                                                }}
                                                classes={classes.textField}
                                                disableCloseOnSelect
                                                options={filter}
                                                value={profileStatus}
                                                getOptionLabel={(option) =>
                                                    option.label
                                                }
                                                key="autocomplete"
                                                getOptionSelected={(
                                                    option,
                                                    value
                                                ) =>
                                                    value === undefined ||
                                                    value === '' ||
                                                    option.label === value.label
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Profile Photo"
                                                        margin="normal"
                                                        variant="outlined"
                                                        style={{ margin: 0 }}
                                                    />
                                                )}
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center"
                                        style={{ margin: '4px' }}
                                    >
                                        <Grid item xs={5}>
                                            <Typography
                                                component={'span'}
                                                className={classes.labelText}
                                            >
                                                Driving License
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={7}
                                            className={
                                                classes.textFieldContainer
                                            }
                                        >
                                            <Autocomplete
                                                onChange={(event, city) => {
                                                    setDLStatus(city)
                                                    handleProfileDLStatus(
                                                        city.label
                                                    )
                                                }}
                                                classes={classes.textField}
                                                disableCloseOnSelect
                                                options={filter}
                                                value={DLStatus}
                                                getOptionLabel={(option) =>
                                                    option.label
                                                }
                                                key="autocomplete"
                                                getOptionSelected={(
                                                    option,
                                                    value
                                                ) =>
                                                    value === undefined ||
                                                    value === '' ||
                                                    option.label === value.label
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Driving License"
                                                        margin="normal"
                                                        variant="outlined"
                                                        style={{ margin: 0 }}
                                                    />
                                                )}
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center"
                                        style={{ margin: '4px' }}
                                    >
                                        <Grid item xs={5}>
                                            <Typography
                                                component={'span'}
                                                className={classes.labelText}
                                            >
                                                Background Check
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={7}
                                            className={
                                                classes.textFieldContainer
                                            }
                                        >
                                            <Autocomplete
                                                onChange={(event, city) => {
                                                    setBCStatus(city)
                                                    handleProfileBCStatus(
                                                        city.label
                                                    )
                                                }}
                                                value={BCStatus}
                                                classes={classes.textField}
                                                disableCloseOnSelect
                                                options={filter}
                                                getOptionLabel={(option) =>
                                                    option.label
                                                }
                                                key="autocomplete"
                                                getOptionSelected={(
                                                    option,
                                                    value
                                                ) =>
                                                    value === undefined ||
                                                    value === '' ||
                                                    option.label === value.label
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Background Check"
                                                        margin="normal"
                                                        variant="outlined"
                                                        style={{ margin: 0 }}
                                                    />
                                                )}
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center"
                                        style={{ margin: '4px' }}
                                    >
                                        <Grid item xs={5}>
                                            <Typography
                                                component={'span'}
                                                className={classes.labelText}
                                            >
                                                Drug Test
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={7}
                                            className={
                                                classes.textFieldContainer
                                            }
                                        >
                                            <Autocomplete
                                                onChange={(event, city) => {
                                                    setDTStatus(city)
                                                    handleProfileDTStatus(
                                                        city.label
                                                    )
                                                }}
                                                value={DTStatus}
                                                classes={classes.textField}
                                                disableCloseOnSelect
                                                options={filter}
                                                getOptionLabel={(option) =>
                                                    option.label
                                                }
                                                key="autocomplete"
                                                getOptionSelected={(
                                                    option,
                                                    value
                                                ) =>
                                                    value === undefined ||
                                                    value === '' ||
                                                    option.label === value.label
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Drug Test"
                                                        margin="normal"
                                                        variant="outlined"
                                                        style={{ margin: 0 }}
                                                    />
                                                )}
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center"
                                        style={{ margin: '4px' }}
                                    >
                                        <Grid item xs={5}>
                                            <Typography
                                                component={'span'}
                                                className={classes.labelText}
                                            >
                                                Training
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={7}
                                            className={
                                                classes.textFieldContainer
                                            }
                                        >
                                            <Autocomplete
                                                onChange={(event, city) => {
                                                    setTrainingStatus(city)
                                                    handleProfileTrainingStatus(
                                                        city.label
                                                    )
                                                }}
                                                value={trainingStatus}
                                                classes={classes.textField}
                                                disableCloseOnSelect
                                                options={trainingList}
                                                getOptionLabel={(option) =>
                                                    option.label
                                                }
                                                key="autocomplete"
                                                getOptionSelected={(
                                                    option,
                                                    value
                                                ) =>
                                                    value === undefined ||
                                                    value === '' ||
                                                    option.label === value.label
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Training"
                                                        margin="normal"
                                                        variant="outlined"
                                                        style={{ margin: 0 }}
                                                    />
                                                )}
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center"
                                        style={{ margin: '4px' }}
                                    >
                                        <Grid item xs={5}>
                                            <Typography
                                                component={'span'}
                                                className={classes.labelText}
                                            >
                                                Hiring Status
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={7}
                                            className={
                                                classes.textFieldContainer
                                            }
                                        >
                                            <Autocomplete
                                                onChange={(event, city) => {
                                                    setHiringStatus(city)
                                                    handleProfileHiringStatus(
                                                        city
                                                    )
                                                }}
                                                value={hiringStatus}
                                                classes={classes.textField}
                                                disableCloseOnSelect
                                                options={hiringList}
                                                getOptionLabel={(option) =>
                                                    option.label
                                                }
                                                key="autocomplete"
                                                getOptionSelected={(
                                                    option,
                                                    value
                                                ) =>
                                                    value === undefined ||
                                                    value === '' ||
                                                    option.label === value.label
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Hiring"
                                                        margin="normal"
                                                        variant="outlined"
                                                        style={{ margin: 0 }}
                                                    />
                                                )}
                                                fullWidth
                                            />
                                        </Grid>
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
