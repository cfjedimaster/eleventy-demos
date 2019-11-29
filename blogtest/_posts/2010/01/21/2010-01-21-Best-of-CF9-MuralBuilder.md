---
layout: post
title: "Best of CF9: MuralBuilder"
date: "2010-01-21T13:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/01/21/Best-of-CF9-MuralBuilder
guid: 3691
---

<img src="https://static.raymondcamden.com/images/cfjedi/bestcfcontest1.jpg" title="Best of ColdFusion 9" a style="float:left;margin-right:5px;margin-bottom:5px"/> Welcome to the <b>final</b> entry in the Best of CF9 contest! We are finally done. I'll be posting a wrap up and announcing the winners mid next week. In the meantime, please enjoy this final review written by Charlie Arehart.
<!--more-->
<p>

Wow, even before I looked at a line of code, I loved MuralBuilder, and not just for the idea or its implementation, but as much for Ben Riordan's style in presenting it.

<p>

What it does:

<p>

Let's clarify first what it does: it allows you to convert an image into a larger poster, or mural. It can be many times larger. The app does the conversion, using various new CF9 features. Once installed, you can upload an image to it (whose progress is tracked using the new CFProgressBar), select a size for the poster (using the ajax CFSlider--not the old Flash form variant-to pick the size), and its converted into a PDF (using CF's image and PDF manipulation features, and again using CFProgressBar to keep you updated of the status) and the PDF has a greatly expanded image implemented on as many pages as needed to print out to make a mural. Simple and effective.

<p>

Evaluation of Entry:

<p>

Sure, there have long been other tools to do this, but let's consider why it's a nifty contest entry.

<p>

First, it's written in CF, which we all love to see. Second, it's using CF9 features, which is key to getting into the contest. Third, and great to see, is that he's made it an easy and stylish web-accessible service, so you can even run it yourself already (without downloading and installing the code, for free) at http://muralbuilder.com/. But as observers of the contest, you can also get the code.

<p>

Better still, if you visit the site (or run the code) you'll notice that he offers a brief (74 second) video right on the front page to introduce it. And it's not a boring walkthrough of code or even benefits.  Instead, it opens with a nifty fast-paced video of a wall being covered with the results of the tool. First you see it being printed, then mounted, then back to showing the interface being used. And all this is done without any voiceover, but instead a trippy backbeat and an invisible hand working away. I give that an "A" for style points.

<p>

<object width="400" height="199"><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="http://vimeo.com/moogaloop.swf?clip_id=7914051&server=vimeo.com&show_title=1&show_byline=1&show_portrait=0&color=&fullscreen=1" /><embed src="http://vimeo.com/moogaloop.swf?clip_id=7914051&server=vimeo.com&show_title=1&show_byline=1&show_portrait=0&color=&fullscreen=1" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="400" height="199"></embed></object><p><a href="http://vimeo.com/7914051">Mural Builder Intro</a> from <a href="http://vimeo.com/user2722978">Ben Riordan</a> on <a href="http://vimeo.com">Vimeo</a>.</p>

<p>

As for the CF9 features:

<p>

As I mentioned above, the app uses the new CFProgressBar and the updated CFSlider (allowing it to be used in other than Flash forms). Beyond the simple interface features of each, Ben also is leveraging their event handling capabilities, so that when each element finishes rendering, the interface knows it can show the next interface control needed to proceed through the process of accepting/converting the uploaded file.

<p>

I'll note that he also nicely uses the tooltip feature (which was added in CF8), offering a help icon for each input control. And as another touch of class, there's a feedback link stylishly placed at the left of the page rotated sideways. Nice way to make it present but not obtrusive. Finally, you'll notice there is a "print center" button, which he notes (in a tooltip) that he eventually plans to integrate with printing centers like OfficeDepot, FedEx Office, etc.

<p>

And all this from someone who just started doing CF, and indeed development in general, in October with CF9's release. Ben's a designer by profession, so that explains the site's style and the video. But again an A for effort the concept, the site's nice touches, the video, and even his packaging the app up in a way that's easy to use. We could use more past-designers in the CF community! :-)

<p>

Picking nits (if I have to)

<p>

If I had to pick any nits, here are a few.

<p>

I also see that he sets a max upload size of 12mb. It certainly makes sense to set some limit on the site, but someone running it locally might like to change that, so it would be good to expose that up front in the code as a configurable option.

<p>

It's worth noting also that CFers don't take enough advantage of using external files to permit such changes. Rather than edit the code, it could read in an ini file where they could be set, as supported by the CF functions GetProfileString, GetProfileSections, and SetProfileString. But I don't begrudge a newcomer not knowing of these, when in fact I'd say most CF developers don't know of them.

<p>

It's also not clear what happens to the images (uploaded and generated), whether running the tool on his site or if one implements it on their own.  Users (and admins) may wonder how long they stick around. And for the site (and for someone offering the tool locally), users may also wonder about any privacy notice or other terms of use. Just something to consider.

<p>

It might also be nice for the upload process to be followed by a display of the image, just to confirm one pointed to the right file to be uploaded. But the image name is shown, and that will surely suffice for most people. And you may notice when you first run it that there's no submit button ("build document", as he labels it). That's because he's not showing it until you change the size slider, which defaults to 0. I think that could confuse some people (only some. Again, I said these were nits.) Maybe it could either default to some size other than 0, or it could show the button but have it greyed out until the selections were made (and if one moused over it with none made, a tooltip could remind them that they've not made any, like he did for the "print center" button).

<p>

Finally, if you do get the code to run it for yourself, he's tried to make that easy, too, saying in his entry:

<p>

"To run it, just unzip it into your web root, and set the correct variables in Application.cfc wwwroot = your coldfusion wwwroot uploadroot = your coldfusion wwwroot/murals. It is changeable for use of a different drive if needed in a higher load environment CFCTree = path to your coldfusion components folder. There is no database connectivity to set up."

<p>

Some readers will know that even that modification can be avoided, if you just use CF's built-in functions or variables to determine that location dynamically. In this case, expandpath() would work, pointing to the current directory when the code runs in application.cfc, so the code which (as he offered it) says:

<p>

<code>
&lt;cfset application.wwwroot="c:/coldfusion9/wwwroot/muralBuilder"&gt;
&lt;cfset application.uploadroot="c:/coldfusion9/wwwroot/muralBuilder/murals"&gt;
</code>

<p>

Could become:

<p>

<code>
&lt;cfset application.wwwroot="#expandpath(".")#"&gt;
&lt;cfset application.uploadroot=application.uploadroot&"\murals"&gt;
</code>

<p>

He also chose to do those settings in the onrequeststart method of application.cfc, with code testing for whether the application.wwwroot variable had been created yet, and if not he then set those variables. Again, some will know that since he's using application.cfc, those settings are something which can instead be done in the onapplicationstart method.

<p>

But hey, as I noted above, he did indicate that he was new to CF, so I point these out only for him and others reading this who may benefit.

<p>

Conclusion: a 10!

<p>

But none of those nits take away from the tool in terms of the contest. For that, I give it a 10, for all the reasons offered above the nits. Great job, Ben Riordan, and welcome to the CF community! :-)<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FmuralBuilder%{% endraw %}2Ezip'>Download attached file.</a></p>