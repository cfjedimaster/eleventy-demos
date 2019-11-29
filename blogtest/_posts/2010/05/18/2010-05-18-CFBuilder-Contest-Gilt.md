---
layout: post
title: "CFBuilder Contest: Gilt"
date: "2010-05-18T14:05:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/05/18/CFBuilder-Contest-Gilt
guid: 3820
---

<img src="https://static.raymondcamden.com/images/cfjedi/cf_builder_appicon.jpg" align="left" style="margin-right:5px" title="ColdFusion Builder FTW!" /> Today's CFBuilder Contest entry is our last - Gilt by Justin Carter. It covers something I haven't used myself, <a href="http://www.balsamiq.com/products/mockups">Balsamic Mockups</a>, but from what I can see, this is a pretty powerful little extension and could become something - well incredible - for CFBuilder. 
<br clear="left">
<!--more-->
<p>

Gilt takes BBML (which is a text-based export from Balsamic) and converts into HTML. Currently it only works with forms. But the result is pretty interesting. Take for example this Balsamic Mockup UI:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/balsamiq-form.png" title="Mockup" />

<p>

From that you can create the BBML export. I've never seen it before, but here is a sample. (And the complete file is in the zip attached to this entry.)

<p>

<code>

&lt;mockup version="1.0" skin="sketch" measuredW="681" measuredH="554" mockupW="616" mockupH="534"&gt;
  &lt;controls&gt;
    &lt;control controlID="0" controlTypeID="com.balsamiq.mockups::TextInput" x="201" y="149" w="-1" h="-1" measuredW="177" measuredH="29" zOrder="1" locked="false" isInGroup="-1"&gt;
      &lt;controlProperties&gt;
        &lt;text&gt;justin.w.carter@gmail.com&lt;/text&gt;
        &lt;customID&gt;email&lt;/customID&gt;
        &lt;customData/&gt;
      &lt;/controlProperties&gt;
    &lt;/control&gt;
    &lt;control controlID="2" controlTypeID="com.balsamiq.mockups::TextInput" x="201" y="108" w="-1" h="-1" measuredW="98" measuredH="29" zOrder="2" locked="false" isInGroup="-1"&gt;
      &lt;controlProperties&gt;
        &lt;text&gt;Justin%20Carter&lt;/text&gt;
        &lt;customID&gt;name&lt;/customID&gt;
        &lt;customData&gt;required&lt;/customData&gt;
      &lt;/controlProperties&gt;
    &lt;/control&gt;
</code>

<p>

You take this BBML, paste it into a file, and here is the critical part - select all. Once you've done that, you can right click and select Gilt-Convert to HTML. If you forget to select all, you will get an error. And yep - I keep harping on this. One of the issues I'm seeing in all the extensions lately (and I include mine) is that they don't always properly support the ways they can be run. In this case, his extension <i>is</i> passed the file name, and when it detected no selection, it should have (imho) switched to using the entire source of file. As I said - everyone seems to mess this up. It's just a new way of thinking. Things are rough now. But as time goes on, I think we (those of us who develop CFBuilder extensions) will get the hang of it.

<p>

Anyway, after converting the BBML, you end up with:

<p>

<code>
&lt;label class="label" for="name"&gt;Name&lt;/label&gt; &lt;input id="name" name="name" value="Justin Carter" /&gt; 
&lt;input id="email" name="email" value="justin.w.carter@gmail.com" /&gt; 
&lt;label class="label" for="email"&gt;Email&lt;/label&gt; 
&lt;label class="label" for=""&gt;Product&lt;/label&gt; &lt;input type="radio" id="product-cfbuilder" name="product" value="Adobe ColdFusion Builder" /&gt; &lt;label for="product-cfbuilder"&gt;Adobe ColdFusion Builder&lt;/label&gt; 
&lt;input type="radio" id="product-flashbuilder" name="product" value="Adobe Flash Builder" /&gt; &lt;label for="product-flashbuilder"&gt;Adobe Flash Builder&lt;/label&gt; 
&lt;input type="checkbox" id="notify" name="notify" value="Please notify me of product updates by email" /&gt; &lt;label for="notify"&gt;Please notify me of product updates by email&lt;/label&gt; 
&lt;label class="label" for="enquiry"&gt;Enquiry&lt;/label&gt; &lt;select id="enquiry" name="enquiry"&gt; 
	&lt;option value="Sales"&gt;Sales&lt;/option&gt; 
&lt;/select&gt; 
&lt;textarea id="comment" name="comment"&gt;Tell us about your enquiry...&lt;/textarea&gt; 
&lt;input type="submit" value="Save" /&gt;
</code>

<p>

Pretty dang cool! As I said, his extension only supports forms now. But you can imagine this getting more and more powerful as time goes on. 

<p>

Another interesting aspect of this is his ideEvent.cfc component. He uses it just for one method, but he wrapped a simple method to handle the correct output for telling CFBuilder to insert text into the editor. 

<p>

<code>
function insertText(text) {
	savecontent variable="xml" {
		writeOutput('
			&lt;response&gt;
			&lt;ide&gt;
			&lt;commands&gt;
			&lt;command type="inserttext"&gt;
				&lt;params&gt;
					&lt;param key="text"&gt;&lt;![CDATA[#text#]]&gt;&lt;/param&gt;
				&lt;/params&gt;
			&lt;/command&gt;
			&lt;/commands&gt;
			&lt;/ide&gt;
			&lt;/response&gt;
		');
	}
	return xml;
}
</code>

<p>

It's really just a glorified snippet, but does make the handler code <i>much</i> simpler:

<p>

<code>
&lt;cfheader name="Content-Type" value="text/xml"&gt;
&lt;cfoutput&gt;#ide.insertText(renderer.output())#&lt;/cfoutput&gt;
</code>

<p>

I <i>really</i> like this idea and I hope to see more of it. Anyway, all in all, a great start. Thanks Justin! 

<p>

p.s. I'll be posting a wrap up later this week. Thank you to everyone who participated and all the comments from my readers.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fmyentry%{% endraw %}2Ezip'>Download attached file.</a></p>