import WordModel from '../models/WordModel';
import DataHelper from './DataHelper';
import { serverPath } from './dataConstants';

const errorMessage = 'Words';

export default class Words {
  /**
   * Get word by id
   * @param {string} wordId - wordId
   * @returns {WordModel} word
   *
   */
  static getWordById = async (wordId) => {
    const url = `${serverPath}/words/${wordId}`;
    const data = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    const message = `${errorMessage}. WordId: ${wordId}`;
    const response = await DataHelper.makeRequest(url, data, message);
    return new WordModel(response);
  };

  /**
   * Get all words according to the query
   *  @param {string} group  - group number
   *  @param {string} page - page in the group
   *  @param {string} wordsPerExampleSentenceLTE - words per example sentence(less then equal to)
   *  @param {string} wordsPerPage - words per page, works only if wordsPerExampleSentenceLTE is specified. Equals 10 by default
   * @returns {[]} array of words {WordModel}
   *
   */
  static getAllWords = async ({
    group = 0,
    page = 0,
    wordsPerExampleSentenceLTE,
    wordsPerPage,
  }) => {
    const wordsPerExampleSentenceLTEString = wordsPerExampleSentenceLTE
      ? `&wordsPerExampleSentenceLTE=${wordsPerExampleSentenceLTE}`
      : '';
    const wordsPerPageString =
      wordsPerExampleSentenceLTE && wordsPerPage
        ? `&wordsPerPage=${wordsPerPage}`
        : '';

    const url = `${serverPath}/words/?group=${group}&page=${page}${wordsPerExampleSentenceLTEString}${wordsPerPageString}`;
    const data = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    const response = await DataHelper.makeRequest(url, data, errorMessage);
    return response.map((element) => new WordModel(element));
  };

  /**
   * Get words count
   *  @param {string} group  - group number
   *  @param {string} wordsPerExampleSentenceLTE - words per example sentence(less then equal to)
   *  @param {string} wordsPerPage - words per page, works only if wordsPerExampleSentenceLTE is specified. Equals 10 by default
   * @returns {number} words count
   *
   */
  static getWordsCount = async ({
    group = 0,
    wordsPerExampleSentenceLTE,
    wordsPerPage,
  }) => {
    const wordsPerExampleSentenceLTEString = wordsPerExampleSentenceLTE
      ? `&wordsPerExampleSentenceLTE=${wordsPerExampleSentenceLTE}`
      : '';
    const wordsPerPageString =
      wordsPerExampleSentenceLTE && wordsPerPage
        ? `&wordsPerPage=${wordsPerPage}`
        : '';

    const url = `${serverPath}/words/count?group=${group}${wordsPerExampleSentenceLTEString}${wordsPerPageString}`;
    const data = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    const response = await DataHelper.makeRequest(url, data, errorMessage);
    return response.count;
  };
}
