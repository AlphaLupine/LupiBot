export default class LangHelp {
    private extendedHelp:string | null = null;
    private argumentHelp:string | null = null;
    private exampleHelp:string | null = null;
    private noteHelp:string | null = null;

    public setExtendedHelp(text:string) {
        this.exampleHelp = text;
        return this;
    }

    public setArgumentHelp(text:string) {
        this.argumentHelp = text;
        return this;
    }

    public setExampleHelp(text:string) {
        this.exampleHelp = text;
        return this;
    }

    public setNoteHelp(text:string) {
        this.noteHelp = text;
        return this;
    }

    public build(name:string, options: LangHelpBuildOptions) {
        const { extendedHelp, argumentHelp = [], examples = [], notes } = options;
        const output:string[] = [];

        if(extendedHelp) {
            output.push(this.extendedHelp!, LangHelp.resolveField(extendedHelp), '');
        }

        if(argumentHelp.length) {
            output.push(this.argumentHelp!, ...argumentHelp.map(([arg, help]) => `${arg}: ${help}`), '');
        }

        if(examples.length) {
            output.push(
                this.exampleHelp!,
                ...examples.map((example) => `${process.env.DEFAULT_PREFIX}${name}${example ? ` ${example}` : ''}`), ''
            );
        }

        if(notes) {
            output.push(this.noteHelp!, LangHelp.resolveField(notes));
        }
        return output.join('\n');
    }

    public static resolveField(str:string[] | string):string {
        return Array.isArray(str) ? LangHelp.resolveField(str.join("\n")) : str.split('\n').map((x) => x.trim()).join('\n');
    }

}
interface LangHelpBuildOptions {
    extendedHelp?: string[] | string;
    argumentHelp?: Array<[string, string]>;
    examples?: string[];
    notes?: string[] | string;
}