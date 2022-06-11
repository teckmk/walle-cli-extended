#!/usr/bin/env node

const { Command } = require('commander')

const configProvider = require('./config.provider')

const walleCLI = new Command('walle')

walleCLI.version('1.0.0')
walleCLI.description('Configurable CLI, that can be extended with plugins')

// command to generate config file
walleCLI
    .command('config')
    .description('Generates config file')
    .action(() => {
        configProvider.generateConfig()
    })

// command to generate plugin templates
walleCLI
    .command('plugin <name>')
    .description('Generates plugin template')
    .action(name => {
        configProvider.generatePlugin(name)
    })

walleCLI
    .command('install <pluginPath>')
    .option('--file', 'Installs plugin from file')
    .description('Installs plugin')
    .action((pluginPath, options) => {
        if (options.file) {
            configProvider.localInstall(pluginPath)
        } else {
            configProvider.installPlugin(pluginPath)
        }
    })

walleCLI
    .command('uninstall <pluginName>')
    .description('Uninstalls plugin')
    .action(pluginName => {
        configProvider.uninstallPlugin(pluginName)
    })

walleCLI
    .command('list')
    .description('Lists installed plugins')
    .action(() => {
        configProvider.listPlugins()
    })

configProvider.loadPlugins(walleCLI, command => walleCLI.addCommand(command))

// run walleCLI
walleCLI.parse(process.argv)
