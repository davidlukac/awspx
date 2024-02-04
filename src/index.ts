#!/usr/bin/env node

import {getProfiles, listProfiles, renameProfile, switchProfile} from './profileManager';
import {execSync} from "node:child_process";
import {isFzfInstalled} from "./fzfTools";
import {isErrorWithStatus} from "./errorTools";

const args = process.argv.slice(2);

/**
 * Interactively select profile to switch to with 'fzf'.
 */
const selectProfileInteractive = () => {
    let output;

    const profiles = getProfiles();
    const profile_names = Object.keys(profiles);
    const cmd = `echo "${profile_names.join('\\n')}" | fzf --exact`;

    try {
        output = execSync(cmd, {stdio: ['inherit', 'pipe', 'inherit']}).toString().trim();
    } catch (e: unknown) {
        if (e instanceof Error) {
            if (isErrorWithStatus(e) && e.status === 130) {
                console.debug('Profile selection interrupted by user.')
                output = null;
            } else {
                console.error(e.message);
            }
        } else {
            console.error(JSON.stringify(e));
        }
    }

    if (output) {
        if (profile_names.includes(output)) {
            switchProfile(output);
        } else {
            console.log(`Invalid profile: '${output}'`);
        }
    } else {
        console.log('Profile not specified.');
    }
};

/**
 * Handle and dispatch commands from command line arguments.
 */
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
