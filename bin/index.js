#! /usr/bin/env node
"use strict";function s(s){return s&&"object"==typeof s&&"default"in s?s.default:s}var o=s(require("child_process")),t=s(require("node:fs")),r=s(require("node:path")),e=s(require("readline"));new(function(){function s(s){void 0===s&&(s={question:"",options:[],answers:[],pointer:">",color:"blue"}),this.opts=s,this.cursorLocs={x:0,y:0},this._color=s.color,this.input=0}var i=s.prototype;return i.start=function(){process.stdout.write(this.opts.question+"\n");for(var s=0;s<this.opts.options.length;s++)this.opts.options[s]=this.opts.pointer+" "+this.opts.options[s],this.opts.options[s]+="\n",0===s?(this.input=0,process.stdout.write(this.color(this.opts.options[s],this._color))):process.stdout.write(this.opts.options[s]),this.cursorLocs.y=s+1;process.stdin.setRawMode(!0),process.stdin.resume(),process.stdin.setEncoding("utf-8"),this.hideCursor(),process.stdin.on("data",this.pn(this))},i.hideCursor=function(){process.stdout.write("[?25l")},i.pn=function(s){return function(o){switch(o){case"":case"\r":case"\n":return s.enter();case"":return s.ctrlc();case"[A":return s.upArrow();case"[B":return s.downArrow()}}},i.upArrow=function(){var s=this.cursorLocs.y;e.cursorTo(process.stdout,0,s+1),process.stdout.write(this.opts.options[s-1]),1==this.cursorLocs.y?this.cursorLocs.y=this.opts.options.length:this.cursorLocs.y--,s=this.cursorLocs.y,e.cursorTo(process.stdout,0,s+1),process.stdout.write(this.color(this.opts.options[s-1],this._color)),this.input=s-1},i.downArrow=function(){var s=this.cursorLocs.y;e.cursorTo(process.stdout,0,s+1),process.stdout.write(this.opts.options[s-1]),this.cursorLocs.y===this.opts.options.length?this.cursorLocs.y=1:this.cursorLocs.y++,s=this.cursorLocs.y,e.cursorTo(process.stdout,0,s+1),process.stdout.write(this.color(this.opts.options[s-1],this._color)),this.input=s-1},i.color=function(s,o){void 0===o&&(o="yellow");var t={yellow:[33,89],blue:[34,89],green:[32,89],cyan:[35,89],red:[31,89],magenta:[36,89]}[o];return"["+t[0]+"m"+s+"["+t[1]+"m[0m"},i.enter=function(){process.stdin.removeListener("data",this.pn),process.stdin.setRawMode(!1),process.stdin.pause(),this.showCursor(),e.cursorTo(process.stdout,0,this.opts.options.length+1),this.configs(this.opts.answers[this.input])},i.ctrlc=function(){process.stdin.removeListener("data",this.pn),process.stdin.setRawMode(!1),process.stdin.pause(),this.showCursor()},i.showCursor=function(){process.stdout.write("[?25h")},i.rootDir=function(){return o.execSync("git rev-parse --show-toplevel",{encoding:"utf-8"}).replace(/\n|\r/,"")},i.configs=function(s,o){void 0===o&&(o="./configs");var e=r.resolve(__dirname,o),i=this.rootDir();try{for(var n=t.readdirSync(e,{encoding:"utf-8",withFileTypes:!0}),c=0;c<n.length;c++){var u=n[c];if(u.isFile()&&u.name.split(".")[0]==s)try{t.unlinkSync(r.resolve(i,"tsconfig.json"));var p=t.readFileSync(r.resolve(e,u.name),{encoding:"utf-8"});t.writeFileSync(r.resolve(i,"tsconfig.json"),p,"utf-8");break}catch(s){throw new Error(JSON.stringify(s))}}}catch(s){throw console.log("error",s),new Error(JSON.stringify(s))}},s}())({question:"Choose type of configuration ?",options:["Node","React","React Native"],answers:["node","react","react_native"],pointer:"->",color:"blue"}).start();
