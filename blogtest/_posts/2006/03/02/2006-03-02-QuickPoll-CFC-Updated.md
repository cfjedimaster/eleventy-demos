---
layout: post
title: "QuickPoll CFC Updated"
date: "2006-03-02T18:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/02/QuickPoll-CFC-Updated
guid: 1134
---

I got some <i>darn</i> nice improvements sent in by Mark Mazelin. These improvements include:

<ul>
<li>Modified the test.cfm to actually output xhtml code, complete with the html/head/body tags.
<li>Updated the test.cfm to remove my e-mail address and put in a generic one. 
<li>The getXXX methods are now public (where it makes sense)
<li>Added the rows and cols attributes to the textarea for xhtml compliance (they are required attributes).
<li>Added XHTML 1.0 Transitional compliance by adding end slashes to the input and br tags
<li>Ability to send html e-mail
<li>Udated error handling to highlight required questions that were not answered
<li>Updated error handling to use unordered list and allow a css-styled error box
<li>Added label tags to the questions/answers (which also includes adding id attributes to those the input tags)
</ul>

I also added support for hidden questions and setting an initial value. The idea for hidden questions came from a commenter to my earlier post. It is useful for passing in information about the survey taker.