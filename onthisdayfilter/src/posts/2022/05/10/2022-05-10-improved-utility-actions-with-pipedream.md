---
layout: post
title: "Improved Utility Actions with Pipedream"
date: "2022-05-10T18:00:00"
categories: ["serverless"]
tags: ["pipedream"]
banner_image: /images/banners/utilities.jpg
permalink: /2022/05/10/improved-utility-actions-with-pipedream.html
description: A look at new built-in functionality for better workflows
---

If you can't tell, I'm a huge fan of [Pipedream](https://pipedream.com), but it isn't the only service of its kind out there. If anything, I like Pipedream even more as it's opened my eyes to alternatives out there and has made me appreciate the "low-code/no-code" space even more. In particular, I'm really enjoying digging into [Microsoft Power Automate](https://flow.microsoft.com/) and it's got me thinking about what could be brought over into Pipedream. 

One place that Power Automate does a really good job of is providing logical actions for controlling the flow and execution of your workflows. So for example, if you have some weird custom logic that dictates if a workflow should end, you can define this without writing any code. That's certainly been possible in Pipedream as well, but typically via a short code-based step. I don't mind that, but one of the things I had hoped for were more 'utility' type actions that would let us define such things without code. 

In the past few weeks, the Pipedream folks have released three different features in this space I want to highlight. For the most part, these were all things you could have done before (except one), it's just implemented in a more formal way now. Let's take a look!

## Exporting Variables

One common thing I've done in Pipedream workflows (and thanks to Dylan Sather for showing me this right when I first started playing with PD) is to define a code step to configure different constants for my workflow. I'm not talking about things like API secrets, for that, you would use environment variables, but rather values you wish to use later in the workflow and want to be defined by themselves so it's easy to change. For example, here's a step from an older workflow that defines one value:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/pd1.jpg" alt="Code step defining THRESHOLD" class="lazyload imgborder imgcenter">
</p>

Later in my workflow, I referenced it like so:

```js
if(steps.analyze_text.sentiment.comparative > steps.constants.THRESHOLD) 
    $end('Not unhappy enough.');
```

All in all, relatively simple, but with the new "Export Variables" action, you can skip the code step. 

To use it, first note it's a tiny bit awkward. When adding a new step, if you search for 'export', you will not find it. Instead, type "helper" in the search field: 

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/pd2.jpg" alt="Search and find the Helper Functions" class="lazyload imgborder imgcenter">
</p>

Click on "Helper Functions" and it will be the first item:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/pd3.jpg" alt="Finding the Export action" class="lazyload imgborder imgcenter">
</p>

Select that and you'll have a new `export_variables` action. Now - as I said - this was a bit awkward. In my mind, this kind of action was like the Code step, just a native part of what's available. I reported this on the Pipedream slack and Dylan said they are aware of this and are working to improve it. So just note if you're reading this sometime after I published, it may be simpler to add. 

Alright, once added, you're given an empty "Configuration" object:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/pd4.jpg" alt="Empty configuration in export variables action" class="lazyload imgborder imgcenter">
</p>

If you click in there, you can begin entering name/value pairs. So for example, here are three keys and values:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/pd5.jpg" alt="Configured values in export variable action" class="lazyload imgborder imgcenter">
</p>

Also, note I renamed the action to `myconfig`. Once you've done this, you can then refer to the values via `steps.myconfig.config`. So for example: `steps.myconfig.config.name` would return `ray`.

Simple, right? I definitely recommend this for workflows that need configuration values defined at the beginning for future steps to reference.

## Aborting Workflows with Filter

I'm not sure "Filter" is the best name, but if you've ever needed to dynamically end a workflow based on some condition, the new Filter action will help you. As with the previous example, this is something you could have done before with a short code step. To begin, you can just search for filter:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/pd6.jpg" alt="Finding the filter action" class="lazyload imgborder imgcenter">
</p>

Selecting that will bring you to three choices:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/pd7.jpg" alt="List of filter options" class="lazyload imgborder imgcenter">
</p>

Let's start with the second and third as they are basically the same thing. If you only want to continue if X is true, you would pick the second. If you want to abort if X is true, you would pick the last. 

When creating conditions, you begin by specifying the type - either text, number, date, boolean, null, array, or object. This then determines the type of conditions. For example, if you are doing text comparisons, you can select contains, does not contain, matches, doesn't match, starts, or ends with. For numbers, you get what you expect: <, <=, >, >=, =. 

For my test, I selected text, and I wanted to say: If a previous step `name` value was inside 'raymond', continue. I configured it as such and tested - and did not get what I expected:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/pd8.jpg" alt="Result of first continue test" class="lazyload imgborder imgcenter">
</p>

Turns out the configuration was the opposite of what I expected. The "Value to compare against" string was checked to see if it was inside "Value to evaluate". Maybe I'm weird, but I thought it would be the opposite. To test, I simply changed "raymond" to "ra" and confirmed it would continue:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/pd9.jpg" alt="Successful filter test" class="lazyload imgborder imgcenter">
</p>

The first option from the list of Filter actions mentioned custom condition and this gives you a bit more flexibility. You can enter a dynamic reason and a dynamic condition. Here's an example where my condition is based on an age value defined earlier. 

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/pd10.jpg" alt="Custom filter example" class="lazyload imgborder imgcenter">
</p>

Once again, this could be done in a code step, but I prefer it as a proper action. 

## Putting things off with Delay

This last one is also fairly simple, but as far as I know, impossible to do before it was added. The new Delay action lets you delay the rest of a workflow by a certain number of milliseconds. As with Filter, add it by searching for "delay":

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/pd11.jpg" alt="Finding the delay action" class="lazyload imgborder imgcenter">
</p>

After adding it - you then specify a length of time and unit. The unit can be milliseconds, seconds, minutes, or even hours. And get this - the max can go as high as one year. Wow. Here's an example configured delay action:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/pd12.jpg" alt="Example of delay action configured to wait 30 seconds" class="lazyload imgborder imgcenter">
</p>

Note that you can also do the delay in code:

```js
$.flow.delay(60 * 1000);
```

The Pipedream folks did a cool blog post demo of this where they delay a workflow 30 minutes after an initial action: [Send delayed welcome emails to new users with Postmark](https://pipedream.com/blog/send-delayed-welcome-emails-to-new-users-with-postmark/). (As a general FYI, bookmark their [blog](https://pipedream.com/blog/) in general, it's got some great examples.) 

## Wrap Up

As I said in the beginning, I love to see Pipedream adding support for more... 'meta' level constructs in workflows. Power Automate is *very* powerful in this regard, letting you build workflows with branching conditions and loops, and I'd like to see Pipedream continue in this direction as it just improves the flexibility and usability of the service in general. 

Photo by <a href="https://unsplash.com/@alschim?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Alexander Schimmeck</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  