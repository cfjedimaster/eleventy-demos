---
layout: post
title: "Repeat - ColdFusion 9 does NOT remove the need to var scope!"
date: "2010-02-08T13:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/02/08/Repeat-ColdFusion-9-does-NOT-remove-the-need-to-var-scope
guid: 3711
---

Sorry to yell (well, we don't have to assume all exclamation marks are equivalent to yelling) but this email came in to me this morning and it is very troubling for me:

<blockquote>
I have a question for you about varScoper and CF9. As I understand it, in CF9 all unscoped variables in a function are placed into a protected local scope, thereby killing the need to use the var x = "" line to scope them.

If that understanding is correct, does this make varScoper obsolete in CF9? Our team in upgrading to CF9 in the near future, and trying to identify if running code through varScoper needs to continue to be a part of our code review processes or not.
</blockquote>

The answer is an unequivocal <b>no</b>. You <b>must</b> still continue to var scope your variables in UDFs and CFC methods. There is no change in this respect. ColdFusion 9 only makes two <i>related</i> changes:

<ul>
<li>The var scope previous was an "unnamed" scope. ColdFusion 9 fixes this by creating a scope called local. Like other ColdFusion scopes you can treat this as a structure.
<li>Because there is an implicit local scope, you can now skip the var keyword and use "local." instead. So given the line used in the quote above, you could var scope X by rewriting it as local.x="". To me, this is still "var scoping", it just gets there via a different path.
</ul>

So long story short - yes - you still need to var scope in CF9. The <a href="http://varscoper.riaforge.org/">varScoper</a> tool is still an important and necessary part of your testing/deployment strategy.