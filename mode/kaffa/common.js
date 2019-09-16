/*
  The MIT License (MIT)
  Copyright (c) 2007-2013 Einar Lielmanis and contributors.
  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:
  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
  
  Go Mode for EverEdit
  ----------------------
    Written by Kaffa (kaffacoffee@outlook.com)
    Homepage: http://www.everedit.net/
*/
function alert(message) {
    var vbOKOnly = 0;
    ShowMsgBox(message, "Message from EverEdit", vbOKOnly);
}

function readTextFile(path, charset) {
    var str;
    var stream = new ActiveXObject("Adodb.Stream");
    var adTypeText = 2;
    var adModeReadWrite = 3;
    stream.Type = adTypeText;
    stream.Mode = adModeReadWrite;
    stream.Charset = charset;
    stream.Open();
    stream.LoadFromFile(path);
    str = stream.ReadText();
    stream.Close();
    stream = null;
    return str;
}

function writeTextFile(path, str, charset) {
    var stream = new ActiveXObject("Adodb.Stream");
    var adTypeText = 2;
    var adModeReadWrite = 3;
    var adSaveCreateNotExist = 1;
    var adSaveCreateOverWrite = 2;
    stream.Type = adTypeText;
    stream.Mode = adModeReadWrite;
    stream.Charset = charset;
    stream.Open();
    stream.WriteText(str);
    stream.SaveToFile(path, adSaveCreateOverWrite);
    stream.Flush();
    stream.Close();
    stream = null;
}

function gb2312ToUTF8(str) {
    var str;
    var stream = new ActiveXObject("Adodb.Stream");
    var adTypeBinary = 1;
    var adTypeText = 2;
    var adModeReadWrite = 3;
    stream.Type = adTypeText;
    stream.Mode = adModeReadWrite;
    stream.Charset = 'utf-8';
    stream.Open();
    stream.WriteText(str);
    stream.Position = 0;
    str = stream.Read();
    stream.Close();
    stream = null;
    return str;
}

function utf8ToGB2312(str) {
    var str;
    var stream = new ActiveXObject("Adodb.Stream");
    var adTypeBinary = 1;
    var adTypeText = 2;
    var adModeReadWrite = 3;
    stream.Type = adTypeBinary;
    stream.Mode = adModeReadWrite;
    stream.Charset = 'utf-8';
    stream.Open();
    stream.Write(str);
    stream.Position = 0;
    stream.Type = adTypeText;
    str = stream.ReadText();
    stream.Close();
    stream = null;
    return str;
}

function getTempFolder() {
    var shell = new ActiveXObject("WScript.Shell");
    return shell.ExpandEnvironmentStrings("%TEMP%");
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function noExt(path) {
    return path.substring(0, path.indexOf("."));
}

function getFilenameExt(filename) {
    return filename.split('.').pop();
}

function getEncodingName(encoding) {
    // 待测
    var encodings = {
        65001: 'UTF-8',
        1200: 'UTF-16',
        1201: 'UTF-16',
        936: 'GB2312',
        950: 'Big5',
        932: 'Shift-JIS',
        1252: 'Windows',
        54936: 'gb18030',
        20936: 'gb2312-80',
        52936: 'HZ'
    }
    var encodingName = false;
    if (encodings.hasOwnProperty(encoding)) {
        encodingName = encodings[encoding];
    }
    return encodingName;
}

function shellExec(dir, cmdStr, encoding) {
    // for java
    var shell = new ActiveXObject('WScript.Shell');
    shell.CurrentDirectory = dir;
    var rs = shell.Exec(cmdStr);
    var stdMsg = rs.StdOut.ReadAll();
    var errMsg = rs.StdErr.ReadAll();
    
    rs = null;
    shell = null;
    return [stdMsg, errMsg];
}

function shellExecForGo(dir, cmdStr, encoding) {
    // for go
    var shell = new ActiveXObject('WScript.Shell');
    shell.CurrentDirectory = dir;
    var rs = shell.Exec(cmdStr);
    var stdMsg = rs.StdOut.ReadAll();
    var errMsg = rs.StdErr.ReadAll();
    if (stdMsg.length != 0) {
        var path = getTempFolder() + "\\out-" + guid() + ".txt";
        writeTextFile(path, stdMsg, encoding);
        stdMsg = readTextFile(path, encoding);
    }
    if (errMsg.length != 0) {
        var path = getTempFolder() + "\\err-" + guid() + ".txt";
        writeTextFile(path, errMsg, encoding)
        errMsg = readTextFile(path, encoding);
    }
    rs = null;
    shell = null;
    return [stdMsg, errMsg];
}
