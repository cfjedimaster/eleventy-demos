---
layout: post
title: "Are we falling behind?"
date: "2009-07-10T18:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/10/Are-we-falling-behind
guid: 3431
---

Keith sent me this email a few days back, and as it touches on a kind of a hot topic lately, it took me a while to formulate a response. Anyway, I hope this helps folks:

<blockquote>
After reading <a href="http://blog.jaymcentire.com/2009/07/coldfusions-identity-crisis-a-perspective-from-higher-education/">Jay McEntire's new blog entry</a>, I really feel like I'm falling behind. I use relatively simple CF code and CFCs, but I have no idea about frameworks, why I should use
them, why it's better, etc. Seems like if I try to find a total beginner's guide it just isn't there.  I've read the descriptions, "This makes it easier! Use it now!" then I see 2,000 files added to a "hello world" app...it just isn't clicking for me, especially when I can do so much with vanilla CF right out of the box. Do you have any recommendations for somewhere to start? It's all very overwhelming. I'm a CF dev, but I'm realizing more and more every day that I'm more of a front end guy... Thanks Ray. Hope you can help.
</blockquote>

Yeah. Kind of a big one there. Jay's blog entry also links to the other "big" entry, <a href="http://www.advantexllc.com/blog/post.cfm/how-oo-almost-destroyed-my-business">How OO Almost Destroyed My Business</a>. I took Marc to task for what I thought was an attack on 'the elite' for pushing OO. Yes - there are a lot of people talking about OO, but as far as I know, no one is out there saying that there is One True Way to Code. However, I can definitely see that there is a growing level of frustration out there. 

It saddens me. The following is going to sound like sappy marketing, but deal with it. I love ColdFusion. I want people to feel powerful and empowered with it. One of the barometers I use for any technology is how it makes me feel after I've read some of the docs. Do I feel like I could build <i>anything</i> with it? Cool - that's a winner. (And by the way, that's exactly what ColdFusion, Flex, AIR, and jQuery do for me.) Do I feel like I'd rather yank my hair out than write Hello World? Yeah, that's a loser for me. (That's what I think whenever I see Python and Ruby. Sorry. I must not be smart enough for them.)

I shared a few emails with Hal recently, and he helped clear some things up for me. I don't feel like I do much OO. I feel like I develop well. I feel like I follow best practices. I also feel like I apply well known and tested solutions to problems. But I don't feel like I'm doing the OO buzzword 100% of the time. Am I an OO developer if I use MVC? If I use Swiz in Flex does it mean I've become a proper Flex developer? 

Hal made the point (and I hope he doesn't mind me butchering his wisdom down into Ray-sized bites ;) to me that the goal here isn't to use <b>anything</b> - the goal is to build applications. Deliver results. Obviously we want to do the best we can. Obviously we want our code to be secure, well maintained, easily updateable by new developers, etc, but OO isn't the goal in itself. It is just the tool.

This is something I think I knew, but just needed it spelled out a bit nicer (thank you Hal). 

I picked up Model-Glue not because I wanted to learn MVC. I picked up Model-Glue because I was sick and tired of worrying about where to place my files. I was sick and tired of copying files from the last application and ripping out all the custom stuff. <b>Model-Glue, and the MVC design pattern, solved a problem.</b> Period. It isn't rocket science. But when it comes to managing a large application, it almost acts like a safety blanket for me. I'm not a terribly bright person. Anything that helps me think less about the simple stuff and spend more time on the complex stuff is a good idea. 

Keith - if you are being successful with simple files and CFCs, then you aren't missing anything. If you encounter a problem, I think that's the time to ask, "Hey, can Model-Glue help me?" I'd apply this to everything really. 

Not to throw another buzzword out there - but when I worked at Broadchoice, I saw Brian and Joe make use of delegates. I had heard of them before but had never really gotten the point. Seeing them in use, and seeing why they were used and the problem they solved, made it crystal clear to me why someone came up with that idea in the first place - but frankly, if I had never run into a real use case of the example, no amount of reading about it would have helped me understand it better. 

I guess my advice is this - and I apologize for being long winded. I've never regretted keeping things simple when I can. I think that while I'm not very smart - I do have a knack for explaining things and breaking things down into simple, easy to digest nuggets. I think that comes across in my code as well. 

Don't feel like you have to use anything, and you know what - there are enough problems in life. <b>Don't go looking for more.</b>

I <b>do recommend</b> being aware of OO, design patterns, and the like. Just because you are aware of them does not mean you should use every single one of them in your next application. Hell no. Just try to be aware of what they are and what kind of problems they solve.

For me, a MVC framework solved the problem of simply setting a site up and handling the flow of the application. That sounds so trivial, doesn't it? But jeeze - if I could have the time back I wasted on that I'd probably have BlogCFC6 done by now. 

We can all be better programmers. But that doesn't involve slavishly copying every new bit of code you see (and yes, I've done it too). We have to be proactive in not only examining and learning from others but trying to put a critical eye to it. "Yes, interfaces are neat, but does it really help me solve something for this application?"

As a last statement - let me know if I ever get too Ivory Tower on you guys. If I need to take a step back, explain something more, slow down, whatever, be my guest to let me know.