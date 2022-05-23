import * as React from 'react'
import { styled, alpha } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import Badge from '@mui/material/Badge'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LogoutIcon from '@mui/icons-material/Logout'
import { Grid } from '@material-ui/core'
import { useNavigate } from 'react-router-dom'

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}))

export default function PrimarySearchAppBar() {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)
    const isMenuOpen = Boolean(anchorEl)
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
    const client = localStorage.getItem('client')
    const navigate = useNavigate()
    const [user, setUser] = React.useState(
        JSON.parse(localStorage.getItem('user'))
    )

    React.useEffect(() => {
        console.log(JSON.parse(localStorage.getItem('user')))
        setUser(JSON.parse(localStorage.getItem('user')))
    }, [])

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        handleMobileMenuClose()
    }

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget)
    }

    const menuId = 'primary-search-account-menu'
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    )

    const mobileMenuId = 'primary-search-account-menu-mobile'
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
        </Menu>
    )

    return (
        <AppBar
            position="sticky"
            style={{ color: '#ffffff', backgroundColor: '#3f50b5' }}
        >
            <Toolbar>
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    <Grid item xs={'auto'}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            style={{ cursor: 'pointer', marginLeft: 50 }}
                            onClick={() => navigate('/')}
                        >
                            {client ? client : 'HRDSP'}
                        </Typography>
                    </Grid>
                    {JSON.parse(localStorage.getItem('user')) && (
                        <Grid item xs justifyContent="flex:end">
                            <Typography
                                variant="h6"
                                noWrap
                                component="span"
                                style={{ cursor: 'pointer', marginLeft: 50 }}
                                onClick={() => navigate('/jobs')}
                            >
                                Jobs
                            </Typography>
                            <Typography
                                variant="h6"
                                noWrap
                                component="span"
                                style={{ cursor: 'pointer', marginLeft: 50 }}
                                onClick={() => navigate('/candidates')}
                            >
                                Candidates
                            </Typography>
                            {user.role.isManager && (
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="span"
                                    style={{
                                        cursor: 'pointer',
                                        marginLeft: 50,
                                    }}
                                    onClick={() =>
                                        navigate('/managers/employees')
                                    }
                                >
                                    My Employees Candidates
                                </Typography>
                            )}

                            <Typography
                                variant="h6"
                                noWrap
                                component="span"
                                style={{ cursor: 'pointer', marginLeft: 50 }}
                                onClick={() => navigate('/employees')}
                            >
                                Employees
                            </Typography>
                            <Typography
                                variant="h6"
                                noWrap
                                component="span"
                                style={{ cursor: 'pointer', marginLeft: 50 }}
                                onClick={() => navigate('/settings')}
                            >
                                Settings
                            </Typography>
                        </Grid>
                    )}
                    {JSON.parse(localStorage.getItem('user')) && (
                        <Grid item xs={1} style={{ float: 'right' }}>
                            <Box sx={{ display: { md: 'flex' } }}>
                                <IconButton
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                    <LogoutIcon
                                        onClick={() => {
                                            localStorage.removeItem('token')
                                            localStorage.removeItem('client')
                                            localStorage.removeItem('user')
                                            navigate('/')
                                        }}
                                    />
                                </IconButton>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Toolbar>
        </AppBar>
    )
}
