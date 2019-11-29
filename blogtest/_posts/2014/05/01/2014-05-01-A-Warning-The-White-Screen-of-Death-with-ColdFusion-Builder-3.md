---
layout: post
title: "A Warning - The White Screen of Death with ColdFusion Builder 3"
date: "2014-05-01T18:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/05/01/A-Warning-The-White-Screen-of-Death-with-ColdFusion-Builder-3
guid: 5215
---

<p>
OK, so I'm loving ColdFusion Builder, but I just lost a few hours of my time to something related to ColdFusion Builder 3 and hopefully no one else makes the same mistake I did. When ColdFusion 11 was released, I updated my local copy of it as well as ColdFusion Builder. Everything was kosher. Then I wanted to test an extension. In order for it to work, I needed to work within web root, so I created a new ColdFusion project in CFB and pointed it to my ColdFusion web root.
</p>
<!--more-->
<p>
Now - I should point out - I don't even use the ColdFusion web root. I've got a folder called testingzone where I put all my ad hoc files. It is huge. I tried to fix that by adding a trash folder where I could put files I knew were safe to delete, but, yeah, that folder is huge now too. Whatever. The point is this folder is a virtual directory on Dropbox and <i>not</i> in web root. Outside of testingzone I've got a set of ColdFusion sites in their own folders, all run via virtual hosts in Apache.
</p>

<p>
So as I was saying - I needed to build an extension - and they prefer web root. So I created a new CFB project and dropped my crap in there and got to work. Everything was cool. Over the next few days I did more crap in testingzone and everything was cool. But then... then I tried to run one of my virtual domains and got...
</p>

<p>
<img src="https://static.raymondcamden.com/images/wall.jpg" />
</p>

<p>
Ok, not really that - just a white page. Nothing. So I started going through my log files. Nothing. I then thought - what if my error handling is broken? So I put logging in my Application.cfc, <i>everywhere</i>, and nothing. I tried other virtual domains. Nothing. I removed and reconnected ColdFusion. Nothing.
</p>

<p>
And then... then... then I remembered something. When you create a new project in ColdFusion Builder 3, it will "help" you by adding an index.cfm file. I don't like this, and I complained about it, but honestly, I didn't think it was a big deal. <strong>But this was the issue!</strong> I never figured out why, but I've known for a while now that if you had file /X.cfm in your ColdFusion web root, and tried to run /X.cfm in virtual host so and so, then the one in the ColdFusion web root will break. I seem to remember this behavior for a while now so it isn't new to ColdFusion 11 (and I'm not running 11 as my primary CF server on the laptop yet). Since every site I tried used index.cfm (of course) they all ran the index.cfm which CFB had added to my web root. What did the file contain?
</p>

<p>
&lt;!--- Please insert your code here ---&gt;
</p>

<p>
Since it was a CF comment it was stripped before being sent to the browser - hence I got nothing.
</p>

<p>
So yeah - that was it. *sigh* I should point out that CFB3 includes the ability to define templates for new projects - and that's kinda cool. I don't want to blame CFB3 for this as it was a combination of things - but hopefully other people don't get bit by this.
</p>