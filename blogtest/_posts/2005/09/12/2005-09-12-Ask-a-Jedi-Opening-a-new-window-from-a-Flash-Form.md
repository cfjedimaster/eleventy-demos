---
layout: post
title: "Ask a Jedi: Opening a new window from a Flash Form"
date: "2005-09-12T19:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/12/Ask-a-Jedi-Opening-a-new-window-from-a-Flash-Form
guid: 768
---

Tim asks: 

<blockquote>
Michael White posted the question of a button in a Flash form that opens up a new window. How would you implement this? I know adding the javascript function to an "onClick" doesnt work. 
</blockquote>

So, onClick is definitely how to start. I built code for this for my <a href="http://ray.camdenfamily.com/index.cfm?mode=cat&catid=8ACE6749-BC45-053C-DFE9F8FADD14ABA2">Lighthouse Pro</a> project. Let's look at the code (which can probably be done better) and I'll explain what I did...

<div class="code"><FONT COLOR=NAVY><FONT COLOR=MAROON>&lt;script&gt;</FONT></FONT><br>
function show(u) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if(u != '') window.open(u, 'sub', 'directories=yes, location=yes, menubar=yes, resizable=yes, scrollbar=yes, status=yes, titlebar=yes, toolbar=yes')<br>
}<br>
<FONT COLOR=NAVY><FONT COLOR=MAROON>&lt;/script&gt;</FONT></FONT><br>
<br>
<br>
<FONT COLOR=MAROON>&lt;cfform format=<FONT COLOR=BLUE>"flash"</FONT> name=<FONT COLOR=BLUE>"foo"</FONT> width=<FONT COLOR=BLUE>"400"</FONT> height=<FONT COLOR=BLUE>"200"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfformgroup type=<FONT COLOR=BLUE>"horizontal"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"text"</FONT> validate=<FONT COLOR=BLUE>"url"</FONT> name=<FONT COLOR=BLUE>"theURL"</FONT> width=<FONT COLOR=BLUE>"150"</FONT> message=<FONT COLOR=BLUE>"Use a proper URL"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"button"</FONT> name=<FONT COLOR=BLUE>"showURL"</FONT> value=<FONT COLOR=BLUE>"Load in New Window"</FONT> width=<FONT COLOR=BLUE>"150"</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;onClick=<FONT COLOR=BLUE>"getURL('javascript:show(\''+theURL.text+'\')')"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfformgroup&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfform&gt;</FONT></div>

I start off with the code I'll use to open a new window. This is your fairly standard "window.open" code. It may - in fact - get blocked by pop up blockers. My Firefox never complained though. Anyway, that being said, the code is pretty standard. Unlike most popups, I don't specify a height and width. This tends to let the browser use the defaults, which is the same size as the user's main window.

Next comes our flash form. I didn't know where you wanted the  new window to go, so I added a simple text input box for a URL. The button is what we really care about. For some reason it took me numerous tries to get all the escaping and string parsing done right here. Basically we use getURL, which is a Flash method that lets you talk to JavaScript. I'm calling my "show" JavaScript function defined above, and passing in the value of the text input box. Obviously you don't have to have a text input box. Maybe it is a static URL, or something from a grid, but you get the idea.