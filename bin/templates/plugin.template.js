module.exports = function (name, description) {
    return `
const plugin = {
    name: '${name}',
    description: '${description}',
    version: '0.0.1',
    cliVersion: '^1.0.0'
}

plugin.config = {    
    greeting: 'Hello'
}

plugin.make = (config) => {
    const helloCmd =  {
        command: 'hello <name>',
        handler: function (name, options, command) {
            const greeting = config.greeting || 'Hi'
            console.log(config.greeting, name)
            if(options.age && +options.age > 18) {
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

module.exports = plugin`
}
