
const Module = require("module");
const load = Module._load;
const EXPRESS_CONST = "express/lib/router";
const splitter = "$$$$$"
let httpMethod = ['all', 'delete', 'get', 'head', 'post', 'put', 'patch'];
let routeSet = new Set();

function endpointsList() {
    try {
        let result = [];
        routeSet.forEach(element => {
            let obj = {};
            let val = element.split(splitter);
            obj.path = val[1];
            obj.method = val[0];
            result.push(obj);
        });
        return result;
    } catch (error) {
        return result;
    }

}

function patcher(mod, func) {
    try {
        let patchMod = mod[func];
        mod[func] = function () {
            let obj = {};
            obj.method = func.toUpperCase();
            obj.path = arguments[0];
            routeSet.add(obj.method + splitter + obj.path);
            console.log(endpointsList());
            return patchMod.apply(this, arguments);
        }
    } catch (error) {

    }

}

Module._load = function (request) {
    try {
        const mod = load.apply(this, arguments);
        if (request === EXPRESS_CONST) {
            httpMethod.forEach((val) => {
                patcher(mod, val);
            })
        }
        return mod;
    } catch (error) {

    }

}


Module.export = {
    endpointsList
}




