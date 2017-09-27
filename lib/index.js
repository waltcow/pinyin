"use strict";

const PINYIN_DICT = require("../data/dict-zi");
const Pinyin = require("./pinyin");
let PHRASES_DICT;

class NodePinyin extends Pinyin {

  // @param {String} hans 要转为拼音的目标字符串（汉字）。
  // @param {Object} options, 可选，用于指定拼音风格，是否启用多音字。
  // @return {Array} 返回的拼音列表。
  convert (hans, options) {
    if(typeof hans !== "string"){
      return [];
    }

    options = Object.assign({}, Pinyin.DEFAULT_OPTIONS, options);
    let phrases = hans;
    let pys = [];
    let nohans = "";

    for (let i = 0, firstCharCode, words, l = phrases.length; i < l; i++) {

      words = phrases[i];
      firstCharCode = words.charCodeAt(0);

      if(PINYIN_DICT[firstCharCode]){

        // ends of non-chinese words.
        if(nohans.length > 0){
          pys.push([nohans]);
          nohans = ""; // reset non-chinese words.
        }

        if (words.length === 1) {
          pys = pys.concat(super.convert(words, options));
        } else {
          pys = pys.concat(this.phrases_pinyin(words, options));
        }

      } else {
        nohans += words;
      }
    }

    // 清理最后的非中文字符串。
    if(nohans.length > 0){
      pys.push([nohans]);
      nohans = ""; // reset non-chinese words.
    }

    return pys;
  }

  // 词语注音
  // @param {String} phrases, 指定的词组。
  // @param {Object} options, 选项。
  // @return {Array}
  phrases_pinyin(phrases, options) {
    let py = [];
    if (PHRASES_DICT.hasOwnProperty(phrases)){
      //! copy pinyin result.
      PHRASES_DICT[phrases].forEach(function(item, idx){
        py[idx] = [];
        if (options.heteronym){
          item.forEach(function(py_item, py_index){
            py[idx][py_index] = Pinyin.toFixed(py_item, options.style);
          });
        } else {
          py[idx][0] = Pinyin.toFixed(item[0], options.style);
        }
      });
    } else {
      for(let i = 0, l = phrases.length; i < l; i++){
        py = py.concat(super.convert(phrases[i], options));
      }
    }
    return py;
  }
}

const pinyin = new NodePinyin(PINYIN_DICT);

module.exports = {
    convert: pinyin.convert.bind(pinyin),
    compare: pinyin.compare.bind(pinyin),
    STYLE_NORMAL: Pinyin.STYLE_NORMAL,
    STYLE_TONE: Pinyin.STYLE_TONE,
    STYLE_TONE2: Pinyin.STYLE_TONE2,
    STYLE_TO3NE: Pinyin.STYLE_TO3NE,
    STYLE_INITIALS: Pinyin.STYLE_INITIALS,
    STYLE_FIRST_LETTER: Pinyin.STYLE_FIRST_LETTER
}


