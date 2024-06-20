import PropTypes from 'prop-types'

export default  function Notification({ message, type }) {

    const successStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        marginBottom: 10, 
        textAlign: 'center'
    }
    const failStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        marginBottom: 10, 
        textAlign: 'center'
    }
    if (message === null) {
        return null
    }
    else{
        const notificationStyle = type === 'success' ? successStyle : failStyle
        return(
            <>
            <div data-testid="notification" style={notificationStyle}>
                {message}
            </div>
            </>
        )
    }        
}


Notification.propTypes = {
    message: PropTypes.string,
    type: PropTypes.string
} 