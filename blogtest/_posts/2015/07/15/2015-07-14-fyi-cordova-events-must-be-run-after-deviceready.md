---
layout: post
title: "FYI - Cordova events must be run after deviceReady"
date: "2015-07-15T08:53:36+06:00"
categories: [development,javascript,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/07/15/fyi-cordova-events-must-be-run-after-deviceready
guid: 6395
---

In all of my work on various Cordova projects, I've only rarely needed to make use of the various <a href="http://cordova.apache.org/docs/en/5.1.1/cordova_events_events.md.html">events</a> supported by the platform. Last night I needed to add some code to handle the <a href="http://cordova.apache.org/docs/en/5.1.1/cordova_events_events.md.html#backbutton">back button</a>. The docs clearly tell you to register your handler <i>after</i> deviceReady has fired:

<!--more-->

<blockquote>
To override the default back-button behavior, register an event listener for the backbutton event, typically by calling document.addEventListener once you receive the deviceready event.
</blockquote>

But obviously I know better. I mean - it's an event, right? So it shouldn't matter when we add the <i>listener</i>. Sure, if the user hits the back button before deviceReady fires, I assume my handler won't run, but it should be safe to <strong><u>register</u></strong> it whenever, right?

Nope.

After bringing this up in the Slack channel, @devgeeks pointed out this little <a href="https://github.com/apache/cordova-js/blob/796a18d425a03101a1a931c54cd8ea002230067c/src/cordova.js#L32">snippet</a> from the Cordova JavaScript library:

<pre><code class="language-javascript">/**
 * Intercept calls to addEventListener + removeEventListener and handle deviceready,
 * resume, and pause events.
 */
var m_document_addEventListener = document.addEventListener;
var m_document_removeEventListener = document.removeEventListener;
var m_window_addEventListener = window.addEventListener;
var m_window_removeEventListener = window.removeEventListener;</code></pre>

Essentially, Cordova modifies the default event listener in your web view so it can actually handle some of those special events. So, I guess the point of this post is - yes - it really does matter where you add your event handlers in regards to the events Cordova gives you access to!