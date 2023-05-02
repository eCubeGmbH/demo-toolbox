const Toolpackage = require('chioro-toolbox/toolpackage')
const base = require('chioro-toolbox/toolbase')

// Toolbox extensions are organized as "Tool Packages".
// A ToolPackage is a collection of tool descriptions, including tests.
// Exporting a ToolPackage object makes a JS module a toolbox extension (see last line)
// base refers to the standard chioro library and can be used anywhere in the code with
// the following syntax: base.nameOfTheStandardFunction

const tools = new Toolpackage("My great toolbox extension")


function niceFunction(input1, input2) {
    return base.upperCaseText(input1) + " " + base.lowerCaseText(input2);
}
tools.add({
    id: "niceFunction",
    impl: niceFunction,
    aliases: {
        en: "niceFunction",
        de: "netteFunktion"
    },
    argsOld: {
        en: "input1, input2",
        de: "eingabe1, eingabe2"
    },
    tags: ["demo"],
    tests: () => {
        tools.expect(niceFunction("hello", "world")).toBe('HELLO world');
        tools.expect(niceFunction("Helping", "World")).toBe('HELPING world');
    }
})

function concatValueAndUnit(param) {
    if(!param.unit) {
        return;
    }
    if (param.unit != null)
        return normalisiereWerte(param.value[0], ',') + " " + param.unit;
    else
        return normalisiereWerte(param.value[0], ',');
}
tools.add({
    id: "concatValueAndUnit",
    impl: concatValueAndUnit,
    aliases: {
        en: "concatValueAndUnit",
        de: "verknüpfeWertUndEinheit"
    },
    argsOld: {
        en: "param",
        de: "param"
    },
    tags: ["demo"]
})

function removeDuplicates(inArray){
    var arr = inArray.concat()
    for(var i=0; i<arr.length; ++i) {
        for(var j=i+1; j<arr.length; ++j) {
            if(arr[i] === arr[j]) {
                arr.splice(j, 1);
            }
        }
    }
    return arr;
}
tools.add({
    id: "removeDuplicates",
    impl: removeDuplicates,
    aliases: {
        en: "removeDuplicates",
        de: "entferneDoppelte"
    },
    argsOld: {
        en: "inArray",
        de: "inArray"
    },
    tags: ["demo"]
})

function translate(text, target_lang = "DE", source_lang = "") {
    var deepl = "https://api-free.deepl.com/v2/translate";
    var auth_key = "66ac47c8-2810-2fac-4642-d598e02a6244:fx";
    var uri = encodeURI(deepl +
        "?auth_key=" + auth_key +
        //        source_lang != "" ? "&source_lang=" + source_lang : "" +
        "&source_lang=" + source_lang +
        "&target_lang=" + target_lang +
        "&text=" + text);
    //return uri;
    var response = getJson(uri);
    //return response;
    return  decodeURI(response.translations[0].text);
}
tools.add({
    id: "translate",
    impl: translate,
    aliases: {
        en: "translate",
        de: "übersetze"
    },
    argsOld: {
        en: "text, target_lang = \"DE\", source_lang = \"\"",
        de: "text, target_lang = \"DE\", source_lang = \"\""
    },
    tags: ["demo"]
})

function multiply(text1,text2) {
    return parseInt(text1)*parseInt(text2);
}
tools.add({
    id: "multiply",
    impl: multiply,
    aliases: {
        en: "multiply",
        de: "multiply"
    },
    argsOld: {
        en: "text1,text2",
        de: "text1,text2"
    },
    tags: ["demo"]
})

function eanCheck(s){
    var result = 0;
    for (var counter = s.length-1; counter >=0; counter--){
        result = result + parseInt(s.charAt(counter)) * (1+(2*(counter % 2)));
    }
    return ((10 - (result % 10)) % 10) === 0;
}
tools.add({
    id: "eanCheck",
    impl: eanCheck,
    aliases: {
        en: "eanCheck",
        de: "eanCheck"
    },
    argsOld: {
        en: "s",
        de: "s"
    },
    tags: ["demo"]
})

//-------------WRITE YOUR FUNCTIONS ABOVE THIS LINE------------------
tools.exportAll(exports)
