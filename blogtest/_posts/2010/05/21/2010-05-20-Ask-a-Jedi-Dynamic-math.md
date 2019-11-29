---
layout: post
title: "Ask a Jedi: Dynamic math?"
date: "2010-05-21T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/05/21/Ask-a-Jedi-Dynamic-math
guid: 3826
---

Jim asks: 
<blockquote>
Ray, I'm just playing and can't figure this out.<br/><br/>

Given:<br/>
&lt;cffunction name="makeRandomNum" returntype="numeric" output="false"&gt;<br/>
       &lt;cfset var result = RandRange(0,10)&gt;<br/>
       &lt;cfreturn result&gt;<br/>
&lt;/cffunction&gt;<br/>
&lt;cfset num1 = makeRandomNum()&gt;<br/>
&lt;cfset num2 = makeRandomNum()&gt;<br/>
&lt;cfset Oper = mid("+-*", randRange(1,3),1)&gt;<br/>
<br/>
&lt;cfset ans = num1 Oper num2&gt;<br/>
<br/>
How can I get var Oper reconized as mathical operator?
</blockquote>
<p>
This is one of the few times where the evaluate function is necessary. In order to get ans to represent the right value, we can easily switch it to:
<p>
<code>
&lt;cfset ans = evaluate("num1 #oper# num2")&gt;
</code>
<p>
Of course, this isn't the only way. Since the number of mathematical operands are limited, you could always write a UDF that takes all 3 values (the two numeric value and the operand) and simply uses a switch case to determine which one to run. But that would be overkill and a complete waste of time, so only an idiot would do it.
<p>
<code>
&lt;cffunction name="makeRandomNum" returntype="numeric" output="false"&gt;
       &lt;cfset var result = RandRange(0,10)&gt;
       &lt;cfreturn result&gt;
&lt;/cffunction&gt;
&lt;cfset num1 = makeRandomNum()&gt;
&lt;cfset num2 = makeRandomNum()&gt;
&lt;cfset Oper = mid("+-*", randRange(1,3),1)&gt;

&lt;cfoutput&gt;oper=#oper# num1=#num1# num2=#num2#, #evaluate("num1 #oper# num2")#&lt;br&gt;&lt;/cfoutput&gt;

&lt;cfscript&gt;
function wasteOfTime(num1,num2,oper) {
	switch(oper) {
		case "+": return num1+num2;
		case "-": return num1-num2;
		case "*": return num1*num2;
		case "/": return num1/num2;
	}
	return "NAN";
}
&lt;/cfscript&gt;
&lt;p&gt;
&lt;cfoutput&gt;#wasteOfTime(num1,num2,oper)#&lt;/cfoutput&gt;
</code>

Enjoy.