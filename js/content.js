
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
        },
        storeOriginalClasses: function(obj){
            var $o = $(obj);
            var attr = $o.attr('loadClass');
            if (typeof attr === 'undefined' || attr === false) {
                $o.attr('loadClass', $o.attr('class'))
            }
        },
        resetOriginalClasses: function(obj){
            
            try{
                
                this.clearClasses(obj);
                var $o = $(obj);
                
                var attr = $o.attr('loadClass');
                if (typeof attr !== 'undefined' && attr !== false) {

                    $o.attr('class', $o.attr('loadClass'))
                }
            }
            catch(err){
                
                logMsg(err);
            }
            
        }
           
	}

	$(function() {
		
		window.FabricExplorer = new FabricExplorer();
	});
})(jQuery);