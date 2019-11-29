---
layout: post
title: "Serving up CFIMages via Image Tags (and a Non-CF Friday contest!)"
date: "2007-09-14T09:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/14/Serving-up-CFIMages-via-Image-Tags-and-a-NonCF-Friday-contest
guid: 2347
---

Todd Sharp recently pinged me about an interesting problem. He was working with Images generated in ColdFusion 8 and was trying to use this imaga via the HTML IMG tag, like so:

<code>
&lt;img src="foo.cfm"&gt;
</code>

The code in foo.cfm generated the graphic and he couldn't quite figure out how to display it. One thing he tried was the WriteToBrowser action:

<code>
&lt;cfimage action="writeToBrowser" ...&gt;
</code>

This didn't work - and if you view source on a file using this action you will see why. The WriteToBrowser action actually generates HTML that points to a 'magic' URL to serve the image. 

He also tried cfcontent:

<code>
&lt;cfimage action="read" source="paris.jpg" name="paris"&gt;
&lt;cfcontent type="image/jpg" variable="#paris#"&gt;
</code>

This also failed as well. Why? The cfcontent tag doesn't like the Image variable. ColdFusion will throw the following error:

<blockquote>
coldfusion.image.Image is not a supported variable type. The variable is expected to contain binary data.
</blockquote>

If you think about it - this makes sense. Image variables aren't binary data in ColdFusion. While they may <i>store</i> binary data, ColdFusion wraps up the data in a new "Image" variable type. Now personally I think cfcontent should be smart enough to recognize a image variable and deal with it - but what do you in the meantime?

ColdFusion provides a <a href="http://www.cfquickdocs.com/cf8/?getDoc=ImageGetBlob">ImageGetBlob</a> function. This returns the binary data of the image and can be safely used with cfcontent like so:

<code>
&lt;cfimage action="read" source="paris.jpg" name="paris"&gt;
&lt;cfcontent type="image/jpg" variable="#imageGetBlob(paris)#"&gt;
</code>

But wait - there is a catch! This works ok as long as you <i>begin</i> your image with a real image. Notice above I have a image file I'm beginning with. If I use a 100% virtual image then it doesn't work. Consider:

<code>
&lt;cfset canvas = imageNew("", 100, 100, "rgb", "white")&gt;
</code>

If you run imageGetBlob on this, you get:

<blockquote>
The source file should contain an extension,so that ColdFusion can determine the image format.
</blockquote>

So I'm not 100% sure - but this is how I read this. I had created an image of a certain type of image type. But there was no <i>file type</i> for the image. Obviously I could write the variable out to a file, but there is no way to go directly from an "pure" Image variable to a blob. I'm going to file an enhancement request to add support for this. In the meantime if you needed to do something like this, I'd recommend creating a "canvas" graphic in your desired format and seed your dynamic image with that.

Ok - so now for the contest part. I whipped up a quick demo to show the code described above in action. I call it the Paris-Talkometer. Let me show you the code and then I'll link to the application. 

<code>
&lt;cfparam name="url.caption" default=""&gt;

&lt;cfajaxproxy bind="javascript:updImage({% raw %}{caption}{% endraw %})"&gt;

&lt;script&gt;
function updImage(str) {
	if(str != '') document.getElementById('myimg').src = 'imgs3.cfm?caption='+escape(str);
}
&lt;/script&gt;

&lt;h2&gt;Paris-Talkometer&lt;/h2&gt;

&lt;cfform name="form"&gt;
&lt;cfinput type="text" name="caption" value="#url.caption#" &gt; &lt;cfinput name="mybutton" type="button" value="Update"&gt;&lt;br /&gt;
&lt;cfinput type="image" name="myimage" src="imgs3.cfm?caption=#url.caption#" id="myimg"&gt;
&lt;/cfform&gt;
</code>

What we have is is a basic form. There is a text box for a caption, and a cfinput image type that points to imgs3.cfm. Notice though that it passes a URL variable. Go back up to the top of the file and see how I use cfajaxproxy to bind to the caption. Whenever the caption changes, I use a bit of JavaScript to the change the SRC of the image. Here is the code behind imgs3.cfm:

<code>
&lt;cfparam name="url.caption" default=""&gt;

&lt;cfimage action="read" source="paris.jpg" name="paris"&gt;

&lt;cfif len(trim(url.caption))&gt;

	&lt;cfset imageSetDrawingColor(paris, "black")&gt;
	&lt;cfset imageDrawRect(paris, 1, 1, paris.width, 40, true)&gt;
	
	&lt;cfset imageSetAntialiasing(paris, "on")&gt;
	&lt;cfset imageSetDrawingColor(paris, "white")&gt;
	&lt;cfset text = {% raw %}{ style='bold', size=12, font='verdana' }{% endraw %}&gt;
	&lt;cfset imageDrawText(paris, url.caption, 10, 25, text)&gt;

&lt;/cfif&gt;

&lt;cfcontent type="image/jpg" variable="#imageGetBlob(paris)#"&gt;
</code>

All I'm really doing here is looking for a URL.caption value. If it exists, I draw some text over the picture. The last thing I do is serve up the image using cfcontent and imageGetBlob. 

You can see this in action here: <br />
<a href="http://www.raymondcamden.com/demos/imagecfcontent/test3.cfm">http://www.coldfusionjedi.com/demos/imagecfcontent/test3.cfm</a>

Now for the contest. If you look at the code for test3.cfm, you will notice that you can seed the caption value via the URL. Here is an <a href="http://www.coldfusionjedi.com/demos/imagecfcontent/test3.cfm?caption=ColdFusion%20Rocks">example</a>.

Your content is to make Paris intelligent - or at least witty. While this is a somewhat herculean task - I'm sure some of you can do it. Just post your URL as a comment (and of course, you can comment on the main part of this blog post as well). Please keep your captions work safe. Work safe doesn't mean boring - just keep it safe please.