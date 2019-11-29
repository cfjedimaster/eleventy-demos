---
layout: post
title: "Caching CFCONTENT"
date: "2007-10-16T11:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/16/Caching-CFCONTENT
guid: 2416
---

A few days ago I blogged about a <a href="http://www.raymondcamden.com/index.cfm/2007/10/11/ColdFusion-and-Verity-Tip--Getting-results-found-when-paging">code review</a> I was doing for another client. Yesterday I found another interesting bug in their code. (It is always easier to find bugs in other people's code.)
<!--more-->
The code in question was an API tester for their web site. The page had a nice set of links to let you test all of their XML based responses for their site. I noticed something odd in one test. The first time I ran the test, I got a nicely formatted XML result in the browser. The second time however I got an odd jumble of text.

Viewing the source revealed that the XML was there ok. I took a look at the code and spotted the problem right away. See if you can as well:

<code>
&lt;cf_ScopeCache
      cachename="foo_#somevar#"
      scope="server"
      timeout="1800"&gt;

&lt;cfset myXML = application.myGateway.getMyXML(args)/&gt;

&lt;CFCONTENT TYPE="text/xml" RESET="Yes"&gt;
&lt;CFOUTPUT&gt;#ToString(myXML)#&lt;/CFOUTPUT&gt;
&lt;/cf_scopecache&gt;
</code>

If you don't recognize cf_scopecache, it is just a caching custom tag. It takes the text result of the stuff inside it and stores it.

And that's where our problem is. Our caching tag caches the text. But the CFCONTENT tag is a Request specific tag. By that I mean it changes the current request. The first time the page is hit, it will execute, as will all the code inside the scopeCache custom tag. The second time though only the text is returned. CFCONTENT isn't run. The fix was simple - move the CFCONTENT:

<code>
&lt;CFCONTENT TYPE="text/xml" RESET="Yes"&gt;
&lt;cf_ScopeCache
      cachename="foo_#somevar#"
      scope="server"
      timeout="1800"&gt;

&lt;cfset myXML = application.myGateway.getMyXML(args)/&gt;

&lt;CFOUTPUT&gt;#ToString(myXML)#&lt;/CFOUTPUT&gt;
&lt;/cf_scopecache&gt;
</code>

The same issue would exist if you used CFCACHE on top of the page.