#!/usr/bin/env node

const args = process.argv;
const commands = ['read', 'write'];
//console.log('these are the args:',args);

const fs = require('fs');
const readline = require('readline');


let command = '';

if(args.length < 3) {
    console.log('Lessthan three args entered');
    return;
}
else if(args.length > 4) {
    console.log('More arguments provided than expected');
    
    return;
}
else {
    command = args[2]
    if(!args[3]) {
        console.log('This tool requires at least one path to a file');
       
        return;
    }
}
switch(commands.indexOf(command)) {
    case 0:
        read(args[3]);
        break;
    case 1:
        write(args[3]);
        break;
    
    default:
        console.log('You entered a wrong command. See help text below for supported functions');
      
        return;
}

function read(filePath) {
    const readableStream = fs.createReadStream(filePath, 'utf-8');

   readableStream.on('error', function (error) {
       console.log(`error: ${error.message}`);
    })

    readableStream.on('data', (chunk) => {
        console.log(chunk);
    })
}


function write(filePath) {
    const writableStream = fs.createWriteStream(filePath);

    writableStream.on('error',  (error) => {
        console.log(`An error occured while writing to the file. Error: ${error.message}`);
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'Enter a sentence: '
    });

    rl.prompt();
      
    rl.on('line', (line) => {
        switch (line.trim()) {
            case 'exit':
                rl.close();
                break;
            default:
                sentence = line + '\n'
                writableStream.write(sentence);
                rl.prompt();
                break;
        }
    }).on('close', () => {
        writableStream.end();
        writableStream.on('finish', () => {
            console.log(`All your sentences have been written to ${filePath}`);
        })
        setTimeout(() => {
            process.exit(0);
        }, 100);
    });
}
