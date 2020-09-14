import React, { Component } from 'react';
import './CrossWord.scss'
import GameField from './GameField/GameField';
import Header from './Header/Header';
import Settings from './Settings/Settings';
import loaderImage from '../assets/img/loader-blue.svg';
import StartScreen from './StartScreen/StartScreen';
import Results from './Results/Results';
import Words from './data/Words'
import { TEXT } from './constants';

const LEVEL_NUMBERS = {
    MIN: 0,
    MAX: 59,
}

export default class CrossWord extends Component {
    state = {
        mainWordData: {},
        subWordsData: [],
        isLoaded: false,
        inputValues: [],
        mainWordValues: [],
        mainWord: '',
        isMainCorrect: false,
        group: +localStorage.groupCW || 0,
        countOfCorrect: 0,
        showStartScreen: true,
        showResults: false,
        showSettings: true,
    }

    getRandomWords = async () => {
        const randomLevel = Math.floor(
            LEVEL_NUMBERS.MIN + Math.random() * (LEVEL_NUMBERS.MAX + 1 - LEVEL_NUMBERS.MIN)
        );

        const wordsData = await Words.getAllWords({
            group: this.state.group,
            page: randomLevel,
            wordsPerExampleSentenceLTE: 99,
            wordsPerPage: 10,
        })

        return wordsData
    }

    startNewGame = async () => {
        this.setState({
            isLoaded: false,
            showResults: false,
            countOfCorrect: 0,
        })

        const dataForMainWord = await this.getRandomWords()
        const mainWordData = await this.getMainWordData(dataForMainWord);
        const mainWord = mainWordData.word.toLowerCase();
        const inputValues = {};
        const subWordsData = [];
        const reg = /<i>\w*<\/i>/;
        const mainWordLetters = mainWord.split('').map((letter, index) => {
            return {
                letter,
                id: index
            }
        });


        while (mainWordLetters.length) {
            const dataForSubWords = await this.getRandomWords();
            for (let index = 0; index < mainWordLetters.length; index += 1) {
                const letter = mainWordLetters[index].letter;
                for (let i = dataForSubWords.length - 1; i >= 0; i -= 1) {
                    const subWordData = dataForSubWords[i];
                    const word = subWordData.word.toLowerCase();
                    const mainLetterIndex = word.indexOf(letter)

                    if (mainLetterIndex > 0 && word.length <= 10) {
                        const mainWordLetterIndex = mainWordLetters[index].id;
                        const question = subWordData.textMeaning;
                        const questionWithHiddenWord = question.replace(reg, `<b>?</b>`);

                        const propsForSubWordData = {
                            word,
                            letter,
                            letterId: mainWordLetterIndex,
                            mainLetterId: mainLetterIndex,
                            isCorrect: false,
                            know: true,
                            hidden: { __html: questionWithHiddenWord },
                            showed: { __html: question },
                        }
                        Object.assign(subWordData, propsForSubWordData);

                        subWordsData.push(subWordData);
                        inputValues[word] = [...new Array(word.length)];
                        mainWordLetters.splice(index, 1);
                        dataForSubWords.splice(i, 1);

                        index--;
                        break;
                    }
                }
            }
        }
        subWordsData.sort((a, b) => a.letterId - b.letterId);
        const mainQuestionWithHiddenWord = mainWordData.textMeaning.replace(reg, '<b>?</b>');
        mainWordData.know = true;
        mainWordData.hidden = { __html: mainQuestionWithHiddenWord }
        const mainWordValues = [...new Array(mainWord.length)]

        this.setState({
            mainWordData,
            subWordsData,
            inputValues,
            isLoaded: true,
            isMainCorrect: false,
            mainWordValues,
            mainWord,
        })
    }

    getMainWordData = (wordsData) => {
        const sortedData = wordsData.sort((a, b) => a.word.length - b.word.length);
        const filteredWords = sortedData.filter(data => data.word.length > 4);
        const mainWordData = filteredWords[0];
        return mainWordData;
    }

    onChangeInput = async (event, word, index, letterId, mainLetter) => {
        const inputValues = this.state.inputValues;
        inputValues[word].splice(index, 1, event.target.value)
        this.setState({
            inputValues
        })
        if (event.target.value === mainLetter) {
            const mainWordValues = this.state.mainWordValues;
            mainWordValues.splice(letterId, 1, event.target.value);
            const isMainCorrect = mainWordValues.join('') === this.state.mainWord;
            this.setState({
                mainWordValues,
                isMainCorrect,
            })
        }
        if (this.state.subWordsData[letterId].word === this.state.inputValues[word].join('').toLowerCase()) {
            const subWordsData = this.state.subWordsData;
            subWordsData[letterId].isCorrect = true;
            let countOfCorrect = this.state.countOfCorrect + 1;
            this.setState({ countOfCorrect })
            if (countOfCorrect === this.state.mainWord.length) {
                this.setState({ showResults: true })
            }
        }
    }

    settingsClickHandler = async (index) => {
        await this.setState({ group: index });
        localStorage.groupCW = index;
        this.startNewGame();
    }

    idkClickHandler = (index) => {
        if (index || index === 0) {
            const data = [...this.state.subWordsData];
            const currentData = data[index];
            currentData.know = false;
            this.setState({ subWordsData: data });
        }
        else {
            const data = { ...this.state.mainWordData };
            data.know = false;
            this.setState({ mainWordData: data })
        }
    }

    closeStartScreen = () => {
        this.setState({ showStartScreen: false })
        this.startNewGame();
    }

    render() {
        return (
            this.state.showStartScreen
                ? <StartScreen
                    onClick={this.closeStartScreen}
                    showStartScreen={this.state.showStartScreen}
                />
                : <div className='crossword'>
                    <Header
                        className='crossword__header'
                    />
                    <Settings
                        showSettings={this.state.showSettings}
                        className='crossword__difficulty'
                        onClick={this.settingsClickHandler}
                        checked={this.state.group}
                    />
                    {
                        this.state.isLoaded
                            ?
                            <React.Fragment>
                                <GameField
                                    className='crossword__game-field'
                                    mainWordData={this.state.mainWordData}
                                    subWordsData={this.state.subWordsData}
                                    onChange={this.onChangeInput}
                                    isMainCorrect={this.state.isMainCorrect}
                                    inputValues={this.state.inputValues}
                                />
                                <div className='crossword__questions'>
                                    <h3>{TEXT.QUESTIONS.HEADING}</h3>
                                    {
                                        this.state.subWordsData.map((data, index) => {
                                            return (
                                                <p
                                                    key={index}
                                                >
                                                    {index + 1}.&nbsp;
                                                    {
                                                        data.know
                                                            ? <span>
                                                                <span dangerouslySetInnerHTML={data.hidden}></span>
                                                            &nbsp;&nbsp;
                                                            <span
                                                                    className='crossword__idk'
                                                                    onClick={() => this.idkClickHandler(index)}
                                                                >&nbsp;{TEXT.QUESTIONS.HINT}</span>
                                                            </span>
                                                            : <span dangerouslySetInnerHTML={data.showed}></span>
                                                    }
                                                </p>
                                            )
                                        })
                                    }
                                    <h4>{TEXT.QUESTIONS.MAIN_WORD}</h4>
                                    <p dangerouslySetInnerHTML={this.state.mainWordData.hidden}></p>
                                </div>

                            </React.Fragment>

                            : <div className='crossword__loading'>
                                <img src={loaderImage} alt='Loading...'></img>
                            </div>
                    }

                    <button
                        onClick={this.startNewGame}
                        className='crossword__new-game-button'
                    >
                        {TEXT.BUTTONS.NEW_GAME}
                    </button>

                    <Results
                        onClick={this.startNewGame}
                        showResults={this.state.showResults}
                        data={this.state.subWordsData}
                        mainWord={this.state.mainWord}
                    />

                </div>

        )
    }
}