---
layout: post
title: "Second example of an HTML-powered AIR application"
date: "2010-08-15T18:08:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2010/08/15/Second-example-of-an-HTMLpowered-AIR-application
guid: 3913
---

It's been a few days since the <a href="http://www.raymondcamden.com/index.cfm/2010/8/4/First-example-of-an-HTMLpowered-AIR-Application">last entry</a> in my HTML/Adobe AIR series. If you aren't up to date on the series, please see the links below in the related entries section. The basic idea here is that I'm going over the example applications I created for my <a href="http://www.coldfusionjedi.com/index.cfm/2010/8/12/Recording-from-Adobe-AIRHTMLjQueryColdFusion-Presentation">Building HTML AIR Applications</a> presentation. I'm not putting these applications out as steller examples of AIR - in fact - they are pretty darn simple and quite ugly. But rather - I hope that if you guys see a bunch of simple examples it will inspire you to build your own. Today's example is another file based one, this time focusing on directory operations as well. I'll start off with a few quick screen shots and then I'll show you the code.

<p>
<!--more-->
<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-08-15 at 4.39.01 PM.png" />

<p>

When the application loads, you end up with a list of files in the left hand side. If you click on a file you then get details, and if it is a text or CFM file, you can see the source.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-08-15 at 4.40.16 PM.png" />

<p>

So - not the most exciting application in the world, but right away you can see that this application demonstrates how to get the contents of a directory and how to get file details and contents. Let's look at the code.

<p>

<code>

&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;Demo working with a list of files&lt;/title&gt;
        &lt;script type="text/javascript" src="lib/air/AIRAliases.js"&gt;&lt;/script&gt;
        &lt;script src="lib/jquery/jquery-1.4.2.js"&gt;&lt;/script&gt;
		&lt;script&gt;
		$(document).ready(function() {
			
			//list the documents directory
			docDir = air.File.documentsDirectory;
			var files = docDir.getDirectoryListing();
			var s = "";
			$.each(files, function(inx,file) {
				if(!file.isDirectory) {
					s += "&lt;div class='fileListing'&gt;" + file.name + "&lt;/div&gt;";
				}
			});
			if(s != '') $("#dirListing").html(s);
			
			$("#dirListing").delegate(".fileListing", "click", function() {
				//full file path is doc dir and text from the item
				var fullPath = air.File.documentsDirectory.nativePath + air.File.separator + $(this).text();
				var fileOb = new air.File(fullPath);
				var s = "";
				s += "&lt;h2&gt;" + $(this).text() + "&lt;/h2&gt;";
				s += "The size of this object is "+fileOb.size + " bytes.&lt;br/&gt;";
				s += "It was last modified on "+fileOb.modificationDate + ".&lt;br/&gt;";

				//if a text file, render contents 
				var ext = fileOb.extension;
				if(ext == 'txt' || ext == 'cfm') {
					var fileStream = new air.FileStream();
					fileStream.open(fileOb,air.FileMode.READ);
					var contents = fileStream.readMultiByte(fileOb.size,"utf-8");
					fileStream.close();
					s += "&lt;br/&gt;&lt;b&gt;Contents:&lt;/b&gt;&lt;br/&gt;&lt;div class='contents'&gt;"+contents+"&lt;/div&gt;";
					
				}				

				$("#fileDetails").html(s);

			})

		})


		&lt;/script&gt;
		
		&lt;style&gt;
		.fileListing {
			background-color: #c0c0c0;
			margin: 5px;
			padding: 5px;
			cursor: pointer;
		}
		
		.contents {
			width: 100%;
			height: 100%;
		}
		&lt;/style&gt;

    &lt;/head&gt;
    &lt;body&gt;
	
	&lt;table&gt;
		&lt;tr valign="top"&gt;
			&lt;td width="20%"&gt;
			&lt;div id="dirListing"&gt;
			&lt;/div&gt;
			&lt;/td&gt;
			&lt;td width="80%"&gt;
			&lt;div id="fileDetails"&gt;
			&lt;/div&gt;
			&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/table&gt;
	
    &lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Like most of my AJAX examples, I use the HTML at the bottom as basic containers for whatever my application is doing. This is no different. I have a simple table with a 20% column used for the listing and the larger side there for the contents. Yes, I know tables suck. I apologize. Now scroll on up to the beginning of the document.ready block. I've got multiple things going on here so I'll cover them one by one.

<p>

I begin by getting a pointer to the user's documents directory:

<p>

<code>
docDir = air.File.documentsDirectory;
</code>

<p>

I know that seems simple - but consider this. That one alias will work across Windows, Mac, and Unix system. No user sniffing - no OS specific code. It just plain works. I <b>love</b> that. The next line gets the directory listing. After I have that I can then use jQuery's nice each operator to loop over each file and lay out some HTML. 

<p>

The second block is my handler for the fileListing blocks. These were the blocks I used to display files. When clicked, I have to parse the DOM a bit to get the file. From that I can then create an AIR file object:

<p>

<code>
var fullPath = air.File.documentsDirectory.nativePath + air.File.separator + $(this).text();
var fileOb = new air.File(fullPath);
</code>

<p>

I display a few properties of the file (there are more, I just picked the ones I thought were interesting). Finally note the extension check. If the file is either a text or ColdFusion file, I want to read the text in and display it. This is as simple as:

<p>

<code>
var fileStream = new air.FileStream();
fileStream.open(fileOb,air.FileMode.READ);
var contents = fileStream.readMultiByte(fileOb.size,"utf-8");
fileStream.close();
</code>

<p>

As you can imagine - if I did this with a large file, I'd bog down my application. AIR supports reading in only portions of a file, seeking to a part of a file, and bringing in contents asynchronously. I was going for simplicity. 

<p>

I've included a zip of this application that also includes the built-out .AIR file so you can run it right away. Next in the series I'll be demonstrating a simple database client.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fexample2%{% endraw %}2Ezip'>Download attached file.</a></p>