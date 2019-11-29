---
layout: post
title: "Example of Async Linting support in Brackets Sprint 38"
date: "2014-04-15T18:04:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2014/04/15/Example-of-Async-Linting-support-in-Brackets-Sprint-38
guid: 5202
---

<p>
One of the more cooler updates to Brackets recently was the linting API. This came out back in October and I wrote up a <a href="http://blog.brackets.io/2013/10/07/new-linting-api/">review</a> of the API for the Brackets blog. It basically took 90% of the boiler plate code for linters and made it a heck of a lot simpler. 
</p>
<!--more-->
<p>
One thing that wasn't possible with the linter (or not <i>easy</i> at least) was handling linters that needed to do something asynchronously. One of my extensions, <a href="https://github.com/cfjedimaster/brackets-w3cvalidation">W3CValidation</a>, made use of a remote API to perform validation on HTML. (I've also got a wrapper for another HTML validator: <a href="https://github.com/cfjedimaster/brackets-htmlhint">HTMLHint</a>.)
</p>

<p>
Brackets Sprint 38 lands new support for handling asynchronous linters. The <a href="https://github.com/adobe/brackets/wiki/Release-Notes:-Sprint-38">release notes</a> aren't terribly clear on how you use this feature. They link to the bug report, which mainly just mentions scanFileAsync. Luckily the developer who landed the feature (and one who has helped out a lot on some of my extensions) shared an example that I was able to steal from. Credit for my update goes to <a href="https://github.com/busykai">busykai</a>. Here is the entirety of the main.js file for my W3CValidator extension.
</p>

<pre><code class="language-javascript">&#x2F;*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 *&#x2F;
&#x2F;*global define, brackets, $, window, W3CValidator *&#x2F;

define(function (require, exports, module) {
	&#x27;use strict&#x27;;
	
	var CodeInspection			= brackets.getModule(&quot;language&#x2F;CodeInspection&quot;),
		AppInit                 = brackets.getModule(&quot;utils&#x2F;AppInit&quot;);

	require(&#x27;w3cvalidator&#x27;);
	
	function _handleValidation(text, fullPath) {
		var response = new $.Deferred();
		var result = {% raw %}{errors:[]}{% endraw %};
			
		W3CValidator.validate(text, function (res) {
			var messages = res.messages;
			
			if (messages.length) {
									
				messages.forEach(function (item) {
					console.log(&#x27;W3CValidation messsage &#x27;,item);
					var type = CodeInspection.Type.ERROR;
					if (item.type === &quot;warning&quot;) {
                        type = CodeInspection.Type.WARNING;
                    }
					result.errors.push({
						pos: {% raw %}{line:item.lastLine-1, ch:0}{% endraw %},
						message:item.message,
						type:type
					});
					
				});
		  
			}

			response.resolve(result);        
			
		}); 

		return response.promise();

	}
		
	AppInit.appReady(function () {


		CodeInspection.register(&quot;html&quot;, {
			name: &quot;W3CValidation&quot;,
			scanFileAsync: _handleValidation
		});
		
	});
	
	
});
</code></pre>

<p>
First - note the use of scanFileAsync in the CodeInspection.register method. I'm telling it to use _handleValidation and to expect an async response. The function then simply creates a new deferred object and returns the promise. My handler calls off to my W3C service and when done, massages the results into the expected format and resolves the promise. 
</p>

<p>
And yeah - that's it. But as I said, it wasn't immediately obvious to me based on the release notes so I hope this helps others.
</p>