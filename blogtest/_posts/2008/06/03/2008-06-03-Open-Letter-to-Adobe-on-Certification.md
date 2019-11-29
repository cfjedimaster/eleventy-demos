---
layout: post
title: "Open Letter to Adobe on Certification"
date: "2008-06-03T16:06:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2008/06/03/Open-Letter-to-Adobe-on-Certification
guid: 2857
---

Please forgive me but the following will be a bit long and lot 'rambly' so take this as you cue to stop reading now. I just took the ColdFusion 8 Certification exam and I have some thoughts I want to share. I also have something I want to share about the Dreamweaver certification as well. Before I get into this though, let me be clear. This blog entry is <b>not</b> meant to be on the relative merits of certifications in general. That's a whole other blog post, and frankly, you won't get much agreement in the community. My personal take is that I don't think a certification stands for much. It does show you can memorize well (which I tend to stink at), but it doesn't show how well you attack problems. I wouldn't ask a developer to rattle off the arguments to CFFILE. Instead, I'd tell the developer: "Imagine we have a cfpoo tag. You know it does X but can't remember the syntax. What do you do?" For me the answer is that I've got the CFML Reference PDF in my Finder so I can launch it whenever I need it - and trust me - I use this PDF all day long. I think only recently have I truly memorized the order of the Find() args, and Find() is - what - 8 years old? So yes, I suck at memorization.
<!--more-->
On the flip side - if someone asks me if they should get certified, I generally recommend it if they are looking for a job. While I don't put much stock in certifications, other people do. And if a simple, 1 hour test for a hundred bucks or so (I have no idea) can help you land the job, then it's worth the time. If it puts you above some else's resume in a pile, then it's worth it. But if you've got a job and have no plans on leaving it, I wouldn't bother. 

So I ask people - please - let's not discuss if certifications make sense. I really want to focus this specifically on the ColdFusion and Dreamweaver certifications and Adobe. Wow, that's a lot of writing for just a disclaimer, but I did warn you.

Let me give a bit of history on my relationship with the ColdFusion certification. I had experience working on the cert back in the CFMX time frame I believe. I wrote a few questions. I forget which company handled the process, all I remember is that they had a horrible web site. I've taken the certification a few times. I believe I took it for 5 and MX7 only though. (For the MX test I believe I got an automatic certification.)

Last year I was approached by a company (I'm not going to name them so don't ask) to help work on the CF8 certification. I wrote a few sample questions but they were not acceptable to the company. The reasons for this are not really relevant I think, and I place the blame more on me then them. I think I write ok - I've got about 12 books under my belt and way too many blog entries. But I find that when I have to write in a particular style or to a form - I find it <b>extremely</b> difficult. In this case, the philosophy behind some of the rules the company had were not something I agreed with, and we both agreed to part ways. I think they used maybe 4 of my questions or so.

Fast forward a few months and the company approached me again, this time with an offer to review. I <b>love</b> to review. I mean, I <b>really, really</b> love to do technical reviews. Its an open license to go ape-crap on a document and live out my anal-retentive fantasies to the max. I recommended two other folks (again, not naming names, will let them announce themselves if they want) and we all did an independent review.  

What we found was pretty scary. Numerous questions were poorly written, wrong, or had multiple right answers. In a long phone session (late at night thank you very much) we hashed out the problems we found. Personally I was concerned that the company would not take all our criticisms seriously. I contacted Adobe about this as well. I felt that the certification needed some drastic oversight and additional review before it was made public.

Today I had the opportunity to take the certification. First - my score: 92%. I was a bit surprised by this. I thought I had done worse actually. I was surprised to find that - as far as I could tell - none of the recommendations myself and the other two testers had found were made. I probably commented on 15-20 of the 64 questions I took. Some comments were very simple - typos. Others were more serious.

As an example, numerous questions would say, "You do X and something goes wrong." Well shoot, what went wrong? The actual error has a big impact on what the problem is. If a coworker came to me and said that I'd give them a puzzled look and ask them if they knew what the actual error was. A related version of this were questions that said "You did X and it didn't work." Well, "not working" can mean so many things. Do you mean that an exception was thrown or that an unexpected result was returned?

Along with questions that were overly vague, I also saw questions with multiple right answers. In most cases I was able to guess, but I know that some of my missed questions on the test were due to this unnecessary confusion. To be fair - it's hard to write test questions. Shoot, I gave up! You can't use answers that are so crazy that the question becomes too simple. At the same time, if a question can lead multiple people to think there are multiple right answers, then a test taker <b>should not have to spend time figuring out what the tester maker wants</b>. It's not a "Can you read my mind" test but a "Do I know ColdFusion" test.

On a picky note - I was a bit surprised to see Application.cfm referenced. The test does make use of Application.cfc, and I do think developers should know about the existence of Application.cfm, but all focus should be to App.cfc I think. (This point I think I may get some push back on from my readers, and on reflection, I'm not even sure how strongly I feel about it, but I thought I'd put it out there.)

I was also a bit worried that the test wouldn't have any ColdFusion 8. I think I got to about a third of the way through before I saw something specific to ColdFusion 8, but after there was a good mix of CF8 stuff. To be fair, ColdFusion has a large number of functions and features and there is no way every question could refer to just version 8.

So let me summarize this before moving on to Dreamweaver. All in all, I think the test needs a lot of work. I do not think it should be taken in it's current state. It is <b>not</b> quite as bad as I remember it from the review, but I cannot recommend someone pay for this test unless they <b>have</b> to for a good job. I can stand on my high horse all day and say what I want, but don't be stupid. If you need the certification to pass, then take it. But outside of that, I'm suggesting folks avoid the test. This is my personal opinion obviously and I welcome opinions to the contrary, and as the subject says, Adobe, please, tell me I'm wrong.

So - the above is nothing terribly urgent. Not the end of the world for sure. ColdFusion isn't going to die because of it. However the following does concern me and frankly, disappoints me. 

On another listserv I belong to, there has been a lot of discussion about the Dreamweaver certification. As I don't use Dreamweaver, I only paid it half-mind, but I wasn't surprised to see people complaining about it. I would assume the same people responsible for the CF cert also handle the DW cert, but I could be wrong. What did get my attention though was the concern amongst instructors. Apparently they have to pass the certification in order to keep teaching. 

For them - a poorly written certification isn't an academic concern but a matter of their livelihood. Recently Dee Sadler shared some "good" news. Adobe had recognized that the certification was flawed, and since they didn't have time to address it, they were letting instructors off the hook. This is great. But then something caught my eye. Adobe went on to say that if an instructor wanted to be product certified, they still needed to take the test.

So.... consider that statement. 

Adobe recognizes the test is flawed (good) and recognizes they don't have time to fix it (understandable) and will allow instructors to skip it (great), but <b>they will continue to allow people to pay for and take the certification that they themselves admit is flawed and not appropriate for their instructors.</b> 

This boggled my mind. You can't say a test is flawed so much that it can (perhaps should) be avoided and still allow the test to be taken. These tests cost money. Maybe not a lot, but they do cost money. To keep these tests on the market is wrong. I understand that Adobe is a <b>very</b> large company and large companies move slowly, but I'm surprised that no more action has been taken. (That I know of, but that's part of the reason I'm blogging all of this - to help spur action.) 

So - there we have it. I welcome one and all to come in and argue with these points. My goal here isn't to attack Adobe. That would be dumb considering how much I love their products. But I do feel that something is seriously flawed and that they need to step up and fix the issue.