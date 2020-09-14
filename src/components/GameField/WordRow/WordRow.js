import React from 'react';
import './WordRow.scss';

const WordRow = (props) => {
    const inputRefs = {};
    const mainLetterId = props.data.mainLetterId;
    const isMainWordCorrect = props.isMainCorrect;
    const wordLength = props.data.word.length;
    const pivot = props.pivot
   
    const onChangeInput = (event, index) => {
        const nextIsMainLetter = index + 1 === mainLetterId;
        const isMainLetterLast = mainLetterId === props.length - 1;
        const isInputEmpty = event.target.value === '';
        const inputIsLast = index === props.length - 1

        if (nextIsMainLetter && !isMainLetterLast && !isInputEmpty && isMainWordCorrect) {
            inputRefs[`${props.data.word}-${index + 2}`].focus()
        }
        else if (!inputIsLast && !isInputEmpty) {
            inputRefs[`${props.data.word}-${index + 1}`].focus()
        }
    }

    const onBackspacePress = (event, index) => {
        const isBackspace = event.key === 'Backspace';
        const isFirstInput = index === 0;
        const isMainLetterFirst = mainLetterId === 0;
        const prevIsMainLetter = index - 1 === mainLetterId;
        const isInputEmpty = event.target.value === '';

        if (isBackspace && isMainWordCorrect && !isMainLetterFirst && prevIsMainLetter && isInputEmpty) {
            inputRefs[`${props.data.word}-${index - 2}`].focus()
        }
        else if (isBackspace && !isFirstInput && isInputEmpty) {
            inputRefs[`${props.data.word}-${index - 1}`].focus()
        }
    }

    const columnStart = pivot - mainLetterId;
    const columnEnd = columnStart + wordLength;

    const wordRowStyle = {
        gridColumn: `${columnStart}/${columnEnd}`,
        gridRow: `${1 + props.id}/${props.id + 2}`,
    }

    const isCorrect = props.data.isCorrect;

    return (
        <div
            className='word-row'
            style={wordRowStyle}
        >
            <span className='word-row__number'>{props.id + 1}</span>
            {
                [...new Array(props.length)].map((el, index) => {
                    const isMain = index === mainLetterId;
                    const itsMainCorrect = props.isMainCorrect && isMain
                    const mainLetterStyle = (isMain)
                        ? { border: '2px solid #00a6c4' }
                        : null;
                    const correctStyle = isCorrect
                        ? { backgroundColor: 'rgb(0, 208, 145)' }
                        : null;
                    const mainCorrectStyle = (isMain && isCorrect)
                        ? { backgroundColor: 'rgb(0, 208, 145)' }
                        : isMain && isMainWordCorrect
                            ? { backgroundColor: 'rgb(0, 208, 145)' }
                            : null;

                    return (
                        <input
                            style={{ ...correctStyle, ...mainLetterStyle, ...mainCorrectStyle }}
                            maxLength='1'
                            key={index}
                            type='text'
                            ref={input => inputRefs[`${props.data.word}-${index}`] = input}
                            onChange={(event) => {
                                props.onChange(event, props.data.word, index, props.data.letterId, props.data.letter);
                                onChangeInput(event, index);
                            }
                            }
                            value={props.inputValue[index]}
                            onKeyDown={(event) => onBackspacePress(event, index)}
                            readOnly={isCorrect || itsMainCorrect}
                        >
                        </input>
                    )
                })
            }
        </div>
    )
}
export default WordRow;