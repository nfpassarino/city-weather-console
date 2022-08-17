const inquirer = require('inquirer');
require('colors');

const selectMenu = async () => {
    console.clear();
    console.log(`===============================`.green);
    console.log(` City Weather `.white);
    console.log(`===============================\n`.green);

    const menuQuestions = [
        {
            type: 'list',
            name: 'option',
            message: '¿Qué desea hacer?',
            choices: [
                {
                    value: 1,
                    name: `${'1.'.green} Buscar ciudad`,
                },
                {
                    value: 2,
                    name: `${'2.'.green} Historial`,
                },
                {
                    value: 0,
                    name: `${'0.'.green} Salir`,
                },
            ],
        },
    ];

    const { option } = await inquirer.prompt(menuQuestions);
    return option;
};

const continueToNext = async () => {
    const enterQuestion = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'ENTER'.green} para continuar`,
        },
    ];
    console.log('\n');
    await inquirer.prompt(enterQuestion);
};

const readInput = async (message) => {
    const inputQuestion = [
        {
            type: 'input',
            name: 'inputValue',
            message,
            validate(value) {
                if (!value.length) return 'Por favor, ingrese un valor';
                return true;
            },
        },
    ];

    const { inputValue } = await inquirer.prompt(inputQuestion);
    return inputValue;
};

const selectCity = async (cities = []) => {
    const choices = cities.map((city, i) => {
        const colorIndex = `${++i}`.green;
        return {
            value: city.id,
            name: `${colorIndex}. ${city.name}`,
        };
    });
    choices.push({
        value: 0,
        name: `${'0'.green}. Volver al menú`,
    });
    const cityQuestions = [
        {
            type: 'list',
            name: 'selectedCity',
            message: 'Elija la ciudad',
            choices: choices,
        },
    ];
    const { selectedCity } = await inquirer.prompt(cityQuestions);
    return selectedCity;
};

const confirmOperation = async (message) => {
    const confirmQuestion = [
        {
            type: 'confirm',
            name: 'ok',
            message,
        },
    ];
    const { ok } = await inquirer.prompt(confirmQuestion);
    return ok;
};

module.exports = {
    selectMenu,
    continueToNext,
    readInput,
    selectCity,
    confirmOperation,
};
