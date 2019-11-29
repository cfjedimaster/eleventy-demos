---
layout: post
title: "ColdFusion Contest Entry Examined - Part 3"
date: "2005-10-07T10:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/07/ColdFusion-Contest-Entry-Examined-Part-3
guid: 835
---

Welcome to the third entry in the <a href="http://ray.camdenfamily.com/index.cfm/2005/9/20/Contest-Shall-We-Play-a-Game">ColdFusion contest</a> that I'm running. For those who are wondering, there were seven entries, and my goal is to wrap this up by next Friday, otherwise I won't be able to name a winner till after MAX. If you haven't looked at the previous entries, here are the links: <a href="http://ray.camdenfamily.com/index.cfm/2005/10/4/ColdFusion-Contest-Entry-Examined">Entry 1</a>, <a href="http://ray.camdenfamily.com/index.cfm/2005/10/5/ColdFusion-Contest-Entry-Examind--Part-2">Entry 2</a>.
<!--more-->
The third entry may be viewed <a href="http://ray.camdenfamily.com/demos/contest1/entry3/HiLo.cfm">here</a>. As before, I suggest you go play with it a bit before reading the rest of the entry. The code for the entry is listed below:

<code>
&lt;cfsetting enablecfoutputonly="Yes" /&gt;
&lt;!---
HiLo
We likes games...

To do:
1) Handle creative users (guessing number outside of new hi-lo range, guessing same number twice, etc.)
2) Tighten up code to conform to xhtml transitional and css standards.
3) More appealing display.
4) Mask goal value when saved in URL.
5) etc.
---&gt;

&lt;cfset temp="#StructInsert(Request,'s_CurrentTemplateFile',GetFileFromPath(GetCurrentTemplatePath()),True)#" /&gt;

&lt;cfset temp="#StructInsert(Request,'i_GoalMin',1,True)#" /&gt;
&lt;cfset temp="#StructInsert(Request,'i_GoalMax',100,True)#" /&gt;

&lt;cfparam name="URL.i_Goal"
         default="" /&gt;
&lt;cfparam name="Form.i_Goal"
         default="#URL.i_Goal#" /&gt;
&lt;cfset temp="#StructInsert(Request,'i_Goal',Form.i_Goal,True)#" /&gt;
&lt;cfset temp="#StructInsert(Request,'i_GoalFormValue',Request.i_Goal,True)#" /&gt;

&lt;cfparam name="URL.lsti_GuessHistory"
         default="" /&gt;
&lt;cfparam name="Form.lsti_GuessHistory"
         default="#URL.lsti_GuessHistory#" /&gt;
&lt;cfset temp="#StructInsert(Request,'lsti_GuessHistory',Form.lsti_GuessHistory,True)#" /&gt;


&lt;cfparam name="URL.i_GuessLast"
         default="" /&gt;
&lt;cfparam name="Form.i_GuessLast"
         default="#URL.i_GuessLast#" /&gt;
&lt;cfset temp = "#StructInsert(Request,'i_GuessLast',Form.i_GuessLast,True)#" /&gt;
        
&lt;cfset temp = "#StructInsert(Request,'s_GoalDisplay','???',True)#" /&gt;


&lt;cfset temp = "#StructInsert(Request,'str_Comp',StructNew(),True)#" /&gt;
&lt;cfset temp = "#StructInsert(Request.str_Comp,'lsti_GuessHistory','',True)#" /&gt;
&lt;cfset temp = "#StructInsert(Request.str_Comp,'lsti_GuessHistorySorted','',True)#" /&gt;
&lt;cfset temp = "#StructInsert(Request.str_Comp,'i_GuessCount',0,True)#" /&gt;
&lt;cfset temp = "#StructInsert(Request.str_Comp,'idx_Hi',0,True)#" /&gt;
&lt;cfset temp = "#StructInsert(Request.str_Comp,'idx_Lo',1,True)#" /&gt;
&lt;cfset temp = "#StructInsert(Request.str_Comp,'s_GoalDisplay','???',True)#" /&gt;


&lt;cfswitch expression="#Len(Request.i_Goal)#"&gt;
   &lt;cfcase value="0"&gt;
   
      &lt;cfset temp = "#StructInsert(Request,'s_HTMLTitle','New Game',True)#" /&gt;
   
      &lt;cfset temp = "#Randomize(DayOfYear(Now()) + Hour(Now()) + Minute(Now()) + Second(Now()))#" /&gt;
      &lt;cfset temp = "#StructInsert(Request,'i_Goal',RandRange(Val(Request.i_GoalMin),Val(Request.i_GoalMax)),True)#" /&gt;
      &lt;cfset temp = "#StructInsert(Request,'i_GoalFormValue',Request.i_Goal,True)#" /&gt;
      
      &lt;cfset temp = "#StructInsert(Request,'s_Message','Starting a new game.  Enter a number below to begin.',True)#" /&gt;
      &lt;cfset temp = "#StructInsert(Request,'s_FormLegend','Let#Chr(39)#s get started...',True)#" /&gt;
      &lt;cfset temp = "#StructInsert(Request,'s_FormPrompt','Enter your first guess:',True)#" /&gt;
      &lt;cfset temp = "#StructInsert(Request,'s_FormButton','Click here to submit',True)#" /&gt;
      &lt;cfset temp = "#StructInsert(Request,'lsti_GuessHistory','',True)#" /&gt;
         
   &lt;/cfcase&gt;
   &lt;cfdefaultcase&gt;

      &lt;cfswitch expression="#((IsNumeric(Request.i_GuessLast)) AND
                              (Request.i_GuessLast GE Request.i_GoalMin) AND 
                              (Request.i_GuessLast LE Request.i_GoalMax))#"&gt;
         &lt;cfcase value="True"&gt;

            &lt;cfset temp = "#StructInsert(Request,'lsti_GuessHistory',ListAppend(Request.lsti_GuessHistory,Request.i_GuessLast,','),True)#" /&gt;         
         
            &lt;cfswitch expression="#CompareNoCase(Request.i_GuessLast,Request.i_Goal)#"&gt;
               &lt;cfcase value="0"&gt;

                  &lt;cfset temp = "#StructInsert(Request,'s_HTMLTitle','You win!',True)#" /&gt;
                  &lt;cfset temp = "#StructUpdate(Request,'s_GoalDisplay',Request.i_Goal)#" /&gt;
                  
                  &lt;cfset temp = "#StructInsert(Request,'i_GoalFormValue','',True)#" /&gt;

                  &lt;cfset temp = "#StructInsert(Request,'s_Message','Congratulations! Your guess of #Val(Request.i_GuessLast)# was correct!',True)#" /&gt;
                  &lt;cfset temp = "#StructInsert(Request,'s_FormLegend','Start a new game?',True)#" /&gt;
                  &lt;cfset temp = "#StructInsert(Request,'s_FormPrompt','',True)#" /&gt;

                  
                  &lt;cfset temp = "#StructInsert(Request.str_Comp,'i_GuessHi',Request.i_GoalMax,True)#" /&gt;
                  &lt;cfset temp = "#StructInsert(Request.str_Comp,'i_GuessLo',Request.i_GoalMin,True)#" /&gt;
                  
                  &lt;cfset temp = "#StructInsert(Request.str_Comp,'i_GuessLast',Val((Request.str_Comp.i_GuessLo + Request.str_Comp.i_GuessHi + RandRange(0,1))\2),True)#" /&gt;

                  &lt;cfloop condition="(Request.str_Comp.i_GuessLast NEQ Request.i_Goal)"&gt;
                     &lt;cfset temp  ="#StructUpdate(Request.str_Comp,'lsti_GuessHistory',ListAppend(Request.str_Comp.lsti_GuessHistory,Request.str_Comp.i_GuessLast,','))#" /&gt;

                     &lt;cfswitch expression="#(Request.str_Comp.i_GuessLast GT Request.i_Goal)#"&gt;
                        &lt;cfcase value="True"&gt;
                           &lt;cfset temp = "#StructUpdate(Request.str_Comp,'i_GuessHi',Request.str_Comp.i_GuessLast - 1)#" /&gt;
                        &lt;/cfcase&gt;
                        &lt;cfdefaultcase&gt;

                           &lt;cfswitch expression="#(Request.str_Comp.i_GuessLast LT Request.i_Goal)#"&gt;
                              &lt;cfcase value="True"&gt;
                                 &lt;cfset temp = "#StructUpdate(Request.str_Comp,'i_GuessLo',Request.str_Comp.i_GuessLast + 1)#" /&gt;
                              &lt;/cfcase&gt;
                           &lt;/cfswitch&gt;

                        &lt;/cfdefaultcase&gt;
                     &lt;/cfswitch&gt;
                     
                     &lt;cfset temp = "#StructInsert(Request.str_Comp,'i_GuessLast',Val((Request.str_Comp.i_GuessLo + Request.str_Comp.i_GuessHi + RandRange(0,1))\2),True)#" /&gt;

                     &lt;cfswitch expression="#(ListFindNoCase(Request.str_Comp.lsti_GuessHistory,Request.str_Comp.i_GuessLast,','))#"&gt;
                        &lt;cfcase value="True"&gt;
                        
                           &lt;cfswitch expression="#(Request.str_Comp.i_GuessLast LT Request.str_Comp.i_GuessHi)#"&gt;
                              &lt;cfcase value="True"&gt;                         
                                 &lt;cfset temp = "#StructInsert(Request.str_Comp,'i_GuessLast',Val(Request.str_Comp.i_GuessLast + 1),True)#" /&gt;
                              &lt;/cfcase&gt;
                              &lt;cfdefaultcase&gt;
                                 &lt;cfset temp = "#StructInsert(Request.str_Comp,'i_GuessLast',Val(Request.str_Comp.i_GuessLast - 1),True)#" /&gt;
                              &lt;/cfdefaultcase&gt;
                           &lt;/cfswitch&gt;
                     
                        &lt;/cfcase&gt;
                     &lt;/cfswitch&gt;
                     
                  &lt;/cfloop&gt;
        
                  &lt;cfset temp = "#StructInsert(Request.str_Comp,'lsti_GuessHistorySorted',
ListSort(Request.str_Comp.lsti_GuessHistory,'Numeric','Desc',','),True)#" /&gt;
                  &lt;cfset temp = "#StructInsert(Request.str_Comp,'i_GuessCount',ListLen(Request.str_Comp.lsti_GuessHistory,','),True)#" /&gt;


                  &lt;cfset temp = "#StructInsert(Request.str_Comp,'idx_Hi',ListFindNoCase(Request.str_Comp.lsti_GuessHistorySorted,Request.str_Comp.i_GuessHi + 1,','),True)#" /&gt;
                  &lt;cfset temp = "#StructInsert(Request.str_Comp,'idx_Lo',Request.str_Comp.idx_Hi + 1,True)#" /&gt;

                  
               &lt;/cfcase&gt;
               &lt;cfdefaultcase&gt;
               
                  &lt;cfset temp = "#StructInsert(Request,'s_HTMLTitle','Guess Again',True)#" /&gt;
                     
                  &lt;cfset temp = "#StructInsert(Request,'s_Message','You are almost there...',True)#" /&gt;
                  &lt;cfset temp = "#StructInsert(Request,'s_FormLegend','Guess Again',True)#" /&gt;
                  &lt;cfset temp = "#StructInsert(Request,'s_FormPrompt','Enter your next guess:',True)#" /&gt;
               &lt;/cfdefaultcase&gt;
            &lt;/cfswitch&gt;

         &lt;/cfcase&gt;
         &lt;cfdefaultcase&gt;

            &lt;cfset temp = "#StructInsert(Request,'s_HTMLTitle','Oops',True)#" /&gt;
               
            &lt;cfset temp = "#StructInsert(Request,'s_Message','Resuming from saved game or you entered an invalid number.  Please enter a number between #Val(Request.i_GoalMin)# and #Val(Request.i_GoalMax)# to continue.',True)#" /&gt;
            &lt;cfset temp = "#StructInsert(Request,'s_FormLegend','Try again',True)#" /&gt;
            &lt;cfset temp = "#StructInsert(Request,'s_FormPrompt','Enter your next guess:',True)#" /&gt;

         &lt;/cfdefaultcase&gt;
      &lt;/cfswitch&gt;

   &lt;/cfdefaultcase&gt;
&lt;/cfswitch&gt;

&lt;cfset temp="#StructInsert(Request,'lsti_GuessHistorySorted',ListSort(Request.lsti_GuessHistory,'Numeric','Desc',','),True)#" /&gt;

&lt;cfset temp="#StructInsert(Request,'i_GuessCount',ListLen(Request.lsti_GuessHistorySorted,','),True)#" /&gt;

&lt;cfset temp="#StructInsert(Request,'idx_Hi',Request.i_GuessCount,True)#" /&gt;
&lt;cfset temp="#StructInsert(Request,'idx_Lo',Request.idx_Hi+1,True)#" /&gt;

         
&lt;cfloop index="Request.idx" from="1" to="#Request.i_GuessCount#"&gt;

   &lt;cfswitch expression="#(ListGetAt(Request.lsti_GuessHistorySorted,Request.idx,',') EQ Request.i_Goal)#"&gt;
      &lt;cfcase value="True"&gt;
         &lt;cfset temp="#StructUpdate(Request,'idx_Hi',Request.idx - 1)#" /&gt;      
         &lt;cfset temp="#StructUpdate(Request,'idx_Lo',Request.idx + 1)#" /&gt;
         
         &lt;cfbreak /&gt;
         
      &lt;/cfcase&gt;
      &lt;cfdefaultcase&gt;
      
         &lt;cfswitch expression="#(ListGetAt(Request.lsti_GuessHistorySorted,Request.idx,',') LT Request.i_Goal)#"&gt;
            &lt;cfcase value="True"&gt;
               &lt;cfset temp="#StructUpdate(Request,'idx_Hi',Request.idx - 1)#" /&gt;      
               &lt;cfset temp="#StructUpdate(Request,'idx_Lo',Request.idx)#" /&gt;
      
               &lt;cfbreak /&gt;
               
            &lt;/cfcase&gt;
         &lt;/cfswitch&gt;
         
      &lt;/cfdefaultcase&gt;
   &lt;/cfswitch&gt;
   
&lt;/cfloop&gt;

&lt;cfsetting enablecfoutputonly="No" /&gt;

&lt;html&gt;
   &lt;head&gt;
      &lt;cfoutput&gt;
         &lt;title&gt;Hi-Lo's Helper: #Request.s_HTMLTitle#&lt;/title&gt;
      &lt;/cfoutput&gt;
      &lt;basefont face="Trebuchet MS" color="Navy" /&gt;
      &lt;style&gt;
body {
   font-family: "Trebuchet MS";
   color: Black;
}
h1 {
   color: Navy;
   font-size: 140%;
   text-align: center;
   margin: 0 0 0 0;
}
p.Hi {
   text-align:right;
   color:Navy;
   font-size:300%;
}
p.Lo {
   text-align:left;
   color:Navy;
   font-size:300%;
}
small {
   font-size:84%;
}
      &lt;/style&gt;

   &lt;/head&gt;
   &lt;body onload="document.forms[0].i_GuessLast.focus()"&gt;

      &lt;cfoutput&gt;

         &lt;table border="0" 
                cellpadding="2" 
                cellspacing="0" 
                width="600"&gt;
            &lt;tr&gt;
               &lt;td colspan="9" valign="middle"&gt;
                  &lt;h1 align="center"&gt;&lt;sup&gt;Hi&lt;/sup&gt;-&lt;sub&gt;Lo&lt;/sub&gt;&lt;small&gt;'s Helper&lt;/small&gt;&lt;/h1&gt;
               &lt;/td&gt;
            &lt;/tr&gt;
         &lt;/table&gt;
         &lt;table border="0" cellpadding="2" cellspacing="0" width="600"&gt;
            &lt;tr&gt;
               &lt;td colspan="3"
                   width="30%"
                   valign="bottom"
                   bgcolor="silver"&gt;
                  &lt;p align="center"&gt;&lt;strong&gt;YOU&lt;/strong&gt;&lt;/p&gt;
               &lt;/td&gt;
               &lt;td rowspan="5" 
                   width="4" 
                   bgcolor="silver"&gt;
                  &lt;p&gt;&nbsp;&lt;/p&gt;
               &lt;/td&gt;
               &lt;td&gt;
                  &lt;p&gt;&nbsp;&lt;/p&gt;
               &lt;/td&gt;
               &lt;td rowspan="5" 
                   width="4" 
                   bgcolor="silver"&gt;
                  &lt;p&gt;&nbsp;&lt;/p&gt;
               &lt;/td&gt;
               &lt;td colspan="3"
                   width="30%"
                   valign="bottom"
                   bgcolor="silver"&gt;
                  &lt;p align="center"&gt;&lt;strong&gt;COMPUTER&lt;/strong&gt;&lt;/p&gt;
               &lt;/td&gt;
            &lt;/tr&gt;
            &lt;tr&gt;
               &lt;td valign="bottom"&gt;
                  &lt;p class="Hi"&gt;Hi&lt;/p&gt;
               &lt;/td&gt;
               &lt;td valign="bottom"&gt;
                  &lt;p align="center" style="text-align:center;font-size: 140%;"&gt;&lt;span style="color:Silver;"&gt;#Request.i_GoalMax#&lt;/span&gt;&lt;br /&gt;
                     &lt;strong&gt;
                     &lt;cfloop index="Request.idx" 
                             from="1" 
                             to="#Request.idx_Hi#"&gt;
                        &lt;br /&gt;#ListGetAt(Request.lsti_GuessHistorySorted,Request.idx,',')#
                     &lt;/cfloop&gt;
                  &lt;/strong&gt;&lt;/p&gt;
               &lt;/td&gt;
               &lt;td&gt;
                  &lt;p&gt;&nbsp;&lt;/p&gt;
               &lt;/td&gt;
               &lt;td rowspan="3" 
                   valign="top"&gt;
                  &lt;p&gt;#HTMLEditFormat(Request.s_Message)#&lt;/p&gt;
                  &lt;form method="post" 
                        action="#Request.s_CurrentTemplateFile#"&gt;
                     &lt;fieldset&gt;
                        &lt;legend&gt;#HTMLEditFormat(Request.s_FormLegend)#&lt;/legend&gt;
                        &lt;p align="center"&gt;#HTMLEditFormat(Request.s_FormPrompt)# &lt;input type="text" name="i_GuessLast" value="" size="3" maxlength="3" /&gt;&lt;br /&gt;
                        &lt;input type="submit" name="btn_Guess" value="Click here to submit" /&gt;&lt;input type="hidden" name="i_Goal" value="#Request.i_GoalFormValue#" /&gt;&lt;input type="hidden" name="lsti_GuessHistory" value="#Request.lsti_GuessHistorySorted#" /&gt;&lt;/p&gt;
                     &lt;/fieldset&gt;
                  &lt;/form&gt;
               &lt;/td&gt;
               &lt;td valign="bottom"&gt;
                  &lt;p class="Hi"&gt;Hi&lt;/p&gt;
               &lt;/td&gt;
               &lt;td valign="bottom"&gt;
                  &lt;p align="center" 
                     style="text-align:center;font-size: 140%;"&gt;&lt;span style="color:Silver;"&gt;#Request.i_GoalMax#&lt;/span&gt;&lt;br /&gt;
                     &lt;strong&gt;
                     &lt;cfloop index="Request.idx" from="1" to="#Request.str_Comp.idx_Hi#"&gt;
                        &lt;br /&gt;#ListGetAt(Request.str_Comp.lsti_GuessHistorySorted,Request.idx,',')#
                     &lt;/cfloop&gt;
                  &lt;/strong&gt;&lt;/p&gt;
               &lt;/td&gt;
               &lt;td&gt;
                  &lt;p&gt;&nbsp;&lt;/p&gt;
               &lt;/td&gt;
            &lt;/tr&gt;
            &lt;tr&gt;
               &lt;td colspan="3"&gt;
                  &lt;p align="center" 
                     style="text-align:center;font-size:200%;border:outset thin silver;margin:0 0 0 0"&gt; &lt;strong&gt;#HTMLEditFormat(Request.s_GoalDisplay)#&lt;/strong&gt;&lt;/p&gt;
               &lt;/td&gt;
               &lt;td colspan="3"&gt;
                  &lt;p align="center" 
                     style="text-align:center;font-size:200%;border:outset thin silver;margin:0 0 0 0"&gt; &lt;strong&gt;#HTMLEditFormat(Request.s_GoalDisplay)#&lt;/strong&gt;&lt;/p&gt;
               &lt;/td&gt;
            &lt;/tr&gt;
            &lt;tr&gt;
               &lt;td&gt;
                  &lt;p&gt;&nbsp;&lt;/p&gt;
               &lt;/td&gt;
               &lt;td valign="top"&gt;
                  &lt;p align="center" 
                     style="text-align:center;font-size: 140%;"&gt;&lt;strong&gt;
                     &lt;cfloop index="Request.idx"
                             from="#Request.idx_Lo#"
                             to="#Request.i_GuessCount#"&gt;
                        #ListGetAt(Request.lsti_GuessHistorySorted,Request.idx,',')#&lt;br /&gt;
                     &lt;/cfloop&gt;
                  &lt;/strong&gt;&lt;br /&gt;
                  &lt;span style="color:Silver;"&gt;#Request.i_GoalMin#&lt;/span&gt;&lt;/p&gt;
               &lt;/td&gt;
               &lt;td valign="top"&gt;
                  &lt;p class="Lo"&gt;Lo&lt;/p&gt;
               &lt;/td&gt;
               &lt;td&gt;
                  &lt;p&gt;&nbsp;&lt;/p&gt;
               &lt;/td&gt;
               &lt;td valign="top"&gt;
                  &lt;p align="center" 
                     style="text-align:center;font-size: 140%;"&gt;&lt;strong&gt;
                     &lt;cfloop index="Request.idx" 
                             from="#Request.str_Comp.idx_Lo#"
                             to="#Request.str_Comp.i_GuessCount#"&gt;
                        #ListGetAt(Request.str_Comp.lsti_GuessHistorySorted,Request.idx,',')#&lt;br /&gt;
                     &lt;/cfloop&gt;
                  &lt;/strong&gt;&lt;br /&gt;
                  &lt;span style="color:Silver;"&gt;#Request.i_GoalMin#&lt;/span&gt;&lt;/p&gt;
               &lt;/td&gt;
               &lt;td valign="top"&gt;
                  &lt;p class="Lo"&gt;Lo&lt;/p&gt;
               &lt;/td&gt;
            &lt;/tr&gt;
            &lt;tr&gt;
               &lt;td colspan="3"
                   width="30%"
                   bgcolor="silver"&gt;
                  &lt;p align="center"&gt;&lt;strong&gt;&lt;small&gt;COUNT:&lt;/small&gt; #Request.i_GuessCount#&lt;/strong&gt;&lt;/p&gt;
               &lt;/td&gt;
               &lt;td&gt;
                  &lt;p title="Add this link to your Favorites to save game"&gt;&lt;small&gt;Save game as:&lt;br /&gt;
&lt;!--- line below broken up a bit to display better on blog ---&gt;
                  &lt;a href = "#Request.s_CurrentTemplateFile#?
i_goal=#Request.i_Goal#&lsti_GuessHistory=
#Request.lsti_GuessHistorySorted#"&gt;Hi-Lo -- Saved Game #DateFormat(Now(),'mmm dd')# #TimeFormat(Now(),'h.m')# #LCase(TimeFormat(Now(),'TT'))#&lt;/a&gt;&lt;/small&gt;&lt;/p&gt;
               &lt;/td&gt;
               &lt;td colspan="3"
                   width="30%"
                   bgcolor="silver"&gt;
                  &lt;p align="center"&gt;&lt;strong&gt;&lt;small&gt;COUNT:&lt;/small&gt; #Request.str_Comp.i_GuessCount#&lt;/strong&gt;&lt;/p&gt;
               &lt;/td&gt;
            &lt;/tr&gt;
         &lt;/table&gt;
         
      &lt;/cfoutput&gt;
      
   &lt;/body&gt;
&lt;/html&gt;
</code>

So, let me start with my general observations before digging into the code. While I didn't want to make this a "visual" contest, I do like the design of this one. The only thing that confused me is the "Computer" box on the right. It <i>seems</i> to reflect the computer's attempt to guess the number at the same time you do - but you only see the computer's guesses at the end. That's why I'm a bit confused. (I'm thinking the author may post a comment and clear this all up.) I think that is kind of neat as it gives you a competitor, but it is kind of odd that you only see it at the end. Either way, he made the computer "imperfect" as well, which is good game design. Another note - like the <a href="http://ray.camdenfamily.com/index.cfm/2005/10/4/ColdFusion-Contest-Entry-Examined">first entry</a>, the author reversed my original intent of making the computer guess. Again though, that's fine. (For the next contest I'll try to be more clear in the specs.) Now let's dig into the code a bit.

Like the other entries, this one doesn't do proper validation of the variables. The author does know this and notes it in the header. I hate to harp on it - but my readers know this is one of the things that I like to be anal about. I <i>always</i> bring it up because far too many public sites don't do a good job of it. 

There are two things in particular I want to point out about the code. I'm not calling these mistakes, but differences in style. This line is repeated (with variations in the values of course) throughout the template:

<code>
&lt;cfset temp="#StructInsert(Request,'s_CurrentTemplateFile',GetFileFromPath(GetCurrentTemplatePath()),True)#" /&gt;
</code>

The first thing I'd point out is that for functions that return a "throw away" value, or a value you simply don't need, as above, you can rewrite the code like so:

<code>
&lt;cfset StructInsert(Request,'s_CurrentTemplateFile',GetFileFromPath(GetCurrentTemplatePath()),True) /&gt;
</code>

This is a bit less typing, and <b>in my opinion</b>, a bit cleaner. Secondly, I've never been a fan of <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000642.htm">structInsert</a>. It isn't a bad function per se, I just don't like the extra typing. I've never heard a good reason to use it. I have heard people say they use it to insert dynamic keys into a structure, but bracket notation works fine that as well:

<code>
&lt;cfset key = "name"&gt;
&lt;cfset s = structNew()&gt;
&lt;cfset s[key] = "Jacob"&gt;
</code>

Again, this is just personal preference on my part. 

So, my last comment, and this is <i>definitely</i> in the realm of being picky - I don't care for the use of cfswitch. I find it makes it a bit hard to follow the logic flow. How do others feel? 

p.s. In general, the comments I've seen on my blog postings about this contest have been very fair and polite. I ask that people keep this in mind. These are beginners, and we <i>all</i> make mistakes. So please be gentle.