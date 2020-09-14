import React from 'react';
import './GameField.scss';
import WordRow from './WordRow/WordRow';


const GameField = (props) => {
    const countOfRows = props.mainWordData.word.length

    let prePivot = 0;
    let postPivot = 0;

    props.subWordsData.forEach(data => {
        const mainLetterId = data.mainLetterId;
        const wordLength = data.word.length;

        if (mainLetterId > prePivot) {
            prePivot = mainLetterId;
        }
        if (wordLength - mainLetterId - 1 > postPivot) {
            postPivot = wordLength - mainLetterId - 1;
        }
    })

    const countOfColumns = prePivot + postPivot + 1;

    const gameFieldStyle = {
        gridTemplateRows: '40px '.repeat(countOfRows),
        gridTemplateColumns: '40px '.repeat(countOfColumns),
    }

    const pivot = prePivot + 1;

    return (
        <div className='game-field-wrap'>
            <div
                className={`${props.className} game-field`}
                style={gameFieldStyle}
            >
                {
                    props.subWordsData.map((data, index) => {
                        return (
                            <WordRow
                                key={data.letterId}
                                length={data.word.length}
                                id={data.letterId}
                                data={data}
                                onChange={props.onChange}
                                isMainCorrect={props.isMainCorrect}
                                inputValue={props.inputValues[data.word]}
                                pivot={pivot}
                            />
                        )
                    })
                }
            </div>
        </div>

    )
}
export default GameField;