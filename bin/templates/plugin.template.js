module.exports = function (name, description) {
    return `
const plugin = {
    name: '${name}',
    description: '${description}',
    version: '0.0.1',
}

plugin.config = {    
    greeting: 'Hello'
}

plugin.make = (config) => {
    const helloCmd =  {
        command: 'hello',
        handler: function (fullname, options, command) {
            console.log(config.greeting, fullname)
        },
        args: [
            {
                name: '<fullname>',
                description: 'Your name',
                formatter: (val, prev) => val,
                default: 'john doe'
            }
        ],
        options: [
            {
                name: 'age <age>',
                alias: 'a',
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
