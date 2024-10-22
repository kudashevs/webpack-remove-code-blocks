/*jslint node:true */
'use strict';

const loaderUtils = require('loader-utils');
const os = require('os');

const EXCLUDE_MODES = ['development'];
const DEFAULT_LABEL = 'devblock';
const BLOCK_START = 'start';
const BLOCK_END = 'end';
const COMMENT_START = '/*';
const COMMENT_END = '*/';

const defaultOptions = {
  blocks: [generateDefaultOptions(DEFAULT_LABEL)],
};

/**
 * @param {string} label
 *
 * @return {object}
 */
function generateDefaultOptions(label) {
  return {
    start: `${label}:${BLOCK_START}`,
    end: `${label}:${BLOCK_END}`,
    prefix: COMMENT_START,
    suffix: COMMENT_END,
    replacement: null,
  };
}

/**
 * @param {string} content
 *
 * @return {string}
 */
function RemoveCodeBlocksLoader(content) {
  if (shouldSkip(process.env.NODE_ENV)) {
    return content;
  }

  const options = loaderUtils.getOptions(this) || defaultOptions;

  options.blocks.forEach(function (block) {
    if (typeof block === 'string') {
      block = generateDefaultOptions(block);
    }

    let prefix = block.prefix ? regexEscape(block.prefix) : '';
    let suffix = block.suffix ? regexEscape(block.suffix) : '';
    let start = regexEscape(block.start);
    let end = regexEscape(block.end);

    // prettier-ignore
    let regex = new RegExp(
      '([\\t ]*)' + prefix + '[\\t ]* ?' + start + '[\\t ]* ?' + suffix + '([\\s\\S]*)?' + prefix + '[\\t ]* ?' + end + '[\\t ]* ?' + suffix + '([\\t ]*)\\n?',
      'g'
    );

    content = content.replace(regex, (substring, prespace, content, postspace) => {
      if (hasReplacement(block)) {
        if (hasNewLine(content)) {
          let trailingSpaces = content.match(/\*?([ \t]*)$/g)[0] || '';
          return trailingSpaces + block.replacement + os.EOL;
        }

        return block.replacement;
      }

      return hasNewLine(content) ? '' : prespace + postspace;
    });
  });

  if (this.cacheable) {
    this.cacheable(true);
  }

  return content;
}

/**
 * @param {string} mode
 *
 * @return {boolean}
 */
function shouldSkip(mode) {
  return EXCLUDE_MODES.includes(mode);
}

/**
 * @param {string} str
 */
function regexEscape(str) {
  return str.replace(/([\^$.*+?=!:\\\/()\[\]{}])/gi, '\\$1');
}

/**
 * @param block
 *
 * @returns {boolean}
 */
function hasReplacement(block) {
  return Object.prototype.hasOwnProperty.call(block, 'replacement') && block.replacement !== null;
}

/**
 * @param {string} str
 *
 * @returns {boolean}
 */
function hasNewLine(str) {
  return /\r|\n/.test(str);
}

module.exports = RemoveCodeBlocksLoader;
