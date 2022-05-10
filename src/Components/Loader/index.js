import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

export default function Loader({ loading }) {
    return (
        <div>
            <Backdrop style={{ color: '#fff', zIndex: 35001 }} open={loading}>
                <CircularProgress
                    style={{ color: '#3f50b5' }}
                    thickness={3}
                    size={50}
                />
            </Backdrop>
        </div>
    )
}
