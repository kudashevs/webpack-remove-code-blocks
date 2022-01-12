/*jslint node:true */
'use strict';

const loaderUtils = require('loader-utils');

const defaultOptions = {
  blocks: [
    {
      start: 'devblock:start',
      end: 'devblock:end',
      prefix: '/*',
      suffix: '*/',
    },
  ],
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
 * @returns {string}
 */
function RemoveCodeBlocksLoader(content) {
  const options = loaderUtils.getOptions(this) || defaultOptions;

  options.blocks.forEach(function (block) {
    if (typeof block === 'string') {
      block = {
        start: block + ':start',
        end: block + ':end',
        prefix: '/*',
        suffix: '*/',
      };
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

module.exports = RemoveCodeBlocksLoader;
