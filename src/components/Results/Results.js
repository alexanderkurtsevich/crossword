import React from 'react';
import './Results.scss';
import BlockWindow from '../BlockWindow/BlockWindow';
import { TEXT } from '../constants';

const Results = (props) => {
    const showResults = props.showResults;
    const mainWord = props.mainWord;
    let correctWords = [];
    let incorrectWords = [];
    props.data.forEach(data => {
        if (data.know) {
            correctWords.push(data.word)
        }
        else {
            incorrectWords.push(data.word)
        }
    });

    return (
        showResults
            ?
            <BlockWindow>
                <div className='results'>
                    <h2>{TEXT.RESULTS.HEADING}</h2>
                    <h5>{TEXT.RESULTS.MAIN_WORD}</h5>
                    <p className='results__words results__words_main'>{mainWord}</p>
                    <hr />
                    <div className='results__heading-wrap'>
                        <h5>{TEXT.RESULTS.KNOW}</h5>
                        <p className='results__counter results__counter_correct'>{correctWords.length}</p>
                    </div>
                    <p className='results__words'>{correctWords.join(', ')}</p>
                    <hr />
                    <div className='results__heading-wrap'>
                        <h5>{TEXT.RESULTS.DONT_KNOW}</h5>
                        <p className='results__counter results__counter_incorrect'>{incorrectWords.length}</p>
                    </div>
                    <p className='results__words'>{incorrectWords.join(', ')}</p>
                    <button
                        onClick={props.onClick}
                        className='crossword__new-game-button'
                    >
                        {TEXT.BUTTONS.NEW_GAME}
                    </button>
                </div>
            </BlockWindow>
            : null
    )
}
export default Results;