---
layout: post
title: "Multi-File Uploads and Multiple Selects"
date: "2013-10-01T10:10:00+06:00"
categories: [development,html5]
tags: []
banner_image: 
permalink: /2013/10/01/MultiFile-Uploads-and-Multiple-Selects
guid: 5051
---

<p>
<b>Edit on 12/6/2013: I forgot to update this post based on a bug from my earlier post. I used a for loop when forEach should have been used. I corrected this in the final code sample.</b>
</p>

<p>
A few weeks back I wrote a <a href="http://www.raymondcamden.com/index.cfm/2013/9/10/Adding-a-file-display-list-to-a-multifile-upload-HTML-control">blog post</a> about adding image previews for multi-file upload controls. I didn't mention it at the time but I had an ulterior motive. A reader wrote to me a few weeks before with an interesting question.
</p>
<!--more-->
<blockquote>
Is it possible to use a mult-file input control and let the user select multiple times?
</blockquote>

<p>
To be clear, what we mean here is that the user selects some files and closes the file picker dialog. She then realizes she forgot a few files and clicks to select them next.
</p>

<p>
What happens in this situation is pretty simple. Like the multiple select field, if you pick something else then the previous selection is removed. Your only option is similar to what you do for the drop down. Use ctrl/cmd to select multiple files in multiple folders all at once - <i>and don't screw it up!</i> Obviously most users won't be able to grok this and <strong>will</strong> screw it up, even if they know it is possible.
</p>

<p>
But my experiment had given me an idea. Remember that we can use an event handler to detect changes to the input field and get access to the file data beneath. Here is a code snippet showing this:
</p>

<pre><code class="language-javascript">function handleFileSelect(e) {
		
	if(!e.target.files) return;
		
	selDiv.innerHTML = "";
		
	var files = e.target.files;

	for(var i=0; i<files.length; i++) {
		var f = files[i];
			
		selDiv.innerHTML += f.name + "<br/>";

	}
		
}</code></pre>

<p>
Based on this, my <a href="http://www.raymondcamden.com/demos/2013/sep/10/test0.html">final demo</a> uses this code to create image thumbnails based on pictures you select. My demo has a bug though that meshes well with today's blog post. If you select images twice, the list of thumbnails grow, but the actual files associated with the control are only based on the <strong>last</strong> selection. But what if we could take those files and store them?
</p>

<p>
Before I went down this route, I updated my demo code to use AJAX to post the form. Part of the benefits of XHR2 is the ability to send file data over the wire. Let's look at a simple example of this.
</p>

<pre><code class="language-markup">&lt;!doctype html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;title&gt;Proper Title&lt;/title&gt;
&lt;style&gt;
	#selectedFiles img {
		max-width: 200px;
		max-height: 200px;
		float: left;
		margin-bottom:10px;
	}
&lt;/style&gt;
&lt;/head&gt;
    
&lt;body&gt;
	
	&lt;form id=&quot;myForm&quot; method=&quot;post&quot;&gt;

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
		document.querySelector('#myForm').addEventListener('submit', handleForm, false);
	}
		
	function handleFileSelect(e) {
		var files = e.target.files;
		for(var i=0; i&lt;files.length; i++) {
			var f = files[i];
			if(!f.type.match(&quot;image.*&quot;)) {
				continue;
			}

			var reader = new FileReader();
			reader.onload = function (e) {
				var html = &quot;&lt;img src=\&quot;&quot; + e.target.result + &quot;\&quot;&gt;&quot; + f.name + &quot;&lt;br clear=\&quot;left\&quot;/&gt;&quot;;
				selDiv.innerHTML += html;
				
			}
			reader.readAsDataURL(f); 
		}
		
	}
		
	function handleForm(e) {
		e.preventDefault();
		console.log('handleForm');
		var data = new FormData(document.querySelector('#myForm'));
				
		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'handler.cfm', true);
		
		xhr.onload = function(e) {
			if(this.status == 200) {
				console.log('onload called');
				console.log(e.currentTarget.responseText);
				
			}
		}
		
		xhr.send(data);
	}
	&lt;/script&gt;

&lt;/body&gt;
&lt;/html&gt;</code></pre>

<p>
If we focus on the changes, the only real difference is that we have a submit handler for the form. We use a FormData object to package up our form and then post it to a server-side handler. The server-side code isn't terribly important. It doesn't see this as anything "special" or "Ajax-y" (my word), it is just a form post. But now the entire process runs through Ajax and not a traditional page reload. (And as a note, I'm not providing <strong>any</strong> user feedback here. In a real application I'd disable the submit button, tell the user something, etc etc.)
</p>

<p>
That parts done, now let's try storing a copy of the files. Here is my updated version with this in action.
</p>

<pre><code class="language-markup">&lt;!doctype html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;title&gt;Proper Title&lt;&#x2F;title&gt;
&lt;style&gt;
	#selectedFiles img {
		max-width: 200px;
		max-height: 200px;
		float: left;
		margin-bottom:10px;
	}
&lt;&#x2F;style&gt;
&lt;&#x2F;head&gt;
    
&lt;body&gt;
	
	&lt;form id=&quot;myForm&quot; method=&quot;post&quot;&gt;

        Files: &lt;input type=&quot;file&quot; id=&quot;files&quot; name=&quot;files&quot; multiple&gt;&lt;br&#x2F;&gt;

        &lt;div id=&quot;selectedFiles&quot;&gt;&lt;&#x2F;div&gt;

        &lt;input type=&quot;submit&quot;&gt;
	&lt;&#x2F;form&gt;

	&lt;script&gt;
	var selDiv = &quot;&quot;;
	var storedFiles = [];
		
	document.addEventListener(&quot;DOMContentLoaded&quot;, init, false);
	
	function init() {
		document.querySelector(&#x27;#files&#x27;).addEventListener(&#x27;change&#x27;, handleFileSelect, false);
		selDiv = document.querySelector(&quot;#selectedFiles&quot;);
		document.querySelector(&#x27;#myForm&#x27;).addEventListener(&#x27;submit&#x27;, handleForm, false);
	}
		
	function handleFileSelect(e) {
		var files = e.target.files;
		var filesArr = Array.prototype.slice.call(files);
		filesArr.forEach(function(f) {			

			if(!f.type.match(&quot;image.*&quot;)) {
				return;
			}
			storedFiles.push(f);
			
			var reader = new FileReader();
			reader.onload = function (e) {
				var html = &quot;&lt;img src=\&quot;&quot; + e.target.result + &quot;\&quot;&gt;&quot; + f.name + &quot;&lt;br clear=\&quot;left\&quot;&#x2F;&gt;&quot;;
				selDiv.innerHTML += html;
				
			}
			reader.readAsDataURL(f); 
		});
		
	}
		
	function handleForm(e) {
		e.preventDefault();
		var data = new FormData();
		
		for(var i=0, len=storedFiles.length; i&lt;len; i++) {
			data.append(&#x27;files&#x27;, storedFiles[i]);	
		}
		
		var xhr = new XMLHttpRequest();
		xhr.open(&#x27;POST&#x27;, &#x27;handler.cfm&#x27;, true);
		
		xhr.onload = function(e) {
			if(this.status == 200) {
				console.log(e.currentTarget.responseText);	
				alert(e.currentTarget.responseText + &#x27; items uploaded.&#x27;);
			}
		}
		
		xhr.send(data);
	}
	&lt;&#x2F;script&gt;

&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

<p>
The changes are pretty simple. I've got  a new global variable called storedFiles. When I detect a change on the input field, I now push them into this array. Finally, when the form is submitted, instead of pre-populating the FormData object we create it empty and then simply append our files. Note the append call uses the same name, files, so that when the server processes it the name is consistent. 
</p>

<p>
And... believe it or not - this worked. This smells like it may be a slight security concern. I have to imagine that if browser vendors allow for this then it must be safe, but if I used this in production, I'd be <strong>real</strong> sure to let the end user know what is going on. As I said my previous demo actually <i>implied</i> it was doing this anyway. (I should have been clearing out my thumbnails when you selected files.) I think in that case the user would have expected it.
</p>