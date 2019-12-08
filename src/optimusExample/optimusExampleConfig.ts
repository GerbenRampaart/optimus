import { optimusSchema } from "../optimusConfig/schema/optimus.schema";
import { Properties } from "../optimusConfig/schema/optimus.schema.types";

export const getOptimusExampleConfig = (): string => {

  let example = `
  # Hi! Welcome to optimus. Please adjust the settings below to you liking. You can place this .optimus file into any directory you want (except for node_modules) in you workspace and optimus will find it after you run the "Optimus: Transform" command from the Command Palette. Oh, and you can have as many .optimus files in you project as you want, every transformation can be different. :)
  `;

  const props: any = Object.keys(optimusSchema.properties);

  props.forEach((p: string) => {
    let prop: Properties = (<any>optimusSchema.properties)[p];
    prop.
  });

  return example;
};

# Determines if this transformer should show up if you run the 'Optimus' command from the quick pick menu. Defaults to true.
enabled: true

# The name to be displayed in the quick pick menu. Optional, if not added the uri (file path) will be displayed.
name: myTransformation

# The input sample file, can be json, xml or csv 
sample: sample.json

# the file containing the transformation function, can be javascript or typescript
transformer: transformer.js

# the function doing the transformation, must be of type 'any' or a typescript interface 
# that complies to the file format in 'sample'
# note that optimus uses xml2js if the input file is xml
function: myTransformer

`;