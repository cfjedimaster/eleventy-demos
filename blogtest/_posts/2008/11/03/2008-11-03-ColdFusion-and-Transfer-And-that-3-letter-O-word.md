---
layout: post
title: "ColdFusion and Transfer (And that 3 letter \"O\" word)"
date: "2008-11-03T22:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/03/ColdFusion-and-Transfer-And-that-3-letter-O-word
guid: 3080
---

It's been an interesting few days (in the blogs at least) in terms of ORMs and ColdFusion. A few days ago Jason <a href="http://www.cfinsider.com/index.cfm/2008/10/30/Object-Relational-Mapping-with-ColdFusion-9">blogged</a> about a MAX session involving ColdFusion 9 and ORMs. Then today Joe Rinehart posted a great article on the current state of ColdFusion and ORMs: <a href="http://firemoss.com/post.cfm/does-coldfusion-have-no-real-orm-frameworks">Does ColdFusion have no real ORM frameworks?</a> This was followed up by another: <a href="http://www.firemoss.com/post.cfm/what-makes-a-framework-an-orm">What makes a framework an ORM?</a> (I'll also point out Brian's take as well: <a href="http://www.briankotek.com/blog/index.cfm/2008/11/3/Joe-Rinehart-Stirs-the-ObjectRelational-Mapping-ORM-Frameworks-Pot">Joe Rinehart Stirs the Object-Relational Mapping (ORM) Frameworks Pot</a>)

Joe's article is pretty darn good, and drives home the <i>real</i> benefits an ORM framework can provide. I can personally attest to this seeing that we use Hibernate at <a href="http://www.broadchoice.com">work</a>. Nothing is cooler than dropping all your tables as a quick way to get rid of bad data. Why can I drop all my tables? Because Hibernate will take care of recreating everything it needs. 

Since the release of <a href="http://www.transfer-orm.com/?action=displayPost&ID=372">Transfer 1.1</a>, I've been waiting to find the time to really dig into Transfer. While I agree with Joe's arguments that we don't have a real ORM framework in ColdFusion, at the same time (and both Joe and Brian agree here), there is some real darn good benefits to using Transfer within ColdFusion. 

So with that in mind I'm launching a simple series of articles that will serve as a basic tutorial of Transfer 1.1. I hope this will be useful for others, and for me as well since I never felt like I got a good formal grounding in Transfer. Even just perusing the <a href="http://docs.transfer-orm.com/wiki/Overview.cfm">Transfer Overview</a> I was surprised by some of what Transfer offered. This will hopefully be a good learning experience for everyone. If things work out right, I can wrap this before MAX and we can compare and contrast Transfer to what CF9 will offer. 

The application I have in mind is a simple employee directory. Nothing earth shattering, but I've got the first build ready for my blog entry tomorrow and I think it works good for the first draft.