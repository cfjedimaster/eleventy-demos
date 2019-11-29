---
layout: post
title: "Dynamically Creating CSV Files on the Client"
date: "2014-04-03T11:04:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2014/04/03/Dynamically-Creating-CSV-Files-on-the-Client
guid: 5191
---

<p>
A reader posed an interesting question on one of my ColdFusion posts recently. The post (<a href="http://www.raymondcamden.com/index.cfm/2011/6/1/ColdFusion-Sample--Create-an-Excel-File">Creating an Excel File</a>) demonstrated how to take form data on the front end and create an Excel file via ColdFusion when the form is submitted. The user wanted to know if this could be done entirely client-side.
</p>
<!--more-->
<p>
The latest versions of Office use an XML based file format contained within a zip file. There is a good JS library for working with zips and as it turns out - there is a JS library for XLSX as well: <a href="https://github.com/stephen-hardy/xlsx.js">https://github.com/stephen-hardy/xlsx.js</a>. While this would possibly work, I thought there might be a simpler way using CSV, or comma-separated value files. 
</p>

<p>
About two years ago I wrote a piece on <a href="http://www.raymondcamden.com/index.cfm/2012/8/23/Proof-of-Concept--Build-a-download-feature-for-IndexedDB">exporting data</a> from IndexedDB. It used string data and a data url to create a link to a virtual representation of the data. Combining this with the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a">download</a> attribute of the anchor tag, it is possible to push a download of a fake file to the user.
</p>

<p>
Therefore - all we need to do is create a CSV string. I built a simple, but ugly demo, that consists of a few rows of text fields.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot6.png" />
</p>

<p>
The user can then enter values into the columns and get a CSV file by clicking the button. Let's look at the JavaScript code.
</p>

<pre><code class="language-javascript">$(document).ready(function() {
	var $link = $(&quot;#dataLink&quot;);
	var $nameFields = $(&quot;.nameField&quot;);
	var $cookieFields = $(&quot;.cookieField&quot;);
	
	$(&quot;#downloadLink&quot;).on(&quot;click&quot;, function(e) {
		var csv = &quot;&quot;;
		&#x2F;&#x2F;we should have the same amount of name&#x2F;cookie fields
		for(var i=0; i&lt;$nameFields.length; i++) {
			var name = $nameFields.eq(i).val();
			var cookies = $cookieFields.eq(i).val();
			if(name !== &#x27;&#x27; &amp;&amp; cookies !== &#x27;&#x27;) csv += name + &quot;,&quot; + cookies + &quot;\n&quot;;	
		}
		console.log(csv);
		
		$link.attr("href", 'data:Application/octet-stream,' + encodeURIComponent(csv))[0].click();
	});
});</code></pre>

<p>
The code begins with the click handler for the download button. All I have to do is generate my CSV string by looping over the rows of fields. To be fair, my CSV handling could be a bit nicer. A name can include a comma so I should probably wrap the value in quotes, but I think you get the idea.
</p>

<p>
Once we have the CSV, we then use the same method I used on the IndexedDB post and force the download. On my system, this creates a file that opens in Excel just fine. 
</p>

<p>
<img src="https://static.raymondcamden.com/images/Menubar_and_data__8__csv.png" />
</p>

<p>
It also worked in OpenOffice once I told it to use commas. Want to try it yourself? Hit the demo link below.
</p>

<p>
<a href="http://www.raymondcamden.com/demos/2014/apr/3/testdownload.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>  
</p>

<p>
Edit: Big thanks to @Laurence below who figured out that I didn't need a particular hack to get my click event working for downloads. That cut out about 50% of the code I had before. Thanks Laurence!
</p>