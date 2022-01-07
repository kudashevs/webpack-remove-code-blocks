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
				block = {block, prefix: '/*', suffix: '*/'}
			}
			let prefix = block.prefix ? regexEscape(block.prefix) : '';
			let suffix = block.suffix ? regexEscape(block.suffix) : '';
			var regex = new RegExp('[\\t ]*' + prefix + ' ?(' + block.block + '):start ?' + suffix + '[\\s\\S]*?' + prefix + ' ?\\1:end ?' + suffix + '[\\t ]*\\n?', 'g');
			content = content.replace(regex, '');
		});
	}

	if (this.cacheable) {
		this.cacheable(true);
	}

	return content;
}

module.exports = StripBlockLoader;
