---
layout: post
title: "Help CF Help You..."
date: "2005-07-12T17:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/07/12/Help-CF-Help-You
guid: 622
---

So, unlike the rest of you guys, I never make any mistakes. No, really, I don't. But, I know people who do make mistakes. In fact, my good buddy (the same guy who is watching and reviewing all those cool shows in England) recently told me that he makes one mistake quite often - and that is trying to use an invalid key of a struct. So, consider the following code:

<div class="code"><FONT COLOR=MAROON>&lt;cfset s = structNew()&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>#s.foo#<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT></div>

When run, ColdFusion will tell you:<br>
<b>Element FOO is undefined in S.</b><br>

Which is helpful and all, but wouldn't it be cool if ColdFusion would tell you what WAS defined in the structure? Well, as <a href="http://www.mikenimer.com/index.cfm?mode=entry&entry=F217B27F-4E22-1671-5753F57AFBBE3DD9">Nimer</a> pointed out a few days ago, the ColdFusion exception handler is a ColdFusion template itself. It can be found in /web-inf/exception/detail.cfm. It can also be modified. Look for line 110 (in CFMX7), and it should be:

#attributes.message#

Then simply add this code immidiately after:

<div class="code"><FONT COLOR=GRAY><I>&lt;!--- is struct? ---&gt;</I></FONT><br>
<FONT COLOR=MAROON>&lt;cfif findNoCase(<FONT COLOR=BLUE>"is undefined in"</FONT>, attributes.message)&gt;</FONT><br>
      &nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset theVar = listLast(attributes.message,<FONT COLOR=BLUE>" "</FONT>)&gt;</FONT><br>
       &nbsp;&nbsp;&nbsp;<FONT COLOR=GRAY><I>&lt;!--- get rid of period ---&gt;</I></FONT><br>
       &nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset theVar = left(theVar, len(theVar)-1)&gt;</FONT><br>
       &nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfif structKeyExists(caller, theVar) and isStruct(caller[theVar])&gt;</FONT><br>
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfif not structIsEmpty(caller[theVar])&gt;</FONT><br>
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Valid keys are: #structKeyList(caller[theVar])#<br>
            &nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfelse&gt;</FONT><br>
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#theVar# is an empty struct.<br>
           &nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
        <FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT></div>

All this does is check the message (I should check the exception type instead most likely), find the variable name, see if it exists, and then checks if it is a struct. It then either shows you the keys or tells you that it is empty. Enjoy.

FYI - the tabbing got a bit messed up above. Ignore my poor choice of pasting.