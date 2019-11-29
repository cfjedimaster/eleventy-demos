---
layout: post
title: "Lemonade Stand - The Results Are In"
date: "2008-07-14T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/07/14/Lemonade-Stand-The-Results-Are-In
guid: 2932
---

It's been a week since I announced the <a href="http://www.raymondcamden.com/index.cfm/2008/7/7/Friday-Puzzler-a-bit-early">Lemonade Stand</a> contest, and I hope folks weren't too disappointed when I delayed the results last Friday. Thankfully that whole mess is done with now. Last night I worked a bit more on my simulator, trying to clean up the results a bit, but the code itself is still a bit ugly. But who cares. What folks want to know is who won this little contest.
<!--more-->
First, thanks to everyone who sent in an entry. There were 16 entries total. (In the results you will see 17, since I included one of my test functions.) Some of the functions were pretty darn intense. I was also surprised to see that folks put a bit more logic into their code then my simulator even considered. So for example, Mat Evans' code actually reduced his cup price if it was too hot. That makes sense. If it's a 100+ degrees outside folks won't be strolling around looking for lemonade. My code didn't actually take that into consideration but it's a good idea.

I was also surprised to find folks writing good error management into their code. What I mean is, their code would throw an error if I sent an invalid weather type. That would imply that the entire simulator was broken and seems a bit overkill, but you know what - you can't be too safe. So props to them. (Although I automatically dinged your results for implying I'm less than perfect.)

There were also some real gems in the comments. Matt Osbun had this to say:

<blockquote>
<p>
I'm pretty sure that if the temp gets hot enough to drive the offset high enough to produce a greater-than-50-cent cup of lemonaid, the Earth has greater worries than this, but if it does, consider the 50 cents to be an End Of Days Sale. 136 degrees, if you did the math- Highest recorded temperature in the world (El Azizia, Libya) and two degrees hotter than the highest recorded temperature in the United States (Death Valley)
</p>
</blockquote>

Nice. So in the end, there was one clear winner. This guy's code was always #1, or #2, right after my entry. (And it beat mine about 90% of the time it seems.) His entry worked so well it really became a fight for second place (again, ignoring my entry). The winner is...

<h2>Geoffrey K. Bentz</h2>

Congrats to him! In second place it was a fight between Mat Evans, Brian Kotek, and sometimes Coyne. For a representative example of the results, click the chart below to see the full screen version. 

<a href="http://www.coldfusionjedi.com/images/bigchart.jpg">
<img src="https://static.raymondcamden.com/images/cfjedi/smallchart.jpg"></a>

The numerical results for this run were:

FINAL FOR BENTZ: $866.89<br>
FINAL FOR SMARTERSELLER: $818.55 (Ray's test)<br>
FINAL FOR MATEVANS: $573.15<br>
FINAL FOR PADDYROHR: $345.32<br>
FINAL FOR BRIANKOTEK: $324.20<br>
FINAL FOR COYNE: $246.67<br>
FINAL FOR STEPHENWITHINGTON: $165.91<br>
FINAL FOR CFSILENCE: $147.51<br>
FINAL FOR MATTOSBUN: $129.33<br>
FINAL FOR JOHNERIC: $112.15<br>
FINAL FOR TUTTLE: $57.00<br>
FINAL FOR GENTRYD: $37.75<br>
FINAL FOR MATTJONES: $20.90<br>
FINAL FOR BRADWOOD: $6.13<br>
FINAL FOR CISKE: $0.40<br>
FINAL FOR CURTGRATZ: $0.07<br>
FINAL FOR JOELSTOBART: $0.06<br>

And finally, I've included all the UDFs and the test code (again, a bit ugly, forgive me) as an attachment to this entry. Thank you everyone for participating! If folks would like to see more contests like these (small, one week type things) then let me know.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fls%{% endraw %}2Ezip'>Download attached file.</a></p>