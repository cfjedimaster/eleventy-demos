---
layout: post
title: "Testing MetaCert's Security API Service"
date: "2015-03-13T12:24:22+06:00"
categories: [development,javascript,mobile]
tags: []
banner_image: 
permalink: /2015/03/13/testing-metacerts-security-api-service
guid: 5825
---

Earlier this week I was contacted by folks at <a href="https://metacert.com/">MetaCert</a>. They provide an API that performs URL reputation checking. Basically, given a URL, it can report on possible issues with the content at that URL. Desktop browsers can help block URLs that lead to known malware (or other dangerous) sites, but mobile browsers don't typically have that protection. Heck, you can't even typically <i>see</i> the URL of a link when viewing web-based content in mobile apps. MetaCert's API lets you check a URL and then determine if it should be blocked. 

<!--more-->

The level of detail in the API is pretty impressive. As an example (and I'm stealing this right from the <a href="https://wordpress.metacert.com/api-documentation/getting-started/">docs</a>), given a URL "http://imgur.com/r/sex/sexy.html", the API will report the entire URL as being porn, the folder (/r/sex/) as being porn, and that the domain (imgur) is an image sharing service. Given a completely different URL, like "http://imgur.com/r/cats/kittens.html" (this URL like the last one are made up), you may decide that even if the URL has nothing wrong with it, you don't feel comfortable with an image sharing domain at all. That level of specificity is really nice as it lets you decide how protective you want to be. 

Currently the URLs are checked for malware and porn, but additional categories (alcohol, file sharing, and gambling are examples) will be added soon. While such a solution will never be 100% perfect, they currently have over ten billion URLs in their library which is pretty damn impressive.

From a developer perspective, the API is about as simple as it can get. To test it, I built a quick Ionic app with a fake registration form:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/iOS-Simulator-Screen-Shot-Mar-13-2015-12.12.59-PM1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/iOS-Simulator-Screen-Shot-Mar-13-2015-12.12.59-PM1.png" alt="iOS Simulator Screen Shot Mar 13, 2015, 12.12.59 PM" width="422" height="454" class="alignnone size-full wp-image-5828" /></a>
I then implemented a basic form submit handler in my controller.

<pre><code class="language-javascript">.controller(&#x27;MainCtrl&#x27;,function($scope,$http) {
	$scope.apiKey = &quot;changeme&quot;;
	$scope.hasErrors = false;
	$scope.errors = [];
	
	$scope.validateForm = function() {
		console.log(&quot;validation called&quot;);
		$scope.errors = [];
		$scope.hasErrors = false;
		
		if(!$scope.fName || $scope.fName == &#x27;&#x27;) $scope.errors.push(&quot;First name required.&quot;);
		if(!$scope.lName || $scope.lName == &#x27;&#x27;) $scope.errors.push(&quot;Last name required.&quot;);
		
		if(!$scope.homepage || $scope.homepage == &#x27;&#x27;) $scope.errors.push(&quot;Homepage required.&quot;);
		
		if($scope.errors.length == 0) {
			
			&#x2F;&#x2F;now do the API call
			var conf = {};
			conf.headers = {% raw %}{&quot;apikey&quot;:$scope.apiKey}{% endraw %};
			var body = {% raw %}{&quot;url&quot;:$scope.homepage}{% endraw %};
			var resp = $http.post(&#x27;https:&#x2F;&#x2F;dev.metacert.com&#x2F;v4&#x2F;check&#x2F;&#x27;,body,conf);

			resp.success(function(result) {
				console.log(&#x27;resp success&#x27;);
				console.dir(result);
				if(result.data.URLs.length) {
					$scope.errors.push(&quot;Your URL has been flagged as potentially offensive.&quot;);
					$scope.hasErrors = true;
				}
			});

			resp.error(function(data,status) {
				console.log(&#x27;resp error&#x27;);
				console.dir(arguments);
			});
			
		} else {
			$scope.hasErrors = true;
		}
		
	};
	
})</code></pre>

Ignoring the boilerplate form validation stuff, look at the $http portion. I set a header with my API key and craft a body containing the URL the user entered. The response from MetaCert will include a data key with three arrays: URLs, Folders, and Domains. At this point, what you do is dependent on your particular needs. To keep it simple, I check the URLs array if there is anything at all there, I flag it as an error. Going further when MetaCert has more categories, I would probably need to be more specific here and check to see exactly what type of category was returned. 

As an example, here is a JSON response for the sexy URL used earlier:

<pre><code class="language-javascript">{
    "status": {
        "code": 200,
        "message": "OK"
    },
    "data": {
        "URLs": [
            {
                "url": "http://imgur.com/r/sex/sexy.html",
                "type": "xxx"
            }
        ],
        "Folders": [
            {
                "folder": "/r/sex/",
                "type": "xxx"
            }
        ],
        "Domains": [
            {
                "domain": "imgur.com",
                "type": "image-sharing"
            }
        ]
    }
}</code></pre>

If you want to try out this sample app, you'll need to sign up first so you can get an API key. Check their <a href="https://metacert.com/#pricing">pricing info</a> sheet for current prices, but at the time I wrote this, the cost is 10 bucks a month, which seems great. There is a free trial so you can try before you buy. If you want to try it with my demo, you can grab the source here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/metacert">https://github.com/cfjedimaster/Cordova-Examples/tree/master/metacert</a>. Just modify the apiKey in the JavaScript file. 

As always - if you try out this service (or have tried it already) I'd love to hear what you think in the comments below.