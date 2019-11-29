---
layout: post
title: "Some thoughts on presenting"
date: "2011-06-23T14:06:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2011/06/23/Some-thoughts-on-presenting
guid: 4279
---

This morning while walking (I love how the mind flows with ideas when exercising) I began to think about presenting and what advice I'd offer to folks who are considering giving it a try. There are plenty of books out there on how best to give presentations. I won't pretend to be an expert in the subject myself. But I've given quite a few of them and there are a few things I think I can share that might be useful. Also - many books on presenting don't tend to cover the specific needs of <i>technical</i> presenters - i.e. people who are talking about code related topics. So with that focus in mind, here are some ideas. As always, feel free to add your own. I'm curious to see what other suggestions folks have. One more quick note before I begin - most of this advice comes from mistakes I've made - and continue to make. I enjoy presenting. I think I'm good at it. But I'm going to looking to improve myself until the day I retire.
<!--more-->
<h2>Getting Started</h2>

If you have any interest at all in speaking, it can be a bit intimidating to get started. Fear of public speaking can be incredible. The only way to get over it though is practice. There's plenty of ways you can get practice in a safe, less stressful environment though. Consider giving a presentation to your coworkers. That may be a group of 5 or so people and it's people you know. That's going to be much less stressful than 20-30 strangers. Forget about the traditional "60 minutes" of slides format and consider just a quick 5 minute topic. This could be a review of what you learned at the last conference. It could be just a demo of a cool plugin you found over the weekend. Just the act of getting up in front of people and speaking - even with minimal structure - will help make you more comfortable.

Outside of work your local user groups are another excellent place to speak. Most user groups are <i>desperate</i> for speakers. If you are already attending the group then you will - most likely - know everyone there. You can also suggest a short topic there as well. Most groups will have meetings planned around a central topic, but you could offer to give a short talk either before or after the main session. (And it bears repeating - if you don't know where your local Adobe User Group is, simply visit <a href="http://groups.adobe.com">groups.adobe.com</a> today and find one!)

The biggest advice I can give in regards to fear is to remember that people attend user groups and conferences because they want to learn. For the most part then it is safe to assume you have an audience of people who are friendly. (For the most part. I'll talk a bit more about audiences later on.)

It's important to find a topic you are actually interested in. Most of the time that isn't a problem. There are times when your boss may ask you to speak on a topic you don't quite care about, but even then, if you try, you can find a way to make it interesting. Every now and then I suggest a topic that - later on - I frankly wonder what in the hell I was thinking of. As an example, a few years ago I spoke about SQLite development in AIR. At the time I suggested it because I didn't know a lot about it and I thought it would be a good way to "force" myself to learn it. Turns out - the more I dug into it - the more freaking cool it seemed to me. Maybe I'm just nerdy that way, but I found a way to dig into the cool parts and make what was essentially a database topic exciting for me. While it doesn't always work out, if you are excited your audience may be as well. Enthusiasm is noticeable. 

<h2>Getting Organized</h2>

No one, and I repeat no one, is going to be able to give a good presentation without organization and planning. I still remember the first time I discovered that comedians actually write their jokes ahead of time. It makes sense now - but at the time I thought they simpler winged everything. About a year or so I had to give a presentation on ColdFusion and Solr with - I kid you not - 5 minutes preparation. I was able to - barely - and that's with me having a <i>very</i> comfortable understanding of the technology. It just proves though unless you spend the time preparing you are not going to give a good presentation. Period. If your job is asking you to present on something, then you need to insist on time to prepare. About 10 years or so I was asked by a sales guy to give a full day class on ColdFusion. When I insisted I'd need 2-3 days to prepare the outline, materials, etc, he got pretty upset. He assumed that since I was an expert I could just walk in and teach a room full of people. That's simply not the case. 

I typically begin with a very simple outline. Maybe just 2 or 3 basic points. I then begin to organize slides around those points. One thing to keep in mind is that this should be an iterative process. I typically modify my slides again and again - sometimes up to the time of the presentation itself. I try to think about the topic and how best to explain it. So for example, if I'm going to talk about using ColdFusion, I may begin with describing what it is and why you would use it. I'd move on to how to install it. I'd then move into actual examples. What's important though is the flow. I'm not going to begin with ColdSpring for example. I'm a big fan of starting as simple as possible and then building gradually up from that. Not just for 'intro' topics but <i>any</i> topic. This has the additional benefit of allowing you to end your session with tips on how to go "higher" in whatever process you were speaking on.

Practice is important - but personally I'm not a fan of doing a run through in front of a mirror. And while my wife loves me - I'm not going to put her through the hell of hearing me talk about code. I know some folks swear by it. Above I mentioned the idea of giving a presentation to your company. It's also a good way to practice a presentation that you may be giving elsewhere. What works for me is simply going through the presentation in my head. I sit there with my Powerpoint and mentally go over what I'm covering on each slide and what code I'll be showing for examples. I'll do this probably 10-20 times and make edits and updates as I feel things need clarification, trimming, etc. 

<h2>It's the content stupid</h2>

I'm going to out on a limb here and say - especially for technical presentations - I don't give a damn about your slide design. I know some books make a big deal out of this. I know that I've seen some incredibly cool looking slides before. But at the end of the day, it just doesn't matter. If you are new to presenting, it can also be a distractor. Pick one theme in Powerpoint or Keynote and just be done with it. The content of your slides is going to be critical. Try to keep your slides to 2-3 bullet points each. Your slide is not a script. You should not be reading from the slides but using it as a guide to what you will be talking about while the slide is on screen. The text there reinforces what you are saying. It doesn't repeat what you are saying. 

Do not put code on your slides. Now there are certainly exceptions to this. The presentation I'm giving today has two slides with code on it - mainly though as an illustration. But unless you use a real small font then you're not going to get much code on the slide. I do think a generic example is fine. So for example, I'm talking about parsing RSS feeds in ColdFusion, I may include: &lt;cffeed source=".." name=".."&gt; 

Speaking of code, before your talk, go into your editor and increase the font. It's not big enough. Trust me. And if you are an Eclipse user, have fun with that. As much respect as I have for the Eclipse platform, it sometimes has the UX of a double left handed monkey. You also want to remember the size of your output. I make this mistake a lot. I'll run something in the browser and forget that the default font size is too small. You can zoom in with most modern browsers, but be ready to do if need be. If you're doing some fancy layout try to ensure it doesn't break when you zoom the browser.

<h2>Assume the Worst</h2>

Your laptop is going to break. Windows/OSX is going to blue/gray screen. Your internet connection will not work. Period. Be ready for it. For technical presentations remember that your audience is used to this already. We all know how darn unreliable our technology is. But be ready. In terms of an internet connection, never assume you will have one. If your session requires it, try to find a way around it. So for example, if I were giving a presentation on web services, I'd try to host my examples locally. It doesn't make sense for local code to call other code locally via SOAP, but in terms of a presentation it makes perfect sense. (And makes it easier for people to test your code later on!) 

In terms of your machine crashing, there isn't much you can do about that. I try to minimize the amount of startup services so that a restart isn't a 10 minute affair, so you can consider trimming the fat there. Try your best not to get flustered. If you are midway through your discussion, it's a good time to go into Q and A while your system is starting up. 

Keep a backup of your code and slides. There are too many services to list, but I make use of <a href="https://www.dropbox.com/referrals/NTg4MTg1OQ?src=global">Dropbox</a> (affiliate link) and ensure both my code and slides are available there. That way if I need to go to completely different machine I have that option. (And yes - I've had to go that route.)

<h2>Public Speaking is... Speaking</h2>

Ok, this is probably obvious, but don't forget you will actually be speaking. Get water. Period. Your mouth will dry out. Do not get coffee or soda or - lord forbid - beer. Go slow. I've mentioned my stutter before - and while it isn't much of an issue when I speak - I do consciously slow myself down to make it less of an issue. This is especially important if you have an accent. (And don't forget - to yourself you'll never have an accent. To everyone else outside of your immediate area - you probably do.) For every foreign speaker I've had to struggle through listening a simple slow down of their pace would have helped tremendously. Watch out for words like "um". We all use words like that when nervous but try to avoid saying it every other sentence.

<h2>The Audience is your friend - your slightly crazy unpredictable friend</h2>

I mentioned earlier that - for the most part - your audience is going to be friendly. They are there to learn. They are there to listen. That being said, the audience isn't always going to very polite. I remember my very first presentation. I noticed people in the back of the room get up and leave. I was shocked. Leaving a presentation? <i>My</i> presentation? I now know that's not a big deal. Keep in mind that sometimes session descriptions don't do a great job of conveying what is being covered. If a person discovers the topic isn't what they need, do not be offended. It happens to all of us. I do it myself. The important thing is not being flustered by it.

Talking can also be an issue. Luckily most of us are mature adults. We don't hold a loud conversation while a speaker is talking. But it happens. Most of the time I try to ignore it, but if it becomes a problem, and if I see people around the troublemakers looking upset, I'll stop and ask the people speaking to please take it outside if they can. 

There's another thing about audiences I've learned as well - they change. That shouldn't be too surprising, but I've given the same presentation one day after another and gotten a completely different reaction. It can be a bit unnerving. Sometimes they don't click. Sometimes you don't click. Look at it like any other relationship. While it may be generally friendly, theres going to be arguments. 

<h2>Last Tips</h2>

Not to be indelicate but... go to the bathroom before your talk. Every time. Pretend like you're talking to your child and whether you have to go or not... go.

Don't type. You will typo. Period. If you are going to write code, keep it short and sweet, not more than one line. Your code should already be done before hand, so at most, use cut and paste to drop in snippets. What I prefer though is an iterative approach, where I'll from from test1.cfm to test10.cfm and add a few lines at a time.

This one bugs me. Don't stop and start your slideshow as you go from slide to code to browser. Keynote used to be bad about that - basically blocking you from alt-tabbing while a presentation was going on. It's the main reason I export to PDF now. You miss transitions, but 99% of transitions are distractors anyway. Practices quickly going from slide to editor to browser. If it isn't fluid, fix it. Presentations in PDF, or HTML, are also more shareable to the public and can more easily be viewed online. 

When someone asks you a question, repeat it. This serves two purposes. One - it's pretty difficult to hear people across a room without a mic. Second - it gives you a chance to mentally prepare your answer. I also rephrase the question sometimes just to make sure I really get what they are asking. And by the way - it's ok to say "I don't know." No one knows everything. If you can't answer the question, offer to take a note of it and come back to the person later. 

Shut down Twitter, IM, and basically <i>any</i> program or tab not related to your discussion. Even something as innocent as iTunes. Any program or distraction is going to - well - distract you. At worst it will embarrass you.