import * as React from 'react'
import PropTypes from 'prop-types'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import SearchIcon from '@mui/icons-material/Search'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import AddIcon from '@mui/icons-material/Add'
import CadidatePageStyle from './style'
import {
    Dialog,
    DialogTitle,
    Grid,
    List,
    ListItem,
    TextField,
    Button,
} from '@material-ui/core'
import CandidateForm from '../CadidateForm'
import { axiosClient, httpOptions } from '../../config'
import moment from 'moment'
import { Autocomplete } from '@mui/material'
import { City, State } from 'country-state-city'
import { uniqBy } from 'lodash'
import { useSnackbar } from 'notistack'
import Loader from '../Loader'

function createData(name, calories, fat, carbs, protein) {
    return {
        name,
        calories,
        fat,
        carbs,
        protein,
    }
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) {
            return order
        }
        return a[1] - b[1]
    })
    return stabilizedThis.map((el) => el[0])
}

const headCells = [
    {
        id: 'job',
        numeric: false,
        disablePadding: false,
        label: 'Job',
    },
    {
        id: 'location',
        numeric: false,
        disablePadding: false,
        label: 'Location',
    },
    {
        id: 'source',
        numeric: false,
        disablePadding: false,
        label: 'Source',
    },
    {
        id: 'referral',
        numeric: false,
        disablePadding: false,
        label: 'Referral',
    },
    {
        id: 'lastName',
        numeric: false,
        disablePadding: false,
        label: 'Last Name',
    },
    {
        id: 'firstName',
        numeric: false,
        disablePadding: false,
        label: 'First Name',
    },
    ,
    {
        id: 'partner',
        numeric: false,
        disablePadding: false,
        label: 'partner',
    },
    ,
    {
        id: 'shift',
        numeric: false,
        disablePadding: false,
        label: 'Shift',
    },
    {
        id: 'phone',
        numeric: false,
        disablePadding: false,
        label: 'Phone',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
    {
        id: 'applied',
        numeric: false,
        disablePadding: false,
        label: 'Date Applied',
    },
    {
        id: 'started',
        numeric: false,
        disablePadding: false,
        label: 'Last Update',
    },
    {
        id: 'recruiter',
        numeric: false,
        disablePadding: false,
        label: 'Recruiter',
    },
]

function EnhancedTableHead(props) {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
    } = props
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property)
    }

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
}

const EnhancedTableToolbar = (props) => {
    const { numSelected } = props

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(
                            theme.palette.primary.main,
                            theme.palette.action.activatedOpacity
                        ),
                }),
            }}
        >
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                Candidate List
            </Typography>
        </Toolbar>
    )
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
}

const filteroptions = [
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
        value: 'Pending',
        label: 'Pending',
    },
    {
        value: 'Hired',
        label: 'Hired',
    },
    {
        value: 'Terminated',
        label: 'Terminated',
    },
    {
        value: 'Rejected',
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

const partnerOptions = [
    {
        label: 'Uber',
        value: 'Uber',
    },
    {
        label: 'Lyft',
        value: 'Lyft',
    },
    {
        label: 'Waymo',
        value: 'Waymo',
    },
]

const shiftOptions = [
    {
        label: 'Weekday 1st Shift',
        value: 'Weekday 1st Shift',
        code: 1,
    },
    {
        label: 'Weekday 2nd Shift',
        value: 'Weekday 2nd Shift',
        code: 2,
    },
    {
        label: 'Weekday 3rd Shift',
        value: 'Weekday 3rd Shift',
        code: 3,
    },
    {
        label: 'Weekend 1st Shift',
        value: 'Weekend 1st Shift',
        code: 4,
    },
    {
        label: 'Weekend 2nd Shift',
        value: 'Weekend 2nd Shift',
        code: 5,
    },
    {
        label: 'Weekend 3rd Shift',
        value: 'Weekend 3rd Shift',
        code: 6,
    },
]

export default function EnhancedTable() {
    const [order, setOrder] = React.useState('asc')
    const [orderBy, setOrderBy] = React.useState('calories')
    const [selected, setSelected] = React.useState([])
    const [page, setPage] = React.useState(0)
    const [dense, setDense] = React.useState(true)
    const [loading, setLoading] = React.useState(false)
    const [rows, setRows] = React.useState([])
    const [jobList, setJobList] = React.useState([])
    const [users, setUsers] = React.useState([])
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [search, setSearch] = React.useState('')
    const [filterDialog, setFilterDialog] = React.useState(false)
    const [searchDialog, setSearchDialog] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const client = localStorage.getItem('client')
    const { enqueueSnackbar } = useSnackbar()
    const classes = CadidatePageStyle
    const [cityList, setCityList] = React.useState([])
    const [stateList, setStateList] = React.useState([])
    const user = JSON.parse(localStorage.getItem('user'))
    const [filter, setFilter] = React.useState({
        city: [],
        state: [],
        user: [],
        jobs: [],
        status: '',
        source: '',
        profile: '',
        DL: '',
        BC: '',
        DT: '',
        Training: '',
        hiring: '',
        partner: '',
        shift: '',
    })

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.name)
            setSelected(newSelecteds)
            return
        }
        setSelected([])
    }

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            )
        }

        setSelected(newSelected)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleChangeDense = (event) => {
        setDense(event.target.checked)
    }

    const isSelected = (name) => selected.indexOf(name) !== -1

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

    const statusList = [
        { name: 'Applied', value: '0' },
        { name: 'Assigned', value: '1' },
        { name: 'Rejected', value: '2' },
        { name: 'Waitlisted', value: '3' },
        { name: 'Training', value: '4' },
        { name: 'Hired', value: '5' },
    ]

    const sourceList = [
        { name: 'Admin Panel', value: 'Admin panel' },
        { name: 'Facebook', value: 'Facebook' },
        { name: 'Indeed', value: 'Indeed' },
    ]

    const getAllJobs = () => {
        const data = {
            clientId: client,
        }
        try {
            axiosClient
                .post('user/profile/getAll', data, httpOptions)
                .then((response) => {
                    if (response.status === 200) {
                        const res = response.data.data
                        setRows(res)
                    } else {
                        // setError(true)
                    }
                })
        } catch (err) {
            console.log(err)
        }
    }

    const getFilterJobs = () => {
        const data = {
            clientId: client,
            filter: filter,
        }
        try {
            axiosClient
                .post('user/profile/showFilterUsers', data, httpOptions)
                .then((response) => {
                    if (response.status === 200) {
                        const res = response.data.data
                        setRows(res)
                    } else {
                        // setError(true)
                    }
                })
        } catch (err) {
            console.log(err)
        }
    }

    const getSearchJobs = (term) => {
        const data = {
            clientId: client,
            term: term,
        }
        try {
            axiosClient
                .post('user/profile/showSearchUsers', data, httpOptions)
                .then((response) => {
                    if (response.status === 200) {
                        const res = response.data.data
                        setRows(res)
                    } else {
                        // setError(true)
                    }
                })
        } catch (err) {
            console.log(err)
        }
    }

    const getAllUsers = () => {
        const data = {
            clientId: client,
        }
        try {
            axiosClient
                .post('auth/getalluser', data, httpOptions)
                .then((response) => {
                    if (response.status === 200) {
                        const res = response.data.data
                        const filterUsers = res.filter((u) => u.id === user.id)
                        setUsers(user.role.isEmployee ? filterUsers : res)
                    } else {
                        // setError(true)
                    }
                })
        } catch (err) {
            console.log(err)
        }
    }

    const setUser = (selectedUser, row) => {
        setLoading(true)
        const data = {
            id: row.id,
            employerId: selectedUser.id,
            status: 'assigned',
            status_code: 1,
        }
        try {
            axiosClient
                .put('user/profile/update', data, httpOptions)
                .then((response) => {
                    if (response.status === 200) {
                        setLoading(false)
                        const res = response.data.data
                        enqueueSnackbar('Candidate Assigned Successfully', {
                            variant: 'success',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                        firstRenderFunction()
                    } else {
                        setLoading(false)
                        enqueueSnackbar('Failed to Assign Candidate', {
                            variant: 'success',
                            autoHideDuration: 3000,
                            preventDuplicate: true,
                        })
                        // setError(true)
                    }
                })
        } catch (err) {
            setLoading(false)
            enqueueSnackbar('Failed to Assign Candidate', {
                variant: 'success',
                autoHideDuration: 3000,
                preventDuplicate: true,
            })
            console.log(err)
        }
    }

    const getJobList = () => {
        const data = {
            clientId: client,
        }
        try {
            axiosClient.post('jobs/list/getAll', data).then((response) => {
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

    React.useEffect(() => {
        firstRenderFunction()
    }, [])

    const firstRenderFunction = async () => {
        setLoading(true)
        const resultCity = uniqBy(City.getCitiesOfCountry('US'), 'name')
        setCityList(resultCity)
        const resultState = uniqBy(State.getStatesOfCountry('US'), 'name')
        setStateList(resultState)
        await getJobList()
        await getAllJobs()
        await getAllUsers()
        setLoading(false)
    }

    return (
        <Box sx={{ width: '100%', padding: '0px' }}>
            <Loader loading={loading} />
            <div
                style={{
                    padding: '0px 5%',
                    marginTop: '100px',
                }}
            >
                <CandidateForm open={open} handleClose={() => setOpen(false)} />
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-end"
                >
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
                            Candidates
                        </Typography>
                    </Box>
                    <Grid item>
                        <Box
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {searchDialog && (
                                <Box
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '0px 10px',
                                    }}
                                >
                                    <TextField
                                        value={search}
                                        onChange={(event) => {
                                            setSearch(event.target.value)
                                            if (event.target.value === '') {
                                                getAllJobs()
                                            }
                                        }}
                                        onKeyPress={(event) => {
                                            if (event.key === 'Enter') {
                                                getSearchJobs(
                                                    event.target.value
                                                )
                                            }
                                        }}
                                        type="string"
                                        placeholder="Search"
                                        className={classes.searchTextField}
                                    />
                                </Box>
                            )}
                            <Dialog
                                onClose={() => setFilterDialog(false)}
                                open={filterDialog}
                                fullWidth
                                maxWidth="xs"
                            >
                                <DialogTitle>Select a Filter</DialogTitle>
                                <List sx={{ padding: 0 }}>
                                    <ListItem
                                        key={'cityfilter'}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                        }}
                                    >
                                        <Autocomplete
                                            multiple
                                            onChange={(event, city) => {
                                                setFilter({
                                                    ...filter,
                                                    city: city,
                                                })
                                            }}
                                            value={filter.city}
                                            classes={classes.textField}
                                            disableCloseOnSelect
                                            options={cityList}
                                            getOptionLabel={(option) =>
                                                option.name
                                            }
                                            key="autocomplete"
                                            getOptionSelected={(
                                                option,
                                                value
                                            ) =>
                                                value === undefined ||
                                                value === '' ||
                                                option.name === value.name
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="City"
                                                    placeholder="city"
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            )}
                                            fullWidth
                                        />
                                    </ListItem>
                                    <ListItem
                                        key={'statefilter'}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                        }}
                                    >
                                        <Autocomplete
                                            multiple
                                            onChange={(event, state) => {
                                                setFilter({
                                                    ...filter,
                                                    state: state,
                                                })
                                            }}
                                            value={filter.state}
                                            classes={classes.textField}
                                            disableCloseOnSelect
                                            options={stateList}
                                            getOptionLabel={(option) =>
                                                option.name
                                            }
                                            key="autocomplete"
                                            getOptionSelected={(
                                                option,
                                                value
                                            ) =>
                                                value === undefined ||
                                                value === '' ||
                                                option.name === value.name
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="State"
                                                    placeholder="State"
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            )}
                                            fullWidth
                                        />
                                    </ListItem>
                                    <ListItem
                                        key={'statusfilter'}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                        }}
                                    >
                                        <Autocomplete
                                            onChange={(event, status) => {
                                                setFilter({
                                                    ...filter,
                                                    status: status,
                                                })
                                            }}
                                            classes={classes.textField}
                                            disableCloseOnSelect
                                            options={statusList}
                                            getOptionLabel={(option) =>
                                                option.name
                                            }
                                            key="autocomplete"
                                            getOptionSelected={(
                                                option,
                                                value
                                            ) =>
                                                value === undefined ||
                                                value === '' ||
                                                option.name === value.name
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Status"
                                                    placeholder="Status"
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            )}
                                            fullWidth
                                        />
                                    </ListItem>

                                    <ListItem
                                        key={'filter'}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                        }}
                                    >
                                        <Autocomplete
                                            onChange={(event, source) => {
                                                setFilter({
                                                    ...filter,
                                                    source: source,
                                                })
                                            }}
                                            classes={classes.textField}
                                            disableCloseOnSelect
                                            options={sourceList}
                                            getOptionLabel={(option) =>
                                                option.name
                                            }
                                            key="autocomplete"
                                            getOptionSelected={(
                                                option,
                                                value
                                            ) =>
                                                value === undefined ||
                                                value === '' ||
                                                option.name === value.name
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Source"
                                                    placeholder="Source"
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            )}
                                            fullWidth
                                        />
                                    </ListItem>
                                    <ListItem
                                        key={'filter'}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                        }}
                                    >
                                        <Autocomplete
                                            onChange={(event, job) => {
                                                setFilter({
                                                    ...filter,
                                                    jobs: job,
                                                })
                                            }}
                                            classes={classes.textField}
                                            disableCloseOnSelect
                                            options={jobList}
                                            getOptionLabel={(option) =>
                                                option.job_title
                                            }
                                            key="autocomplete"
                                            getOptionSelected={(
                                                option,
                                                value
                                            ) =>
                                                value === undefined ||
                                                value === '' ||
                                                option.job_title ===
                                                    value.job_title
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Select a Job"
                                                    placeholder="Job"
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            )}
                                            fullWidth
                                        />
                                    </ListItem>

                                    <ListItem
                                        key={'partner'}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                        }}
                                    >
                                        <Autocomplete
                                            onChange={(event, job) => {
                                                setFilter({
                                                    ...filter,
                                                    partner: job,
                                                })
                                            }}
                                            classes={classes.textField}
                                            disableCloseOnSelect
                                            options={partnerOptions}
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
                                                    label="Partner"
                                                    placeholder="Select a Partner"
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            )}
                                            fullWidth
                                        />
                                    </ListItem>

                                    <ListItem
                                        key={'filter'}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                        }}
                                    >
                                        <Autocomplete
                                            onChange={(event, job) => {
                                                setFilter({
                                                    ...filter,
                                                    shift: job,
                                                })
                                            }}
                                            classes={classes.textField}
                                            disableCloseOnSelect
                                            options={shiftOptions}
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
                                                    label="Shift"
                                                    placeholder="Select a Shift"
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            )}
                                            fullWidth
                                        />
                                    </ListItem>

                                    <ListItem
                                        key={'filter'}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                        }}
                                    >
                                        <Autocomplete
                                            onChange={(event, job) => {
                                                setFilter({
                                                    ...filter,
                                                    profile: job,
                                                })
                                            }}
                                            classes={classes.textField}
                                            disableCloseOnSelect
                                            options={filteroptions}
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
                                                    label="Profile Photo"
                                                    placeholder="Profile Photo"
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            )}
                                            fullWidth
                                        />
                                    </ListItem>

                                    <ListItem
                                        key={'filter'}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                        }}
                                    >
                                        <Autocomplete
                                            onChange={(event, job) => {
                                                setFilter({
                                                    ...filter,
                                                    Dl: job,
                                                })
                                            }}
                                            classes={classes.textField}
                                            disableCloseOnSelect
                                            options={filteroptions}
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
                                                    label="Driving License"
                                                    placeholder="Driving License"
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            )}
                                            fullWidth
                                        />
                                    </ListItem>

                                    <ListItem
                                        key={'filter'}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                        }}
                                    >
                                        <Autocomplete
                                            onChange={(event, job) => {
                                                setFilter({
                                                    ...filter,
                                                    BC: job,
                                                })
                                            }}
                                            classes={classes.textField}
                                            disableCloseOnSelect
                                            options={filteroptions}
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
                                                    label="Background Check"
                                                    placeholder="Background Check"
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            )}
                                            fullWidth
                                        />
                                    </ListItem>

                                    <ListItem
                                        key={'filter'}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                        }}
                                    >
                                        <Autocomplete
                                            onChange={(event, job) => {
                                                setFilter({
                                                    ...filter,
                                                    DT: job,
                                                })
                                            }}
                                            classes={classes.textField}
                                            disableCloseOnSelect
                                            options={filteroptions}
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
                                                    label="Drug Test"
                                                    placeholder="Drug Test"
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            )}
                                            fullWidth
                                        />
                                    </ListItem>

                                    <ListItem
                                        key={'filter'}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                        }}
                                    >
                                        <Autocomplete
                                            onChange={(event, job) => {
                                                setFilter({
                                                    ...filter,
                                                    Training: job,
                                                })
                                            }}
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
                                                    label="Training"
                                                    placeholder="Training"
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            )}
                                            fullWidth
                                        />
                                    </ListItem>

                                    <ListItem
                                        key={'filter'}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                        }}
                                    >
                                        <Autocomplete
                                            onChange={(event, job) => {
                                                setFilter({
                                                    ...filter,
                                                    hiring: job,
                                                })
                                            }}
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
                                                    label="Hiring Status"
                                                    placeholder="Hiring Status"
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            )}
                                            fullWidth
                                        />
                                    </ListItem>

                                    <ListItem
                                        key="btn"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'end',
                                            alignItems: 'center',
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                        }}
                                    >
                                        <Button
                                            onClick={() => {
                                                getFilterJobs()
                                                setFilterDialog(false)
                                            }}
                                            style={{
                                                background: '#081e5c',
                                                color: '#FFFFFF',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            Filter
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                getAllJobs()
                                                setFilterDialog(false)
                                            }}
                                            style={{
                                                background: '#CECECE',
                                                color: '#FFFFFF',
                                                marginLeft: '10px',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </ListItem>
                                </List>
                            </Dialog>
                            <Box
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#cecece',
                                    borderRadius: '15px',
                                    padding: `3px 5px`,
                                    marginRight: '10px',
                                    width: 80,
                                }}
                            >
                                <SearchIcon
                                    onClick={() =>
                                        setSearchDialog(!searchDialog)
                                    }
                                    style={{ margin: '0px 5px' }}
                                />
                                <FilterAltIcon
                                    onClick={() =>
                                        setFilterDialog(!filterDialog)
                                    }
                                    style={{ margin: '0px 5px' }}
                                />
                            </Box>
                            <Box
                                style={{
                                    backgroundColor: '#081e5c',
                                    borderRadius: '9px',
                                    padding: 5,
                                }}
                            >
                                <AddIcon
                                    style={{ color: 'white' }}
                                    onClick={() => setOpen(true)}
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </div>
            <Paper sx={{ width: '90%', mb: 2, margin: '50px 5%' }}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {/* {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy))  */}
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.name)
                                    const labelId = `enhanced-table-checkbox-${index}`
                                    console.log(row)
                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) =>
                                                handleClick(event, row.name)
                                            }
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.name}
                                            selected={isItemSelected}
                                        >
                                            <TableCell
                                                id={labelId}
                                                align="left"
                                                padding="0px 10px"
                                            >
                                                {row.post_job.job_title}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.city_name}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.source}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.referral}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.last_name}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.first_name}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.service}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.shift}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.phone_number}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.status}
                                            </TableCell>
                                            <TableCell align="left">
                                                {moment(row.createdAt).format(
                                                    'MMMM DD, YYYY'
                                                )}
                                            </TableCell>
                                            <TableCell align="left">
                                                {moment(row.updatedAt).format(
                                                    'MMMM DD, YYYY'
                                                )}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.user ? (
                                                    row.user.name
                                                ) : (
                                                    <Autocomplete
                                                        onChange={(
                                                            event,
                                                            data
                                                        ) => {
                                                            setUser(data, row)
                                                        }}
                                                        classes={
                                                            classes.textField
                                                        }
                                                        options={users}
                                                        getOptionLabel={(
                                                            option
                                                        ) => option.name}
                                                        getOptionSelected={(
                                                            option,
                                                            value
                                                        ) =>
                                                            value ===
                                                                undefined ||
                                                            value === '' ||
                                                            option.name ===
                                                                value.name
                                                        }
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextField
                                                                {...params}
                                                                placeholder="user"
                                                                margin="normal"
                                                                required
                                                            />
                                                        )}
                                                    />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    )
}
