const path = require('path')
const { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } = require('fs')

const configTemplate = require('./templates/config.template')
const generatePlugin = require('./templates/plugin.template')

const CONFIG_FILENAME = 'walle-config.json'
const configProvider = {}

configProvider.getConfig = function () {
    if (existsSync(CONFIG_FILENAME)) {
        const fileContents = readFileSync(CONFIG_FILENAME, {
            encoding: 'utf8',
            flag: 'r'
        })
        return JSON.parse(fileContents)
    }
    return configTemplate
}

configProvider.generateConfig = function () {
    const config = JSON.stringify(configTemplate, null, 2)
    writeFileSync(CONFIG_FILENAME, config)
}

configProvider.generatePlugin = function (name, description = '') {
    const plugin = generatePlugin(name, description)
    writeFileSync(`${name}_plugin.js`, plugin, { encoding: 'utf8' })
}

configProvider.saveConfig = function (config) {
    const fileContents = JSON.stringify(config, null, 2)
    writeFileSync(CONFIG_FILENAME, fileContents)
}

configProvider.installPlugin = function (pluginPath) {
    const config = configProvider.getConfig()
    if (config.plugins.includes(pluginPath)) {
        // run update plugin here
        return
    }

    console.log(`Installing plugin ${pluginPath}`)
    const plugin = require(pluginPath)
    configProvider.verifyPlugin(plugin)

    console.log(`Adding plugin ${plugin.name} to config`)
    config.options[plugin.name] = plugin.config // add plugin config to config
    config.plugins.push(pluginPath)
    config.installed[plugin.name] = pluginPath
    configProvider.saveConfig(config)
    console.log(`Plugin ${plugin.name} installed`)
}

configProvider.uninstallPlugin = function (pluginName) {
    const config = configProvider.getConfig()
    const pluginPath = config.installed[pluginName]

    console.log(`Uninstalling plugin ${pluginName}`)
    const plugin = require(pluginPath)

    console.log(`Removing plugin ${pluginName} from config`)
    config.plugins = config.plugins.filter(p => p !== pluginPath)
    delete config.options[plugin.name]
    delete config.installed[plugin.name]

    configProvider.saveConfig(config)

    console.log(`Removing plugin ${pluginName} from filesystem`)
    // delete plugin file if it exists
    if (existsSync(pluginPath)) {
        unlinkSync(pluginPath)
    }
}

configProvider.localInstall = function (pluginPath) {
    console.log(`Installing plugin from ${pluginPath}`)
    const contents = readFileSync(pluginPath, {
        encoding: 'utf8',
        flag: 'r'
    })

    console.log(`Verifying plugin ${pluginPath}`)
    // create plugin directory if it doesn't exist
    const pluginDir = path.join(__dirname, 'plugins')
    if (!existsSync(pluginDir)) {
        mkdirSync(pluginDir)
    }

    const absPath = path.join(__dirname, `./plugins/${pluginPath}`)
    writeFileSync(absPath, contents, { encoding: 'utf8' })

    configProvider.installPlugin(absPath)
}

configProvider.verifyPlugin = function (plugin) {
    if (!plugin.name) {
        throw new Error('Plugin has no name')
    }
    if (!plugin.make || typeof plugin.make !== 'function') {
        throw new Error('Plugin has no make function')
    }
    if (!plugin.make({}).functions) {
        throw new Error('Plugin has no functions')
    }
}

configProvider.listPlugins = function () {
    const config = configProvider.getConfig()
    if (!config.plugins || config.plugins.length === 0) {
        return console.log('No plugins installed')
    }
    console.log('Installed plugins:')
    config.plugins.forEach(p => {
        const plugin = require(p)
        console.log(`\t🧩 ${plugin.name} - ${plugin.description || 'No description'}`)
    })
}

// rename 'functions' to 'commands'
configProvider.loadPlugins = function (cli) {
    const config = configProvider.getConfig()
    config.plugins.forEach(p => {
        const plugin = require(p)
        const pluginCommands = plugin.make(config.options[plugin.name]).commands
        const pluginProgram = cli
            .command(plugin.name)
            .description(plugin.description || 'No description')

        pluginCommands.forEach(c => {
            const pluginCommand = pluginProgram
                .command(c.command)
                .description(c.description || 'No Description')
                .action(c.handler)

            if (c.options) {
                c.options.forEach(o => {
                    pluginCommand.option(o.name, o.description, o.default)
                })
            }
        })
    })
}

module.exports = configProvider
