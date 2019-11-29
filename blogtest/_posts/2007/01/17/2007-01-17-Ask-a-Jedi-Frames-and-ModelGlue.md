---
layout: post
title: "Ask a Jedi: Frames and Model-Glue"
date: "2007-01-17T15:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/01/17/Ask-a-Jedi-Frames-and-ModelGlue
guid: 1774
---

Yesterday Dan asked the following question about frames and Model-Glue:

<blockquote>
Basically, my question is about using frames within my application.  I basically want to use a frame for my avigation
that never gets reloaded and another frame below it for the page displays. The reason I am using a frame for the navigation is that I am also trying to implement chat functionality within my ColdFusion app.  The chat core needs to sit in a page that doesn't get refreshed, thus my need for a frame within my application. How would I go about in setting up this layout with my application using the Model-Glue framework?
</blockquote>
<!--more-->
The short answer to this is that you don't do anything special for frames when it comes to Model-Glue. What is interesting is that a very similar issue came up last week. I was doing training for a group of developers using Model-Glue and Spry. When it came time to talk about the URL to use for Spry's AJAX requests, I made the point that requesting XML (or loading a frame) is no different than any other Model-Glue request.

So to take your frames request and show a practical example, let's first look at a simple example of framed code:

<code>
&lt;frameset cols="200,*" bordercolor="#333333" framespacing="2" border="5"&gt;
    &lt;frame src="navserver.cfm"  name="frame_nav" resize="yes" marginwidth="0" marginheight="0" framespacing="0" title="Navigation"&gt;
    &lt;frame src="right.cfm?target="  name="frame_detail" id="frame_detail" resize="yes" marginwidth="0" marginheight="0" framespacing="0" title="Main window"&gt;
&lt;/frameset&gt;
</code>

In case folks are curious - these frames come from the ColdFusion administrator  (the only site I know that actually uses frames). The code we want to focus on is the two frame tags. Note they both use a SRC attribute which points to a URL. So in a Model-Glue site, the frames could look like so:

<code>
&lt;frameset&gt;
  &lt;frame src="index.cfm?event=page.leftframe"&gt;
  &lt;frame src="index.cfm?event=page.rightframe"&gt;
&lt;/frameset&gt;
</code>

So to make this absolutely crystal clear - there is nothing special about using frames or AJAX requests in Model-Glue. Just remember your URL format (index.cfm?event=X) and use it for your links. 

p.s. Don't forget Model-Glue has a set of <a href="http://ray.camdenfamily.com/index.cfm/2006/6/2/ModelGlue-What-is-reserved-in-the-view-state">predefined</a> variables in the viewState, including one for index.cfm?event=. So technically, to make a link to event X, you would normally use this:

<code>
&lt;cfoutput&gt;
&lt;a href="#viewState.getValue("myself")#X"&gt;X&lt;/a&gt;
&lt;/cfoutput&gt;
</code>

As a hint - I recommend copying out that myself value to a variable if you will have a lot of links on a page (like your display template).