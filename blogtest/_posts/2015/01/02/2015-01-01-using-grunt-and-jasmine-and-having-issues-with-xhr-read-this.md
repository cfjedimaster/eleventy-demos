---
layout: post
title: "Using Grunt and Jasmine and having issues with XHR? Read this."
date: "2015-01-02T09:58:09+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2015/01/02/using-grunt-and-jasmine-and-having-issues-with-xhr-read-this
guid: 5510
---

I recently did some work with Grunt and Jasmine. I had a Jasmine suite of tests that were entirely Ajax based. (You can see the test for yourself <a href="https://github.com/cfjedimaster/SWAPI-Wrapper/blob/master/tests/spec/swapiSpec.js">here</a> if you want.) These tests ran just fine when using the Jasmine spec runner. This was my first time doing async-based testing with Jasmine and I was pretty impressed by how easy it was.

<!--more-->

Everything was kosher until I started trying to run the unit tests via Grunt. When I ran the suite, the same one that <i>always</i> passed, via Grunt, I consistently got an error in some, but not all, of my tests. The error was:

<code>
Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL. (1)
</code>

This seems to imply that those particular calls were taking too long to respond, but even if I modified the DEFAULT_TIMEOUT_INTERVAL value to a high value, it never passed. 

The code I'm testing made use of XHR directly (no jQuery) so I added an onerror to see if it reported anything. I noticed in all the failing calls, onerror ran immediately with a status code of 0.

After a bit of Googling I found two interesting possibilities. The first was this bug report: <a href="https://github.com/gruntjs/grunt-contrib-jasmine/issues/61">Async loading files stalls Grunt task</a>. It mentioned that by default, Jasmine is running the tests via PhantomJS and the file system. The bug report suggested passing '--local-to-remote-url-access' to allow the tests to hit remote URLs. That makes some sense, but my Jasmine suite had passing tests that were hitting the remote URL just fine. (I tried it anyway, it didn't help.)

I then discovered this StackOverflow post: <a href="http://stackoverflow.com/questions/11933044/using-phantomjs-to-make-ajax-calls-using-extjs-proxy-on-local-file">Using phantomjs to make ajax calls using extjs proxy on local file</a>. The answer there suggested this setting: --web-security=no. Using this is what eventually worked. You can see my Grunt script here: <a href="https://github.com/cfjedimaster/SWAPI-Wrapper/blob/master/Gruntfile.js">https://github.com/cfjedimaster/SWAPI-Wrapper/blob/master/Gruntfile.js</a>

Honestly, I'm still confused by this. When I tried telling Grunt/Jasmine/PhantomJS to use a web server, it didn't help. Also, my code was still able to do XHRs to the remote server just fine. It was just <i>some</i> of the calls failing. They all used the exact same utility function to do XHR. If for some reason the remote API didn't enable CORS for those calls my web-based testing would have failed as well.

So... there ya go. Who knows. :)