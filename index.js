#!/usr/bin/env node
'use strict';
const inquirer = require('inquirer');
const fs = require('fs')
const path = require('path');
const process = require('process');
const { spawn } = require('child_process');

inquirer.registerPrompt('search-list', require('inquirer-search-list'));

fs.access('./package.json', (err)=> {
    if(err)
        return;
    const pkg = require(path.join(process.cwd(), 'package.json'));
    inquirer.prompt([{
        type: 'search-list',
        name: 'scriptChooser',
        message: 'Choose a script:',
        choices: Object.keys(pkg.scripts),
        pageSize: 10,
        filter: x=>{
            console.log(x);
            return x;
        }
    }]).then((answers)=>{
        const npmrun = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run',  answers['scriptChooser']]);
        npmrun.stdout.pipe(process.stdout);
        npmrun.stderr.pipe(process.stderr);
    });
});
