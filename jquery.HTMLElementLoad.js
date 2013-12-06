/*
 * Copyright 2013-2015 Luke Rebarchik
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 
 Expected use example:
	//	Attach load handler to all images with document ready
	$(document).ready(function() {
		//	If you want to check only some images, or additional media that has a height you can modify this jquery selector to include/exclude those elements.
		$("img").bind("load", function(){
			//	Do something with images...
		});
	});
 
 */
/*
	Expanded "load" handler for all html tags.
		Based upon the work of:
		* MIT License
		* Paul Irish     | @paul_irish | www.paulirish.com
		* Andree Hansson | @peolanha   | www.andreehansson.se
		* 2010.
		* https://raw.github.com/peol/jquery.imgloaded/master/ahpi.imgload.js
*/
(function ($) {
	//	For cross-browser compatibility we should handle the load event more delicately
	//		To be thorough we should also hit all element types with this added functionality - ensuring that the load event is fired automatically if already loaded on all of them.
	$.event.special.load = {
		add: function (handlerFunc) {
			if ( this.nodeType === 1 ) {
				//		We only want to attach a load event to nodeType 1 (ELEMENT_NODE) because attributes, CDATA, text, comments and other nodes would be silly to include.
				if ( this.complete || this.readyState === 4 ) {			//	We're relying on one of these two properties (Gotta love IE, right?) NOTE: unsupported in IE for the <script> tag. Possible other support potholes.
					handlerFunc.handler.apply(this);	//	When the resource is reporting ready, simply run the handler immediately.
				} else if (this.tagName.toLowerCase() === 'img' || this.src != undefined) {	//		specific errors for image tags
					//	Images may be embedded using "data:" -- if this is such an image detect whether data URI images is supported, fire 'error' event if not
					//		Essentially the embedded images (or other elements with a "src") should never be uninitialized, they contain their data.
					if( this.readyState === 'uninitialized' && this.src.indexOf('data:') === 0 ) {
						$(this).trigger('error');
					} else {
						$(this).bind('load', handlerFunc.handler);	//	Bind the provided handler
					}
				} else {
					$(this).bind('load', handlerFunc.handler);		//	Bind the provided handler
				}
			}
		}
	};
}(jQuery));