---
layout: post
title: "Model-Glue Question - Helpers calling helpers"
date: "2010-04-20T13:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/04/20/ModelGlue-Question-Helpers-calling-helpers
guid: 3785
---

A coworker asked me a question yesterday that I wasn't quite sure about. I whipped up some quick tests to figure it out and I thought I'd share it with others. My coworker asked if one helper in a Model-Glue application could call another. Now if you don't know what helpers in Model-Glue are, you can consider them as simple utilities that are available to your views. Most applications end up needing some way to support utilities that don't fall into the traditional controller or model area. In the past I've ended up creating a utility CFC that my controller would automatically pass into the view. Model-Glue makes this simpler with the use of a special folder of helper files. More information can be found in the <a href="http://docs.model-glue.com/wiki/HowTos/HowToUseHelpers#Helpers">official docs</a> for the feature. 

So <i>can</i> one helper call another? Turns out the answer is "yes and no". I built a simple test where one helper tried to call another from within the same CFM file. So given a filename of util.cfm, my test() function simply returned helpers.util.test2(). This failed. I then tried dumping helpers and from within the context of the method it did not exist at all. However - my test function had no problem simply calling test2(). This worked even if test2() existed as a local UDF on the view itself.

Somehow this just feels wrong to me in a CFM though. If you plan on having helpers calling other helpers, I'd probably just use a CFC for the file.