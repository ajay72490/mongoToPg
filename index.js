const processes = require("./allprocesses.json")


const express = require('express')
const app = express()

var db = require('sharedb-postgres')({
    host: 'localhost',
    port: 8742,
    user: '',
    database: '',
    password: '',
    ssl: { rejectUnauthorized: false }
});

var ShareDb = require('sharedb')
var backend = new ShareDb({db: db})

backend.use('apply', (context, next) => {
    if (context && context.op && context.op.create && context.op.create.data && context.op.create.data.creator) {
        context.op.m.uId = context.op.create.data.creator
    }
    next();
});

var connection = backend.connect()


var addProcess = function (process) {
        delete process._o
        delete process._type
        delete process._v
        delete process._m
        
        var docId = process._id
        
        delete process._id
        
        var doc =  connection.get('processes',  docId)
        
        doc.create(process, (err) => {
          console.log("err", err);
          console.log("doc 2", doc)
        })
}

for (var i = 1; i<processes.length; i++) {
    addProcess(processes[i])
}

app.listen(3000)