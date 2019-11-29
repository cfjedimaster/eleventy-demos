---
layout: post
title: "ColdFusion Builder Tip - Finding a file"
date: "2009-08-31T11:08:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2009/08/31/ColdFusion-Builder-Tip-Finding-a-file
guid: 3504
---

I'm working with a new client that has a rather large and complex code base. Since I'm still kinda new to the project I don't know where everything exists. I needed to find a particular file name within the project and discovered that ColdFusion Builder (Eclipse really!) provides a simple way to do it.
<!--more-->
First, go to the Search menu like you would when searching for text within a project. Remove anything from "Containing text" and under FIle name patterns, just type in the actual file name. Lastly, be sure your scope is set to Selected resources. 

Here is a simple example of searching for blog.cfc within my BlogCFC5 project:

<img src="https://static.raymondcamden.com/images/Screen shot 2009-08-31 at 10.02.00 AM.png" />

The result will pop up in the Search panel:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2009-08-31 at 10.03.31 AM.png" />

As I said - this is more an Eclipse thing than a ColdFusion Builder feature, but it never occurred to me to use the search feature to find a particular file. Pretty obvious now I guess but it's going to be a life saver with me on this project.