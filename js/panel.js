/* global jQuery */
/* global FabricData */
/* global chrome */

(function($) {
	var currentElmClasses = []; 
    var curElm;
    var counter = 0;
    var FabricClasses={
        "FontSize" : [],
        "FontWeight" : [],
        "FontColor" : [],
        "BGColor" : [],
        "BorderColor" : [],
        "Icon" : [],
        "Animation" : [],
        "Grid" : [],
        "Utils" : []        
    };
    
 
    
    $(function() {
		var originalClasses = $('#originalClasses');			
        var availableClasses = $('#availableClasses');			        
        		
        function setSelectedElementChangedListener(){
            if(chrome
            && chrome.devtools
            && chrome.devtools.panels
            && chrome.devtools.panels.elements){
                chrome.devtools.panels.elements.onSelectionChanged.addListener(setSelectedElementInfo);
            }
        }
        
        function setSelectedElementInfo(){
            chrome.devtools.inspectedWindow.eval('('+getObjectInfo.toString()+')($0)', function(obj, exc) {
                if(obj) {    
                    curElm = obj;                        
                    currentElmClasses = [];
                    originalClasses.empty(); 
                    if(curElm && curElm.class) {                                
                        storeOriginalClasses();                               
                        $.map(curElm.class.split(' '), function(cls, n) {                                
                            originalClasses.html(originalClasses.html() + cls + '<br />');
                            currentElmClasses.push(cls);
                        });
                        $('#fabricClassGroup').val("");
                        setAvailableClassChoices();                                                            
                    }                           
                    
                } else {                        
                    originalClasses.html('');
                }
            });
        }
        function registerGroupChangeHandler(){
            $('#fabricClassGroup').on('change', function(e) {
                setAvailableClassChoices();                             
            });
        }
         
        function setAvailableClassChoices(){
            availableClasses.empty();
            var selectControl = $('#fabricClassGroup')[0];
            var selectedGroupValue = selectControl[selectControl.selectedIndex].value;
            if(selectedGroupValue === ""){ 
                return;
            }
            var classesList = FabricClasses[selectedGroupValue];
            $.map(classesList, function(cls, n) {
                let checkedString = "";
                if(currentElmClasses.indexOf(cls) > -1){
                    checkedString = "checked='checked'";
                }
                let ctrlType = ("Grid" === selectedGroupValue)? "checkbox" : "radio";
                let ctrlString='<input id="'+selectedGroupValue+'-'+n+'" type="'+ctrlType+'" data-className="'+cls+'" name="'+selectedGroupValue+'-Choices" ' + checkedString + '><label for="class-'+n+'">'+cls+'</label><br />';
                availableClasses.html(availableClasses.html() + ctrlString);
            });
            registerClassChangeHandler();
        }
         
        function registerClassChangeHandler(){            
            availableClasses.find('input').on('mousedown', 
                function() {
                      var prevClassName = $(availableClasses.find('input:checked')).attr('data-className');
                      if("undefined" !== typeof prevClassName && prevClassName.indexOf('ms-u-') === -1){
                            toggleClass(prevClassName);
                            var index = currentElmClasses.indexOf(prevClassName);
                            if (index > -1) {
                                currentElmClasses.splice(index, 1);
                            }
                            else{
                                currentElmClasses.push(prevClassName);
                            } 
                      }            
                }).on('mouseup',
                function() {
                    try{
                        var className = $(this).attr('data-className');
                    }
                    catch(err){
                        logMsg(err);
                    }
                    if("undefined" !== typeof className /*&& prevClassName.indexOf('ms-u-' === -1)*/){
                        toggleClass(className);
                        var index = currentElmClasses.indexOf(className);
                        if (index > -1) {
                            currentElmClasses.splice(index, 1);
                        }
                        else{
                            currentElmClasses.push(className);
                        } 
                   }  
                });
        }
        
        function init(){           
            registerGroupChangeHandler();
            $('#resetBtn').on('click', resetClasses);
            $('.launcher').on('click', doLaunch);
            
            $('#initBtn').on('click', initClasses);
            initClasses();
        }
        
        

		function getObjectInfo(obj){
			return {
				id: obj.id,
				class: obj.className,
				tag: obj.tagName.toLowerCase()
			}
		}

        

		function toggleClass(cls) {		
            if("undefined" === typeof cls){
                return;
            }
            if(chromeInspectedWindowAvailable()){               
                chrome.devtools.inspectedWindow.eval('FabricExplorer.toggleClass($0, "'+cls+'")', {useContentScriptContext: true});                
            }           
		}

        function chromeInspectedWindowAvailable(){
            return chrome && chrome.devtools && chrome.devtools.inspectedWindow;
        }
        
        function clearClasses(cls) {
			if(chromeInspectedWindowAvailable()){
                chrome.devtools.inspectedWindow.eval('FabricExplorer.clearClasses($0)', {useContentScriptContext: true});
            }           
		}
        
        function resetClasses() {
			
            if(chromeInspectedWindowAvailable()){
                
                chrome.devtools.inspectedWindow.eval('FabricExplorer.resetOriginalClasses($0)', {useContentScriptContext: true});
                
            }
            
            currentElmClasses = originalClasses.html().split('<br>');
            setAvailableClassChoices();
		}

        function initClasses(){
            $('#availableClassCount').text("0");
            getClassesFromPage();                
            var id = setInterval(function(){
                if(0<counter){
                    $('#availableClassCount').text(counter)
                    clearInterval(id);
                }}, 1000);                
        }

        function assignToClassGroup(oneClassName){
            for(var j=0;j<FabExConfig.ClassGroups.length;j++){
                if(oneClassName.indexOf(".") > 0){
                    oneClassName = "." + oneClassName;
                }
                let oneGroup = FabExConfig.ClassGroups[j];
                if(oneClassName.substring(oneGroup.beginTestPosition,oneGroup.endTestPosition)=== oneGroup.testString){
                    addClassToGroup(oneGroup.name, oneClassName);
                
                    counter++;
                    return true;
                }

            }
            if(oneClassName.substring(0,6)=== ".ms-u-"){
                if(oneClassName.indexOf('delay') > -1
                || oneClassName.indexOf('expand') > -1
                || oneClassName.indexOf('rotate') > -1
                || oneClassName.indexOf('fade') > -1
                || oneClassName.indexOf('scale') > -1
                || oneClassName.indexOf('slide') > -1
                ){
                    addClassToGroup("Animation", oneClassName);
                }
                else{
                    addClassToGroup("Utils", oneClassName);
                }  
                counter++;
                return true;
                                }
            return false;
        }

        function addClassToGroup(group, className){
            className = parseClass(className);
            if(FabricClasses[group].indexOf(className) === -1){
                FabricClasses[group].push(parseClass(className));
            }
        }

        function getClassesFromPage(){
            logMsg("getting Classes from page");
                counter=0;
                chrome.devtools.inspectedWindow.eval('('+initClasses2.toString()+')()', function(obj) {
                    
                    
                    if(obj) {    
                          FabricClasses={
                            "FontSize" : [],
                            "FontWeight" : [],
                            "FontColor" : [],
                            "BGColor" : [],
                            "BorderColor" : [],
                            "Icon" : [],
                            "Animation" : [],
                            "Grid" : [],
                            "Utils" : []        
                        }; 
                          for(var i=0;i<obj.length;i++){
                              if("undefined" === typeof obj[i]){
                                  continue;
                              }
                              try{
                                    let classes = obj[i].split(' ');
                                    for(var j=0;j<classes.length;j++){
                                        let oneClassName = classes[j];
                                        if(oneClassName.indexOf(".ms-u-md") > -1){
                                            logMsg("md");
                                        }
                                        
                                        if(assignToClassGroup(oneClassName)){
                                            continue;
                                        }
                                    }
                              }
                              catch(err){
                                  logMsg(i);
                                  logMsg(obj[i]);
                              }
                          } 
                          logMsg('Done getting classes from page-' + counter + "/" + obj.length);                                             
                    } else {                        
                        alert('No Fabric classes found on current page - please check your stylesheet refrences');
                        
                    }
                });
           
        }

        function parseClass(oneClassName){
            let retVal = oneClassName.replace('.', '');
            try{
                let delim = retVal.indexOf(',');
                if(delim > -1){
                    retVal = retVal.substring(0,delim);
                }
                delim = retVal.indexOf(':');
                if(delim > -1){
                    retVal = retVal.substring(0,delim);
                }
                delim = retVal.indexOf('--hover');
                if(delim > -1){
                    retVal = retVal.substring(0,delim);
                }
            }
            catch(err){

            }
            return retVal
        }
        
        function initClasses2() {            
            var rules;
            var retVal = [];
            var cssFiles = document.styleSheets;
            for(var i=0;i<cssFiles.length;i++){
                var sheet = cssFiles[i];
                rules = sheet.rules || sheet.cssRules;
                if(rules && rules.length){
                    for(var j=0;j<rules.length;j++){
                        var rule = rules[j];
                        if(rule.selectorText && rule.selectorText.indexOf(".ms-") > -1){
                            retVal.push(rule.selectorText);
                        }
                    } 
                }  
            }
            return retVal;
            
		}

       
        function storeOriginalClasses() {
			if(chromeInspectedWindowAvailable()){
                chrome.devtools.inspectedWindow.eval('FabricExplorer.storeOriginalClasses($0)', {useContentScriptContext: true});
            }
		}
        
        function doLaunch(){
            var url = ($(this).attr('data-href'));
            window.open(url, '_blank');          
        }
               
        init();
        setAvailableClassChoices();
        setSelectedElementChangedListener();
	});
    
    
})(jQuery);

