import React from 'react';
import './BlockWindow.scss'

const BlockWindow = (props) => {

    return (
        <React.Fragment>
            <div className='block-window'></div>
            {props.children}
        </React.Fragment>


    )
}
export default BlockWindow;