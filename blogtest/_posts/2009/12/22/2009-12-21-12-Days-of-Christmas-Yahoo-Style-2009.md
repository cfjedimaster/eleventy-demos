---
layout: post
title: "12 Days of Christmas - Yahoo Style - 2009"
date: "2009-12-22T11:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/22/12-Days-of-Christmas-Yahoo-Style-2009
guid: 3661
---

Two years ago I whipped up a <a href="http://www.raymondcamden.com/index.cfm/2007/12/14/12-Days-of-Christmas--Yahoo-Style">quick blog entry</a> demonstrating how to make use of the <a href="http://cfyahoo.riaforge.org">CFYahoo</a> ColdFusion library to retrieve images related to the 12 Days of Christmas. I was thinking of this entry and thought it would be nice to repost the code and use more current results. So nothing new here, nothing serious, just something a bit cute (imho). The code:
<!--more-->
<code>
&lt;cfset imageAPI = createObject("component", "CFYahoo.org.camden.yahoo.image")&gt;

&lt;cfset gifts = ["A partridge in a pear tree","Two turtle doves","Three French hens","Four calling birds","Five golden rings","Six geese a-laying",
        "Seven swans a-swimming","Eight maids a-milking","Nine ladies dancing","Ten lords a-leaping","Eleven pipers piping","Twelve drummers drumming"]&gt;

&lt;cfloop index="x" from="1" to="#arrayLen(gifts)#"&gt;

    &lt;cfinvoke component="#imageAPI#" method="search" returnVariable="result"&gt;
        &lt;cfinvokeargument name="query" value="#gifts[x]#"&gt;
        &lt;cfinvokeargument name="results" value="3"&gt;
    &lt;/cfinvoke&gt;
    
    &lt;cfoutput&gt;
    &lt;h2&gt;Image search for #gifts[x]#&lt;/h2&gt;
    &lt;/cfoutput&gt;
    
    &lt;cfoutput query="result"&gt;
    &lt;cfif len(thumbnail)&gt;
    &lt;img src="#thumbnail#" width="#thumbnailwidth#" height="#thumbnailheight#" alt="#title#" style="align:left"&gt;
    &lt;/cfif&gt;
    &lt;h3&gt;#title#&lt;/h3&gt;
    URL: &lt;a href="#clickurl#"&gt;#result.url#&lt;/a&gt;&lt;br /&gt;    
    Summary: #summary#
    &lt;br clear="both" style="clear:both"&gt;
    
    &lt;p&gt;
    &lt;hr&gt;
    &lt;/p&gt;
    &lt;/cfoutput&gt;
    &lt;cfflush&gt;
    
&lt;/cfloop&gt;
</code>

Nothing fancy there - just looping over the array and performing the search. I did have to get anal with the BR/clear tag as Chrome did not support br clear=left when I used align="left" in the image. Outside of that though the code worked perfectly well. And here is the result. Enjoy. 

Also let me take this opportunity to wish everyone a Merry Christmas!

 <h2>Image search for A partridge in a pear tree</h2> 
    
    <img src="http://thm-a01.yimg.com/image/74b5c82f5c5f0a8a" width="111" height="140" alt="Partridge in a Pear Tree jpg" style="align:left"> 
    
    <h3>Partridge in a Pear Tree jpg</h3> 
    URL: <a href="http://www.julesavenuegraphics.com/Partridge_in_a_Pear_Tree.jpg">http://www.julesavenuegraphics.com/Partridge_in_a_Pear_Tree.jpg</a><br />    
    Summary: Partridge in a pear tree card
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/56b72eb0a212640c" width="94" height="135" alt="12 days partridge pear tree jpg" style="align:left"> 
    
    <h3>12 days partridge pear tree jpg</h3> 
    URL: <a href="http://www.msgr.ca/msgr-2/12{% raw %}%20days%{% endraw %}20partridge{% raw %}%20pear%{% endraw %}20tree.jpg">http://www.msgr.ca/msgr-2/12{% raw %}%20days%{% endraw %}20partridge{% raw %}%20pear%{% endraw %}20tree.jpg</a><br />    
    Summary: My true love gave to me A Partridge in a Pear Tree
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/7013fc5fae372af0" width="125" height="119" alt="Partridge In A Pear Tree Pin JPG" style="align:left"> 
    
    <h3>Partridge In A Pear Tree Pin JPG</h3> 
    URL: <a href="http://www.distinctgiftshop.com/media/Partridge_In_A_Pear_Tree_Pin.JPG">http://www.distinctgiftshop.com/media/Partridge_In_A_Pear_Tree_Pin.JPG</a><br />    
    Summary: Partridge In A Pear Tree Pin
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <h2>Image search for Two turtle doves</h2> 
    
    <img src="http://thm-a01.yimg.com/image/31acbfe593131320" width="136" height="150" alt="12daysofxmas 2 turtle doves jpg" style="align:left"> 
    
    <h3>12daysofxmas 2 turtle doves jpg</h3> 
    URL: <a href="http://www.deanperry.co.uk/images/seasonalextras/12days/12daysofxmas-2-turtle-doves.jpg">http://www.deanperry.co.uk/images/seasonalextras/12days/12daysofxmas-2-turtle-doves.jpg</a><br />    
    Summary: Three French Hens Two Turtle Doves A Partridge in a Pear Tree
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/1d00578b24effe04" width="130" height="107" alt="2turtledoves jpg" style="align:left"> 
    
    <h3>2turtledoves jpg</h3> 
    URL: <a href="http://www.fashion-era.com/images/xmas/xmas_traditions/2turtledoves.jpg">http://www.fashion-era.com/images/xmas/xmas_traditions/2turtledoves.jpg</a><br />    
    Summary: On the second day of Christmas  my true love gave to me Two Turtle Doves and a partridge in a pear tree
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/716530596d304856" width="130" height="130" alt="dove jpg" style="align:left"> 
    
    <h3>dove jpg</h3> 
    URL: <a href="http://www.bevo.co.uk/blog/dove.jpg">http://www.bevo.co.uk/blog/dove.jpg</a><br />    
    Summary: 5 58 pm | General Chatter My day has been random       Woke up in a strange house fully cloathed scared to death coz I didn t know where I was  Went for a walk through the Wellington in a short sleeved shirt saw
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <h2>Image search for Three French hens</h2> 
    
    <img src="http://thm-a01.yimg.com/image/af25c66d294a5878" width="101" height="130" alt="three french hens 2 jpg" style="align:left"> 
    
    <h3>three french hens 2 jpg</h3> 
    URL: <a href="http://quidnimis.squarespace.com/storage/three_french_hens_2.jpg">http://quidnimis.squarespace.com/storage/three_french_hens_2.jpg</a><br />    
    Summary: And what about those three hens    Help is on the way
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/f67aa9c771964de8" width="135" height="131" alt="3 french hens jpg" style="align:left"> 
    
    <h3>3 french hens jpg</h3> 
    URL: <a href="http://www.ashmolean.org/assets/images/Shop/larger/3_french_hens.jpg">http://www.ashmolean.org/assets/images/Shop/larger/3_french_hens.jpg</a><br />    
    Summary: 
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/bf9219cff30c4e26" width="109" height="140" alt="22 threefrenchhens72 jpg" style="align:left"> 
    
    <h3>22 threefrenchhens72 jpg</h3> 
    URL: <a href="http://www.porterfieldsfineart.com/JohnnyKarwan/images/22-threefrenchhens72.jpg">http://www.porterfieldsfineart.com/JohnnyKarwan/images/22-threefrenchhens72.jpg</a><br />    
    Summary: 
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <h2>Image search for Four calling birds</h2> 
    
    <img src="http://thm-a01.yimg.com/image/ff0af7e3df11a75e" width="125" height="82" alt="1217 day four copy jpg" style="align:left"> 
    
    <h3>1217 day four copy jpg</h3> 
    URL: <a href="http://www.in-forum.com/gfx/photos/thumbs/1217{% raw %}%20day%{% endraw %}20four{% raw %}%20copy.jpg">http://www.in-forum.com/gfx/photos/thumbs/1217%{% endraw %}20day{% raw %}%20four%{% endraw %}20copy.jpg</a><br />    
    Summary: 
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/e74405bbe5a2d952" width="125" height="118" alt="4callingbirds 200 jpg" style="align:left"> 
    
    <h3>4callingbirds 200 jpg</h3> 
    URL: <a href="http://shopping.originpublishing.com/chart_images/4callingbirds_200.jpg">http://shopping.originpublishing.com/chart_images/4callingbirds_200.jpg</a><br />    
    Summary: 
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/77041180632ea214" width="109" height="140" alt="20 fourcallingbirds72 jpg" style="align:left"> 
    
    <h3>20 fourcallingbirds72 jpg</h3> 
    URL: <a href="http://www.porterfieldsfineart.com/JohnnyKarwan/images/20-fourcallingbirds72.jpg">http://www.porterfieldsfineart.com/JohnnyKarwan/images/20-fourcallingbirds72.jpg</a><br />    
    Summary: 
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <h2>Image search for Five golden rings</h2> 
    
    <img src="http://thm-a01.yimg.com/image/eadde6248c1ce184" width="125" height="125" alt="3905 JPG" style="align:left"> 
    
    <h3>3905 JPG</h3> 
    URL: <a href="http://www.rembrandtcharms.com/charm_img/3905.JPG">http://www.rembrandtcharms.com/charm_img/3905.JPG</a><br />    
    Summary: 
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/2c3e67c3533a240a" width="135" height="36" alt="5rings jpg" style="align:left"> 
    
    <h3>5rings jpg</h3> 
    URL: <a href="http://www.cashbarn.com/gif/5rings.jpg">http://www.cashbarn.com/gif/5rings.jpg</a><br />    
    Summary: PLUS    5 SECOND PLACE PRIZES RETAIL  $180 00 EACH FIVE  5  GOLDEN RINGS This diamond band is beautifully crafted in 14K Yellow Gold and includes 13 round diamonds of equal size  The shared prong setting allows the maximum amount of light to
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/1635a02245f8acf8" width="127" height="135" alt="5goldrings jpg" style="align:left"> 
    
    <h3>5goldrings jpg</h3> 
    URL: <a href="http://guy-sports.com/fun_pictures/christmas/5goldrings.jpg">http://guy-sports.com/fun_pictures/christmas/5goldrings.jpg</a><br />    
    Summary: my true love gave to me Six Geese a laying  five golden rings  four calling birds  three French hens  two turtle doves  and a partridge in a pear tree
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <h2>Image search for Six geese a-laying</h2> 
    
    <img src="http://thm-a01.yimg.com/image/566577de3329bee0" width="136" height="150" alt="6 geese a laying jpg" style="align:left"> 
    
    <h3>6 geese a laying jpg</h3> 
    URL: <a href="http://www.deanperry.co.uk/images/seasonalextras/12days/6-geese-a-laying.jpg">http://www.deanperry.co.uk/images/seasonalextras/12days/6-geese-a-laying.jpg</a><br />    
    Summary: Eight Maids A Milking Seven Swans A Swimming Six Geese A Laying Five Gold Rings
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/ab7bf54bbb964514" width="145" height="110" alt="Six Geese a  laying1 jpg" style="align:left"> 
    
    <h3>Six Geese a  laying1 jpg</h3> 
    URL: <a href="http://www.shanart.com/images{% raw %}%20/Six-Geese-a--laying1.jpg">http://www.shanart.com/images%{% endraw %}20/Six-Geese-a--laying1.jpg</a><br />    
    Summary: Six Geese a Laying
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/9bbbb80bcb89860c" width="102" height="135" alt="36972 reg jpg" style="align:left"> 
    
    <h3>36972 reg jpg</h3> 
    URL: <a href="http://www.giftcorral.com/giftcorral/images/items/36972_reg.jpg">http://www.giftcorral.com/giftcorral/images/items/36972_reg.jpg</a><br />    
    Summary: Our Price  $7 00  Big Sky Carvers Six Geese A Laying Ornament
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <h2>Image search for Seven swans a-swimming</h2> 
    
    <img src="http://thm-a01.yimg.com/image/701110778efe8d34" width="145" height="138" alt="seven swans a swimming jpg" style="align:left"> 
    
    <h3>seven swans a swimming jpg</h3> 
    URL: <a href="http://www.artshole.co.uk/arts/artists/anna{% raw %}%20charity/seven-swans-a-swimming.jpg">http://www.artshole.co.uk/arts/artists/anna%{% endraw %}20charity/seven-swans-a-swimming.jpg</a><br />    
    Summary: seven swans a swimming
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/8f86cdf63e59c71e" width="125" height="119" alt="TN seven swans a swimming JPG" style="align:left"> 
    
    <h3>TN seven swans a swimming JPG</h3> 
    URL: <a href="http://www.artshole.co.uk/arts/artists/anna{% raw %}%20charity/TN_seven-swans-a-swimming.JPG">http://www.artshole.co.uk/arts/artists/anna%{% endraw %}20charity/TN_seven-swans-a-swimming.JPG</a><br />    
    Summary: seven swans a swimming
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/617e022ccb45376e" width="135" height="96" alt="X7 Seven swans a swimming l GIF" style="align:left"> 
    
    <h3>X7 Seven swans a swimming l GIF</h3> 
    URL: <a href="http://www.papersharks.com/lrgxmasImages/X7{% raw %}%20Seven%{% endraw %}20swans{% raw %}%20a%{% endraw %}20swimming{% raw %}%20l.GIF">http://www.papersharks.com/lrgxmasImages/X7%{% endraw %}20Seven{% raw %}%20swans%{% endraw %}20a{% raw %}%20swimming%{% endraw %}20l.GIF</a><br />    
    Summary: 
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <h2>Image search for Eight maids a-milking</h2> 
    
    <img src="http://thm-a01.yimg.com/image/bd44484d4ba198ec" width="135" height="135" alt="Eight Maids a Milking jpg" style="align:left"> 
    
    <h3>Eight Maids a Milking jpg</h3> 
    URL: <a href="http://www.artshole.co.uk/arts/artists/April{% raw %}%2006/Jay%{% endraw %}20Taylor/Eight-Maids-a-Milking.jpg">http://www.artshole.co.uk/arts/artists/April{% raw %}%2006/Jay%{% endraw %}20Taylor/Eight-Maids-a-Milking.jpg</a><br />    
    Summary: Eight Maids a Milking
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/b6994a8d69ef573c" width="125" height="125" alt="TN Eight Maids a Milking JPG" style="align:left"> 
    
    <h3>TN Eight Maids a Milking JPG</h3> 
    URL: <a href="http://www.artshole.co.uk/arts/artists/April{% raw %}%2006/Jay%{% endraw %}20Taylor/TN_Eight-Maids-a-Milking.JPG">http://www.artshole.co.uk/arts/artists/April{% raw %}%2006/Jay%{% endraw %}20Taylor/TN_Eight-Maids-a-Milking.JPG</a><br />    
    Summary: Eight Maids a Milking
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/ce9243c27b735b96" width="136" height="150" alt="8 maids a milking jpg" style="align:left"> 
    
    <h3>8 maids a milking jpg</h3> 
    URL: <a href="http://www.deanperry.co.uk/images/seasonalextras/12days/8-maids-a-milking.jpg">http://www.deanperry.co.uk/images/seasonalextras/12days/8-maids-a-milking.jpg</a><br />    
    Summary: and previously    Nine Ladies Dancing Eight Maids A Milking Seven Swans A Swimming
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <h2>Image search for Nine ladies dancing</h2> 
    
    <img src="http://thm-a01.yimg.com/image/820c4622187f25c6" width="145" height="24" alt="9ladies jpg" style="align:left"> 
    
    <h3>9ladies jpg</h3> 
    URL: <a href="http://www.fashion-era.com/images/xmas/xmas_traditions/9ladies.jpg">http://www.fashion-era.com/images/xmas/xmas_traditions/9ladies.jpg</a><br />    
    Summary: On the ninth day of Christmas  my true love gave to me Nine Ladies Dancing   eight maids a milking  seven swans a swimming  six geese a laying  Five golden rings  Four calling birds  three French hens  two
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/f0f6fff6df74ef12" width="136" height="150" alt="9 ladies dancing jpg" style="align:left"> 
    
    <h3>9 ladies dancing jpg</h3> 
    URL: <a href="http://www.deanperry.co.uk/images/seasonalextras/12days/9-ladies-dancing.jpg">http://www.deanperry.co.uk/images/seasonalextras/12days/9-ladies-dancing.jpg</a><br />    
    Summary: 10 Lords A Leaping  click for bigger  and previously    Nine Ladies Dancing Eight Maids A Milking
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/544cfea19da74a4a" width="83" height="100" alt="thumb 9ladies small jpg" style="align:left"> 
    
    <h3>thumb 9ladies small jpg</h3> 
    URL: <a href="http://www.jonquathor.co.uk/albums/userpics/10001/thumb_9ladies-small.jpg">http://www.jonquathor.co.uk/albums/userpics/10001/thumb_9ladies-small.jpg</a><br />    
    Summary: Nine Ladies Dancing   72 viewsFiller art for the Twelve Day of Christmas at The Wotch
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <h2>Image search for Ten lords a-leaping</h2> 
    
    <img src="http://thm-a01.yimg.com/image/713b7d38304d4d2e" width="95" height="125" alt="Ten Lords A Leaping Thumb jpg" style="align:left"> 
    
    <h3>Ten Lords A Leaping Thumb jpg</h3> 
    URL: <a href="http://www.coloursdownunder.com.au/shop/images/product_images/Ten-Lords-A-Leaping-Thumb.jpg">http://www.coloursdownunder.com.au/shop/images/product_images/Ten-Lords-A-Leaping-Thumb.jpg</a><br />    
    Summary: 
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/a4a4f191a78b3ba4" width="128" height="130" alt="1993 Ten Lords A Leaping JPG" style="align:left"> 
    
    <h3>1993 Ten Lords A Leaping JPG</h3> 
    URL: <a href="http://www.thepartyshop.com/Commerce/images/1993{% raw %}%20Ten%{% endraw %}20Lords{% raw %}%20A-Leaping.JPG">http://www.thepartyshop.com/Commerce/images/1993%{% endraw %}20Ten{% raw %}%20Lords%{% endraw %}20A-Leaping.JPG</a><br />    
    Summary: 1993 Springtime Bonn  > 27 Apr 2005 21 40 57K 1993 TURTLE jpg 14 Jul 2005 08 37 33K 1993 Ten Lords A Lea  > 26 May 2005 14 53 28K 1993 Time for Easter  > 27 Apr 2005 21 54 100K
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/781699d6537ca35e" width="110" height="135" alt="36976 reg jpg" style="align:left"> 
    
    <h3>36976 reg jpg</h3> 
    URL: <a href="http://www.giftcorral.com/giftcorral/images/items/36976_reg.jpg">http://www.giftcorral.com/giftcorral/images/items/36976_reg.jpg</a><br />    
    Summary: Our Price  $5 25  Big Sky Carvers Ten Lords A Leaping Ornament
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <h2>Image search for Eleven pipers piping</h2> 
    
    <img src="http://thm-a01.yimg.com/image/80770d65f9669e52" width="108" height="135" alt="xmas11 jpg" style="align:left"> 
    
    <h3>xmas11 jpg</h3> 
    URL: <a href="http://streamers.com/ideas/xmas11.jpg">http://streamers.com/ideas/xmas11.jpg</a><br />    
    Summary: Eleven Pipers piping
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/4e82408b1e9bbe60" width="136" height="150" alt="11 pipers piping jpg" style="align:left"> 
    
    <h3>11 pipers piping jpg</h3> 
    URL: <a href="http://www.deanperry.co.uk/images/seasonalextras/12days/11-pipers-piping.jpg">http://www.deanperry.co.uk/images/seasonalextras/12days/11-pipers-piping.jpg</a><br />    
    Summary: It s the Penultimate Day of Christmas  Woohoo  so here s    Eleven Pipers Piping   click on the image for a full size version  The Eleven Pipers represent the eleven Faithful Apostles  1  Simon Peter  2  Andrew  3  James  4  John  5  Philip  6  Bartholomew  7  Matthew  8  Thomas  9  James bar Alphaeus  10  Simon
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/de35c9b1f0920300" width="119" height="170" alt="pipers piping 12 days jpg" style="align:left"> 
    
    <h3>pipers piping 12 days jpg</h3> 
    URL: <a href="http://www.msgr.ca/msgr-2/pipers{% raw %}%20piping%{% endraw %}2012{% raw %}%20days.jpg">http://www.msgr.ca/msgr-2/pipers%{% endraw %}20piping{% raw %}%2012%{% endraw %}20days.jpg</a><br />    
    Summary: My true love gave to me
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <h2>Image search for Twelve drummers drumming</h2> 
    
    <img src="http://thm-a01.yimg.com/image/d51a2d60927342e0" width="130" height="94" alt="Twelve Drummers Drumming300 jpg" style="align:left"> 
    
    <h3>Twelve Drummers Drumming300 jpg</h3> 
    URL: <a href="http://www.creativedisplays.com/siteresources/modules/webstore/ProdImages/Twelve{% raw %}%20Drummers%{% endraw %}20Drumming300.jpg">http://www.creativedisplays.com/siteresources/modules/webstore/ProdImages/Twelve{% raw %}%20Drummers%{% endraw %}20Drumming300.jpg</a><br />    
    Summary: Twelve Drummers Drumming  Six Feet Tall  TDD6  Twelve Drummers Drumming   Six Feet Tall  animated   Large Drums
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/c724b6c7cf2ff946" width="135" height="86" alt="find the twelve days of christmas 10 jpg" style="align:left"> 
    
    <h3>find the twelve days of christmas 10 jpg</h3> 
    URL: <a href="http://static.howstuffworks.com/gif/find-the-twelve-days-of-christmas-10.jpg">http://static.howstuffworks.com/gif/find-the-twelve-days-of-christmas-10.jpg</a><br />    
    Summary: View Enlarged Image Find twelve drummers drumming and lots more in this Christmas game
    <br clear="both" style="clear:both"> 
    
    <p> 
    <hr> 
    </p> 
    
    <img src="http://thm-a01.yimg.com/image/b2e30b934a546b74" width="150" height="112" alt="12 drummers drumming jpg" style="align:left"> 
    
    <h3>12 drummers drumming jpg</h3> 
    URL: <a href="http://christiannewwave.files.wordpress.com/2007/04/12-drummers-drumming.jpg">http://christiannewwave.files.wordpress.com/2007/04/12-drummers-drumming.jpg</a><br />    
    Summary: German band Twelve Drummers Drumming started in the autumn of 1983  Seizing their name from an English Christmas carol  The 12 Days OF Christmas   The line up consisted of Rudi Edgar
    <br clear="both" style="clear:both">