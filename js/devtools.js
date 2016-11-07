(function($) {
	/*Create a sidebar tool (sidebar name, sidebar icon, sidebar callback)*/
	chrome.devtools.panels.elements.createSidebarPane(chrome.runtime.getManifest().name, function(sidebar) {
		/*set panel page*/
		sidebar.setPage('panel.html');
		
	});
})(jQuery);