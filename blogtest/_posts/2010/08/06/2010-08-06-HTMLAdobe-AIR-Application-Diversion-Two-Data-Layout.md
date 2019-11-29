---
layout: post
title: "HTML/Adobe AIR Application Diversion Two - Data Layout"
date: "2010-08-06T14:08:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2010/08/06/HTMLAdobe-AIR-Application-Diversion-Two-Data-Layout
guid: 3901
---

The same reader who prompted my last diversion (<a href="http://www.raymondcamden.com/index.cfm/2010/8/5/HTMLAdobe-AIR-Application-Diversion-One--User-Login">HTML/Adobe AIR Application Diversion One - User Login</a>) also spurred me into another late night of coding. This time his question involved how you could display data loaded via Ajax. While certainly not just an AIR concern (any Ajax application has to worry about this), my experiments focused on the AIR side. Before going any further, let me discuss how I handle this issue now.

<p>
<!--more-->
I've done "data display" now three ways:

<p>

<ol>
<li>When I first began doing Ajax devleopment I made use of <a href="http://labs.adobe.com/technologies/spry/">Adobe Spry</a>. As much as I'm a jQuery fan boy now I've yet to see a JavaScript framework do display of Ajax data as nicely as Spry. It's incredibly simple and practical. I no longer use Spry as I feel more productive in jQuery, but I still think it's a great model.
<li>More recently I discovered jQuery templates (see my <a href="http://www.coldfusionjedi.com/index.cfm/2010/7/9/Quick-example-of-jQuery-Templates">post</a> on it). I really dig this - but it has an issue in AIR. I'm not going to go into why just yet - but it's coming up in my AIR series.
<li>So outside of the two methods above, most of the time I simply loop over the data, create a big ass string (that's the technical term, honest), and inject it into the DOM.
</ol>

<p>

So that's what I've done so far. I'm sure there are other options, but these have worked great for me so far. My reader though threw me for a loop and asked about doing layout using XSLT. XSLT stands for XSL transformations. I won't go into the complete description here (if you want more detail, see <a href="http://www.w3schools.com/xsl/">this page</a>), but it's essentially a way to take some XML, combine it with a XML document that describes layout, and generate HTML. It's kinda cool. ColdFusion supports it. But honestly? I've never used it. The thought of using it for Ajax though was quite intriguing. 

<p>

I did some research and discovered that you can actually do XSLT on the client. This tutorial, <a href="http://www.w3schools.com/xsl/xsl_client.asp/">XSLT on the Client</a>, talks about how you can load both an XML and XSL file via Ajax and then combine them to create layout. I took their code and simplified it to make it work with AIR. (Since we don't have to worry about IE we can remove some code.)

<p>

<code>

&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;New Adobe AIR Project&lt;/title&gt;
        &lt;script type="text/javascript" src="lib/air/AIRAliases.js"&gt;&lt;/script&gt;
		&lt;script src="lib/jquery/jquery-1.4.2.min.js"&gt;&lt;/script&gt;

        &lt;script&gt;
		function loadXMLDoc(dname) {
			xhttp=new XMLHttpRequest();
			xhttp.open("GET",dname,false);
			xhttp.send("");
			return xhttp.responseXML;
		}
		
		function displayResult() {
			xml=loadXMLDoc("data.xml");
			xsl=loadXMLDoc("test.xsl");
			xsltProcessor=new XSLTProcessor();
			xsltProcessor.importStylesheet(xsl);
			resultDocument = xsltProcessor.transformToFragment(xml,document);
			$("#example").html(resultDocument);
		}			


		$(document).ready(function() {

			displayResult();

		});
		&lt;/script&gt;
    &lt;/head&gt;
    &lt;body&gt;
		&lt;div id="example"&gt;&lt;/div&gt;
    &lt;/body&gt;
&lt;/html&gt;
</code>

<p>

I won't go into detail about this code since it is just a simplified version of the tutorial I linked above, but I think you can get an idea about just how simple this stuff is. Taking this and running it within AIR results in pretty much what you would expect:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-08-06 at 12.41.19 PM.png" />

<p>

Cool, right? XSL is a pretty intense language (syntax? framework? whatever). You can do looping (obviously) and other stuff too - even conditionals. So all of this took just a few minutes. What took me a few hours was deciding to turn this little experiment into a full fledged application. 

<p>

I began by digging up an XML service. Yahoo has a nice <a href="http://developer.yahoo.com/traffic/rest/V1/index.html">Traffic API</a> that spits out XML so I thought it would be a good starting point. I thought I'd design an application that would prompt you for your address and display the results. Here is a screen shot.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-08-06 at 12.45.46 PM.png" />

<p>

I'll paste the code and - like normal - walk you guys through it. There was some <b>extremely</b> painful parts of this application - mainly because I was unaware of some things that jQuery did for us.

<p>

<code>

&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;New Adobe AIR Project&lt;/title&gt;
        &lt;script type="text/javascript" src="lib/air/AIRAliases.js"&gt;&lt;/script&gt;
        &lt;script src="/lib/jquery/jquery-1.4.2.min.js"&gt;&lt;/script&gt;
		&lt;script&gt;
		//simple func to read in a complete file
		function fileRead(fileob) {
			var fileStream = new air.FileStream();
			fileStream.open(fileob,air.FileMode.READ);
			var contents = fileStream.readMultiByte(fileob.size,"utf-8");
			fileStream.close();
			return contents;			
		}
		
		function lookup(evt) {
			var street = $("#street").val();
			var city = $("#city").val();
			var state = $("#state").val();
			
			if(street == '' {% raw %}|| city == '' |{% endraw %}| state == '') {
				alert('Please enter all values.');
				return ;
			}
			
			var url = "http://local.yahooapis.com/MapsService/V1/trafficData?appid=YdnDemo&street=" + escape(street);
			url += "&city="+escape(city) + "&state="+escape(state);

			$.get(url, {}, function(res,status) {
				$("#log").html("");
				var resultDocument = xsltProcessor.transformToFragment(res,document);
				$("#display").html(resultDocument);
			});

		}

		$(document).ready(function() {
			var xslFile = air.File.applicationDirectory.resolvePath("design.xsl");
			var xsl = fileRead(xslFile);
			xsl = (new DOMParser()).parseFromString(xsl, "text/xml");

			xsltProcessor=new XSLTProcessor();
			xsltProcessor.importStylesheet(xsl);

			$("#trafficBtn").click(lookup);
			
			$('#log').ajaxError(function(e,xhr) {
				var msg = xhr.responseXML.getElementsByTagName("Message")[0].firstChild.textContent;
				$(this).text(msg);
			});
			
		});
		&lt;/script&gt;
    &lt;/head&gt;
    &lt;body&gt;
	
	Enter your street: &lt;input type="text" id="street"&gt;&lt;br/&gt;
	Enter your city: &lt;input type="text" id="city"&gt;&lt;br/&gt;
	Enter your state: &lt;input type="state" id="state"&gt;&lt;br/&gt;
	&lt;input type="button" value="Get Traffic Report" id="trafficBtn"&gt;
	&lt;div id="log"&gt;&lt;/div&gt;
	&lt;p/&gt;
	
	&lt;div id="display"&gt;&lt;/div&gt;
	
    &lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Ok, so we can pretty much ignore the HTML at the bottom. It's basically a form, a div used for status messages (log), and a display area. Let's go to the fun code. 

<p>

When the document loads, I begin by loading in my XSL sheet. Notice the use of File.applicationDirectory. This basically means "same place as my app". The fileRead function simply handles doing a synchronous file read using AIR File APIs. I convert my XSL text into a proper XML document. (Don't ask me how I learned that line - thank Google.) I then create my XSL processor object and pass in the XSL. Ignore the error handler for now. 

<p>

So now let's look at the form handler. I start off grabbing my form values and doing a quick validation on them. Next I create my URL. This just follows the API directions from Yahoo. Finally I fire off the request and when I get my data back, I pass it to my XSL processor. That's it! So what took me so long? I struggled for quite some time because I didn't realize that jQuery had recognized the XML and turned it into an XML object for me. My original code was "re-XMLing" the result. Ugh. (And let me just say. This is the second time in two weeks I've done XML in JavaScript and so far I fracking hate it. ColdFusion handles XML much nicer!) So what about the XSL?

<p>

<code>
&lt;xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"&gt; 
 
&lt;xsl:template match="/"&gt; 
  &lt;html&gt; 
  &lt;body&gt; 
  &lt;h2&gt;Traffic Report&lt;/h2&gt; 
    &lt;table border="1" width="100%"&gt; 
      &lt;tr bgcolor="#9acd32"&gt; 
	  	&lt;th&gt;Type&lt;/th&gt;
        &lt;th&gt;Incident&lt;/th&gt; 
      &lt;/tr&gt; 
      &lt;xsl:for-each select="//*[local-name()='Result']"&gt; 
      &lt;tr&gt; 
	  	&lt;td&gt;&lt;xsl:value-of select="@type"/&gt;&lt;/td&gt;
        &lt;td&gt;&lt;xsl:value-of select="//*[local-name()='Title']"/&gt;&lt;/td&gt; 
	  &lt;/tr&gt;
	  &lt;tr bgcolor="yellow"&gt;
        &lt;td colspan="2"&gt;
        	&lt;xsl:value-of select="//*[local-name()='Description']"/&gt;
			&lt;br/&gt;&lt;b&gt;Severity:&lt;/b&gt; 
		&lt;xsl:choose&gt;
          &lt;xsl:when test="//*[local-name()='Severity']='1'"&gt;
          	Not very
          &lt;/xsl:when&gt;
          &lt;xsl:when test="//*[local-name()='Severity']='2'"&gt;
          	Mildly Annoying
          &lt;/xsl:when&gt;
          &lt;xsl:when test="//*[local-name()='Severity']='3'"&gt;
          	Annoying
          &lt;/xsl:when&gt;
          &lt;xsl:when test="//*[local-name()='Severity']='4'"&gt;
          	Pain in the Rear
          &lt;/xsl:when&gt;
          &lt;xsl:when test="//*[local-name()='Severity']='5'"&gt;
          	You ain't going nowhere
          &lt;/xsl:when&gt;
          &lt;xsl:otherwise&gt;
          	Unknown. Consult Fringe department.
          &lt;/xsl:otherwise&gt;
        &lt;/xsl:choose&gt;
		&lt;/td&gt; 
      &lt;/tr&gt; 
      &lt;/xsl:for-each&gt; 
    &lt;/table&gt; 
  &lt;/body&gt; 
  &lt;/html&gt; 
&lt;/xsl:template&gt; 
&lt;/xsl:stylesheet&gt;
</code>

<p>

This was also a bit painful, but mainly because of the namespaces. Everywhere you see: //*[local-name() you can thank namespaces. I wish there was a way to ignore them. If a tag is &lt;foo&gt; then I want my path to just use foo. Google seemed to imply that it may be possible to tell the XSL processor to ignore the namespaces but I wasn't able to get it to work. It's not horrible - but I think it makes the XSL harder to read. 

<p>

Anyway - most of the above is just the loop. The only "fancy" part is my conditional. As you can see - I do some basic branching based on the severity of the traffic report. I could have used graphics instead of text, but I think you get the idea.

<p>

So... what do you think? If you want to play with this application I've attached it to the blog entry. Unfortunately Yahoo didn't seem to have traffic data for my home town, but perhaps that's because of the overabundance of swamp, vampires, and werewolves. Your results may vary.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fxslttest%{% endraw %}2Eair'>Download attached file.</a></p>