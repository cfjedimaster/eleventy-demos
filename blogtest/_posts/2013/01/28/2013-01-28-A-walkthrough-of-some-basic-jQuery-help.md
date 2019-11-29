---
layout: post
title: "A walkthrough of some basic jQuery help"
date: "2013-01-28T22:01:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2013/01/28/A-walkthrough-of-some-basic-jQuery-help
guid: 4841
---

Over the past few days I've exchanged emails with David. He had a simple jQuery-based application and he ran into some issues with it. His problems were, I thought, fairly common and I thought it might make sense for me to share what he did and what I suggested. We went through a couple of iterations of this so you can see how the project evolved over time. One thing I want to point out. David writes his code differently than I do (as I expect everyone does!). When he asked for help, I tried to make my help/suggestions as minimally invasive as possible. I was tempted to just delete all his code and do it "my way", but I thought working within his 'style' would be less jarring. Ok, with that out of the way, let's look at his code.
<!--more-->
David wanted a form that - when changed - would automatically sum up the values. He included a mix of form fields for testing purposes and wanted to sum those fields with a class name of foo. Here is what he started with.

<script src="https://gist.github.com/4661708.js"></script>

Right away I saw that his initial selector, #addhours, didn't actually match anything. Notice his form was actually identified as my-form. He made the same mistake with another selector as well. Don't forget that you can use Google Chrome Dev Tools to look into your DOM and ensure you're looking for the right IDs. If your DOM is big and messy (like my beard), you can also hop into the console and try selecting what your code is. In the screen shot below, look at the difference between a bad and good match.

<img src="https://static.raymondcamden.com/images/screenshot60.png" />

Continuing on - I then pointed out that his code wasn't within the $(document).ready block. Most people who write jQuery tend to <i>always</i> include this by reflex, but if you don't, you can run into problems with your selectors. His code was trying to find DOM items before the DOM was actually done loading. You can mentally translate the $(document).ready block as "I'm ready to get down to business." In most cases, you almost always want to have your code in there. (Not always of course!) 

I modified his code a bit and returned this to him.

<script src="https://gist.github.com/4615163.js"></script>

You can see the $(document).ready block as well as the corrected selectors. David then came back to me with this:

<blockquote>
I was able to use your example and it works great.  But how can the jquery be modified so that it runs on page load.  It works fine on the change event for the field with class "foo".  I also wanted it to fire once the page is loaded so that any fields on screen go ahead and get counted. 
</blockquote>

As he noted, the code handled <i>changes</i> just fine. But if the form loaded with some initial values (he was using ColdFusion to generate the HTML dynamically) then the 'total' field wasn't updated until he changed a value. 

To handle this, I simply broke out the event handler doing the math and added a call to it in the $(document).ready block. In the code sample below, notice too I modified one of the form fields to have an initial value.

<script src="https://gist.github.com/4631529.js"></script>

Once again, he was good to go. Until today. He modified his code a bit so that users could dynamically add form fields to the page. He wanted his 'sum' logic to apply to these new fields as well. Here is what he had:

<script src="https://gist.github.com/4661751.js"></script>

For this, the issue came down to this original code...

$summands.on('change', doAdds);

This says: "At the time of running, attach a change event handler to $summands." If you remember, summands was run like so,   $summands = $form.find('.foo'), in document.ready. It was run <b>immediately and one time</b>. So it found stuff once, and then was done. It didn't know the user had (possibly) added more stuff. 

So first I changed the code to this:

$("#addhours").on("change", ".foo", doAdds);

This says: On any change event inside the addhours form, if it (the thing throwing the event) <b><i>also</i></b> has a foo class, run doAdds. This is a "live" event (in fact, the API used to be called live) and will find new stuff.

The next fix was to remove the code that created summands on startup. You will see it inside of doAdds now. You can't make it once and cache it since it can change. Here is the version I sent back to him.

<script src="https://gist.github.com/4660804.js"></script>

A little messy - but again - I was trying to work within his original code.

Anyway, I hope this post-mortem is useful to others.