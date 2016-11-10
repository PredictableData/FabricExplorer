/* global jQuery */
/* global chrome */

(function ($) {
    var currentElmClasses = [];
    var curElm;
    var numFabricClasses = 0;
    var totalClasses = 0;
    var fabricClassGroupNames = ["FontSize", "FontWeight", "FontColor", "BGColor", "BorderColor", "Icon", "Animation", "Grid", "Utils"];
    var FabricClasses = {};
    $(function () {
        var originalClasses = $('#originalClasses');
        var availableClasses = $('#availableClasses');

        function init() {
            initClasses();
            registerEventHandlersAndListeners();
        }

//region - event handlers

        function registerEventHandlersAndListeners() {
            $('#resetBtn').on('click', resetClasses);
            $('.launcher').on('click', doLaunch);
            $('#initBtn').on('click', initClasses);
            setSelectedElementChangedListener();
            registerGroupChangeHandler();
        }
        function registerGroupChangeHandler() {
            $('#fabricClassGroup').on('change', function (e) {
                setAvailableClassChoices();
            });
        }
        function registerClassChangeHandler() {
            availableClasses.find('input').on('mousedown',
                function () {

                    var prevClassName = $(availableClasses.find('input:checked')).attr('data-className');
                    if ("undefined" !== typeof prevClassName && prevClassName.indexOf('ms-u-') === -1) {
                        toggleClass(prevClassName);
                        var index = currentElmClasses.indexOf(prevClassName);
                        if (index > -1) {
                            currentElmClasses.splice(index, 1);
                        }
                        else {
                            currentElmClasses.push(prevClassName);
                        }
                    }
                }).on('mouseup',
                function () {
                    try {

                        var className = $(this).attr('data-className');

                    }
                    catch (err) {
                        logMsg(err);
                    }
                    if ("undefined" !== typeof className) {

                        toggleClass(className);

                        var index = currentElmClasses.indexOf(className);
                        if (index === -1) {

                            currentElmClasses.push(className);
                        }
                    }
                });
        }
        function setSelectedElementChangedListener() {
            if (chrome
                && chrome.devtools
                && chrome.devtools.panels
                && chrome.devtools.panels.elements) {
                chrome.devtools.panels.elements.onSelectionChanged.addListener(setSelectedElementInfo);
            }
        }

//region Selected element
        function setSelectedElementInfo() {
            chrome.devtools.inspectedWindow.eval('(' + getObjectInfo.toString() + ')($0)', function (obj) {
                if (obj) {
                    curElm = obj;
                    currentElmClasses = [];
                    originalClasses.empty();
                    if (curElm && curElm.class) {
                        storeOriginalClasses();
                        $.map(curElm.class.split(' '), function (cls, n) {
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
        function getObjectInfo(obj) {
            return {
                id: obj.id,
                class: obj.className,
                tag: obj.tagName.toLowerCase()
            }
        }
        function storeOriginalClasses() {
            if (chromeInspectedWindowAvailable()) {
                chrome.devtools.inspectedWindow.eval('FabricExplorer.storeOriginalClasses($0)', { useContentScriptContext: true });
            }
        }
        function toggleClass(cls) {
            if ("undefined" === typeof cls) {
                return;
            }
            if (chromeInspectedWindowAvailable()) {
                chrome.devtools.inspectedWindow.eval('FabricExplorer.toggleClass($0, "' + cls + '")', { useContentScriptContext: true });
            }
        }
        function clearClasses(cls) {
            if (chromeInspectedWindowAvailable()) {
                chrome.devtools.inspectedWindow.eval('FabricExplorer.clearClasses($0)', { useContentScriptContext: true });
            }
        }
        function resetClasses() {

            if (chromeInspectedWindowAvailable()) {

                chrome.devtools.inspectedWindow.eval('FabricExplorer.resetOriginalClasses($0)', { useContentScriptContext: true });

            }

            currentElmClasses = originalClasses.html().split('<br>');
            setAvailableClassChoices();
        }

//region CSS/Stylesheet Processing
        function setAvailableClassChoices() {
            availableClasses.empty();
            var selectControl = $('#fabricClassGroup')[0];
            var selectedGroupValue = selectControl[selectControl.selectedIndex].value;
            if (selectedGroupValue === "") {
                return;
            }
            var classesList = FabricClasses[selectedGroupValue];
            var htmlString = "";
            $.map(classesList, function (cls, n) {
                let checkedString = "";
                if (currentElmClasses.indexOf(cls) > -1) {
                    checkedString = "checked='checked'";
                }
                let ctrlType = ("Grid" === selectedGroupValue) ? "checkbox" : "radio";
                let ctrlString = '<input id="' + selectedGroupValue + '-' + n + '" type="' + ctrlType + '" data-className="' + cls + '" name="' + selectedGroupValue + '-Choices" ' + checkedString + '><label for="class-' + n + '">' + cls + '</label><br />';
                htmlString += ctrlString;
            });
            availableClasses.html(htmlString);
            registerClassChangeHandler();
        }
        function initClasses() {
            $('#availableClassCount').text("0");
            getClassesFromPage();
            var id = setInterval(function () {
                if (0 < numFabricClasses) {
                    $('#availableClassCount').text(numFabricClasses)
                    clearInterval(id);
                }
            }, 1000);
        }
        function assignToClassGroup(oneClassName) {
            for (var j = 0; j < FabExConfig.ClassGroups.length; j++) {
                if (oneClassName.indexOf(".") === -1) {
                    oneClassName = "." + oneClassName;
                }
                let oneGroup = FabExConfig.ClassGroups[j];
                if (oneClassName.substring(oneGroup.beginTestPosition, oneGroup.endTestPosition).toLowerCase() === oneGroup.testString.toLowerCase()) {
                    addClassToGroup(oneGroup.name, oneClassName);

                    numFabricClasses++;
                    return true;
                }

            }
            if (oneClassName.substring(0, 6).toLowerCase() === ".ms-u-") {
                if (isAnimationClass(oneClassName)) {
                    addClassToGroup("Animation", oneClassName);
                }
                else {
                    addClassToGroup("Utils", oneClassName);
                }
                numFabricClasses++;
                return true;
            }
            return false;
        }
        function isAnimationClass(className) {
            className = className.toLowerCase();
            return className.indexOf('delay') > -1
                || className.indexOf('expand') > -1
                || className.indexOf('rotate') > -1
                || className.indexOf('fade') > -1
                || className.indexOf('scale') > -1
                || className.indexOf('slide') > -1
        }
        function addClassToGroup(group, className) {
            className = parseClassName(className);
            if (FabricClasses[group].indexOf(className) === -1) {
                FabricClasses[group].push(className);
            }
        }
        function getClassesFromPage() {
            numFabricClasses = 0;
            totalClasses = 0;
            chrome.devtools.inspectedWindow.eval('(' + processStylesheets.toString() + ')()', function (fabricClassNames) {
                if (fabricClassNames) {
                    totalClasses = totalClasses + fabricClassNames.length;
                    for (var i = 0; i < fabricClassGroupNames.length; i++) {
                        FabricClasses[fabricClassGroupNames[i]] = [];
                    }
                    for (var i = 0; i < fabricClassNames.length; i++) {
                        if ("undefined" === typeof fabricClassNames[i]) {
                            continue;
                        }
                        try {
                            let classes = fabricClassNames[i].split(', ');
                            totalClasses = totalClasses + (classes.length - 1);
                            for (var j = 0; j < classes.length; j++) {
                                let oneClassName = classes[j];
                                assignToClassGroup(oneClassName);
                            }
                        }
                        catch (err) {
                            logMsg(i);
                            logMsg(fabricClassNames[i]);
                        }
                    }
                    for (var i = 0; i < fabricClassGroupNames.length; i++) {
                        FabricClasses[fabricClassGroupNames[i]].sort();
                    }
                    logMsg('Done getting classes from page-' + numFabricClasses + "/" + totalClasses);
                } else {
                    alert('No Fabric classes found on current page - please check your stylesheet refrences');

                }
            });

        }
        function parseClassName(oneClassName) {
            let retVal = oneClassName.replace('.', '');
            try {
                let delim = retVal.indexOf(',');
                if (delim > -1) {
                    retVal = retVal.substring(0, delim);
                }
                delim = retVal.indexOf(':');
                if (delim > -1) {
                    retVal = retVal.substring(0, delim);
                }
                delim = retVal.indexOf('--hover');
                if (delim > -1) {
                    retVal = retVal.substring(0, delim);
                }
            }
            catch (err) {

            }
            return retVal
        }
        function processStylesheets() {
            var rules;
            var retVal = [];
            var cssFiles = document.styleSheets;
            for (var i = 0; i < cssFiles.length; i++) {
                var sheet = cssFiles[i];
                rules = sheet.rules;
                if (rules && rules.length) {
                    for (var j = 0; j < rules.length; j++) {
                        var rule = rules[j];
                        if (rule.type === 1 && rule.selectorText && rule.selectorText.indexOf(".ms-") > -1) {
                            retVal.push(rule.selectorText);
                        }

                        if (rule.type === 4 && rule.cssRules) {
                            for (var k = 0; k < rule.cssRules.length; k++) {
                                var mediaRule = rule.cssRules[k];
                                if (mediaRule.type === 1 && mediaRule.selectorText && mediaRule.selectorText.indexOf(".ms-") > -1) {
                                    retVal.push(mediaRule.selectorText);
                                }
                            }
                        }
                    }
                }
            }
            return retVal;

        }

// Utilities
        function chromeInspectedWindowAvailable() {
            return chrome && chrome.devtools && chrome.devtools.inspectedWindow;
        }
        function doLaunch() {
            var url = ($(this).attr('data-href'));
            window.open(url, '_blank');
        }

//

        init();
    });
})(jQuery);

