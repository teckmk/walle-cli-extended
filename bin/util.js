exports.createOption = function (option) {
    const { name, alias = '' } = option
    const al = alias ? `-${alias},` : ''
    return `${al} --${name}`
}
