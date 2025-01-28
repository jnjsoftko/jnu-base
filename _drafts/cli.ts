import { execSync } from "child_process";

const exec = (cmd: string): string => {
    return execSync(cmd, { encoding: 'utf8' }).toString().trim();
};

const exe = (cmds: string[]): string[] => {
    const results: string[] = [];
    cmds.forEach(cmd => results.push(exec(cmd)));
    return results;
};

export { exec, exe };

// console.log(exec("dir /w"));
// console.log(exec("powershell -Command \"Get-ChildItem | Format-Wide\""));