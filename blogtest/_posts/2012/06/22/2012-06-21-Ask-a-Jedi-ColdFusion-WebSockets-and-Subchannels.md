---
layout: post
title: "Ask a Jedi: ColdFusion WebSockets and Subchannels"
date: "2012-06-22T10:06:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2012/06/22/Ask-a-Jedi-ColdFusion-WebSockets-and-Subchannels
guid: 4654
---

It has been <i>way</i> too long since I did a "Ask a Jedi" post! This was a simple question, but I thought it might be interesting to others considering WebSockets and ColdFusion 10. Matthew asked:
<!--more-->
<blockquote>
Wondered if you know of a way to get a listing of all the subchannels under a certain channel with the JavaScript API in CF 10.  Like your example with sports, sports.football, sports.basketball, sports.baseball.  So I could do something like socket.getChannels('socket');    There is a WSGetAllChannels("channelName") in CF but this will not return the channels added later in JS as far as I can tell, only in Application.cfc

I looked at firebug and see a few things. under the DOM, there is a socket object, and also under Coldfusion.WebSocket.GET_CHANNELS but this doesnt seem like what Im looking for.

Does the user have to be subscribed to the a channel to be able to pull the sub channels?
</blockquote>

As far as I know, there is no way to do this. Since subchannels are ad hoc, there seems to be no way to enumerate them.

Now - I'd say in a 'proper' app you know what subchannels you support anyway. My example where I allow for folks to pick from a variety of channels was hard coded, but it would have probably been database driven. If you do allow for dynamic ones, you could use a CFC call to 'record' it in a shared scope. Remember that you can easily run CFCs via typical AJAX calls or using the invoke API in your WebSocket object.

Of course, anyone can pop into console and subscribe to a random subchannel, but you could use a CFC handler to block that if you truly cared. Again, given that you would probably have your list database driven, it would be possible to block a subscription to an unknown subchannel. When you subscribe to x.y, where X is the known channel and Y is the subchannel, the allowSubscribe handler will see x.y. You would "pop off" the subchannel using string functions and then do your verification there.

If any of the above doesn't make sense, let me know and I can whip up a demo.