import { useState } from "react"
import PropTypes from "prop-types"

export default function ToggleContent({ buttonLabel, children }){
    const [isVisible, setIsVisible] = useState(false);

    const showWhenIsVisible = { display: isVisible ? "" : "none" };
    const hideWhenIsVisible = { display: isVisible ? "none" : "" };

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    }

    return (
        <div>
            <div style={hideWhenIsVisible}>
                <button onClick={toggleVisibility}>{buttonLabel}</button>
            </div>
            <div style={showWhenIsVisible}>
                {children}
                <button onClick={toggleVisibility}>Cancel</button>
            </div>
        </div>
    );
}

ToggleContent.propTypes = {
    buttonLabel: PropTypes.string,
    children: PropTypes.node
}

// Usage
// <ToggleContent buttonLabel="Show Content">
//     <Content />
// </ToggleContent>
