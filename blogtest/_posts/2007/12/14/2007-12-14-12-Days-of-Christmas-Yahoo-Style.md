---
layout: post
title: "12 Days of Christmas - Yahoo Style"
date: "2007-12-14T14:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/14/12-Days-of-Christmas-Yahoo-Style
guid: 2542
---

Earlier today I <a href="http://www.raymondcamden.com/index.cfm/2007/12/14/Friday-Challenge--Christmas-Style">blogged</a> a Friday Challenge that involved taking the 12 Days of Christmas as a query and generating the song. After I posted this, I had an odd thought - why not see what the Internet (in this case, Yahoo), would do with the gifts.
<!--more-->
I used my <a href="http://cfyahoo.riaforge.org">CFYahoo</a> package to create a connection to their image service:

<code>
&lt;cfset imageAPI = createObject("component", "org.camden.yahoo.image")&gt;
</code>

Next I created my array and started to loop:

<code>
&lt;cfset gifts = ["A partridge in a pear tree","Two turtle doves","Three French hens","Four calling birds","Five golden rings","Six geese a-laying",
		"Seven swans a-swimming","Eight maids a-milking","Nine ladies dancing","Ten lords a-leaping","Eleven pipers piping","Twelve drummers drumming"]&gt;

&lt;cfloop index="x" from="1" to="#arrayLen(gifts)#"&gt;
</code>

Then for each item I performed a search. Yahoo filters adult images by default so I didn't have to worry about that:

<code>
&lt;cfinvoke component="#imageAPI#" method="search" returnVariable="result"&gt;
	&lt;cfinvokeargument name="query" value="#gifts[x]#"&gt;
	&lt;cfinvokeargument name="results" value="1"&gt;
&lt;/cfinvoke&gt;
</code>

Lastly I displayed the result from each search. I did a quick view source/ctrl+a/ctrl+v and below is the results. 

Yes, this is a complete and utter waste of time. Enjoy.

<b>Edited:</b> I added my CFM as a zip to this page. I also changed the code to show 3, as it gets interesting with multiple results. For this to work you will need my CFYahoo package and an API key.

	<h2>Image search for A partridge in a pear tree</h2>
	
	
	<img src="http://re3.mm-a5.yimg.com/image/3164158378" width="134" height="145" alt="0001_137_Partridge_In_A_Pear_Tree.gif" align="left">
	
	<h3>0001_137_Partridge_In_A_Pear_Tree.gif</h3>
	URL: <a href="http://www.bisgrove.com/0001_137_Partridge_In_A_Pear_Tree.gif">http://www.bisgrove.com/0001_137_Partridge_In_A_Pear_Tree.gif</a><br />	
	Summary: Links: {% raw %}| Site Index |{% endraw %}
	<br clear="left">
	
	<p>

	<hr>
	</p>
	
	<h2>Image search for Two turtle doves</h2>
	
	
	<img src="http://re3.mm-a4.yimg.com/image/2933550061" width="145" height="145" alt="444966.jpg" align="left">
	
	<h3>444966.jpg</h3>
	URL: <a href="http://images.dpchallenge.com/images_challenge/608/444966.jpg">http://images.dpchallenge.com/images_challenge/608/444966.jpg</a><br />	
	Summary: Two Turtle Doves
	<br clear="left">

	
	<p>
	<hr>
	</p>
	
	<h2>Image search for Three French hens</h2>
	
	
	<img src="http://re3.mm-a1.yimg.com/image/1977057164" width="101" height="130" alt="Three French Hens.jpg" align="left">
	
	<h3>Three French Hens.jpg</h3>
	URL: <a href="http://www.dcist.com/attachments/dcist_melissa/Three{% raw %}%20French%{% endraw %}20Hens.jpg">http://www.dcist.com/attachments/dcist_melissa/Three{% raw %}%20French%{% endraw %}20Hens.jpg</a><br />	
	Summary: Washington Wish List: Holiday Hankerings of D.C. Foodies Whether it's Corduroy's scallops with mushroom and potato puree, 2 Amys' cod fritters, or Restaurant Eve's mojitos, DCist indulges in good food and drink about town over the holiday season
	<br clear="left">

	
	<p>
	<hr>
	</p>
	
	<h2>Image search for Four calling birds</h2>
	
	
	<img src="http://re3.mm-a6.yimg.com/image/3550721265" width="109" height="140" alt="20-fourcallingbirds72.jpg" align="left">
	
	<h3>20-fourcallingbirds72.jpg</h3>
	URL: <a href="http://www.porterfieldsfineart.com/JohnnyKarwan/images/20-fourcallingbirds72.jpg">http://www.porterfieldsfineart.com/JohnnyKarwan/images/20-fourcallingbirds72.jpg</a><br />	
	Summary: On the fourth day of Christmas my true love gave to me Four calling birds Three french hens
	<br clear="left">

	
	<p>
	<hr>
	</p>
	
	<h2>Image search for Five golden rings</h2>
	
	
	<img src="http://re3.mm-a3.yimg.com/image/2595993267" width="125" height="117" alt="Goldrings.jpg" align="left">
	
	<h3>Goldrings.jpg</h3>
	URL: <a href="http://my.homewithgod.com/sweatbj/Graphics/Christmas/Goldrings.jpg">http://my.homewithgod.com/sweatbj/Graphics/Christmas/Goldrings.jpg</a><br />	
	Summary: Five Golden Rings - First five books of the Old Testament. The greatest books to the Jews, worth more than gold.
	<br clear="left">

	
	<p>
	<hr>
	</p>
	
	<h2>Image search for Six geese a-laying</h2>
	
	
	<img src="http://re3.mm-a1.yimg.com/image/2003788603" width="140" height="83" alt="VIThe12DaysOfDickensVillageSixGeeseALaying.jpg" align="left">
	
	<h3>VIThe12DaysOfDickensVillageSixGeeseALaying.jpg</h3>
	URL: <a href="http://web.ivenue.com/cobblestonesgiftsclctbls/images/VIThe12DaysOfDickensVillageSixGeeseALaying.jpg">http://web.ivenue.com/cobblestonesgiftsclctbls/images/VIThe12DaysOfDickensVillageSixGeeseALaying.jpg</a><br />	
	Summary: VI, The 12 Days Of Dickens'  Six Geese A-Laying Set Of 2 - Introduced in 1995 - Retired in 1999 - 2.5, 1.25'' tall.Retail Price: $29.95
	<br clear="left">

	
	<p>
	<hr>
	</p>
	
	<h2>Image search for Seven swans a-swimming</h2>
	
	
	<img src="http://re3.mm-a6.yimg.com/image/3608975258" width="145" height="138" alt="seven-swans-a-swimming.jpg" align="left">
	
	<h3>seven-swans-a-swimming.jpg</h3>
	URL: <a href="http://www.artshole.co.uk/arts/artists/anna{% raw %}%20charity/seven-swans-a-swimming.jpg">http://www.artshole.co.uk/arts/artists/anna%{% endraw %}20charity/seven-swans-a-swimming.jpg</a><br />	
	Summary: seven-swans-a-swimming
	<br clear="left">

	
	<p>
	<hr>
	</p>
	
	<h2>Image search for Eight maids a-milking</h2>
	
	
	<img src="http://re3.mm-a4.yimg.com/image/2921795315" width="135" height="89" alt="Eight_Maids_a_Milking.jpg" align="left">
	
	<h3>Eight_Maids_a_Milking.jpg</h3>
	URL: <a href="http://www.sheridangardens.com/ChristopherRadko/Eight_Maids_a_Milking.jpg">http://www.sheridangardens.com/ChristopherRadko/Eight_Maids_a_Milking.jpg</a><br />	
	Summary: Eight Maids a Milking
	<br clear="left">

	
	<p>
	<hr>
	</p>
	
	<h2>Image search for Nine ladies dancing</h2>
	
	
	<img src="http://re3.mm-a6.yimg.com/image/3403419954" width="140" height="71" alt="nine_ladies_dancing.gif" align="left">
	
	<h3>nine_ladies_dancing.gif</h3>
	URL: <a href="http://www.101funpages.com/html/imgs/page_imgs/images/nine_ladies_dancing.gif">http://www.101funpages.com/html/imgs/page_imgs/images/nine_ladies_dancing.gif</a><br />	
	Summary: Two Turtle Doves And a Partridge in a Pear Tree. On the ninth day of Christmas, My true love gave to me,
	<br clear="left">

	
	<p>
	<hr>
	</p>
	
	<h2>Image search for Ten lords a-leaping</h2>
	
	
	<img src="http://re3.mm-a4.yimg.com/image/2866720044" width="128" height="130" alt="1993 Ten Lords A-Leaping.JPG" align="left">
	
	<h3>1993 Ten Lords A-Leaping.JPG</h3>
	URL: <a href="http://www.thepartyshop.com/Commerce/images/1993{% raw %}%20Ten%{% endraw %}20Lords{% raw %}%20A-Leaping.JPG">http://www.thepartyshop.com/Commerce/images/1993%{% endraw %}20Ten{% raw %}%20Lords%{% endraw %}20A-Leaping.JPG</a><br />	
	Summary: 1993 Springtime Bonn..  27-Apr-2005 21:40 57K 1993 TURTLE.jpg 14-Jul-2005 08:37 33K 1993 Ten Lords A-Lea..  26-May-2005 14:53 28K 1993 Time for Easter..  27-Apr-2005 21:54 100K
	<br clear="left">

	
	<p>
	<hr>
	</p>
	
	<h2>Image search for Eleven pipers piping</h2>
	
	
	<img src="http://re3.mm-a8.yimg.com/image/4246688926" width="145" height="93" alt="11pipers.gif" align="left">
	
	<h3>11pipers.gif</h3>
	URL: <a href="http://www.12days.com/graphics/12daysbook/11pipers.gif">http://www.12days.com/graphics/12daysbook/11pipers.gif</a><br />	
	Summary: Eleven Pipers Piping ~ C o l l e c t o r s E d i t i o n ~
	<br clear="left">

	
	<p>
	<hr>
	</p>
	
	<h2>Image search for Twelve drummers drumming</h2>
	
	
	<img src="http://re3.mm-a8.yimg.com/image/4184741830" width="125" height="90" alt="12drummersdrumming.gif" align="left">
	
	<h3>12drummersdrumming.gif</h3>
	URL: <a href="http://home.netvigator.com/~dianayu/images/12drummersdrumming.gif">http://home.netvigator.com/~dianayu/images/12drummersdrumming.gif</a><br />	
	Summary: On the twelfth day of Christmas My true love gave to me Twelve drummers drumming Eleven pipers piping,
	<br clear="left">

	
	<p>
	<hr>
	</p><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fraytest%{% endraw %}2Ecfm%2Ezip'>Download attached file.</a></p>