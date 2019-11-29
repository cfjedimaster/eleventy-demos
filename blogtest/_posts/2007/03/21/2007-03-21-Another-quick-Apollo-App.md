---
layout: post
title: "Another quick Apollo App"
date: "2007-03-21T11:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/03/21/Another-quick-Apollo-App
guid: 1910
---

I'm just loving Apollo. This morning I built a quick regex tester. It only does global style matches, but it is a good first draft. Download it by clicking the Download link below.

In the next version I'll switch to using highlight on the original text instead of a dump of matches. I'll also let you try out replacements as well.

Enjoy my lovely design skills. The code is below for those who are curious.
<!--more-->
<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:ApolloApplication xmlns:mx="http://www.adobe.com/2006/mxml" layout="absolute" title="Regular Expression Tester"&gt;

&lt;mx:Script&gt;
&lt;![CDATA[
private function testRegex():void {
	var regexStr:String = regex.text;
	var bodyStr:String = body.text;
	
	results.text = '';
	
	if(regexStr == '' || bodyStr == '') {
		mx.controls.Alert.show("Please enter a regex and a body.");
		return;
	}
	
	var regexOb:RegExp = new RegExp(regexStr,"g");
	var matches:Array = bodyStr.match(regexOb);
	
	if(matches != null && matches.length &gt; 0) {
		for(var i=0; i &lt; matches.length; i++) {
			results.text += matches[i] + "\n";
		}
	}
}		
]]&gt;
&lt;/mx:Script&gt;

&lt;mx:VDividedBox width="100{% raw %}%" height="100%{% endraw %}"&gt;
	
	&lt;mx:Panel title="Regex" width="100%" height="70" &gt;

		&lt;mx:HBox width="100{% raw %}%" height="100%{% endraw %}"&gt;
			
			&lt;mx:TextInput id="regex" width="100{% raw %}%" height="100%{% endraw %}"/&gt; &lt;mx:Button id="tstButton" label="Test Regular Expression" click="testRegex()" height="100%" /&gt;
			
		&lt;/mx:HBox&gt;
		
	&lt;/mx:Panel&gt;
	
	&lt;mx:Panel title="Body" width="100%"&gt;
		
		&lt;mx:TextArea id="body" width="100{% raw %}%" height="100%{% endraw %}" /&gt;

	&lt;/mx:Panel&gt;

	&lt;mx:Panel title="Matches" width="100%"&gt;
		
		&lt;mx:TextArea id="results" width="100{% raw %}%" height="100%{% endraw %}" editable="false" /&gt;

	&lt;/mx:Panel&gt;

&lt;/mx:VDividedBox&gt;

&lt;/mx:ApolloApplication&gt;
</code><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fregex%{% endraw %}2Ezip'>Download attached file.</a></p>