---
layout: post
title: "Adding print support to ColdFusion Builder Extensions"
date: "2010-07-02T10:07:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/07/02/Adding-print-support-to-ColdFusion-Builder-Extensions
guid: 3868
---

While jogging this morning (I won't call what I do running, at best, it's fast shambling that would probably just barely keep me ahead of the zombie horde) it occurred to me that it would probably be trivial to add basic print support to ColdFusion Builder extensions. I'm not talking about the cfprint tag, but printing on your client machine. I whipped up the following quick demo. Since extensions use a "mini browser", shouldn't it be possible to just use JavaScript to print?
<p/>
<!--more-->
First, I created a very basic ide_config.xml. For those who have not written any CFB extensions, the ide_config.xml file dictates how your extension interacts with the IDE. I wanted to test both "XML mode" and "HTML mode" responses to see if printing would work in one and not the other. Here is my XML:
<p>
<code>
&lt;application&gt;

	&lt;name&gt;TestExtention&lt;/name&gt;
	&lt;author&gt;Raymond Camden&lt;/author&gt;
	&lt;version&gt;0&lt;/version&gt;
	&lt;email&gt;ray@camdenfamily.com&lt;/email&gt;	
    &lt;menucontributions &gt;

		&lt;contribution target="editor"&gt;
			&lt;menu name="Run Test Extension"&gt;
	    		&lt;action name="Run XML Test" handlerid="xmltest" showResponse="true" /&gt;
	    		&lt;action name="Run HTML Test" handlerid="htmltest" showResponse="true" /&gt;
			&lt;/menu&gt;
		&lt;/contribution&gt;			

    &lt;/menucontributions&gt;	

	&lt;handlers&gt;		
		&lt;handler id="xmltest" type="CFM" filename="test_xml.cfm" /&gt;
		&lt;handler id="htmltest" type="CFM" filename="test_html.cfm" /&gt;
	&lt;/handlers&gt;

&lt;/application&gt;
</code>
<p>
As you can see, I've got two tests - "Run XML Test" and "Run HTML Test". I started off with the HTML response:
<p>
<code>
&lt;style&gt;
@media print {
	.hideforprint {
	display:none;
	}
}
&lt;/style&gt;

&lt;cfoutput&gt;
&lt;div class="hideforprint"&gt;First test - print: &lt;a href="javascript:window.print()"&gt;print!&lt;/a&gt;&lt;br/&gt;&lt;/div&gt;
Testing!
&lt;/cfoutput&gt;
</code>

<p>

I've got a very basic JavaScript window.print command along with some simple CSS to hide it when printing. I've got one line of HTML ("Testing!") and - well, that's it. Guess what? It worked perfectly. I'm using an Adobe PDF print driver for testing. Here is a screen shot of the result:

<p>

<img src="https://static.raymondcamden.com/images/p1.png" />

<p>

I then tried the exact same, but in XML mode:

<p>

<code>
&lt;cfheader name="Content-Type" value="text/xml"&gt;
&lt;cfoutput&gt;
&lt;response showresponse="true"&gt;
&lt;ide&gt;
&lt;dialog width="500" height="500" title="This is Handler Two" /&gt;
&lt;body&gt;
&lt;![CDATA[
&lt;style&gt;
@media print {
	.hideforprint {
	display:none;
	}
}
&lt;/style&gt;
&lt;div class="hideforprint"&gt;First test - print: &lt;a href="javascript:window.print()"&gt;print!&lt;/a&gt;&lt;br/&gt;&lt;/div&gt;
Testing: Testing!
&lt;p/&gt;
]]&gt;
&lt;/body&gt;
&lt;/ide&gt;
&lt;/response&gt;&lt;/cfoutput&gt;
</code>

<p>

This too worked perfectly. For the heck of it, I quickly modified the <a href="http://varscoper.riaforge.org">varScoper CFB extension</a> to add a print link to the bottom of the report:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/vsp.PNG" />

<p>

And not surprisingly, it worked fine as well. I've included the PDF result as an attachment to the blog entry.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fvarscoper%{% endraw %}2Epdf'>Download attached file.</a></p>