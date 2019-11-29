---
layout: post
title: "Interestng CFHTTP issue"
date: "2009-04-30T14:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/04/30/Interestng-CFHTTP-issue
guid: 3335
---

Here is an interesting issue that came from a reader. He is using Yahoo's stock quote system to get data using CFHTTP. Here is the code he used:

<code>
&lt;cfhttp name="Stocks" method="get" delimiter=","
firstRowAsHeaders="false" url="http://quote.yahoo.com/d/quotes.csv"
columns="stockID,IndexValue,TradeTimeDate,TradeTimeTime,ChangePoint,OpenValue,En
dingDayRange,OpeningDayRange,DoNotKnow1,MarketCap,PreviousClose,ChangePercent,Ye
arRange,EarningPerShare,EarningRatio,CompanyName"
throwonerror="yes"&gt;
&lt;cfhttpparam type="Header" name="charset" value="ISO-8859-1" /&gt;
&lt;cfhttpparam name="s" value="#form.symbol#" type="formfield" encoded="no"
/&gt;
&lt;cfhttpparam name="f" value="xxx"
type="formfield" /&gt;
&lt;/cfhttp&gt;
</code>

I've not used the Yahoo API before, but it should be pretty obvious what the above does. Pass in a symbol via a form variable and parse the result into a query. Note - the "f" param was a longer string and I was concerned that it may be a private key. I changed it to xxx just to be safe.

So what's the problem? When he used ^DJI as a symbol, the value ended up being escaped. Yahoo's result indicated that it didn't recognize the value, which makes sense as it was no longer ^DJI, but had changed to %5EDJI. As you can see, he did pass encoded="no", but this was ignored. I thought perhaps it was the use of GET as the cfhttp operation. Changing this to POST did not help. Nor did changing the cfhttpparam type to URL. Nothing seemed to work right.

I tried a few different combinations, and finally got it working, but to be honest, I have no idea why this works. Consider the new version (and again, 'f' has been changed in case it is a private variable):

<code>
&lt;cfhttp  method="post" 
url="http://quote.yahoo.com/d/quotes.csv?s=#urlEncodedFormat(form.symbol)#&f=xxx"
throwonerror="false"
columns="stockID,IndexValue,TradeTimeDate,TradeTimeTime,ChangePoint,OpenValue,EndingDayRange,OpeningDayRange,DoNotKnow1,MarketCap,PreviousClose,ChangePercent,YearRange,EarningPerShare,EarningRatio,CompanyName"
delimiter=","
name="Stocks"
firstRowAsHeaders="false"
&gt;
	&lt;cfhttpparam type="Header" name="charset" value="ISO-8859-1" /&gt;
	&lt;cfhttpparam name="s" value="#form.symbol#" type="formfield" /&gt;
    &lt;cfhttpparam name="f" value="xxx" type="formfield" /&gt;
&lt;/cfhttp&gt;
</code>

Notice I've supplied the s and f values both in the URL and in the form field. This worked perfectly, but as I said, I've got not idea why. Anyone want to take a guess?