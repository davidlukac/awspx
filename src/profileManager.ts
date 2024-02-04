import * as fs from 'fs';
import * as os from 'os';
import * as ini from 'ini';

const credentialsPath = `${os.homedir()}/.aws/credentials`;

export const getProfiles = (): { [key: string]: any } => {
    const content = fs.readFileSync(credentialsPath, 'utf-8');
    return ini.parse(content);
}

export const listProfiles = (): void => {
    const profiles = getProfiles();
    Object.keys(profiles).forEach(profile => {
        console.log(profile);
    });
};

export const switchProfile = (profileName: string): void => {
    const content = fs.readFileSync(credentialsPath, 'utf-8');
    const parsed = ini.parse(content);
    parsed['default'] = { ...parsed[profileName] };
    fs.writeFileSync(credentialsPath, ini.stringify(parsed));
    console.log(`Switched 'default' to profile "${profileName}".`);
};

export const renameProfile = (oldName: string, newName: string): void => {
    const content = fs.readFileSync(credentialsPath, 'utf-8');
    const parsed = ini.parse(content);
    parsed[newName] = { ...parsed[oldName] };
    delete parsed[oldName];
    fs.writeFileSync(credentialsPath, ini.stringify(parsed));
    console.log(`Profile "${oldName}" renamed to "${newName}".`);
};
