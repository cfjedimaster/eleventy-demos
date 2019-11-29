---
layout: post
title: "Translating from Roman to Decimal Numbers with ColdFusion"
date: "2010-02-02T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/02/02/Translating-from-Roman-to-Decimal-Numbers-with-ColdFusion
guid: 3706
---

A few days ago I saw on Twitter a request for code that would convert roman numerals to decimal. <a href="http://www.cflib.org">CFLib</a> has a UDF for going from decimal to Roman, but not the other way. I did a bit of searching and while I found a bunch of code libraries, I didn't find one that explained the <i>logic</i> behind the translation. Finally I came across this page: <a href="http://www.mathematische-basteleien.de/romannumerals.htm">Roman Numerals</a>, which I thought explained the issue very nicely. The basic process to convert from Roman to decimal is:

<p>

1) Read the numbers from left to right.<br/>

2) Each number is added to the next... <br/>

3) Except when the next number is larger than the current number. Then you take the pair and do a subtraction.<br/>

<p>

So with this logic in mind, I came up with the following UDF. It assumes valid Roman numerals for input. But it seems to work ok.

<p>

<code>
function romantodec(input) {
	var romans = {};
	var result = 0;
	var pos = 1;
	var char = "";
	var thisSum = "";
	var nextchar = "";
		
	romans["I"] = 1;
	romans["V"] = 5;
	romans["X"] = 10;
	romans["L"] = 50;
	romans["C"] = 100;
	romans["D"] = 500;
	romans["M"] = 1000;

	while(pos lte len(input)) {
		char = mid(input, pos, 1);
		//are we NOT at the end?
		if(pos != len(input)) {
			//check my next character - if bigger, replace with a sub
			nextchar = mid(input, pos+1, 1);
			if(romans[char] &lt; romans[nextchar]) {
				thisSum = romans[nextchar] - romans[char];
				result += thisSum;
				pos+=2;
			} else {
				result += romans[char];
				pos++;
			} 
		} else {
			result += romans[char];
			pos++;
		}
	}
	
	return result;
}
</code>

<p>

You can see how it follows the basic, 'left to right, add the numbers together' process, and how it notices when the current character has a higher number to the right of it. I wrote up a quick test script for it like so:

<p>

<code>
&lt;cfset inputs = "XX,XI,IV,VIII,MC,DL,XL"&gt;
&lt;cfloop index="input" list="#inputs#"&gt;
	&lt;cfoutput&gt;
	#input#=#romantodec(input)#&lt;br/&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

<p>

Which produced:
<p>

XX=20<br/>
XI=11<br/>
IV=4<br/>
VIII=8<br/>
MC=1100<br/>
DL=550<br/>
XL=40<br/>

You can download this UDF at CFLib now: <a href="http://www.cflib.org/udf/romanToDecimal">romanToDecimal</a> 

p.s. Sorry for those still waiting for UDF approval at CFLib. It is a volunteer process (myself, Scott Pinkston, Todd Sharp) so be patient!