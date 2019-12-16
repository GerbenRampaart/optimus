module.exports.myTransformer = (data) => {
    data.push({
        "key3": "value3"
    });
    return data;
}
module.exports.___result = myTransformer([
    {
        "key1": "value1"
    },
    {
        "key1": "value1"
    }
]);

const ____transform = (str) => {
    return eval(str);
  }.call(context,somestring);