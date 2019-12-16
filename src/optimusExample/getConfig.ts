import { optimusSchema } from "../optimusConfig/schema/optimus.schema";
import { Property } from "../optimusConfig/schema/optimus.schema.types";
import { EOL } from "os";
import { configName } from "../optimusConfig/config";

export const getConfig = (): string => {

  let example = `# Hi! Welcome to optimus. Please adjust the settings below to you liking. You can place this ${configName} file into any directory you want (except for node_modules) in you workspace and optimus will find it after you run the "Optimus: Transform" command from the Command Palette. Oh, and you can have as many ${configName} files in you project as you want, every transformation can be different. :)${EOL}${EOL}`;

  const props: any = Object.keys(optimusSchema.properties);

  props.forEach((p: string) => {
    let prop: Property = (<any>optimusSchema.properties)[p];
    
    const isRequired = optimusSchema.required.indexOf(p) > -1;

    example += `# ${prop.title}${EOL}`;
    example += `${p}: ${prop.default} # (required: ${isRequired})${EOL}${EOL}`;
  });

  return example;
};