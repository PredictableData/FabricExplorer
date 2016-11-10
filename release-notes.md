# Fabric Explorer v2

**Description**: Fabric Explorer (FabEx) is a Chrome browser extension which allows you to explore the UI aspects of Microsoft's Office UI Fabric quickly and easily live in a web page.  This allows you to either learn more about the Fabric classes or quickly build a UI using the functionality of Fabric.

**Video Demo**: https://youtu.be/e8v-Zw1iRZs (old version, but similar UI for all practical purposes)

**Install From** [Chrome Web Store](https://chrome.google.com/webstore/detail/fabric-explorer/iealmcjmkenoicmjpcebflbpcendnjnm)

**Fabric Resources**: http://blog.mannsoftware.com/?p=2311

##Release Details

**Release**: 2.0.1

**Release Date**: 11/10/2016

**Notes**: 
* Removed support for **file://** URLs as they were flaky and presented reliability issues
* FabEx now reads the Fabric classes live from the target web page when it is loaded so if you have added or removed classes from the Fabric CSS classes, FabEx will reflect those changes.  This also allows:
  * Support for past and future versions of the Fabric CSS classes, providing that the naming standards for the classes don’t change (i.e. Font Weight class names all begin ms-fontWeight, Icon class names all begin ms-Icon--, etc.)
  * Eventual expansion into other frameworks – i.e Bootstrap, etc.
* Changed to radio buttons when selecting classes that only allow one class to be assigned at a time
* Ability to manually reload Fabric classes from web page if desired (although I’m not sure why you would do this…)
* Provides information on how many Fabric classes are available in the target web page
* Minor bug fixes and code cleanup
* Documentation
* Note that due to a bug in Chrome, this version of FabEx will only work when the page and the Fabric CSS files are loaded from the same domain.  This means that if you are loading Fabric from a CDN, or any domain other than the one where your HTML is coming from, FabEx will not be able to read the available classes.  I have a workaround in process but it won't be published until after my next Pluralsight course in December 2016.  
* I released a sister-project, FabEx Playground, that provides an environment for exploring Fabric.  It includes an embedded version of each Fabric release from 1.0 through 4.1.0 so you can select which version of Fabric to use.  More details available here: https://github.com/Sector43/FabExPlayground.

_____

**Release**: 1.3 

**Release Date**: 3/3/2016

**Notes**: 
* Added support for pages loaded into the browser via a **file://** URL
* Fixed bugs that prevented the Reset button from correctly returning an element back to the original state it was in when the page was initially loaded
* Added the remainder of the Fabric Responsive Grid classes

_____

**Release**: 1.0  (Initial)

**Release Date**: 2/11/2016

**Notes**: 
* Initial release providing core functionality 


