---
layout: post
title: "Proposals for ColdFusion 9 - From the Enemy's Camp"
date: "2008-05-09T09:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/09/Proposals-for-ColdFusion-9-From-the-Enemys-Camp
guid: 2816
---

Yesterday I was reading an interesting article (from <a href="http://www.dzone.com">Dzone</a>): 

<a href="http://www.ibm.com/developerworks/opensource/library/os-php-future/?S_TACT=105AGX54&S_CMP=B0508&ca=dnw-918">The future of PHP</a>

So why is an admitted ColdFusion fan-boy reading about PHP? As much as I love CF and think nothing compares to it (cue Sinead), I don't for one minute think that it has a monopoly on all the good ideas.

While reading the article (oh, btw, congrats on getting XML, SOAP, and Unicode support in guys - welcome to CF6) I noticed a few things that I thought could perhaps be of use in ColdFusion. I'm definitely not <b>sure</b> about these ideas, but I've shared them with <a href="http://www.forta.com">Ben</a> and a few friends and thought I'd share them with my readers. Again - I'm not sure about this. Feel free to call em out as dumb ideas. Also note that my knowledge of PHP isn't high - so I may be misunderstanding how PHP works.
<!--more-->
1) First off - PHP6 is disabling a feature they call register_globals. This feature is much like CF's auto scope check. If I put this on a page:

<code>
&lt;cfoutput&gt;#x#&lt;/cfoutput&gt;
</code>

Then CF will check local scope, then form, url, etc (I may have gotten the order wrong).

By turning this off, CF could - perhaps - be a bit more secure. The example they show up on the URL I think is a good one. Probably rare though as most folks would store authentication info in the Session scope. It appears as if PHP checks the Session scope, which CF does NOT do.

Imagine we added a per app setting (this.scopecheck = false) that would tell CF to NOT chekc other scopes. If you do 

<code>
&lt;cfoutput&gt;#x#&lt;/cfoutput&gt;
</code>

CF would only check the local Variables scope, and perhaps the unnamed Var scope. The setting would default to true for backwards compat.


2) magic_quotes

This seems to mesh with CF's auto escaping of quotes. While this is a good thing, folks should be using cfqueryparam. What if there was a way to turn off CF's auto escaping? It would mean queries would start throwing errors - but that may be preferable to a SQL injection attack. It would also force you to use cfqueryparam. (Again, this setting would
default to being enabled for backwards compat.)