(function() {
    function Config() {
		this.ClassGroups = [];

        this.initClassGroups();
	}

    Config.prototype = {
		constructor : Config,
        initClassGroups: function(){
            this.ClassGroups.push(
                {
                    "name" : "FontSize",
                    "beginTestPosition" : 0,
                    "endTestPosition" : 13,
                    "testString" : ".ms-fontSize-"
                }
            );
            this.ClassGroups.push(
                {
                    "name" : "FontWeight",
                    "beginTestPosition" : 0,
                    "endTestPosition" : 15,
                    "testString" : ".ms-fontWeight-"
                }
            );
            this.ClassGroups.push(
                {
                    "name" : "FontColor",
                    "beginTestPosition" : 0,
                    "endTestPosition" : 14,
                    "testString" : ".ms-fontColor-"
                }
            );
            this.ClassGroups.push(
                {
                    "name" : "BGColor",
                    "beginTestPosition" : 0,
                    "endTestPosition" : 12,
                    "testString" : ".ms-bgColor-"
                }
            );
            this.ClassGroups.push(
                {
                    "name" : "BorderColor",
                    "beginTestPosition" : 0,
                    "endTestPosition" : 16,
                    "testString" : ".ms-borderColor-"
                }
            );
            this.ClassGroups.push(
                {
                    "name" : "Icon",
                    "beginTestPosition" : 0,
                    "endTestPosition" : 10,
                    "testString" : ".ms-Icon--"
                }
            );
            this.ClassGroups.push(
                {
                    "name" : "Grid",
                    "beginTestPosition" : 0,
                    "endTestPosition" : 8,
                    "testString" : ".ms-u-sm"
                }
            );
            this.ClassGroups.push(
                {
                    "name" : "Grid",
                    "beginTestPosition" : 0,
                    "endTestPosition" : 8,
                    "testString" : ".ms-u-md"
                }
            );
            this.ClassGroups.push(
                {
                    "name" : "Grid",
                    "beginTestPosition" : 0,
                    "endTestPosition" : 8,
                    "testString" : ".ms-u-lg"
                }
            );
            this.ClassGroups.push(
                {
                    "name" : "Grid",
                    "beginTestPosition" : 0,
                    "endTestPosition" : 8,
                    "testString" : ".ms-u-xl"
                }
            );
            this.ClassGroups.push(
                {
                    "name" : "Grid",
                    "beginTestPosition" : 0,
                    "endTestPosition" : 9,
                    "testString" : ".ms-u-xxl"
                }
            );
            this.ClassGroups.push(
                {
                    "name" : "Grid",
                    "beginTestPosition" : 0,
                    "endTestPosition" : 10,
                    "testString" : ".ms-u-xxxl"
                }
            );
            this.ClassGroups.push(
                {
                    "name" : "Grid",
                    "beginTestPosition" : 0,
                    "endTestPosition" : 11,
                    "testString" : ".ms-u-hidden"
                }
            );
        }

    }

	$(function() {
		
		window.FabExConfig = new Config();
	});
})();