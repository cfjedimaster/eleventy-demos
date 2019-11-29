---
layout: post
title: "Continuing my Fusebox study"
date: "2007-02-07T09:02:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/02/07/Continuing-my-Fusebox-study
guid: 1824
---

In my <a href="http://ray.camdenfamily.com/index.cfm/2007/2/5/Installing-Fusebox">last entry</a> I talked about how to install the Fusebox framework and how to create a basic Fusebox application install using the skeleton. I confirmed that the skeleton worked (you can see it <a href="http://ray.camdenfamily.com/skeleton">here</a>) and now I want to dig down a bit more into what actually goes on when you run the application.

I read - a few times - the documentation on the <a href="http://www.fusebox.org/index.cfm?fuseaction=documentation.Fusebox4Lifecycle">Fusebox life cycle</a>. (As a note - the docs refer to Fusebox 4 still. This is a known bug.) What follows is my take on what I read in the docs, and how it compares to Model-Glue.
<!--more-->
So the docs split up the life cycle (or in simpler terms, what the heck happens when I run the page) into 4 sections: Runtime, Loader, Transformer, and Parser.

The Runtime simply determines which of the other three guys need to run. As a developer I don't have to worry about this too much. It is the framework itself (or thats how I see it). The Runtime also takes care of joining any URL or Form data into the ATTRIBUTES scope. In Model-Glue world this would be the event object. I assume folks know why this is a Good Idea(tm) so I won't go over it.

The Loader does what it says - loads the configuration information. In Model-Glue this would be the Model-Glue.xml file. This loads the fusebox.xml (note that in the skeleton this is actually a fusebox.xml.cfm file) file and any other xml file necessary. This is all cached though, again, like Model-Glue. 

Question - is there a URL key to force Fusebox to refresh? Is there a configuration setting in fusebox.xml to force a refresh on each hit? The <a href="http://www.fusebox.org/index.cfm?fuseaction=documentation.FuseboxXML">doc</a> on the XML file says there is - but the doc doesn't match what I see in the XML file. The doc mentions I should use a value of development or production, but my skeleton shows a value of development-circuit-load. 

So at this point I admit I get a bit lost. The docs say:

<blockquote>
At this point Fusebox 4 takes a leap forward from earlier versions. In all previous versions, the fuseaction at this point was operated on directly: "do A. OK, done with A. Now do B. Ok, done with B. Now do C. OK, done with C." Effectively, the developer was limited to execution of a single fuseaction, and it was difficult (or at least cumbersome) to share common fuses among multiple fuseactions which could make use of it.
</blockquote>

The docs haven't (as of yet) talked about a fuseaction. The <a href="http://www.fusebox.org/index.cfm?fuseaction=documentation.TheBasics">previous page</a> in the documentation does mention fuseaction once, but only as a query string variable. I get that the fuseaction is a message. But what is a fuse? What does it even mean to share it among multiple fuseaction? I will admit I'm being a bit facetious here. I know from talks with other FB developers a bit about what is going on here. But from a newbie perspective, this is a <b>not</b> a gentle introduction. At this point (if I were writing the docs), I would have simply said:

<blockquote>
At this point Fusebox will look at the fuseaction being requested and determine how it will be processed. The XML determines what each fuseaction does. 
</blockquote>

The docs continue on to the Transformer. The Transformer creates what is called a Fuse Queue (or FuseQ). I think this is simply the list of what to do - based on the fuseaction which defined what is being done for the event. 

Lastly the Parser will take the Fuse Queue and "outputs a full language-specific version of the application you wrote in XML". Now I'm really confused. Is Fusebox generating code for me like an ORM? Is it simply translating the XML into a set of cfincludes? I may have Model-Glue too much in my mind - but I don't get what this means. In Model-Glue, our event has a series of actions (messages, views, results). So in Fusebox this would be the Fuseaction which becomes a Fuse Queue. I'm with ya there, Fusebox. But it sounds like Fusebox actually translates this list into a script. I can maybe see that being useful for speed - but I don't think I have a handle on it yet.

Summary: All in all this part of the documentation really threw me for a loop. The <a href="http://www.fusebox.org/index.cfm?fuseaction=documentation.TheBasics">first page</a> was rather simple, but the <a href="http://www.fusebox.org/index.cfm?fuseaction=documentation.Fusebox4Lifecycle">second page</a> seems to be way complex. I'd rather see a one or two paragraph simple explanation of what is going on in the request with links to further information about each part of the process. Also the docs throw around fuse, fuseaction, and circuit without doing a great job defining them. 

So I'm a bit confused... but think I kind of get it. I know my readers will help clear this up! (And if others agree with me, maybe we can get the documentation improved a bit.)