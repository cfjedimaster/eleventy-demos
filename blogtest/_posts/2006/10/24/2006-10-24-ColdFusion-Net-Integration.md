---
layout: post
title: "ColdFusion .Net Integration"
date: "2006-10-24T17:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/10/24/ColdFusion-Net-Integration
guid: 1608
---

Again - forgive the haphazard nature of the notes.

.Net Integration Session

Why? Leverage functionality available in .Net. Leverage MS products like Word, Excel, Outlook, etc.

Idea is to keep it simple. (Like rest of ColdFusion.) Right now you can talk to .Net using web services (if the .Net code is available via web services.) With Scorpio you will be able to do it directly.

How can we interact with .Net?<br>
Web Services (available now)<br>
Messaging<br>
Using COM<br>
Runtime Unification (new in Scorpio)<br>

Runtime Unification:<br>
Make .net components locally available. Invoke .net components directly from CFM.
Using cfobject and createObject. Works very much like cfobject/createobject for Java

<code>
&lt;cfobject type=".net" class="xxx" assembly="foo.dll" name="something"&gt;
&lt;cfset foo = something.method&gt;
</code>

Web Services versus RU:

Loose coupling versus tight coupling.<br>
Coarse granular and less programmatic control versus fine granular and more programmatic control.<br>
Low on performance/realiability versus better performance/reliability.<br>
Stateless versus Stateful.<br>
Web services more useful for external clients where RU is better for internal clients.

Features:<br>
Seamless (no configuration)<br>
Location independent (components can be remote or local)<br>
Platform independent (CF can be on any platform calling .Net on a Windows platform)<br>
Hot deployment of assemblies.<br>
Can talk to multiple .net servers.<br>
Secure<br>
Automatic conversion from/to basic CF datatypes and .Net datatypes.

Syntax:<br>
cfobject: class, name, assembly, protocol, secure, server, port

For assembly, can be a list of exe's or dlls or proxy jars. mscorlib.dll always included. 

For protocol, binary is default with best performance. HTTP can be used across the net. 

For constructors, you manually call init() after the cfobject call.

For static methods, no need to call init. 

Example shows getting running processes via .Net. Next example is creating Word docs via ColdFusion.

For datatypes - decimal type not supported. You can use JavaCast on the CF side. JavaCast updated to support byte, short, and char. They have a full mapping of .Net to Java conversions. (Too much to type.)

A proxy is used to handle communication. This means that if you are on a non-Windows machine, must use a command line tool to create the proxies. Proxies generated for .Net 1.x can be used for 2.0 as well. Proxies generated for 2.0 can only be used for 2.0.

Deploment scenario: .net and cf on same machine - no configuration - simplest.

CF and .Net on 2 different machines. The ".Net Side Agent" needs to be installed on other machine and you have to register the assemblies that CF will have access too.

CF on non-Windows machine. .Net side agent needs to be installed on the .Net machine. Generate proxy. This is done on .Net machine and you copy the generated JAR to the CF machine.

Limitations:
Enum and Decimal data type not supported.<br>
Methods with out parameters as arguments. <br>
Methods with pointers as arguments or return type.<br>
.Net UI components<br>
Callbacks