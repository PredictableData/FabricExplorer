
(function($) {

	function FabricExplorer() {
		
	}

	FabricExplorer.prototype = {
		constructor: FabricExplorer,
		toggleClass: function(obj, cls) {
			try{
                $(obj).toggleClass(cls);
            }
            catch(err){
                console.log("Error: " + err);
            }
            
		},
        clearClasses: function(obj){
            $(obj).removeAttr('class');
        }        
	}

	$(function() {
		
		window.FabricExplorer = new FabricExplorer();
	});
})(jQuery);