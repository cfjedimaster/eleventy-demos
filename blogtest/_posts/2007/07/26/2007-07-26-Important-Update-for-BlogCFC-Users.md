---
layout: post
title: "Important Update for BlogCFC Users"
date: "2007-07-26T18:07:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/07/26/Important-Update-for-BlogCFC-Users
guid: 2223
---

If you use BlogCFC, please edit your style sheets so that the code style adds "courier new" to the list of fonts and changes the size to 1em. For a while now I've been wondering why code blocks were small on BlogCFC sites, but only on my Mac. I want to thank <a href="http://cjordan.us/index.cfm">Chris Jordan</a> for sending me the fix and sharing it on the <a href="http://groups.google.com/group/cfbloggers">cfbloggers</a> listserv.

Oops, forgot to paste the final code:

<code>
.code {
	font-family: "courier new",courier,monospace;
	font-size: 1em;
	color: black;
	border: solid thin #0000cc;
	background-color: #ffffcc;
	overflow: auto;
	max-height: 200px;
    padding: 4px 4px 4px 4px;
    line-height: 15px;
	 margin:5px 0 5px 0;	
}
</code>