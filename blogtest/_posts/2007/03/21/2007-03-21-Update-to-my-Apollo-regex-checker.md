---
layout: post
title: "Update to my Apollo regex checker"
date: "2007-03-21T14:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/03/21/Update-to-my-Apollo-regex-checker
guid: 1911
---

I love you guys so much that I spent my lunch not just watching the Young and the Restless, but also improving my ugly little Apollo Regex Checker. (Ok, so I <i>did</i> watch Y and R while I coded.)

This new version now uses HTML mark up to show your matches, and lets you toggle between one match and multiple matches.

I have to say I really went down the wrong path trying to get my regex working right. Turns out there was a much simpler way to mark up the matches. This is my new AS code:

<code>
private function testRegex():void {
	var regexStr:String = regex.text;
	var bodyStr:String = body.text;
	var options:String = "";
	
	if(regexStr == '' || bodyStr == '') {
		mx.controls.Alert.show("Please enter a regex and a body.");
		return;
	}

	if(global.selected) options = "g";
		
	var regexOb:RegExp = new RegExp(regexStr,options);

	//any matches?
	if(!regexOb.test(bodyStr)) return;

	body.htmlText = bodyStr.replace(regexOb,"&lt;b&gt;$&&lt;/b&gt;");
	
}		
</code>

Next will be a version that lets you test replacements as well.

By the way - Apollo notices if you run the same AIR twice. It asks you if you want to replace the old version. Sweet.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fregex1%{% endraw %}2Ezip'>Download attached file.</a></p>