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
                              let oneClass = obj[i];
                               if(oneClass.substring(0,13)=== ".ms-fontSize-"){
                                  FabricClasses.FontSize.push(parseClass(oneClass));
                                  counter++;
                                  continue;
                              }
                              //if(oneClass.substring(0,9)=== ".ms-font-"){
                                  //FabricClasses.Font.push(parseClass(oneClass));
                                  //counter++;
                                  //continue;
                              //}
                             
                              if(oneClass.substring(0,15)=== ".ms-fontWeight-"){
                                  FabricClasses.FontWeight.push(parseClass(oneClass));
                                  counter++;
                                  continue;
                              }
                              if(oneClass.substring(0,14)=== ".ms-fontColor-"){
                                  FabricClasses.FontColor.push(parseClass(oneClass));
                                  counter++;
                                  continue;
                              }
                              if(oneClass.substring(0,12)=== ".ms-bgColor-"){
                                  FabricClasses.BGColor.push(parseClass(oneClass));
                                  counter++;
                                  continue;
                              }
                              if(oneClass.substring(0,16)=== ".ms-borderColor-"){
                                  FabricClasses.BorderColor.push(parseClass(oneClass));
                                  counter++;
                                  continue;
                              }
                              if(oneClass.substring(0,10)=== ".ms-Icon--"){
                                  FabricClasses.Icon.push(parseClass(oneClass));
                                  counter++;
                                  continue;
                              }
                              if(oneClass.substring(0,8)=== ".ms-u-sm"){
                                  FabricClasses.Grid.push(parseClass(oneClass));
                                  counter++;
                                  continue;
                              }
                              if(oneClass.substring(0,8)=== ".ms-u-md"){
                                  FabricClasses.Grid.push(parseClass(oneClass));
                                  counter++;
                                  continue;
                              }
                              if(oneClass.substring(0,8)=== ".ms-u-lg"){
                                  FabricClasses.Grid.push(parseClass(oneClass));
                                  counter++;
                                  continue;
                              }
                              if(oneClass.substring(0,8)=== ".ms-u-xl"){
                                  FabricClasses.Grid.push(parseClass(oneClass));
                                  counter++;
                                  continue;
                              }
                              if(oneClass.substring(0,9)=== ".ms-u-xxl"){
                                  FabricClasses.Grid.push(parseClass(oneClass));
                                  counter++;
                                  continue;
                              }
                              if(oneClass.substring(0,10)=== ".ms-u-xxxl"){
                                  FabricClasses.Grid.push(parseClass(oneClass));
                                  counter++;
                                  continue;
                              }
                              if(oneClass.substring(0,11)=== ".ms-u-hidden"){
                                  FabricClasses.Grid.push(parseClass(oneClass));
                                  counter++;
                                  continue;
                              }
                              if(oneClass.substring(0,6)=== ".ms-u-"){
                                  if(oneClass.indexOf('delay') > -1
                                    || oneClass.indexOf('expand') > -1
                                    || oneClass.indexOf('rotate') > -1
                                    || oneClass.indexOf('fade') > -1
                                    || oneClass.indexOf('scale') > -1
                                    || oneClass.indexOf('slide') > -1
                                  ){
                                      FabricClasses.Animation.push(parseClass(oneClass));
                                  }
                                  else{
                                      FabricClasses.Utils.push(parseClass(oneClass));
                                  }  
                                  counter++;
                                  continue;
                              }
                          } 
                          logMsg('Done getting classes from page-' + counter + "/" + obj.length);                                             
                    } else {                        
                        alert('No Fabric classes found on current page - please check your stylesheet refrences');
                        
                    }
                });
           
        }

        function parseClass(oneClass){
            let retVal = oneClass.replace('.', '');
            try{
                let delim = retVal.indexOf(',');
                if(delim > -1){
                    retVal = retVal.substring(0,delim);
                }
                delim = retVal.indexOf(':');
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

