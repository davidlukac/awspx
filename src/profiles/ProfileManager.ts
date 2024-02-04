import fs from "fs";
import * as ini from "ini";

export class ProfileManager {
    constructor(readonly credentialsPath: string) {
    }

    getProfiles(): { [key: string]: unknown } {
        const content = fs.readFileSync(this.credentialsPath, 'utf-8');
        return ini.parse(content);
    }

    listProfiles(): void {
        const profiles = this.getProfiles();
        Object.keys(profiles).forEach(profile => {
            console.log(profile);
        });
    }

    switchProfile(profileName: string): void {
        const content = fs.readFileSync(this.credentialsPath, 'utf-8');
        const parsed = ini.parse(content);
        parsed['default'] = {...parsed[profileName]};
        fs.writeFileSync(this.credentialsPath, ini.stringify(parsed));
        console.log(`Switched 'default' to profile "${profileName}".`);
    }

    renameProfile(oldName: string, newName: string): void {
        const content = fs.readFileSync(this.credentialsPath, 'utf-8');
        const parsed = ini.parse(content);
        parsed[newName] = {...parsed[oldName]};
        delete parsed[oldName];
        fs.writeFileSync(this.credentialsPath, ini.stringify(parsed));
        console.log(`Profile "${oldName}" renamed to "${newName}".`);
    }
}
