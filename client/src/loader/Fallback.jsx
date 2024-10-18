import React from 'react';
import './fallback.css'

const FallbackComp = () => {

    return (
        <div role='fallback'
            className={` main-fallback center-item`}
            style={{ backgroundColor: '#000' }}>
            <div className="outer-roll center-item ">
                <div className="inner-roll"></div>
            </div>
        </div>
    )
}

export default FallbackComp 