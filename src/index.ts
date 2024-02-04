#!/usr/bin/env node

import {execSync} from "node:child_process";

import {isErrorWithStatus} from "./utils/isErrorWithStatus";

import {isFzfInstalled} from "./utils/isFzfInstalled";
import {ProfileManager} from "./profiles/ProfileManager";
import os from "os";

const args = process.argv.slice(2);
const credentialsPath = `${os.homedir()}/.aws/credentials`;
const profileManager = new ProfileManager(credentialsPath);

/**
 * Interactively select profile to switch to with 'fzf'.
 */
const selectProfileInteractive = () => {
    let output;

    const profiles = profileManager.getProfiles();
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
            profileManager.switchProfile(output);
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
            profileManager.listProfiles();
        }
    } else {
        const command = args[0];

        if (command === '-') {
            profileManager.switchProfile('default'); // Simplified for the example
        } else if (command.includes('=')) {
            const [oldName, newName] = command.split('=');
            profileManager.renameProfile(oldName, newName);
        } else {
            profileManager.switchProfile(command);
        }
    }
};

handleCommands();
