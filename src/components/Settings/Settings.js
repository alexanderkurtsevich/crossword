import React from 'react';
import './Settings.scss';
import { TEXT } from '../constants';

const GROUPS = [1, 2, 3, 4, 5, 6]

const Settings = (props) => {
    if (!props.showSettings) {
        return null
    }
    const className = props.className
    return (
        <div className={`${className} settings`}>
            <p className='settings__text'>{TEXT.DIFFICULTY}</p>
            {
                GROUPS.map((group, index) => {
                    return (
                        <div
                            key={index}
                            className='settings__group'
                        >
                            <input
                                id={`group-${index}`}
                                name='settings'
                                type='radio'
                                onClick={() => props.onClick(index)}
                                defaultChecked={props.checked === index}
                            />

                            <label htmlFor={`group-${index}`}>
                                {group}
                            </label>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default Settings;