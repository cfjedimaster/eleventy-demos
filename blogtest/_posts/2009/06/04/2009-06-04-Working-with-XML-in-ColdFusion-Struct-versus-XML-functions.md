---
layout: post
title: "Working with XML in ColdFusion - Struct versus XML functions"
date: "2009-06-04T14:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/06/04/Working-with-XML-in-ColdFusion-Struct-versus-XML-functions
guid: 3384
---

Earlier this week I worked with John Bliss on an interesting problem he had. Let me describe his issue, and the solution he came up, and what I learned from it.

John was trying to consume a web service. The web service demanded that a particular SOAP header be sent:
<!--more-->
<code>
&lt;soap:Header&gt;
&lt;ApiUserAuthHeader xmlns="namespace"&gt;
&lt;UserName&gt;xxxxx&lt;/UserName&gt;
&lt;Password&gt;xxxxx&lt;/Password&gt;
&lt;UserAccessKey&gt;xxxx&lt;/UserAccessKey&gt;
&lt;/ApiUserAuthHeader&gt;
&lt;/soap:Header&gt;
</code>

He created the header like so:

<code>
&lt;cfset ApiUserAuthHeader = StructNew()&gt;
&lt;cfset
ApiUserAuthHeader.UserAccessKey = "xxxxx"&gt;
&lt;cfset ApiUserAuthHeader.Password =
"xxxxx"&gt;
&lt;cfset ApiUserAuthHeader.UserName = "xxxxx"&gt;
&lt;cfset
AddSOAPRequestHeader(MyWebservice, "namespace", "ApiUserAuthHeader",
ApiUserAuthHeader)&gt;
</code>

So far so good, right? I've never actually used addSOAPRequestHeader, but just looking at his code it made sense to me. The result however was off:

<code>
&lt;soapenv:Header&gt;
&lt;ns1:ApiUserAuthHeader xmlns:ns1="namespace"&gt;
     &lt;item
xmlns:ns2="http://xml.apache.org/xml-soap"&gt;
        &lt;key
xsi:type="xsd:string"&gt;PASSWORD&lt;/key&gt;
        &lt;value
xsi:type="xsd:string"&gt;xxxxx&lt;/value&gt;
     &lt;/item&gt;
     &lt;item&gt;
        &lt;key
xsi:type="xsd:string"&gt;USERNAME&lt;/key&gt;
        &lt;value
xsi:type="xsd:string"&gt;xxxxx&lt;/value&gt;
     &lt;/item&gt;
     &lt;item&gt;
        &lt;key
xsi:type="xsd:string"&gt;USERACCESSKEY&lt;/key&gt;
        &lt;value
xsi:type="xsd:string"&gt;xxxxx&lt;/value&gt;
     &lt;/item&gt;
  &lt;/ns1:ApiUserAuthHeader&gt;
&lt;/soapenv:Header&gt;
</code>

If you compare this to what the API requires, you can see they don't match. The first suggestion I had was to change how he worked with the structures. When you do:

<code>
&lt;cfset s = {}&gt;
&lt;cfset s.name = "Ray"&gt;
</code>

to create a structure, ColdFusion will uppercase the struct key (name), to give you: s.NAME = "Ray". I recommended he try bracket notation, essentially:

<code>
&lt;cfset s = {}&gt;
&lt;cfset s["name"] = "Ray"&gt;
</code>

This didn't help either (although the resultant header did have the right case for the keys). I hashed this a bit more in my head and then I had an idea. He created the XML data pretty much the way I always did - with structure functions. Of course, ColdFusion also has native XML functions to create XML nodes/data. I never use them because the structure functions are simpler (to me!) and just plain work. In this case though switching to 'proper' XML manipulation functions worked <b>perfectly</b> for him:

<code>
&lt;cfset doc = XmlNew()&gt;
&lt;cfset doc.ApiUserAuthHeader = XmlElemNew(ApiUserAuthHeader, "namespace", "ApiUserAuthHeader")&gt;
&lt;cfset doc.ApiUserAuthHeader.UserName = XmlElemNew(ApiUserAuthHeader, "UserName")&gt;
&lt;cfset doc.ApiUserAuthHeader.UserName.XmlText = "xxxxx"&gt;
&lt;cfset doc.ApiUserAuthHeader.UserAccessKey = XmlElemNew(ApiUserAuthHeader, "UserAccessKey")&gt;
&lt;cfset doc.ApiUserAuthHeader.UserAccessKey.XmlText = "xxxxx"&gt;
&lt;cfset doc.ApiUserAuthHeader.Password = XmlElemNew(ApiUserAuthHeader, "Password")&gt;
&lt;cfset doc.ApiUserAuthHeader.Password.XmlText = "xxxxx"&gt;
&lt;cfset AddSOAPRequestHeader(MyWebservice, "namespace", "ApiUserAuthHeader", doc)&gt;
</code>

So I guess I don't have much to add here, but I'd be curious if this type of problem has tripped up others?