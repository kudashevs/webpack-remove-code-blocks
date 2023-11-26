Webpack Remove Code Blocks ![test workflow](https://github.com/kudashevs/webpack-remove-code-blocks/actions/workflows/run-tests.yml/badge.svg)
==========================

This Webpack Remove Code Blocks package was originated from [Webpack Remove Block](https://github.com/ee01/webpack-remove-blocks). 

This is a webpack loader that can remove blocks of code marked with special tags in comments. It can be incorporated into
the build process to remove the code that you don't want to see in production. The loader supports multiple block types.

The key difference from the original loader is that the syntax is not limited only with `:start` and `:end` markers.

## Usage example

Let's start with a simple usage example. For example, we want to remove some code from a bundle while we build a project.
To do that, we need to take a few simple steps.

Firstly, we need to add the loader and some additional settings to our webpack configuration: 
```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,                                              // files we want to procces
                exclude: /(node_modules|bower_components|\.spec\.js)/,      // files we want to exclude
                use: [
                    {
                        loader: 'webpack-remove-code-blocks',               // use the loader
                    },
                ],
            },
        ],
    },
};
```

Then, we can mark unwanted blocks of code in our `.js` files using comments with the special syntax `devblock:start` and `devblock:end`:
```javascript
/* devblock:start */
console.log('something not for production');
/* devblock:end */
```

After the bundling process, the marked blocks will be removed (the comments will be removed too).

## Advanced usage example

Let's suppose, that we have a more sophisticated task. We want to use different labels (we might want to keep some code
in staging, but not in the production environment) and process different file extensions. That's not a problem.

The only thing we need to do is to provide some additional settings to our webpack configuration:
```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.js|\.ts|\.tsx$/,                                   // files we want to procces
                exclude: /(node_modules|bower_components|\.spec\.js)/,      // files we want to exclude
                use: [
                    {
                        loader: 'webpack-remove-code-blocks',               // use the loader
                        options: {
                            blocks: [                                       // define three different blocks
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

Let's now build our project with this code inside:
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

After the bundling process, the result will be as follows:
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
