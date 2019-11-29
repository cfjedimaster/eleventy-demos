---
layout: post
title: "Adding a file display list to a multi-file upload HTML control"
date: "2013-09-10T11:09:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2013/09/10/Adding-a-file-display-list-to-a-multifile-upload-HTML-control
guid: 5033
---

<p>
I'm working on something a bit interesting with a multi-file upload control, but while that is in development, I thought I'd share a quick tip about working with multi-file upload controls in general.
</p>
<!--more-->
<p>
If you are not clear about what I'm talking about, I simply mean adding the multiple attribute to the input tag for file uploads. Like so:
</p>

<pre><code class="language-markup">&lt;input type="file" name="foo" id="foo" multiple&gt;</code></pre>

<p>
In browsers that support it, the user will be able to select multiple files. In browsers that don't support it, it still works fine as a file control, but they are limited to one file. In theory, this is pretty trivial to use, but there's a UX issue that kind of bugs me. Here is a screen shot of a form using this control. I've selected two files:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_9_10_13_9_32_AM.jpg" />
</p>

<p>
Notice something? The user isn't told <i>what</i> files they selected. Now obviously in a form this small it isn't that big of a deal, but in a larger form the user may forget or simply want to double check before they submit the form. Unfortunately there is no way to do that. Clicking the Browse button simply opens the file picker again. Surprisingly, IE handles this the best. It provides a read-only list of what you selected:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_9_10_13_9_35_AM.png" />
</p>

<p>
One could use a bit of CSS to make that field a bit larger for sure and easier to read, but you get the idea. So how can we provide some feedback to the user about what files they have selected?
</p>

<p>
First, let's add a simple change handler to our input field:
</p>

<pre><code class="language-javascript">document.addEventListener("DOMContentLoaded", init, false);
	
function init() {
	document.querySelector('#files').addEventListener('change', handleFileSelect, false);
}</code></pre>

<p>
Next, let's write an event handler and see if we can get access to the files property of the event. Not all browsers support this, but in the ones that do, we can enumerate over them.
</p>

<pre><code class="language-javascript">function handleFileSelect(e) {
		
	if(!e.target.files) return;
		
	var files = e.target.files;
	for(var i=0; i &lt; files.length; i++) {
		var f = files[i];
	}
		
}</code></pre>

<p>
The file object gives us a few properties, but the one we care about is the name. So let's create a full demo of this. I'm going to add a little div below my input field and use it as place to list my files.
</p>

<pre><code class="language-markup">&lt;!doctype html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;title&gt;Proper Title&lt;/title&gt;
&lt;/head&gt;
    
&lt;body&gt;
	
	&lt;form id=&quot;myForm&quot; method=&quot;post&quot; enctype=&quot;multipart/form-data&quot;&gt;

        Files: &lt;input type=&quot;file&quot; id=&quot;files&quot; name=&quot;files&quot; multiple&gt;&lt;br/&gt;

        &lt;div id=&quot;selectedFiles&quot;&gt;&lt;/div&gt;

        &lt;input type=&quot;submit&quot;&gt;
	&lt;/form&gt;

	&lt;script&gt;
	var selDiv = &quot;&quot;;
		
	document.addEventListener(&quot;DOMContentLoaded&quot;, init, false);
	
	function init() {
		document.querySelector('#files').addEventListener('change', handleFileSelect, false);
		selDiv = document.querySelector(&quot;#selectedFiles&quot;);
	}
		
	function handleFileSelect(e) {
		
		if(!e.target.files) return;
		
		selDiv.innerHTML = &quot;&quot;;
		
		var files = e.target.files;
		for(var i=0; i&lt;files.length; i++) {
			var f = files[i];
			
			selDiv.innerHTML += f.name + &quot;&lt;br/&gt;&quot;;

		}
		
	}
	&lt;/script&gt;

&lt;/body&gt;
&lt;/html&gt;</code></pre>

<p>
Pretty simple, right? You can view an example of this here: <a href="https://static.raymondcamden.com/demos/2013/sep/10/test0A.html">https://static.raymondcamden.com/demos/2013/sep/10/test0A.html</a>. And here is a quick screen shot in case you are viewing this in a non-compliant browser.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_9_10_13_9_42_AM.png" />
</p>

<p>
Pretty simple, right? Let's kick it up a notch. Some browsers support FileReader (<a href="https://developer.mozilla.org/en-US/docs/Web/API/FileReader">MDN Reference</a>), a basic way of reading files on the user system. We could check for FileReader support and use it to provide image previews. I'll share the code first and then explain how it works.
</p>

<p><strong>Edit on September 11:</strong> A big thank you to Sime Vidas for <a href="https://www.raymondcamden.com/2013/09/10/Adding-a-file-display-list-to-a-multifile-upload-HTML-control#c6E612D19-BAD9-A665-957DCD4546E53F41">pointing out</a> a stupid little bug in my code I missed on first pass around. I made a classic array/callback bug and didn't notice it. I fixed the code and the screen shot, but if you want to see the broken code, view source on https://static.raymondcamden.com/demos/2013/sep/10/test0orig.html.</p>

<pre><code class="language-markup">&lt;!doctype html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;title&gt;Proper Title&lt;/title&gt;
&lt;style&gt;
	#selectedFiles img {
		max-width: 125px;
		max-height: 125px;
		float: left;
		margin-bottom:10px;
	}
&lt;/style&gt;
&lt;/head&gt;
    
&lt;body&gt;
	
	&lt;form id=&quot;myForm&quot; method=&quot;post&quot; enctype=&quot;multipart/form-data&quot;&gt;

        Files: &lt;input type=&quot;file&quot; id=&quot;files&quot; name=&quot;files&quot; multiple accept=&quot;image/*&quot;&gt;&lt;br/&gt;

        &lt;div id=&quot;selectedFiles&quot;&gt;&lt;/div&gt;

        &lt;input type=&quot;submit&quot;&gt;
	&lt;/form&gt;

	&lt;script&gt;
	var selDiv = &quot;&quot;;
		
	document.addEventListener(&quot;DOMContentLoaded&quot;, init, false);
	
	function init() {
		document.querySelector('#files').addEventListener('change', handleFileSelect, false);
		selDiv = document.querySelector(&quot;#selectedFiles&quot;);
	}
		
	function handleFileSelect(e) {
		
		if(!e.target.files || !window.FileReader) return;

		selDiv.innerHTML = "";
		
		var files = e.target.files;
		var filesArr = Array.prototype.slice.call(files);
		filesArr.forEach(function(f) {
			var f = files[i];
			if(!f.type.match(&quot;image.*&quot;)) {
				return;
			}

			var reader = new FileReader();
			reader.onload = function (e) {
				var html = &quot;&lt;img src=\&quot;&quot; + e.target.result + &quot;\&quot;&gt;&quot; + f.name + &quot;&lt;br clear=\&quot;left\&quot;/&gt;&quot;;
				selDiv.innerHTML += html;				
			}
			reader.readAsDataURL(f); 
		});
		
	}
	&lt;/script&gt;

&lt;/body&gt;
&lt;/html&gt;</code></pre>

<p>
I've modified the handleFileSelect code to check for both the files array as well as FileReader. (Note - I should do this <i>before</i> I even attach the event handler. I just thought of that.) I've updated my input field to say it accepts only images and added a second check within the event handler. Once we are sure we have an image, I use the FileReader API to create a DataURL (string) version of the image. With that I can actually draw the image as a preview.</p>

<p>
You can view a demo of this here: <a href="https://static.raymondcamden.com/demos/2013/sep/10/test0.html">https://static.raymondcamden.com/demos/2013/sep/10/test0.html</a>. And again, a screen shot:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_9_11_13_5_49_AM.png" /></p>

<p>
Check it out and let me know what you think. As I said, it should be fully backwards compatible (in that it won't break) and works well in Chrome, Firefox, IE10, and Safari.
</p>