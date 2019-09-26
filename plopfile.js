module.exports = (plop) => {
  plop.setGenerator('component', {
    description: 'New component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is your component name?'
      },
      {
        type: 'confirm',
        name: 'withJs',
        default: false,
        message: 'With JS logic?'
      }
    ],
    actions: (answers) => [
      {
        type: 'add',
        path: 'src/components/{{kebabCase name}}/block.pug',
        templateFile: '.plop/component/pug'
      },
      {
        type: 'add',
        path: 'src/components/{{kebabCase name}}/block.styl',
        templateFile: '.plop/component/styl'
      },
      ...answers.withJs ?
        [
          {
            type: 'add',
            path: 'src/components/{{kebabCase name}}/block.js',
            templateFile: '.plop/component/js'
          },
          {
            type: 'append',
            path: 'src/components/{{kebabCase name}}/block.pug',
            pattern: /append head/,
            template: '  script(src="../components/{{kebabCase name}}/block.js")'
          }
        ] :
        [],
      (answers) => `New component created: ${plop.getHelper('pascalCase')(answers.name)}`
    ]
  })
}