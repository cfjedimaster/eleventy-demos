---
layout: post
title: "Ask a Jedi: Moving items up and down..."
date: "2005-09-09T14:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/09/Ask-a-Jedi-Moving-items-up-and-down
guid: 760
---

So, a while ago I released a custom tag called <a href="http://ray.camdenfamily.com/downloads/slush.zip">Slush</a>. It was a custom tag that would generate a Flash Form control allowing for left/right controls using select boxes. A user asked me if I had anything like that but with Up/Down type controls. In other words, he wanted to order items in a select box. 

This isn't too hard to do. I'll show the code then talk about it a bit:

<div class="code"><FONT COLOR=MAROON>&lt;cfform format=<FONT COLOR=BLUE>"flash"</FONT> width=<FONT COLOR=BLUE>"600"</FONT> height=<FONT COLOR=BLUE>"200"</FONT>&gt;</FONT><br>
<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfsavecontent variable=<FONT COLOR=BLUE>"fix"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;var t2:Array = Array();<br>
&nbsp;&nbsp;&nbsp;for(var i=0; i &lt; people.getLength();i++) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;t2.push(people.getItemAt(i).data);<br>
&nbsp;&nbsp;&nbsp;}<br>
&nbsp;&nbsp;&nbsp;people_list.text = t2.join(<FONT COLOR=BLUE>","</FONT>);<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfsavecontent&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfsavecontent variable=<FONT COLOR=BLUE>"moveUp"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if(people.selectedIndex &gt; 0) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var pos = people.selectedIndex;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var temp = people.getItemAt(pos);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;people.addItemAt(pos-1,temp);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;people.removeItemAt(pos+1);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;people.selectedIndex = pos-1;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>#fix#<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfsavecontent&gt;</FONT><br>
<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfsavecontent variable=<FONT COLOR=BLUE>"moveDown"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if(people.selectedIndex+1 &lt; people.length) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var pos = people.selectedIndex;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var temp = people.getItemAt(pos+1);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;people.addItemAt(pos,temp);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;people.removeItemAt(pos+2);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>#fix#<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfsavecontent&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfformgroup type=<FONT COLOR=BLUE>"horizontal"</FONT>&gt;</FONT><br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfselect name=<FONT COLOR=BLUE>"people"</FONT> multiple size=<FONT COLOR=BLUE>"4"</FONT> width=<FONT COLOR=BLUE>"200"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;option value=<FONT COLOR=BLUE>"1"</FONT>&gt;</FONT></FONT>Apple<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/option&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;option value=<FONT COLOR=BLUE>"2"</FONT>&gt;</FONT></FONT>Beta<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/option&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;option value=<FONT COLOR=BLUE>"3"</FONT>&gt;</FONT></FONT>Caladium<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/option&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;option value=<FONT COLOR=BLUE>"4"</FONT>&gt;</FONT></FONT>Death Star<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/option&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfselect&gt;</FONT><br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfformgroup type=<FONT COLOR=BLUE>"vertical"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"button"</FONT> name=<FONT COLOR=BLUE>"moveUp"</FONT> value=<FONT COLOR=BLUE>"Up"</FONT> onClick=<FONT COLOR=BLUE>"#moveUp#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"button"</FONT> name=<FONT COLOR=BLUE>"moveDown"</FONT> value=<FONT COLOR=BLUE>"Down"</FONT> onClick=<FONT COLOR=BLUE>"#moveDown#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"submit"</FONT> name=<FONT COLOR=BLUE>"submit"</FONT> value=<FONT COLOR=BLUE>"Save"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfformgroup&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfformgroup&gt;</FONT><br>
<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfformgroup type=<FONT COLOR=BLUE>"horizontal"</FONT> visible=true height=<FONT COLOR=BLUE>"0"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"text"</FONT> name=<FONT COLOR=BLUE>"people_list"</FONT> value=<FONT COLOR=BLUE>"1,<FONT COLOR=BLUE>2</FONT>,<FONT COLOR=BLUE>3</FONT>,<FONT COLOR=BLUE>4</FONT>"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfformgroup&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
<FONT COLOR=MAROON>&lt;/cfform&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfdump var=<FONT COLOR=BLUE>"#form#"</FONT>&gt;</FONT></div>

First off - this isn't a custom tag version, but it could be changed into it. The first thing you should note is the cfselect box. This is the container for options that we will sort. Next note the Up and Down button. They use the code defined above in the moveUp and moveDown cfsavecontent blocks. The action script is, genrally, understandeable. It's pretty close to how you would do it in JavaScript.

So far - this is mostly trivial code. What isn't trivial is how you pass the order to the server. By default, a select box with the multiple option will pass <i>no</i> data if you don't select anything. I don't want to force the user to Select All before hitting submit, so I made a little hack. I added an invisible form field called people_list. Whenever the drop down is reordered, I repopulate the value property using the code defined in cfsavecontent block named "fix".

Thoughts? I'd be shocked if the folks at <a href="http://www.asfusion.com">ASFusion.com</a> don't have a much more elegant solution, so check there as well.