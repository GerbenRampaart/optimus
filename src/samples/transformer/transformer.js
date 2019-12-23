module.exports.myTransformer = (data) => {
    data.push({
        "key3": "value3"
    });
    return data;
}

module.exports.___result = this.myTransformer([
    {
        "key1": "value1"
    },
    {
        "key1": "value1"
    }
]);

/*
module.exports.____transformed = function(data) {
    return eval(`
    module.exports.myTransformer = (${data}) => {
        data.push({
            "key3": "value3"
        });
        return data;
    }    
    `);
}.call(this, [
    {
        "key1": "value1"
    },
    {
        "key1": "value1"
    }
])();
*/