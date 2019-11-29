---
layout: post
title: "Update to My Image Recognition Service Tester - Amazon Rekognition Support"
date: "2017-09-04T13:22:00-07:00"
categories: [javascript]
tags: [nodejs]
banner_image: 
permalink: /2017/09/04/update-to-my-image-recognition-service-tester-amazon-rekognition-support
---

A few months ago I wrote up a quick little demo to help me test multiple image recognition services at once (<a href="https://www.raymondcamden.com/2017/06/15/testing-multiple-image-recognition-services-at-once/">Testing Multiple Image Recognition Services at Once</a>). This morning I was bored so I thought I'd quickly add a new test to the suite - <a href="https://aws.amazon.com/rekognition/">Amazon Rekognition</a>.

As before, I'm not trying to test out every aspect of the service, but rather hit the high points so it's easy to see - in comparison - how it handles the same input image as other services. Before I get into the Rekognition part, I did some other small tweaks ot my code as well.

Services can now be disabled a bit easier by modifying this part of index.js:

<pre><code class="language-javascript">services.push(google.doProcess(theFile, creds.google));
services.push(ibm.doProcess(theFile, creds.ibm));
services.push(microsoft.doProcess(theFile, creds.microsoft));
services.push(amazon.doProcess(theFile, creds.amazon));
</code></pre>

It isn't necessarily rocket science, but if you comment out one of the above lines, the test for that service won't be run. The front end will correctly recognize this and simply not render the result. I had to do this as my Microsoft key timed out and I was too lazy to renew it. (Sorry Microsoft, I still love ya!)

So let's talk Rekognition. In general, the most difficult part of this API was setting up the right credentials. That's a common theme with me and AWS, but it feels like it's getting a bit easier now so I think in the future it will be simpler. The other issue I ran into was documentation. The links under the [Rekognition Developers](https://aws.amazon.com/rekognition/developers/) page leads you to the [JavaScript SDK](https://aws.amazon.com/documentation/sdk-for-javascript/) which is generic for all of AWS. I had trouble finding SDK docs specific for Rekognition until I came across the refernece link: <a href="http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html">http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html</a>. This is the link you want to bookmark. 

Another thing to note is that the Rekognition service wants either an S3 path (no surprise there) or the actual bits of the image, up to 5 megs. Here's my complete Amazon tester module.

<pre><code class="language-javascript">var request = require(&#x27;request&#x27;);
var fs = require(&#x27;fs&#x27;);
var AWS = require(&#x27;aws-sdk&#x27;);

&#x2F;&#x2F; http:&#x2F;&#x2F;docs.aws.amazon.com&#x2F;AWSJavaScriptSDK&#x2F;latest&#x2F;AWS&#x2F;Rekognition.html
&#x2F;*
detectFaces
detectLabels
detectModerationLabels
recognizeCelebrities

*&#x2F;

function doProcess(path, auth) {

    var creds = new AWS.Credentials(auth.accessKeyId, auth.secretAccessKey);
    var myConfig = new AWS.Config({
        credentials: creds, region: auth.region
    });
    
    let recog = new AWS.Rekognition(myConfig);
    let params = {};
    
    let content = fs.readFileSync(path);
    params.Image = {% raw %}{Bytes: content}{% endraw %};

    let faces = new Promise((resolve, reject) =&gt; {
        recog.detectFaces(params, function(err, data) {
            if(err) reject(err);
            resolve(data);
        });
    });
    let labels = new Promise((resolve, reject) =&gt; {
        recog.detectLabels(params, function(err, data) {
            if(err) reject(err);
            resolve(data);
        });
    });
    let modlabels = new Promise((resolve, reject) =&gt; {
        recog.detectModerationLabels(params, function(err, data) {
            if(err) reject(err);
            resolve(data);
        });
    });
    let celebs = new Promise((resolve, reject) =&gt; {
        recog.recognizeCelebrities(params, function(err, data) {
            if(err) reject(err);
            resolve(data);
        });
    });


	return new Promise((resolve, reject) =&gt; {

		console.log(&#x27;Attempting Amazon recog&#x27;);
        Promise.all([faces, labels, modlabels, celebs]).then(values =&gt; {
            let faces = values[0];
            let labels = values[1];
            let modlabels = values[2];
            let celebs = values[3];
            let result = {
                faces:faces,
                labels:labels,
                modlabels:modlabels,
                celebs:celebs
            }
            resolve({% raw %}{&quot;amazon&quot;:result}{% endraw %});
        });
	});


}

module.exports = {% raw %}{ doProcess }{% endraw %}
</code></pre>

As I said above, I am *not* attempting to hit all aspects of the API. Instead I focused on 4 main parts: 

* finding general labels
* finding faces
* finding things that you may want to moderate (naughty bits)
* finding celebrities

I'm not going to share the 'render' code as it follows the same format as the others. (I do have some thoughts on the front end though - I'll share that at the end.) But let's consider some examples. 

First, consider the Captain:

![Picard](https://static.raymondcamden.com/images/2017/9/picard.jpg)

And here are the results:

<pre>
Faces

Note, this report is not showing: BoundingBox, Landmarks (location), or Pose

Brightness: 57.73588943481445
Sharpness: 99.98487854003906

Landmarks found:

eyeLeft
eyeRight
nose
mouthLeft
mouthRight
Labels

People (confidence: 99.27647399902344)
Person (confidence: 99.2764892578125)
Human (confidence: 99.27130126953125)
Art (confidence: 54.227542877197266)
Chair (confidence: 50.68247985839844)
Furniture (confidence: 50.68247985839844)
Face (confidence: 50.529090881347656)
Selfie (confidence: 50.529090881347656)
Moderation Labels

No moderation labels.

Celebrities

Note, this report includes uncecognized faces, but I believe it is the 
same as the Face report so they will not be displayed below. Also, I'm 
hiding the same information (BoundingBox, etc) for celebs.

Name: Patrick Stewart
www.imdb.com/name/nm0001772
Brightness: 
Sharpness:

Landmarks found:
</pre>

Pretty good results if you ask me. I also tried this picture of him:

![Still the captain](https://static.raymondcamden.com/images/2017/9/ps.jpg)

And it still recognized him as Patrick Stewart. Be sure to note (as I say in the results) that I'm not displaying the specific face location data. That's definitely returned and would help you narrow in on the actual face image (as well as the 'landmarks'). 

When using a picture of me (found <a href="https://www.raymondcamden.com/about/">here</a>), it noticed I had a beard, but thought there was a 50% chance I had a cap or hat. It also didn't recognize me as a celebrity, which is technically correct unfortunately. 

Given Sinistar...

<img src="https://static.raymondcamden.com/images/2017/6/bewareilive.jpg">

It had some interesting results:

<pre>
Labels

Flyer (confidence: 95.81148529052734)
Poster (confidence: 95.81148529052734)
Logo (confidence: 74.65271759033203)
Trademark (confidence: 74.65271759033203)
American Flag (confidence: 73.34989166259766)
Emblem (confidence: 73.34989166259766)
Flag (confidence: 73.34989166259766)
Brochure (confidence: 70.04080963134766)
Badge (confidence: 69.28379821777344)
Greeting Card (confidence: 63.669036865234375)
Mail (confidence: 63.669036865234375)
Art (confidence: 61.1774787902832)
Modern Art (confidence: 61.1774787902832)
Text (confidence: 51.11092758178711)
Label (confidence: 50.73374938964844)
</pre>

I find the flag label interesting. It definitely has a flag-like aspect. 

Anyway - as before, you can find the source code up on GitHub: <a href="https://github.com/cfjedimaster/recogtester">https://github.com/cfjedimaster/recogtester</a>.

Of course, the best news is that I think I can rewrite the front end in Vue - because that would be even more fun!