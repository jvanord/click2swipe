// Load jQuery
if (typeof(jQuery)=="undefined") {
	function getScript(url, success) {
		var script = document.createElement("script");
		script.src = url;
		var head = document.getElementsByTagName("head")[0],
		done = false;
		script.onload = script.onreadystatechange = function() {
			if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
			done = true;
				success();
				script.onload = script.onreadystatechange = null;
				head.removeChild(script);
			};
		};
		head.appendChild(script);
	};
	getScript("http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js", function() {
		if (typeof jQuery=="undefined") console.log("Multiple jQuery Failure in Click-2-Swipe");
		else jQuery(onJQueryReady);
	});
} else {
	jQuery(onJQueryReady);
};

function onJQueryReady(){

	var c2sAlwaysReady = false;
	var c2sIsReady = false;
	var c2sInput = "";
	var c2sTimer;
	
	// Center
	if (!jQuery.fn.center) jQuery.fn.center = function () { this.css("position", "absolute"); this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px"); this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px"); return this; }

	// Prevent Context Menu and Control Key
	jQuery(window).bind("contextmenu",function(event) {event.preventDefault();});
	jQuery(window).keydown(function(event){if(event.ctrlKey){event.preventDefault();}});
	
	// Read and Cancel Events
	if (c2sAlwaysReady) c2sReady();
	jQuery("#trigger").click(c2sReady);
	jQuery("#c2s_cancel").click(c2sDone);
		
	function c2sReady(){
		if (!c2sAlwaysReady){
			jQuery("#c2s").center().slideDown(100);
			jQuery("#c2s_wait").hide();
		}
		c2sIsReady = true;
		c2sInput = "";
		jQuery(window).keypress(function (event) {
			if (c2sIsReady){
				event.preventDefault();
				c2sReadCharacter(event.keyCode);
			}
		});
	};

	function c2sReadCharacter(key){
		clearTimeout(c2sTimer);
		c2sTimer = setTimeout(function(){c2sParse(c2sInput);},1000);
		//c2sParse(c2sInput);
		if (key > 31) c2sInput += String.fromCharCode(key);
	}

	function c2sParse(input){
		//%B5178059396952807^VANORD/JASON ^1403101000000000011127313000000?
		//;5178059396952807=140310111127313?
		//alert(input);
		console.log(input);
		//jQuery("#c2s_wait").show();
		var fullLine = input.selectBetween("%B", "?");
		var number = fullLine.selectBetween("", "^"); // input.match(/(?:\%B)(\d{16})(?:\^)/i)[1];
		var fullName = fullLine.selectBetween(number + "^", "^");
		var date = fullLine.selectBetween(fullName + "^", "").substr(0,4); // input.match(/(?:\^)(\d{4})/i)[1];
		var lname = fullName.selectBetween("", "/"); // input.match(/(?:\^)(\w+)(?:\/)/i)[1];
		var fname = fullName.selectBetween("/", " "); // input.match(/(?:\/)(\w+)(?: )/i)[1];
		if (fname.length < 1) fname = fullName.selectBetween("/", "");
		var mname = fullName.selectBetween(" ", ""); // input.match(/(?: )(\w+)(?:\^)/i)[1];
		if (number.length < 16) { alert("Card Number Error"); return false; }
		if (date.length < 4) { alert("Card Number Error"); return false; }
		jQuery("#cardnumber").val(number.substr(0,4) + "-" + number.substr(4,4) + "-" + number.substr(8,4) + "-" + number.substr(12,4));
		jQuery("#expires").val(date.substr(2,2) + "/" + date.substr(0,2));
		jQuery("#lname").val(lname);
		jQuery("#fname").val(fname);
		jQuery("#mname").val(mname);
		c2sDone();
	}

	function c2sDone(){
		jQuery(window).unbind("keypress");
		c2sInput = "";
		if (!c2sAlwaysReady) c2sIsReady = false;
		//jQuery("#c2s_wait").show();
		jQuery("#c2s").slideUp();
	}

	String.prototype.selectBetween = function (from, to){
		if (this.length < from.length + to.length) return "";
		var a = 0;
		if (from.length > 0) a = this.indexOf(from);
		if (a < 0) return ""; else a += from.length;
		var b = a + 1;
		if (to.length > 0) b = this.indexOf(to, b); else b = this.length - 1;
		if (b <= a) return "";
		return this.slice(a, b);
	}

	/* jQuery Plugin
	(function(jQuery) {  

		// Constructor
		jQuery.fn.click2swipe = function(options) {  
			options = jQuery.extend({}, jQuery.fn.click2swipe.defaultOptions, options);
			this.each(function() {
			
				var element = jQuery(this); //Manipulate element here ...  
			
			});        
			return this;
		};

		// Defaults
		jQuery.fn.click2swipe.defaultOptions = {
			class: 'watermark',
			text: 'Enter Text Here'
		}
		
		//Public Function greet
		jQuery.fn.click2swipe.greet = function(name) {
			console.log('Hello, ' + name + ', welcome to Script Junkies!');
		};
		
		// Input Complete
		jQuery.fn.click2swipe.ReadComplete = function (){
			jQuery(window).unbind("keypress");
			c2sInput = "";
			if (!c2sAlwaysReady) c2sIsReady = false;
			jQuery("#c2s_wait").show();
			jQuery("#c2s").hide();
		}

	})(jQuery); /**/
}