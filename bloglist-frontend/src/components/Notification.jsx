import PropTypes from 'prop-types'

export default function Notification ({  message }){
    console.log(message)
    
    return (
        <div style={{ backgroundColor: 'grey', border: '1px solid red', borderRadius: '10px', textAlign: 'center' }}>
            <p style={{ color: 'darkred' }}>{message}</p>
        </div>
    )
}

Notification.propTypes = {
    message: PropTypes.string.isRequired
} 