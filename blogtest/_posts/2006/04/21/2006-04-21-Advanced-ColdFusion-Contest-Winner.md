---
layout: post
title: "Advanced ColdFusion Contest Winner"
date: "2006-04-21T15:04:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2006/04/21/Advanced-ColdFusion-Contest-Winner
guid: 1230
---

My last contest has been over for a few weeks now, and I haven't blogged about it since things did not quite turn out the way I had hoped. My previous two contests (<a href="http://ray.camdenfamily.com/index.cfm/2005/9/20/Contest-Shall-We-Play-a-Game">Contest1</a>, <a href="http://ray.camdenfamily.com/index.cfm/2005/10/30/Intermediate-ColdFusion-Contest">Contest 2</a>) were a great success. I had numerous entries, and many of them had what I like to call "great mistakes", or mistakes that we could all look at and learn from. It was also great to just see how people solved problems. I think we can all learn from seeing how people solve problems, and it may even lead to solutions for future problems.
<!--more-->
The <a href="http://ray.camdenfamily.com/index.cfm/2006/2/22/Advanced-Contest-Announced">Advanced Contest</a> caused just a tiny bit of controversy when I announced it. Many people were not happy with the Flex 2 tie in. While I understand where they are coming from, I still feel that this was a good decision. Flex 2 and ColdFusion make a perfect match.  The combination of both technologies can really lead to some powerful results. (And I think you will see that in the entry I show later.) I understand that some people wanted a "pure" CFML contest. But if you think about it, even the previous contests required you to use HTML to display the UI.

But I won't start this argument again. Folks disagreed with me and that is fine. The first two contests were a success, this one was not. However - I had one person send in a proper entry (more on that later), and frankly, this one entry makes me very, very happy. One of the things I wanted from this contest was a <i>real</i> tool that could be used by others, not just a game. I'm happy to say that the winning entry didn't just win because it was the only entry. It won because it kicked some royal butt and was exactly what I had in mind when I talked about revamping ColdFusion's log reader. 

The winner of the contest was <a href="http://www.boyzoid.com/blog/index.cfm">Scott Stroz</a>, who by the way is also responsible for the new CSS based layout over at <a href="http://www.blogcfc.com">BlogCFC</a>. His entry may be downloaded by using the link at the end of the entry. There isn't an online demo on my box since I'm not running Mystic. Scott has said he will continue to update the project if there is interest, and I hope he does because I find the tool incredibly useful.

Of course, that isn't going to stop me from nit picking, so here we go. When you begin the installation routine, you are asked to set a few values, one of which is the DSN. He then has a web based installation script you can run to set everything up which is very nice. However, he forgets to use his own DSN variable. Before you run his script, find line 22:

<code>
&lt;cfquery name="createTables" datasource="logWatcher"&gt;
</code>

and change it to:

<code>
&lt;cfquery name="createTables" datasource="#logViewerDSN#"&gt;
</code>

During installation I ran into another bug. This bug was fixed by Scott and is in the zip, but I want to talk about his error handling. His install script runs a parseLogs method. This method has a try/catch in it where if something goes wrong, he simply returns false as a status message. In other words, if everything works, you get a true response back, if things fail, you get a false. I take issue with it as it swollows up bugs that can be useful for debugging. I had to manually add a dump to the cfcatch so I could report to Scott what the issue is.

<a href="http://ray.camdenfamily.com/images/contestshots/shot1.jpg"><img src="http://ray.camdenfamily.com/images/contestshots/shot1_small.jpg" align="left"></a> Once that got past, I got to view the application in all it's glory, and right away I stopped feeling like this contest was a failure. Personally, I don't care. This is my new ColdFusion log viewer, period. The UI is nice and simple. As I had said, this was not a Flex contest so I didn't expect a lot. A log viewer should be very utilitarian anyway. The speed is quite good. You load a log file and the entries are just there. (More on that later.) Filtering is fast. Sorting is fast. Everything about this is fast. While the old log viewer wasn't terribly slow, the HTML based UI really pales in comparison to what Flex is doing here. After using it for about five minutes I found myself wondering how I used the old one for so long. 

<a href="http://ray.camdenfamily.com/images/contestshots/shot2.jpg"><img src="http://ray.camdenfamily.com/images/contestshots/shot2_small.jpg" align="left"></a> If you switch to charts, you get a real sense of the power here though. So for example, there is a Page based chart that represents the pages with log entries. Looking at the chart you can immediately see a page that is taking up a huge slice. What a great way to visually cue to the documents that need some TLC on your box! The day of the week chart is also good. In the example URL I'm going to post at the end, you can clearly see Sunday is a busy day. That is the <i>last</i> day I would have guessed, and having this report just shows you how illuminating the tool is. 

So, lets talk a bit about how he did this. There are are two main components to the application. There is a log file reader/filterer, and a stats section. The stats come from aggregate information about the logs. This is set up by parsing all the logs during installation, and fired again when the event gateway is fired. One thing I pointed out to Scott was that it seemed kind of odd that when the event gateway fired, he reparsed all the files. His concern was that a log could be updated, and before the EG would fire, ColdFusion could crash. (ColdFusion crash? Never!) The log data you see in the grids is actually generated without any caching at all. Everytime you click, the file is reparsed into a ColdFusion query and returned. Now, as I said above, the site seemed to scream speed wise. But the reading will probably be a bit slower on larger files. He is <i>not</i> using CFFILE to read the logs though. Instead he uses pure Java calls to read in the files line by line. Caching would be <i>very</i> easy to add here though so I bet that will be in a future version. I can say though that even using his demo (again, URL later), his server.log at 2.4K lines loaded in about 2 seconds. That's fine by me. 

So - if you want to see it in action, use the URL below. But note that this is his dev server and probably will <b>not</b> be able to handle the load. You can download the code using the download link. As I said above, Scott will be supporting this project, so send feedback to him!

<a href="http://util.boyzoid.com:816/logreader/">http://util.boyzoid.com:816/logreader/</a>

Last but not least - a big thank you to Scott Stroz for taking the time to do this. I know it wasn't easy, and I'm serious when I say that he isn't "just" winning as the sole entry. I think this is a wonderful application and I hope others find it useful as well.

Will there be another contest? Yes. And don't worry folks, I won't dare mention the F word. (grin) However, right now I'm thinking it won't start till both BlogCFC5 and CFLib 2.0 is released, so probably around the Fall.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Flogreader%2Ezip'>Download attached file.</a></p>