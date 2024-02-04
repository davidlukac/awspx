import {execSync} from "node:child_process";

/**
 * Check if `fzf` is installed on the system.
 *
 * @returns (boolean)
 */
export const isFzfInstalled = (): boolean => {
    let fzfInstalled = false;

    try {
        execSync('fzf --version', {stdio: 'ignore'});
        fzfInstalled = true;
    } catch {
        // Nothing to do.
    }

    return fzfInstalled;
}
