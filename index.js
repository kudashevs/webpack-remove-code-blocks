/*jslint node:true */
'use strict';

var loaderUtils = require('loader-utils');

function regexEscape(str) {
	return str.replace(/([\^|\$|\.|\*|\+|\?|\=|\!|\:|\\|\/|\(|\)|\[|\]|\{|\}])/gi, '\\$1');
}

function StripBlockLoader(content) {
	var options = loaderUtils.getOptions(this);
	if (options && options.blocks) {
		options.blocks.forEach(function (block) {
			if (typeof block === 'string') {
				block = {block, suffix: '/*', end: '*/'}
			}
			let suffix = block.suffix ? regexEscape(block.suffix) : '';
			let end = block.end ? regexEscape(block.end) : '';
			var regex = new RegExp('[\\t ]*' + suffix + ' ?(' + block.block + '):start ?' + end + '[\\s\\S]*?' + suffix + ' ?\\1:end ?' + end + '[\\t ]*\\n?', 'g');
			content = content.replace(regex, '');
		});
	}

	if (this.cacheable) {
		this.cacheable(true);
	}

	return content;
}

module.exports = StripBlockLoader;
