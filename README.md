Webpack Remove Code Blocks ![test workflow](https://github.com/kudashevs/webpack-remove-code-blocks/actions/workflows/run-tests.yml/badge.svg)
==========================

This Webpack Remove Code Blocks package was originated from [Webpack Remove Block](https://github.com/ee01/webpack-remove-blocks). 

This is a webpack loader that can remove blocks of code marked with special tags in comments. It can be incorporated into
the build process to remove the code that you don't want to see in production. The loader supports multiple block types.

The key difference from the original loader is that the syntax is not limited only with `:start` and `:end` markers.

## Usage

As a usage example let's look at the situation when we need to remove some code from a bundle. To do that we need to mark
this code somehow, and the less painful way to do that is to use comments. So, in places where we need to remove the code
from our js files let's add the comments with the specific syntax `devblock:start` and `devblock:end`:
```javascript
/* devblock:start */
console.log('something not for production');
/* devblock:end */
```

Then, we need to update our webpack configuration with the loader:

```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|\.spec\.js)/,
                use: [
                    {
                        loader: 'webpack-remove-code-blocks',
                    },
                ],
            },
        ],
    },
};
```

After a bundling process this `console.log` code in the comments block will be removed (the comments will be removed too).

## Advanced usage

Let's suppose, that we have a more sophisticated case, which includes lots of blocks to be removed. That is not a problem.
The only thing we need to do is to update the webpack configuration with the specific options.

```javascript
/* debug:start */
console.log('debug');
/* debug:end */
var makeFoo = function(bar, baz) {
    // The following code will be removed with the loader
    /* devblock:start */
    if (bar instanceof Bar !== true) {
        throw new Error('makeFoo: bar param is required and must be instance of Bar');
    }
    /* devblock:end */

    /* devblock_start */
    if (baz instanceof Baz !== true) {
        throw new Error('makeFoo: baz param is required and must be instance of Baz');
    }
    /* devblock_end */

    // This code will remain
    return new Foo(bar, baz);
}
```

Then, we need to update our webpack configuration with the specific options and the loader:

```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|\.spec\.js)/,
                use: [
                    {
                        loader: 'webpack-remove-code-blocks',
                        options: {
                            blocks: [
                                'debug',
                                'devblock',
                                {
                                    start: 'devblock_start',
                                    end: 'devblock_end',
                                    prefix: '/*',
                                    suffix: '*/',
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    },
};
```

After a bundling process we will get the following result:

```javascript
var makeFoo = function(bar, baz) {
    // The following code will be removed with the loader


    // This code will remain
    return new Foo(bar, baz);
}
```

## Options

These are some moments that are worth knowing about options. The options must include the `blocks` array.
This array includes information about all comment blocks that we want to remove. Each block could be represented
by a string or by an object with the following fields:
```
prefix: '/*',                   # a string value which denotes the start of a comment
suffix: '*/',                   # a string value which denotes the end of a comment
start: 'dev_start',             # a string value which denotes a comment content for the block start
end: 'dev_end',                 # a string value which denotes a comment content for the block end
```

However, if you don't want to type all this stuff you can use a string value, which will be converted to the block option.
For example, the string `block` will be converted into the object with the following fields:
```
prefix: '/*',
suffix: '*/',
start: 'block:start',
end: 'block:end',
```

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
