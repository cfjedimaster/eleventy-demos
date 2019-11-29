---
layout: post
title: "Multi-File Uploads and Multiple Selects (Part 2)"
date: "2014-04-14T10:04:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2014/04/14/MultiFile-Uploads-and-Multiple-Selects-Part-2
guid: 5200
---

<p>
A while back I wrote a simple example of using JavaScript to add file previews for a multi-file upload HTML control. You can find that entry here: <a href="http://www.raymondcamden.com/index.cfm/2013/9/10/Adding-a-file-display-list-to-a-multifile-upload-HTML-control">Adding a file display list to a multi-file upload HTML control</a>. I followed it up with another example (<a href="http://www.raymondcamden.com/index.cfm/2013/10/1/MultiFile-Uploads-and-Multiple-Selects">Multi-File Uploads and Multiple Selects</a>) that demonstrated adding support for multiple selections. This weekend a reader asked for a way to <strong>remove</strong> files from the list before uploading. Here is an example of that. 
</p>
<!--more-->
<p>
First - I had to figure out how users would remove files. I could have added a button to each image preview, or a link. Anything really. But to make things simpler, I decided that a click on the image would remove it. Obviously that may not be the best UX. I added a title attribute to help make this clear. You should be able to easily modify my code to change how this works. Let's look at the code and then I'll explain the changed bits. (If you didn't read the previous entries though, please do so. I won't be going over the basics again.)
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

	&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.0.3&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
	
	&lt;script&gt;
	var selDiv = &quot;&quot;;
	var storedFiles = [];
	
	$(document).ready(function() {
		$(&quot;#files&quot;).on(&quot;change&quot;, handleFileSelect);
		
		selDiv = $(&quot;#selectedFiles&quot;); 
		$(&quot;#myForm&quot;).on(&quot;submit&quot;, handleForm);
		
		$(&quot;body&quot;).on(&quot;click&quot;, &quot;.selFile&quot;, removeFile);
	});
		
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
				var html = &quot;&lt;div&gt;&lt;img src=\&quot;&quot; + e.target.result + &quot;\&quot; data-file=&#x27;&quot;+f.name+&quot;&#x27; class=&#x27;selFile&#x27; title=&#x27;Click to remove&#x27;&gt;&quot; + f.name + &quot;&lt;br clear=\&quot;left\&quot;&#x2F;&gt;&lt;&#x2F;div&gt;&quot;;
				selDiv.append(html);
				
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
		
	function removeFile(e) {
		var file = $(this).data(&quot;file&quot;);
		for(var i=0;i&lt;storedFiles.length;i++) {
			if(storedFiles[i].name === file) {
				storedFiles.splice(i,1);
				break;
			}
		}
		$(this).parent().remove();
	}
	&lt;&#x2F;script&gt;

&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

<p>
The first big difference in this version is the use of jQuery. I didn't really need it before so I used querySelector instead. I needed to make use of jQuery's simple handling of post-DOM manipulation event binding (let me know if that doesn't make sense) so I added in the library. I've added my click handler here:
</p>

<pre><code class="language-javascript">$("body").on("click", ".selFile", removeFile);</code></pre>

<p>
I then modified the image display to include the class and title attribute.
<p/>

<pre><code class="language-javascript">var html = "&lt;div&gt;&lt;img src=\"" + e.target.result + "\" data-file='"+f.name+"' class='selFile' title='Click to remove'&gt;" + f.name + "&lt;br clear=\"left\"/&gt;&lt;/div&gt;";</code></pre>

<p>
Notice I added a div around the image and file name. This will make sense in a second. Now let's look at the handler.
</p>

<pre><code class="language-javascript">function removeFile(e) {
	var file = $(this).data(&quot;file&quot;);
	for(var i=0;i&lt;storedFiles.length;i++) {
		if(storedFiles[i].name === file) {
			storedFiles.splice(i,1);
			break;
		}
	}
	$(this).parent().remove();
}</code></pre>

<p>
Not really rocket science. I find the file in the existing list, remove it, and then remove the image/file text from the DOM. Done. 
</p>