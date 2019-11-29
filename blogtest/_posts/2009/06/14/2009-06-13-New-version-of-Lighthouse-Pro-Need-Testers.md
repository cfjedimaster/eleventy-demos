---
layout: post
title: "New version of Lighthouse Pro - Need Testers"
date: "2009-06-14T10:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/06/14/New-version-of-Lighthouse-Pro-Need-Testers
guid: 3394
---

Hey folks, today I'm releasing the beta of a new version of Lighthouse Pro (you can find the released version <a href="http://lighthousepro.riaforge.org/">here</a>). This is not a big update in terms of functionality, but it is a complete rewrite to support Model-Glue 3 (see note at the end!). In general this is good to go, but I'd like folks to give it a test drive before I release it. Before downloading/testing, please read the following.

1) This works with the latest beta of <a href="http://www.model-glue.com/">Model-Glue 3</a>. Do <b>not</b> use it with Model-Glue 2.

2) This works with a modified version of Model-Glue 3. This modification <b>will</b> in source soon. Dan's been a bit busy with IRL stuff (important happy stuff :) so it isn't checked in yet. What's the modification? You know that a controller listener specifies both a message to listen to as well as a function to call. Your MG code probably has a lot of these:

<code>
&lt;message-listener message="foo" function="foo" /&gt;
&lt;message-listener message="goo" function="goo" /&gt;
&lt;message-listener message="zoo" function="zoo" /&gt;
</code>

I don't know about you, but I almost always use the same message name and function name. I've rarely used anything different, and when I have, it was always some refactoring where I ended up pushing some listeners to one main function. That being said, it would be nice if I could do:

<code>
&lt;message-listener message="foo" /&gt;
</code>

In other words, listen for foo, and assume the function has the same name. That's what the mod does. In order for this to work, download this file: <a href="http://www.raymondcamden.com/downloads/XMLModuleLoader.cfc.zip">XMLModuleLoader.cfc.zip</a>. Extract and save to /ModelGlue/gesture/module.

<b>Edit on June 15h: Dan Wilson tells me this is actually in SVN/Zip now. No need to grab my mod if you have the latest.</b>

3) There is one confirmed feature not complete yet, and is the main thing I need help with. The code to check mail accounts for issues isn't quite ready yet. The code should be avoided until I post the next build. If someone can share a POP server I can hit, please email me privately.

4) Print has been removed from the main issues screen. It wasn't working right in the previous version so I've removed it for now. I'll add it back in later.

5) So outside of all the warnings above, in general, it should just act the same. I've added some jQuery love in various places. Dates all use the date picker. Milestone editing is a bit slicker now. 

So please download and report bugs here (that way folks won't duplicate issues). So you may ask - why did I do this? <a href="http://www.alagad.com">Alagad</a> sponsored this update to help provide samples for Model-Glue 3. Once the bugs are fixed, it will ship with Model-Glue as an example application. The most up to date version though will continue to be found at RIAForge. A big thank you to <a href="http://www.alagad.com">Alagad</a> for helping support Model-Glue 3!<p><a href='enclosures/E{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Flhp%{% endraw %}2Ezip'>Download attached file.</a></p>