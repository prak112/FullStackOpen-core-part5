import { useState } from "react"
import PropTypes from "prop-types"

export default function ToggleContent({ showButtonLabel, children, hideButtonLabel }){
    const [isVisible, setIsVisible] = useState(false);
    
    const showWhenIsVisible = { display: isVisible ? "" : "none" };
    const hideWhenIsNotVisible = { display: isVisible ? "none" : "" };
    const buttonStyle = { background: 'violet', color: 'black', borderRadius: '5px' }

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    }

    return (
        <div>
            <div style={hideWhenIsNotVisible}>
                <button style={buttonStyle}  onClick={toggleVisibility}>{showButtonLabel}</button>
            </div>
            <div className="hidden-content" style={showWhenIsVisible}>
                {children}
                <button style={buttonStyle} onClick={toggleVisibility}>{hideButtonLabel}</button>
            </div>
        </div>
    );
}

ToggleContent.propTypes = {
    showButtonLabel: PropTypes.string,
    children: PropTypes.node,
    hideButtonLabel: PropTypes.string
}


