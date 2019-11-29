---
layout: post
title: "Converting XML to JSON - My exploration into madness..."
date: "2012-01-04T11:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/01/04/Converting-XML-to-JSON-My-exploration-into-madness
guid: 4481
---

Forgive the overly dramatic blog title - just having a bit of fun. A coworker asked me yesterday how one could take a flat XML file and serve it up as JSON. I told him I'd whip up a "quick example" for him and blog it to share with others. Smirking a bit to myself, I imagined I'd be done in 5 minutes and it would be a bit of a fluff piece. My ego ran head first into a brick wall rather quickly - which - I will admit - was kind of fun. Here's what I discovered.

<p/>
<!--more-->
For the hell of it, I thought, why not simply read in the XML, parse it, and serialize it?

<p/>

<code>
&lt;cfset xmlFile = expandPath("./Applications.xml")&gt;
&lt;cfset xmlData = xmlParse(xmlFile)&gt;

&lt;cfset jsonData = serializeJSON(xmlData)&gt;
&lt;cfoutput&gt;#jsonData#&lt;/cfoutput&gt;
</code>

<p/>

Looks simple enough, right? However, it appears that serializeJSON takes the 'toString' version of xmlData. Even though it's a ColdFusion XML variable, it's first converted to a string and then passed to serializeJSON. So basically you get a large JSON encoded string. Or as I call it - a Chrome killer. (To be fair, Chrome was nice about shutting down a tab, and it was more the fact that I have a plugin that recognizes and auto formats JSON strings.) So that's not good. What about converting the XML into native ColdFusion structure?

<p/>

Turns out there is a UDF for that - <a href="http://www.cflib.org/udf/xmltojson">xmlToJson</a>. It makes use of a XSLT transformation to create JSON. Perfect! And appropriately geeky too, right? I mean, how often do you get a chance to tell folks you performed an XSLT transformation today? Try it at the bar next time. It's a sure win. Here's the template I created to test this (note, the UDF is rather large, so I cut out the innards):

<p/>

<code>

&lt;cfset xmlFile = expandPath("./Applications.xml")&gt;
&lt;cfset xmlData = xmlParse(xmlFile)&gt;


&lt;cffunction name="xmlToJson" output="false" returntype="any" hint="convert xml to JSON"&gt;
		
&lt;/cffunction&gt;
	
&lt;cfset json = xmlToJson(xmlData)&gt;
&lt;cfdump var="#deserializeJSON(json)#"&gt;
</code>

<p/>

This worked rather fast - shockingly fast actually - but it throws an error when deserializing. The transformation encountered this - Value=".0". This created a JSON string something like this - "Value":.0. That's not valid JSON. In theory I could have done some string parsing, but that felt dirty, so I went to approach 3: manually creating a structure. I designed this UDF:

<p/>

<code>
function xmlToStruct(xml x) {
	var s = {};
	
	if(xmlGetNodeType(x) == "DOCUMENT_NODE") {
		s[structKeyList(x)] = xmlToStruct(x[structKeyList(x)]);	
	}

	if(structKeyExists(x, "xmlAttributes") && !structIsEmpty(x.xmlAttributes)) { 
		s.attributes = {};
		for(var item in x.xmlAttributes) {
			s.attributes[item] = x.xmlAttributes[item];		
		}
	}
	
	if(structKeyExists(x, "xmlChildren")) {
		for(var i=1; i&lt;=arrayLen(x.xmlChildren); i++) {
			if(structKeyExists(s, x.xmlchildren[i].xmlname)) { 
				if(!isArray(s[x.xmlChildren[i].xmlname])) {
					var temp = s[x.xmlchildren[i].xmlname];
					s[x.xmlchildren[i].xmlname] = [temp];
				}
				arrayAppend(s[x.xmlchildren[i].xmlname], xmlToStruct(x.xmlChildren[i]));				
			 } else {
				s[x.xmlChildren[i].xmlName] = xmlToStruct(x.xmlChildren[i]);		 	 
			 }
		}
	}
	
	return s;
}
</code>

<p>

It handles creating a substructure for xml attributes and handling a case where you have 2-N xml children of the same name. (That was the toughest part.) Here's the complete template:

<p>

<code>
&lt;cfset xmlFile = expandPath("./Applications.xml")&gt;
&lt;cfset xmlData = xmlParse(xmlFile)&gt;

&lt;cfscript&gt;
function xmlToStruct(xml x) {
	var s = {};
	
	if(xmlGetNodeType(x) == "DOCUMENT_NODE") {
		s[structKeyList(x)] = xmlToStruct(x[structKeyList(x)]);	
	}

	if(structKeyExists(x, "xmlAttributes") && !structIsEmpty(x.xmlAttributes)) { 
		s.attributes = {};
		for(var item in x.xmlAttributes) {
			s.attributes[item] = x.xmlAttributes[item];		
		}
	}
	
	if(structKeyExists(x, "xmlChildren")) {
		for(var i=1; i&lt;=arrayLen(x.xmlChildren); i++) {
			if(structKeyExists(s, x.xmlchildren[i].xmlname)) { 
				if(!isArray(s[x.xmlChildren[i].xmlname])) {
					var temp = s[x.xmlchildren[i].xmlname];
					s[x.xmlchildren[i].xmlname] = [temp];
				}
				arrayAppend(s[x.xmlchildren[i].xmlname], xmlToStruct(x.xmlChildren[i]));				
			 } else {
				s[x.xmlChildren[i].xmlName] = xmlToStruct(x.xmlChildren[i]);		 	 
			 }
		}
	}
	
	return s;
}

s = xmlToStruct(xmlData);

&lt;/cfscript&gt;

&lt;cfcontent reset="true" type="application/json"&gt;&lt;cfoutput&gt;#serializeJSON(s)#&lt;/cfoutput&gt;
</code>

<p>

This worked rather fast (2-3 seconds for a 2 meg XML file), but we could make it even faster by cutting out the file read and parsing after we've done it one time:

<p>

<code>
&lt;cfset cachedJSON = cacheGet("jsonstr")&gt;
&lt;cfif isNull(cachedJSON)&gt;

	&lt;cfset xmlFile = expandPath("./Applications.xml")&gt;
	&lt;cfset xmlData = xmlParse(xmlFile)&gt;
	
	&lt;cfscript&gt;
	function xmlToStruct(xml x) {
		var s = {};
		
		if(xmlGetNodeType(x) == "DOCUMENT_NODE") {
			s[structKeyList(x)] = xmlToStruct(x[structKeyList(x)]);	
		}
	
		if(structKeyExists(x, "xmlAttributes") && !structIsEmpty(x.xmlAttributes)) { 
			s.attributes = {};
			for(var item in x.xmlAttributes) {
				s.attributes[item] = x.xmlAttributes[item];		
			}
		}
		
		if(structKeyExists(x, "xmlChildren")) {
			for(var i=1; i&lt;=arrayLen(x.xmlChildren); i++) {
				if(structKeyExists(s, x.xmlchildren[i].xmlname)) { 
					if(!isArray(s[x.xmlChildren[i].xmlname])) {
						var temp = s[x.xmlchildren[i].xmlname];
						s[x.xmlchildren[i].xmlname] = [temp];
					}
					arrayAppend(s[x.xmlchildren[i].xmlname], xmlToStruct(x.xmlChildren[i]));				
				 } else {
					s[x.xmlChildren[i].xmlName] = xmlToStruct(x.xmlChildren[i]);		 	 
				 }
			}
		}
		
		return s;
	}
	
	cachedJSON = serializeJSON(xmlToStruct(xmlData));
	
	&lt;/cfscript&gt;
	
	&lt;cfset cachePut("jsonstr", cachedJSON)&gt;
	
&lt;/cfif&gt;

&lt;cfcontent reset="true" type="application/json"&gt;&lt;cfoutput&gt;#cachedJSON#&lt;/cfoutput&gt;
</code>

<p>

This version makes use of ColdFusion 9's built in caching to store the JSON string. On the first hit it takes about 3 seconds to render in the browser. After that it's almost immediate. The cache has no expiration, but it could be updated to timeout after a certain amount of time, or, you could note the date stamp on the file and store both that and the filename as a key to your cache. 

<p>