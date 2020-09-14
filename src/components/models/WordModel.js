// path to data repository
import {repoPath} from '../data/dataConstants';

const wordDifficulty =  {
  weak: 'weak',
  medium: 'medium',
  strong: 'strong',
}
Object.freeze(wordDifficulty);

export { wordDifficulty };

export default class WordModel {
  constructor({
    id,
    group,
    page,
    word,
    image,
    audio,
    audioMeaning,
    audioExample,
    textMeaning,
    textExample,
    transcription,
    wordTranslate,
    textMeaningTranslate,
    textExampleTranslate,    
    wordsPerExampleSentence
  }) {
    this.id = id;
    this.group = group; 
    this.page = page;
    this.word = word;   
    this.imagePath = WordModel.correctPath(image);
    this.audioPath = WordModel.correctPath(audio);
    this.audioMeaningPath = WordModel.correctPath(audioMeaning);
    this.audioExamplePath = WordModel.correctPath(audioExample);
    this.textMeaning = textMeaning;
    this.textExample = textExample;
    this.transcription = transcription;
    this.wordTranslate = wordTranslate;
    this.textMeaningTranslate = textMeaningTranslate;
    this.textExampleTranslate = textExampleTranslate;
    this.wordsPerExampleSentence = wordsPerExampleSentence;
  }

  static correctPath(path) {
    return `${repoPath}/${path}`;
  }
}
