---
layout: post
title: "Friday Puzzler: The tag popularity contest"
date: "2006-05-19T09:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/19/Friday-Puzzler-The-tag-popularity-contest
guid: 1278
---

Today's contest is not only simple, but (hopefully) useful. Write a UDF that will take a string of CFML code as input. The UDF will parse the string for CFML tags. It will then return a  result set that includes each tag used (without arguments) and the number of times it is used. This could create a report that looks like so:

<table>
<tr>
<td>&lt;cfset&gt;</td>
<td>9</td>
</tr>
<tr>
<td>&lt;cfoutput&gt;</td>
<td>4</td>
</tr>
</table>

Just to be clear, you don't need to worry about the attributes. Just determine the tags and how many times they were used. 

For extra credit, check the string passed in and see if it is a directory. If it is, do a recursive list to get all CFMs and then parse all of those files.

For super extra credit (let's call em Ray Points), make your script handle custom tags correctly, including knowing that cfmodule template="ray.cfm" is the same (potentially) as cf_ray. 

By the way, can you guess what the top used tags will be? Ben has talked about this many times in the past.