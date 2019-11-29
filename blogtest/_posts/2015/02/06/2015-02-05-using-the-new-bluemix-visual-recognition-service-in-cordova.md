---
layout: post
title: "Using the new Bluemix Visual Recognition service in Cordova"
date: "2015-02-06T11:11:41+06:00"
categories: [development,javascript,mobile]
tags: [bluemix]
banner_image: 
permalink: /2015/02/06/using-the-new-bluemix-visual-recognition-service-in-cordova
guid: 5644
---

Before I begin, a quick disclaimer. I've been at IBM for a grand total of five days. Considering three were taken up by travel and orientation, I'm <i>very</i> much the new kid on the block here. I've only begun to look into <a href="https://www.ibm.com/mobilefirst/us/en/">MobileFirst</a> and <a href="http://www.ibm.com/software/bluemix">Bluemix</a> so you should take what I show here with the same confidence you would give anyone using a new technology for two days. In other words - proceed with caution! ;)

<!--more-->

Bluemix is a cloud platform that offers both Platform as a Service (PaaS) and MBaaS (Mobile Backend as a Service). The PaaS offerings let you deploy web applications using a variety of engines, including Node. I'm currently use <a href="http://www.appfog.com">AppFog</a> as my PaaS for a few sites so I'm already a bit familiar with the concept. The MBaaS side are services that integrate with your web or mobile apps. These include things like NoSQL datastorage and access to IBM Watson.

Yesterday we announced <a href="https://developer.ibm.com/watson/blog/2015/02/04/new-watson-services-available/">five new services</a> that make use of the Watson. They include: <a href="http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/speech-to-text.html">Speech to Text</a> and <a href="http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/text-to-speech.html">Text to Speech</a>, <a href="http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/visual-recognition.html">Visual Recognition</a>, <a href="http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/concept-insights.html">Concept Insights</a>, and <a href="http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/tradeoff-analytics.html">Tradeoff Analytics</a>.

As soon as I saw the Visual Recognition API (<a href="http://visual-recognition-demo.mybluemix.net/">demo link</a>) I thought - this would be cool in Cordova!

One thing I wasn't sure of though was how to use the service by itself, and not with a particular application. I checked the docs and came across this <a href="https://www.ng.bluemix.net/docs/#services/reqnsi.html#config">Enabling external applications and third-party tools to use Bluemix services</a>:

<blockquote>
You might have applications that were created and run outside of Bluemix, or you might use third-party tools. If Bluemix services provide endpoints that are accessible from the internet, you can use those services with your local apps or third-party tools.

To enable an external application or third-party tool to use a Bluemix service, complete the following steps:

<ol>
<li>Request an instance of the service for an existing Bluemix application. The credentials and connection parameters for the service are created. For more information about requesting a service instance, see Requesting a new service instance.
<li>Retrieve the credentials and the connection parameters of the service instance from the VCAP_SERVICES environment variable of the Bluemix application.
<li>Specify the credentials and the connection parameters in your external application or third-party tool.
</ol>
</blockquote>

My understanding of that was that I needed to make a new Node application and simply create a view that would dump out VCAP_SERVICES. I wished it were easier, but I figured if I did this once, I could reuse the same Node code in the future when I needed to test out another service. Turns out I didn't need to do all those steps. This next section will focus on what you have to do on the Bluemix side to prepare the service. I'll then switch to the Cordova side.

After signing up for Bluemix (you can get a free, 30 day trial), you want to first create an application. You won't actually be <i>using</i> the application, but it is necessary to get the proper credentials to use the service.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/bm1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/bm1.png" alt="bm1" width="750" height="380" class="alignnone size-full wp-image-5645" /></a>

On the next screen I selected Web. This may be something I change next time I do this.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/bm2.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/bm2.png" alt="bm2" width="750" height="315" class="alignnone size-full wp-image-5646" /></a>

And then I selected the Node option. Since I really wasn't using the app, I probably could have selected "I Have Code Already."

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/bm3.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/bm3.png" alt="bm3" width="750" height="284" class="alignnone size-full wp-image-5647" /></a>

For the application name, pick anything. If you pick "RayIsTheBestNewIBMer" you get double the time for your free trial. (Note - the preceding statement may not be exactly true.)

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/bm4.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/bm4.png" alt="bm4" width="750" height="314" class="alignnone size-full wp-image-5648" /></a>

On the next screen, select Add a Service:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/bm5.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/bm5.png" alt="bm5" width="750" height="393" class="alignnone size-full wp-image-5649" /></a>

And then - obviously - select the Visual Recognition service. Note the beta label. Results may vary. Yada, yada, yada.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/bm6.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/bm6.png" alt="bm6" width="750" height="411" class="alignnone size-full wp-image-5650" /></a>

Since you added this service <i>from</i> an app, it will be automatically selected in the next screen. (You may not have a "Space" though. I made a few while testing and I don't remember if it is required or not.)

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/bm7.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/bm7.png" alt="bm7" width="412" height="521" class="alignnone size-full wp-image-5651" /></a>

You'll get a warning about needing to restage the application, but since you don't have anything there anyway you can just go ahead and let it restart the app. Woot - almost done. Now we need the authentication and API info. Back on the app dashboard, note there is a link to show credentials for the service:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/bm8.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/bm8.png" alt="bm8" width="750" height="433" class="alignnone size-full wp-image-5652" /></a>

Clicking that will expose properties for the service including the ones we care about: <strong>url</strong>, <strong>username</strong>, and <strong>password</strong>:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/bm9.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/bm9.png" alt="bm9" width="631" height="750" class="alignnone size-full wp-image-5653" /></a>

Ok, we've got what we came for, let's talk about the Cordova side. I began by creating a simple application that would make use of the Camera API. I created a web page with two buttons - one to source from the device camera and one from the photo gallery. Once I had the image file, I would then make use of the File Transfer plugin to post to the API.

Documentation for the Visual Recognition API may be found here: <a href="http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/apis/#!/visual-recognition/">http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/apis/#!/visual-recognition/</a>. I focused my attention on the POST call to /v1/tag/recognize. I saw there that I needed to send the image with a file name of <strong>img_file</strong>. Let's take a look at the code (this portion and the rest may be found in the Github URL I'll share towards the end):

<pre><code class="language-javascript">

var API_URL = &quot;https:&#x2F;&#x2F;gateway.watsonplatform.net&#x2F;visual-recognition-beta&#x2F;api&quot;;
var API_USER = &quot;supersecret&quot;;
var API_PASSWORD = &quot;anothersecret&quot;;

$(document).on(&quot;deviceready&quot;, function() {

    function uploadWin(res) {
        var data = JSON.parse(res.response);
        var labels = data.images[0].labels;
        var result = &quot;&lt;p&gt;Detected the following possible items:&lt;br&#x2F;&gt;&quot;;
        for(var i=0, len=labels.length; i&lt;len; i++) {
            result += &quot;&lt;b&gt;&quot;+labels[i].label_name + &quot;&lt;&#x2F;b&gt;&lt;br&#x2F;&gt;&quot;;   
        }
        $(&quot;#status&quot;).html(result);
    }
    
    function uploadFail() {
        console.log(&#x27;uploadFail&#x27;);
        console.dir(arguments);
    }
    
    &#x2F;&#x2F;Credit: http:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;14313052&#x2F;52160
    function authHeaderValue(username, password) {
        var tok = username + &#x27;:&#x27; + password;
        var hash = btoa(tok);
        return &quot;Basic &quot; + hash;
    };
    
    function onCamSuccess(imageData) {
		var image = document.getElementById(&#x27;myImage&#x27;);
        $(&quot;#imgDisplay&quot;).attr(&quot;src&quot;, imageData);

        $(&quot;#status&quot;).html(&quot;&lt;i&gt;Uploading picture for BlueMix analysis...&lt;&#x2F;i&gt;&quot;);
        
        var options = new FileUploadOptions();
        options.fileKey = &quot;img_file&quot;;
        options.fileName = imageData.substr(imageData.lastIndexOf(&#x27;&#x2F;&#x27;) + 1);
        
        options.headers = {% raw %}{&#x27;Authorization&#x27;: authHeaderValue(API_USER, API_PASSWORD) }{% endraw %};
        
        var ft = new FileTransfer();
        ft.upload(imageData, encodeURI(API_URL+&quot;&#x2F;v1&#x2F;tag&#x2F;recognize&quot;), uploadWin, uploadFail, options);

    }

    function onCamFail(message) {
	alert(&#x27;Failed because: &#x27; + message);
    }	
    
    &#x2F;&#x2F;Touch handlers for the two buttons, one uses lib, one uses cam
    $(&quot;#cameraButton, #galleryButton&quot;).on(&quot;touchend&quot;, function() {
        var source = ($(this).prop(&quot;id&quot;)===&quot;cameraButton&quot;)?Camera.PictureSourceType.CAMERA:Camera.PictureSourceType.PHOTOLIBRARY;
        
		navigator.camera.getPicture(onCamSuccess, onCamFail, { 
			quality: 50,
			sourceType: source,
			destinationType: Camera.DestinationType.FILE_URI
		});

    });
    
});
</code></pre>

I assume the camera usage is not necessarily new for my readers. All I do "fancy" here is switch my source based on the button clicked. As soon as I have the image I render it on the app so the user can see it. I then begin my file transfer. I use the URL I got from the service and ensure I include my authorization info. I'm using fake values in the code above of course. (More on that in a minute.) 

Once done, I take the result and simply output the labels to the app. The service returns labels with an underscore between words and that could be cleaned up, but I didn't really bother. Here are a few samples. Of course, the results are not perfect, but close, and can be improved. First, a scary picture of myself.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/bm10.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/bm10.png" alt="bm10" width="360" height="750" class="alignnone size-full wp-image-5654" /></a>

I'm not quite sure where <strong>Combat Sport</strong> came from, but I'm all about the combat sport. <strong>Meat Eater</strong> is also dead on too. On a serious note, <strong>human</strong>, <strong>indoors</strong> and <strong>person view</strong> were perfect. 

Each label returns a score and you could use that to filter out items that appear to be too low. I'm not doing that in this demo but that would help improve the results shown to the user. Ok, another test.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/bm11.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/bm11.png" alt="bm11" width="360" height="750" class="alignnone size-full wp-image-5655" /></a>

Personally I think <strong>toothed whale</strong> is pretty damn funny. It didn't recognize shark, but it got close, which I think is pretty good. 

Another option the API supports is including labels to narrow down the search. One could use that to help direct the results as well.

So - the obvious issue we have with this demo is that the username and password are available in the source code. One way around that would be to actually <i>use</i> the Node application and have it work as a proxy. That would let me log, monitor, restrict to authorized users, etc. 

I've put the source code for this up on my Github repo of Cordova demos. You can find it here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/imagerecognitionbluemix">https://github.com/cfjedimaster/Cordova-Examples/tree/master/imagerecognitionbluemix</a>