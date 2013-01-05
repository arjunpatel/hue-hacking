/**
 * 	Color utility functions, exposed as an AMD module.
 *	No external dependencies.
 */
define(function () {
	
	////
	//	Utility functions for hex parsing and rgb conversion
	////
	
	var hexToRed = function (hex) {
		return parseInt( hex.substring(0, 2), 16 );
	};
	
	var hexToGreen = function (hex) {
		return parseInt( hex.substring(2, 4), 16 );
	};
	
	var hexToBlue = function (hex) {
		return parseInt( hex.substring(4, 6), 16 );
	};
	
	var hexToRGB = function (h) {
		var rgb = [hexToRed(h), hexToGreen(h), hexToBlue(h)];
		return rgb;
	};
	
	/**
	 *	Translate initial RGB value in the 0-255 range to a
	 *	usable CIE 1931 equivalent.
	 *	Algorithm from: 
 	 *		http://www.easyrgb.com/index.php?X=MATH&H=02#text2
	 *
	 *	@param {Number} Value in the 0-255 RGB color range.
 	 */
	var translateRGBValue = function(rgbValue /* Number */) {
		rgbValue = rgbValue / 255.0;
		if (rgbValue > 0.04045) {
			rgbValue = ((rgbValue + 0.055) / 1.055);
			rgbValue = Math.pow(rgbValue, 2.4);
		} else {
			rgbValue = rgbValue / 12.92;
		}
		return rgbValue;
	};
	
	/**
	 *	Generates a random number between 'from' and 'to'.
	 *
	 *	@param {Number} Number representing the start of a range.
	 *	@param {Number} Number representing the end of a range.
	 */
	var randomFromInterval = function(from /* Number */, to /* Number */) {
		return Math.floor(Math.random() * (to - from + 1) + from);
	};
	
	return {
		/**
		 *	Converts hexadecimal colors represented as a String to approximate
		 *	CIE 1931 coordinates. May not produce accurate values.
		 *
		 *	@param {String} Value representing a hexadecimal color value
		 *	@return {Array{Number}} Approximate CIE 1931 x,y coordinates.
		 */
		hexToCIE1931 : function (h) {
			var rgb = hexToRGB(h);
			return this.rgbToCIE1931(rgb[0], rgb[1], rgb[2]);
		},
		/**
		 *	Converts red, green and blue integer values to approximate CIE 1931
		 *	x and y coordinates. Algorithm from: 
		 *	http://www.easyrgb.com/index.php?X=MATH&H=02#text2. May not produce
		 *	accurate values.
		 *
		 *	@param {Number} red Integer in the 0-255 range.
		 *	@param {Number} green Integer in the 0-255 range.
		 *	@param {Number} blue Integer in the 0-255 range.
		 *	@return {Array{Number}} Approximate CIE 1931 x,y coordinates.
		 */
		rgbToCIE1931 : function (red, green, blue) {
			var x,
				y,
				r = translateRGBValue(red),
				g = translateRGBValue(green),
				b = translateRGBValue(blue);
			
			x = r * 0.4124 + g * 0.3576 + b * 0.1805;
			y = r * 0.2126 + g * 0.7152 + b * 0.0722;
			
			return [x, y];
		},
		/**
		 *	Returns the approximate CIE 1931 x,y coordinates represented by the 
		 *	supplied hexColor parameter, or of a random color if the parameter
		 * 	is not passed.
		 *
		 *	@param {String} hexColor String representing a hexidecimal color value.
		 *	@return {Array{Number}} Approximate CIE 1931 x,y coordinates.
		 */
		getCIEColor : function (hexColor /* String */) {
			var hex = hexColor || null;
			var xy = [];
			if (null !== hex) {
				xy = this.hexToCIE1931(hex);
			} else {
				var r = randomFromInterval(0, 255);
				var g = randomFromInterval(0, 255);
				var b = randomFromInterval(0, 255);
				xy = this.rgbToCIE1931(r, g, b);
			}
			return xy;
		}
	};
});