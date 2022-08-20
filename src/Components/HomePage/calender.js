import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Loader from '../Loader'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import { Button, Dialog, DialogTitle, Grid, TextField } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/material/styles'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import { axiosClient, httpOptions } from '../../config'
import moment from 'moment'
import { sortBy } from 'lodash'
import ReactTooltip from 'react-tooltip'

// import '@fullcalendar/core/main.css'
// import '@fullcalendar/daygrid/main.css'
// import '@fullcalendar/timegrid/main.css'

function CalendarView() {
    const calendarComponentRef = React.createRef()
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [eventTitle, setEventTitle] = useState('')
    const [eventDes, setEventDes] = useState('')
    const client = localStorage.getItem('client')
    const user = JSON.parse(localStorage.getItem('user'))
    const [loading, setLoading] = React.useState(false)
    const handleClose = () => {
        setOpen(false)
    }
    const [events, setEvent] = useState([])
    const [sortedEvents, setSortedEvent] = useState([])

    const handleSave = () => {
        const data = {
            clientId: client,
            employerId: user.id,
            title: eventTitle,
            des: eventDes,
            start: date,
            end: date,
            allDay: true,
        }
        setLoading(true)
        try {
            axiosClient
                .post('user/profile/todoListCreate', data, httpOptions)
                .then((response) => {
                    setLoading(false)
                    if (response.status === 200) {
                        const res = response.data.data
                        setEvent([...events, res])
                    } else {
                        // setError(true)
                    }
                })
        } catch (err) {
            setLoading(false)
            console.log(err)
        }
        setOpen(false)
    }

    const handleDateClick = (arg) => {
        // alert(moment(new Date(arg.dateStr)).startOf('day'))
    }

    const handleSelectedDates = (info) => {
        const now = moment(new Date(info.startStr).toString())
        const start = now.add(0, 'hours')
        const end = now.add(24, 'hours')

        if (info != null) {
            console.log(info)
            setSortedEvent(
                sortedEvents.filter(
                    (e) => console.log(moment(`${e.start}z`))
                    // moment(`${e.start}z`)
                    //     .toLocaleString()
                    //     .add(0, 'hours') >= start &&
                    // moment(`${e.start}z`).toLocaleString().add(0, 'hours') <
                    //     end
                )
            )
        } else {
            console.log('nothing')
        }
    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#081e5c',
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

    const getMyTodo = () => {
        setLoading(true)
        const data = {
            userId: user.id,
        }
        try {
            axiosClient
                .post('user/profile/todoListGetAll', data, httpOptions)
                .then((response) => {
                    setLoading(false)
                    if (response.status === 200) {
                        const res = response.data.data
                        setEvent(res)
                    } else {
                        // setError(true)
                    }
                })
        } catch (err) {
            setLoading(false)
            console.log(err)
        }
    }

    const deleteMyTodo = (item) => {
        setLoading(true)
        const data = {
            id: item.id,
            userId: user.id,
        }
        try {
            axiosClient
                .post('user/profile/todoListDelete', data, httpOptions)
                .then((response) => {
                    setLoading(false)
                    if (response.status === 200) {
                        const res = response.data.data
                        setEvent(events.filter((e) => e.id != item.id))
                    } else {
                        // setError(true)
                    }
                })
        } catch (err) {
            setLoading(false)
            console.log(err)
        }
    }

    React.useEffect(() => {
        getMyTodo()
    }, [])

    React.useEffect(() => {
        setSortedEvent(
            sortBy(events, function (o) {
                return new moment(o.start)
            })
        )
    }, [events])

    function JobTables() {
        return (
            <>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    style={{ marginBottom: '5px' }}
                >
                    <Grid item xs={10}>
                        <span
                            style={{
                                color: '#2C3E50',
                                fontSize: '22px',
                                fontWeight: 'bold',
                            }}
                        >
                            To-do List
                        </span>
                        <AddCircleIcon
                            onClick={() => setOpen(true)}
                            style={{
                                margin: '0px 5px',
                                float: 'right',
                                fontSize: '30px',
                                color: '#2C3E50',
                                cursor: 'pointer',
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item xs={10}>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Title</StyledTableCell>
                                    <StyledTableCell>
                                        Start Time
                                    </StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedEvents.map((row) => (
                                    <StyledTableRow key={row.title}>
                                        <StyledTableCell>
                                            <span
                                                data-tip
                                                data-for={
                                                    'registerTip-' + row.id
                                                }
                                            >
                                                {row.title}
                                            </span>
                                            <ReactTooltip
                                                id={'registerTip-' + row.id}
                                                place="top"
                                                effect="solid"
                                            >
                                                {row.des}
                                            </ReactTooltip>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {new Date(
                                                `${row.start}z`
                                            ).toLocaleString('en-US', {
                                                timeStyle: 'short',
                                                dateStyle: 'short',
                                            })}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <DeleteIcon
                                                onClick={() =>
                                                    deleteMyTodo(row)
                                                }
                                                style={{
                                                    float: 'right',
                                                    fontSize: '20px',
                                                    color: '#2C3E50',
                                                    cursor: 'pointer',
                                                }}
                                            />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </>
        )
    }

    return (
        <>
            <Loader loading={loading} />
            <Grid container direction="row">
                <Grid item xs={6}>
                    {JobTables()}
                </Grid>
                <Grid item xs={6}>
                    <FullCalendar
                        schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
                        ref={calendarComponentRef}
                        defaultView="dayGridMonth"
                        dateClick={handleDateClick}
                        displayEventTime={true}
                        header={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                        }}
                        selectable={true}
                        plugins={[
                            dayGridPlugin,
                            interactionPlugin,
                            timeGridPlugin,
                            resourceTimeGridPlugin,
                        ]}
                        eventClick={(event) => {
                            console.log(event.event._def.publicId)
                        }}
                        events={events}
                        select={handleSelectedDates}
                        eventLimit={5}
                        style={{ innerHeight: 400 }}
                    />
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle>Add New Schedule</DialogTitle>
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    style={{ padding: '10px 10px' }}
                >
                    <TextField
                        id="datetime-local"
                        label="Next Schedule"
                        type="datetime-local"
                        defaultValue={new Date().toISOString().substring(0, 10)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        style={{ cursor: 'pointer', margin: '8px 0px' }}
                        onChange={(event) => setDate(event.target.value)}
                        value={date}
                    />
                    <TextField
                        id="outlined-multiline-static"
                        label="Schedule Title"
                        variant={'outlined'}
                        fullWidth
                        value={eventTitle}
                        style={{ margin: '8px 0px' }}
                        onChange={(event) => setEventTitle(event.target.value)}
                    />
                    <TextField
                        id="outlined-multiline-static"
                        multiline
                        rows={4}
                        fullWidth
                        label="Schedule Description"
                        variant={'outlined'}
                        style={{ margin: '8px 0px' }}
                        value={eventDes}
                        onChange={(event) => setEventDes(event.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        onClick={handleSave}
                        style={{
                            background: '#081e5c',
                            color: '#FFFFFF',
                            margin: '10px',
                            textTransform: 'capitalize',
                            float: 'right',
                        }}
                    >
                        Save
                    </Button>
                </Grid>
            </Dialog>
        </>
    )
}

export default CalendarView
