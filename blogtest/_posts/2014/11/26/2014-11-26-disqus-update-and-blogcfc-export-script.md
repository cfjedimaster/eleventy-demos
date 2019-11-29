---
layout: post
title: "Disqus update (and BlogCFC export script)"
date: "2014-11-26T14:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/11/26/disqus-update-and-blogcfc-export-script
guid: 5359
---

<p>
As folks know, I've been working on transitioning to <a href="http://www.disqus.com">Disqus</a> over the past week. I ran into multiple problems, and I made multiple mistakes, but today the process completed and I'm ready to share details about my BlogCFC export script as well as some tips for others who may be considering making the jump.
</p>
<!--more-->
<p>
I had two main issues when I did my import. The first was that some comments on my earliest blog entry didn't show up. This issue went away. I'm not sure why it did - but it was a minor issue compared to the second issue so I'm not concerned about it.
</p>

<p>
The second issue was the big one. When I did my import I discovered that my comments were not in the right order. This was because I screwed up my call to ColdFusion's timeFormat function. Yes - timeFormat. I've been using ColdFusion for about fifteen years and I made a rookie mistake there. (Actually I screwed it up <i>twice</i> which is even worse - but let's just pretend that I didn't.) This is where I ran into the problem with Disqus. When I reran my import, the changes were not reflected. I even went through the step of deleting all 6000+ of my previously imported comments, 25 at a time, to remove them and do my import. That didn't help either.
</p>

<p>
Turns out there is <strong>no way</strong> to do replacements in Disqus. Period. They recommend you test your imports on a dev forum, but even that wouldn't be helpful if you screwed up. You would need to make multiple testing forums which is probably not desirable. Luckily the fix was easy enough. Disqus looks at the &lt;wp:comment_id&gt; tag value in your imported XML to determine the uniqueness of a comment. I was using the UUID from my database table. To get around the issue, I literally just prefixed "m1_" in front of the ID. (Why m1? I assumed I was going to screw up again.) I should note that some folks on Twitter also suggested this but I held off trying it until I got confirmation from Disqus that this would work.
</p>

<p>
So... for the most part, that was the end of it. I ran my script about 4 times - generating "pages" of data over my BlogCFC entry list. Disqus recommends creating XML files less than 50 megs big. From what I could see I would have been a bit over that if I had done them all at once, but for folks who want to use my code you can probably generate a complete export if your comment count is less than mine. Another thing to watch out for is errors. I had about 20 comments in my database that were blank in regards to the actual text. I don't know why. Disqus considered these errors (rightly so), and reported the import as an error... but only while it was processing. Here is a screen shot of what I'm talking about:
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot39.png" />
</p>

<p>
Do you see how it says it only imported 900 or so? And see the error? This worried me but then I realized that it was still processing. The status seemed to imply a finished state but it was actually still digging through stuff. As I reloaded the number went higher and higher. (For folks curious, it took maybe 5 minutes to import 20K+ comments.)
</p>

<p>
If that UI in the screen shot doesn't match what you see in the Disqus import screen, that's because there is apparently two different places you can check imports. I was shown this url: http://import.disqus.com/group/FORUMNAME. This site seemed to provide slightly clearer reports so you may want to check it if you do a big import.
</p>

<p>
I want to give <strong>huge</strong> thanks to Matt Robenolt of Disqus. As I said, I had trouble with the "main" Disqus support. They were somewhat slow. I found Matt via contacts on Twitter and he dug deep into the issue. He agreed that there probably needs to be a way to force a reimport so hopefully that will come in the future. 
</p>

<p>
For those of you on ColdFusion and running BlogCFC, I've attached my script. It was written for ColdFusion 11 but you can backport it easily enough to earlier versions. If you use it and it works for you, please let me know in the comments below.
</p><p><a href='https://static.raymondcamden.com/enclosures/exporter.zip'>Download attached file.</a></p>