---
layout: post
title: "xmlFormat and Microsoft's Funky Characters"
date: "2006-11-02T18:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/11/02/xmlFormat-and-Microsofts-Funky-Characters
guid: 1631
---

Did you know that xmlFormat, which is supposed to make a string safe for XML, doesn't always work? Specifically it will ignore the funky Microsoft Word characters like smart quotes. If you are delivering dynamic content via XML, you cannot rely on xmlFormat alone. This is what I'm using now in <a href="http://ray.camdenfamily.com/projects/toxml">toXML</a>:

<code>
&lt;cffunction name="safeText" returnType="string" access="private" output="false"&gt;
	&lt;cfargument name="txt" type="string" required="true"&gt;

	&lt;cfset arguments.txt = replaceList(arguments.txt,chr(8216) & "," & chr(8217) & "," & chr(8220) & "," & chr(8221) & "," & chr(8212) & "," & chr(8213) & "," & chr(8230),"',',"","",--,--,...")&gt;
	&lt;cfreturn xmlFormat(arguments.txt)&gt;
&lt;/cffunction&gt;
</code>

The replaceList comes from Nathan Dintenfas' <a href="http://www.cflib.org/udf.cfm/safetext">SafeText</a> UDF. toXML, in case you don't remember, is a simple CFC that converts native ColdFusion datatypes to XML. Very useful for handing data to Spry.