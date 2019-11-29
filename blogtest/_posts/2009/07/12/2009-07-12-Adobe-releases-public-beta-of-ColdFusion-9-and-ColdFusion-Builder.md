---
layout: post
title: "Adobe releases public beta of ColdFusion 9 and ColdFusion Builder"
date: "2009-07-13T00:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/12/Adobe-releases-public-beta-of-ColdFusion-9-and-ColdFusion-Builder
guid: 3433
---

The title says it all. As of about 60 seconds ago, Adobe Labs just released the public beta's of ColdFusion 9 and ColdFusion Builder:

<a href="http://labs.adobe.com/technologies/coldfusion9/ 
">Download ColdFusion 9</a>

<a href="http://labs.adobe.com/technologies/coldfusionbuilder/">Download ColdFusion Builder</a>

Ben, Adam, Terry, and others have been blogging/talking about these new releases quite heavily lately and now you get to play with them as well. I, along with others, will be doing quite a few blog entries over the next few days. If there is something in particular you want to see me cover, speak up.

So I've got my hands on some nicely written, high level overviews of ColdFusion 9. I hate to just cut and paste, but heck, someone's gone through the trouble so why not? Where you see Ray:, those are my little comments.

<b>CFML Language Evolution</b><br/>
ColdFusion 9 introduces several requested CFML and CFC improvements including the onServerStart() method, nested CFTRANSACTIONs, local variable scope, and implicit getters 
and setters. All the CFML language enhancements in ColdFusion 9 were vetted and directed by the CFML Advisory committee. Ray: Sometimes it's the small little language improvements that really kick butt - I especially like the improvements to implicit structs and arrays in CF9.

<b>Rethinking Database Driven Applications - Hibernate-based ORM</b><br>
One of the most significant additions to ColdFusion is the new object-relational mapping framework built-in to ColdFusion 9. Powered by the industry leading Hibernate framework, ColdFusion 9 takes rapid application development to the next level by allowing ColdFusion developers to build database driven applications without writing SQL, faster than any other platform. Ray: I've learned to depend on Transfer, and hibernate has me even more excited. 

<b>Enterprise Glue: Microsoft SharePoint & Office Interoperability</b><br>
ColdFusion 9 extends its reach into .NET based technologies like Microsoft SharePoint and MS Office. Teamed with previous integration with .NET, MS Exchange and Active Directory, ColdFusion developers can fully bridge the gap between Java and .NET technologies. Native Excel, PowerPoint and Word functionality extends ColdFusion reporting capabilities from the web into the conference room. 

<b>Native JEE Portlets</b><br>
With native support for Java standards JSR-168, JSR-286 and WSRP, ColdFusion applications can be exposed as Portlets in leading JEE Portals. The full range of integration and services make ColdFusion 9 the fastest and easiest way to extend your company's portals. Ray: So I have to say, I've never actually done anything with portlets. How many of my readers have?

<b>Exposed Service Layer (CFaaS)</b><br>
ColdFusion 9 exposes many existing enterprise services that can be accessed using SOAP or Flash Remoting without writing a single line of CFML.  These services include charting, 
document services, PDF utilities, image manipulation and email. With granular security controls, these web services can be sandboxed, permitting access only to authorized 
applications. Ray: <b>Big</b> fan of this one. See the Adobe.tv presentation on it.

<b>Dynamic UI Controls</b><br>
Developing rich applications for the browser has never been easier. ColdFusion 9 provides access to a broader set of AJAX controls that leverage the new Ext JS 3.0 library via easy to use CFML tags and attributes.  New controls include mapping, Video Player, multi-file upload, enhanced data grid, accordion navigation, progress indicator, confirmations and alerts as well as customizable buttons and sliders. Ray: I've got an Adobe.tv presentation on the new Map stuff. Will link later.

<b>Advanced Caching</b><br> 
ColdFusion 9 enables more granular control over caching, allowing you to build high performance applications.  By using new built-in functions, you can cache objects/data or page fragments to disk or memory. Ray: I've got an Adobe.tv presentation on this as well.

<b>Scripting Language Support</b><br> 
ColdFusion 9 includes the highly requested extended support for CFSCRIPT, including full function, component and interface definition. Save time building applications by not having to switch between script and tag based coding. Ray: While I won't write <i>everything</i> in cfscript, I'll definitely start doing my CFCs in it.

<b>Apache Solr/Lucene Integration</b><br>
ColdFusion 9 adds support for the open source Apache Solr project.  Based on the popular Lucene full-text serach engine, Apache Solr can index an unlimited number of documents for access via the CFSEARCH tag. Ray: I always said people didn't give Verity enough respect, but whatever. Lucene kicks butt, and I'm very happy to see it (Solr really) natively added. 

<b>Server Management Tool</b><br/> 
The new Server Manager is a desktop application to help manage multiple ColdFusion servers from one location, simplifying administration.  You can create data sources, schedule tasks, apply hotfixes and clear caches across a cluster of ColdFusion servers as well as compare settings across servers. Since it's based on Adobe AIR, the Server Manager can run on Windows, OSX and Linux. Ray: I rarely have to deal with clusters, but this will be a godsend for folks who have to deal with 2+ servers at once.

So that's it. ColdFusion Builder has a very nice set of features as well. I'll blog a bit more on that later. 

And finally, a presentation on the launch:

<object height="425" width="550">
	<param name="movie" value="http://slidesix.com/viewer/SlideSixViewer.swf?alias=ColdFusion-Beta-Launch-Preso"/>
	<param name="menu" value="false"/>
	<param name="scale" value="noScale"/>
	<param name="allowFullScreen" value="true"/>
	<param name="allowScriptAccess" value="always" />
	<embed src="http://slidesix.com/viewer/SlideSixViewer.swf?alias=ColdFusion-Beta-Launch-Preso" allowscriptaccess="always" allowFullScreen="true" height="425" width="550" type="application/x-shockwave-flash" />
</object>