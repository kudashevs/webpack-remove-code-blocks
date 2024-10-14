/*jslint node:true */
'use strict';

const loaderUtils = require('loader-utils');

const EXCLUDE_MODES = ['development'];
const DEFAULT_LABEL = 'devblock';
const BLOCK_START = 'start';
const BLOCK_END = 'end';
const COMMENT_START = '/*';
const COMMENT_END = '*/';

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
  };
}

const defaultOptions = {
  blocks: [generateDefaultOptions(DEFAULT_LABEL)],
};

/**
 * @param {string} str
 */
function regexEscape(str) {
  return str.replace(
    /([\^|\$|\.|\*|\+|\?|\=|\!|\:|\\|\/|\(|\)|\[|\]|\{|\}])/gi,
    '\\$1'
  );
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

    // prettier-ignore
    let regex = new RegExp(
      '[\\t ]*' + prefix + ' ?' + block.start + ' ?' + suffix + '[\\s\\S]*?' + prefix + ' ?' + block.end + ' ?' + suffix + '([\\t ]*\\n)?',
      'g'
    );

    content = content.replace(regex, '');
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

module.exports = RemoveCodeBlocksLoader;
