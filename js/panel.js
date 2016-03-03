/* global jQuery */
/* global FabricData */
/* global chrome */

(function($) {
	var currentElmClasses = []; 
    var curElm;
    
 
    
    $(function() {
		/*Define visible elements*/       
		var originalClasses = $('#originalClasses');			
        var availableClasses = $('#availableClasses');			        
        
        setAvailableClassChoices()
        

		/*Add event on element selected*/
        if(chrome
            && chrome.devtools
            && chrome.devtools.panels
            && chrome.devtools.panels.elements){
                chrome.devtools.panels.elements.onSelectionChanged.addListener(setSelectedElementInfo);
            }

            function setSelectedElementInfo(){
                /*Get current element from dev tools*/                
                chrome.devtools.inspectedWindow.eval('('+getObject.toString()+')($0)', function(obj, exc) {
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
             var classesList = FabricData.getClassNames(selectedGroupValue);
              $.map(classesList, function(cls, n) {
                var checkedString = "";
                if(currentElmClasses.indexOf(cls) > -1){
                    checkedString = "checked='checked'";
                }
                    availableClasses.html(availableClasses.html() + '<input id="class-'+n+'" type="checkbox" name="'+cls+'" ' + checkedString + '><label for="class-'+n+'">'+cls+'</label><br />');
                });
                registerClassChangeHandler();
         }
         
        function registerClassChangeHandler(){
            availableClasses.find('input').on('change', 
                function() {
                    toggleClass(this.name);
                    var index = currentElmClasses.indexOf(this.name);
                    if (index > -1) {
                        currentElmClasses.splice(index, 1);
                    }
                    else{
                        currentElmClasses.push(this.name);
                    }                   
                });
        }
        
        function init(){           
            registerGroupChangeHandler();
            $('#resetBtn').on('click', resetClasses);
            $('#launcher').on('click', doLaunch);
            $('#launcher2').on('click', doLaunch2);            
        }
        
        

		function getObject(obj){
			/*get current element from dev tools and return element attributes and tagName*/
			return {
				id: obj.id,
				class: obj.className,
				tag: obj.tagName.toLowerCase()
			}
		}

		function toggleClass(cls) {
			/*Calling toggle class function in content.js with current element from dev tools and classes that need to toggle*/			
            if(chrome
            && chrome.devtools
            && chrome.devtools.inspectedWindow){
               
                chrome.devtools.inspectedWindow.eval('FabricExplorer.toggleClass($0, "'+cls+'")', {useContentScriptContext: true});                
            }           
		}
        
        function clearClasses(cls) {
			/*Calling toggle class function in content.js with current element from dev tools and classes that need to toggle*/
			
            if(chrome
            && chrome.devtools
            && chrome.devtools.inspectedWindow){
                chrome.devtools.inspectedWindow.eval('FabricExplorer.clearClasses($0)', {useContentScriptContext: true});
            }           
		}
        
        function resetClasses() {
			if(chrome
            && chrome.devtools
            && chrome.devtools.inspectedWindow){
                chrome.devtools.inspectedWindow.eval('FabricExplorer.resetOriginalClasses($0)', {useContentScriptContext: true});
            }
            currentElmClasses = originalClasses.html().split('<br>');
            setAvailableClassChoices();
		}
        
        function storeOriginalClasses() {
			if(chrome
            && chrome.devtools
            && chrome.devtools.inspectedWindow){
                chrome.devtools.inspectedWindow.eval('FabricExplorer.storeOriginalClasses($0)', {useContentScriptContext: true});
            }
		}
        
        function doLaunch(){
            
            var newUrl = 'http://www.sector43.com';
            window.open(newUrl, '_blank');          
        }
        
        function doLaunch2(){            
            var newUrl = 'http://www.sector43.com/pluralsight-training-videos/';
            window.open(newUrl, '_blank');          
        }

        init();
	});
    
    
})(jQuery);

