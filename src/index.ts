#!/usr/bin/env node

import {getProfiles, listProfiles, renameProfile, switchProfile} from './profileManager';
import {execSync} from "node:child_process";


const args = process.argv.slice(2);

function isFzfInstalled(): boolean {
    let fzfInstalled = false;

    try {
        execSync('fzf --version', {stdio: 'ignore'});
        fzfInstalled = true;
    } catch {
        // Nothing to do.
    }

    return fzfInstalled;
}

const selectProfileInteractive = () => {
    let output;

    const profiles = getProfiles();
    const profile_names = Object.keys(profiles);
    const cmd = `echo "${profile_names.join('\\n')}" | fzf --exact`;

    try {
        output = execSync(cmd, {stdio: ['inherit', 'pipe', 'inherit']}).toString().trim();
    } catch (error) {
        console.log(JSON.stringify(error));
    }

    if (output && profile_names.includes(output)) {
        switchProfile(output);
    } else {
        console.log(`Invalid profile: '${output}'`);
    }
};

const handleCommands = () => {
    if (args.length === 0) {
        if (process.stdout.isTTY && isFzfInstalled()) {
            selectProfileInteractive();
        } else {
            listProfiles();
        }
    } else {
        const command = args[0];

        if (command === '-') {
            switchProfile('default'); // Simplified for the example
        } else if (command.includes('=')) {
            const [oldName, newName] = command.split('=');
            renameProfile(oldName, newName);
        } else {
            switchProfile(command);
        }
    }
};

handleCommands();
