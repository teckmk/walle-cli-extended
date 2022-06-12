# Walle CLI

Install the CLI:

```bash
npm install walle-cli
```

## Table of Contents

-   [Features](#features)
-   [Get Started](#get-started)
-   [Commands](#commands)
-   [Plugins](#plugins)
-   [Config Structure](#config)

## Features

-   **Extendable**: Install plugins from [npm](https://www.npmjs.com/), [github](https://github.com/) or local directory.
-   **Create plugins**: Create ready to use [plugin](<https://en.wikipedia.org/wiki/Plug-in_(computing)>) with single command. And modify it to your needs.
-   **Lightweight**: [CLI](https://en.wikipedia.org/wiki/Command-line_interface) itself is very light-weight. It just provides bare essentials to manage [plugins](<https://en.wikipedia.org/wiki/Plug-in_(computing)>).
-   **Easy to use**: It is easy to use and understand. Provides a simple and intuitive interface.
-   **Powerful**: [CLI](https://en.wikipedia.org/wiki/Command-line_interface) runs in [Node](https://nodejs.org/en/) environment and a [plugin](<https://en.wikipedia.org/wiki/Plug-in_(computing)>) is simply a [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) file. It means that you can do anything that you can do in [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) with [Node](https://nodejs.org/en/).

## Get Started

Here is the quick start guide.

First of all install walle-cli:

```bash
npm install walle-cli -g
# or
yarn global add walle-cli
# or with latest npm
npm install walle-cli --location=global
```

Then open a new terminal in directory where you want to create your plugin.
And run following command.

It will generate a walle config file in current directory.

```bash
walle config
```

Now that you have a config file, you can start to create your plugin.

Run following command to create a new plugin.

```bash
walle plugin my-plugin
# you can change `my-plugin` to any name you want
```

Above command will create a new file `my-plugin.js` in current directory.

You can [edit this plugin file](#plugins) and start to write your plugin.

When you are done, you can run following command to add your plugin to walle.

```bash
walle add my-plugin
```

Above command will add your plugin to walle. Now it is ready to use.

Just run:

```bash
walle my-plugin hello john
```

You have successfully created and ran your plugin.
You can also try following:

```bash
# try to run:
walle --help
# you will see your plugin in walle commands list
# or see help of your plugin
walle my-plugin -h

# every plugin has these built-in commands:
walle my-plugin --help
walle my-plugin --version
```

## Commands

List of all available commands:

    walle config
    walle add <plugin-name>
    walle add <plugin-name> --file <plugin-file>
    walle remove <plugin-name>
    walle remove <plugin-name> --file <plugin-file>
    walle list

    walle <plugin-name>
    walle <plugin-name> <command>
    walle <plugin-name> <command> <args>
    walle <plugin-name> <command> <args> <options>

Creating config file:

```bash
walle config
```

Generating a new plugin:

```bash
walle plugin <plugin-name>

# The plugin name can be any string, but it must be unique.
# e.g.
walle plugin my-plugin
```

Installing a plugin:

```bash
# if you have installed a plugin from npm, want to use it with walle, do:
walle add <plugin-name>
# Note: `walle add` won't download anything.

# if you have created a plugin locally, using `walle plugin`, use:
walle add --file <plugin-path>

#e.g.
walle add --file ./my-plugin.js

```

Uninstalling a plugin:

```bash
# if you have installed a plugin from npm
walle remove <plugin-name>

# if you have created a plugin locally, using `walle plugin`, use:
walle remove --file <plugin-path>

#e.g.
walle remove --file ./my-plugin.js

```

Listing all installed plugins:

```bash
walle list
```

## Plugins

Every walle plugin is an object with the following properties:

```javascript
{
    name: '<plugin-name>',
    description: '<plugin-description>',
    version: '0.0.1',
    config: {}
    make: function (config){}
}
```

Custom plugin can be created by running `walle plugin` command.

Walle generates a plugin file with the following structure:

```javascript
const plugin = {
    name: '<plugin-name>',
    description: '<plugin-description>',
    version: 'x.x.x',
    cliVersion: 'x.x.x'
}

plugin.config = {
    greeting: 'Hello'
}

plugin.make = config => {
    const helloCmd = {
        command: 'hello <name>',
        handler: function (name, options, command) {
            const greeting = config.greeting || 'Hi'
            console.log(config.greeting, name)

            if (options.age && +options.age > 18) {
                console.log('you are adult')
            } else {
                console.log('you are not adult, are you?')
            }
        },
        options: [
            {
                name: '-a, --age <age>',
                description: 'Your age'
            }
        ]
    }

    return {
        commands: [helloCmd]
    }
}

module.exports = plugin
```

Let's explore the plugin file step by step:  
**1.** Plugin information:

```javascript
const plugin = {
    // name of the plugin that will be used to access it
    // and in the config file
    // i.e. `walle <plugin-name> some-command`
    name: '<plugin-name>',

    // description of the plugin
    // will be shown in the help
    description: '<plugin-description>',

    // version of the plugin
    // can be viewed with `walle <plugin-name> --version`
    version: '0.0.1',

    // version of the walle-cli
    // used to check if the plugin is compatible with the walle-cli
    cliVersion: '1.0.0'
}
```

**2.** Plugin's default config:

```javascript
// default config for the plugin, it will be append to the cli config file
// it will get passed to the plugin's `make` function
plugin.config = {
    greeting: 'Hello'
}
```

**3.** Plugin's `make` function:

```javascript
// every walle plugin must have a `make` function that returns an object
plugin.make = config => {
    const helloCmd = {}

    // `make` function must return an object containing commands property
    // you can add as many commands as you want
    return {
        commands: [helloCmd]
    }
}
```

**4.** Plugin's commands:

A plugin command is an object with the following properties:

-   `command`: name of the command and its arguments
-   `handler`: function that will be executed when the command is called
-   `options`: array of options that will be available for the command

`command`:

```javascript
const helloCmd = {
    command: 'hello <name>'
    //...
}

// usage:
// walle <plugin-name> <command> <args>

// i.e.
// walle greeter hello john

// An argument can be <required> or [optional]
// Use `<` and `>` to mark required arguments
// Use `[` and `]` to mark optional arguments
```

`handler`:

A plugin command handler is a function that will be executed when the command is called. It receives command's `arguments` and `options` as well as the `command` itself.

```javascript
const helloCmd = {
    //...
    handler: function (name, options, command) {
        // code
    }
    //...
}
```

If the command has multiple arguments, they will be passed to handler one by one before the options.
e.g.

```javascript
//...
handler: function(arg1, arg2,..., options, command)
//...
```

`options`:

`options` is an array of objects with the following properties:

-   `name`: alias, name and args of the option i.e. `-a, --age <age>`
-   `description`: description of the option

## Config Structure

You can create a config file by running `walle config`.

Config file structure:

```json
{
    "plugins": [],
    "installed": {},
    "options": {}
}
```
