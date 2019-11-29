---
layout: post
title: "Using ColdFusion to help with my son's homework"
date: "2008-09-25T22:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/25/Using-ColdFusion-to-help-with-my-sons-homework
guid: 3030
---

So I don't know if this is cheating or not. You guys can tell me. My son's teacher assigns some homework that is meant to be done with a parent. Today he had a problem that involved school lunches. The problem was that if a student spent exactly 5 dollars for lunch, he would get a free cookie. There were four groups of foods and each item had a different price. You had to pick one item from each group and reach a sum of 5 dollars. He found one by himself, and had trouble finding the other combinations. We began to do it by random guessing, and quickly gave up. It then occurred to me. This was a perfect example of boring, iterative work that a computer could probably solve in one second. I created a set of data for the food groups and items:

<code>
&lt;cfset meat = {% raw %}{chicken=1.95,roast_beef=3.05,shrimp=3.50,roast_pork=2.75}{% endraw %}&gt;
&lt;cfset salad = {% raw %}{cole_slaw=0.60,potato_salad=0.95,dinner_salad=0.75,macaroni_salad=1.10}{% endraw %}&gt;
&lt;cfset veggies_potatoes = {% raw %}{mashed_potatoes=1,french_fries=0.85,sweet_corn=0.65,green_beans=0.5}{% endraw %}&gt;
&lt;cfset drinks = {% raw %}{milk=0.40,chocolate_milk=0.45,oj=0.95,soda=0.55}{% endraw %}&gt;
</code>

In case you are wondering about the key names, when you use implicit struct notation you can't use strings for the key names. I had tried "roast beef"=3.05, but that returned a syntax error. 

So that defined the data, now I just needed to loop and check the prices:

<code>
&lt;cfloop item="m" collection="#meat#"&gt;
	&lt;cfloop item="s" collection="#salad#"&gt;
		&lt;cfloop item="v" collection="#veggies_potatoes#"&gt;
			&lt;cfloop item="d" collection="#drinks#"&gt;
				&lt;cfset combo_price = meat[m] + salad[s] + veggies_potatoes[v] + drinks[d]&gt;
				&lt;cfif combo_price is 5&gt;
					&lt;cfoutput&gt;#m#+#s#+#v#+#d#&lt;br /&gt;&lt;/cfoutput&gt;
				&lt;/cfif&gt;
			&lt;/cfloop&gt;
		&lt;/cfloop&gt;
	&lt;/cfloop&gt;
&lt;/cfloop&gt;
</code>

I walked through the code with my son and made sure he got what was going on. We then ran it and got the answers:

<blockquote>
<p>
CHICKEN+MACARONI_SALAD+MASHED_POTATOES+OJ
ROAST_BEEF+DINNER_SALAD+SWEET_CORN+SODA
ROAST_PORK+POTATO_SALAD+FRENCH_FRIES+CHOCOLATE_MILK
SHRIMP+COLE_SLAW+GREEN_BEANS+MILK
</p>
</blockquote>

We then double checked each combination to ensure it added up right. So - is that cheating? I say any early introduction to the power of programming is never a bad thing! :)