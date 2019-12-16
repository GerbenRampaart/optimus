
export const getTransformer = (functionName: string): string => {
    return `module.exports.${functionName} = (data) => {
    return data;
}`;
};
