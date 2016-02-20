


function logMsg(msg){
    if(chrome
            && chrome.devtools
            && chrome.devtools.inspectedWindow){
                chrome.devtools.inspectedWindow.eval("console.log('" + msg + "')");
            }
}
