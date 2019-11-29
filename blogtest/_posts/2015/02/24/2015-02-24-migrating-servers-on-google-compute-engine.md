---
layout: post
title: "Migrating servers on Google Compute Engine"
date: "2015-02-24T13:20:13+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2015/02/24/migrating-servers-on-google-compute-engine
guid: 5729
---

So, as folks know, I've been struggling a bit with my server here. Last night MySQL went down around 10PM, and while normally I'm up there, I had gone to bed early so I didn't restart it till 6AM this morning. That's a heck of a long time for it to be down. I decided to reach out again for help as well as start looking seriously at <a href="http://jekyllrb.com/">Jekyll</a>. I prefer <a href="http://harpjs.com/">Harp</a> but after watching Brian Rinaldi's demo of Jekyll I decided to try it out.

<!--more-->

One of the suggestions that was made was to move from Apache to <a href="http://nginx.org/">nginx</a>. While I didn't think Apache was ever an issue, it was the process using most of the RAM on my machine and I figured - it couldn't hurt.

In order to give this a shot though I wanted to test it first, and that is what I'd like to cover here. How difficult is it to copy a Google Compute Engine instance? Turns out - it's really darn easy.

If you go into the instance detail page, you'll see a Clone button right away:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/Google_Developers_Console.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/Google_Developers_Console.png" alt="Google_Developers_Console" width="850" height="137" class="alignnone size-full wp-image-5730" /></a>

But do <strong>not</strong> use that first! When you clone, Google will ask you what disk to use. You can pick one of the main source disks (for different operating systems), a snapshot, or an existing disk. It wasn't clear if "existing disk" would copy or re-use the same disk. I assumed it would re-use the disk which isn't what I wanted obviously. (And I just confirmed with my friend at Google - it would re-use it.) So instead - make a snapshot of your disk. Then go back to the Clone operation and select that.

Within five minutes, heck maybe even two, I had a clone of my original instance with a copy of the drive. I could even confirm this by hitting my new IP and seeing my blog.

I then worked on getting Nginx installed. Since this post is about the Google Compute area, I'll share some links about that portion at the end. Once I had everything up and running well, I decided it was time to trust that I hadn't screwed things up and point the static IP address I had for my first instance to the new instance.

Back when I first launched on Google Compute, I went with the smallest instance possible. When I discovered I needed to move to a bigger instance, I ran into the issue of migrating the IP address. Back then I used the CLI to deallocate the IP from the server and re-allocate it to the new one. For the life of me I couldn't find that blog post detailing the process. On a whim, I went to the Network portion of my Google panel and discovered something cool. You could do the entire thing there!

You can see the two instances below. 
<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/swapIP1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/swapIP1.png" alt="swapIP1" width="850" height="165" class="alignnone size-full wp-image-5731" /></a>

I began by clicking Change:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/swapIP3.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/swapIP3.png" alt="swapIP3" width="1128" height="734" class="alignnone size-full wp-image-5732" /></a>

I then simply selected my new instance - and that was that. Google started pointing my static external IP to the new box! Also notice how it restored an ephemeral IP address back to the original instance. That's pretty helpful.

All in all - a relatively painless process (well, the Nginx stuff was a bit involved). The only real hiccup is ensuring you use a new disk when you clone your server.

<h3>NGinx and Wordpress</h3>

Ok, so this is off topic for the main post, but if you're curious about using NGinx and Wordpress, here are a few helpful links:

<ul>
<li><a href="https://www.digitalocean.com/community/tutorials/how-to-install-linux-nginx-mysql-php-lemp-stack-on-ubuntu-12-04">How To Install Linux, nginx, MySQL, PHP (LEMP) stack on Ubuntu 12.04</a> - I began here. I already had MySQL and PHP, but I installed PHP-FPM as it is supposed to be faster. </li>
<li><a href="https://www.digitalocean.com/community/tutorials/how-to-install-wordpress-with-nginx-on-ubuntu-12-04">How To Install Wordpress with nginx on Ubuntu 12.04</a> - I then followed the configuration suggestions here.</li>
<li><a href="https://rtcamp.com/wordpress-nginx/tutorials/single-site/wp-super-cache/">WP Super cache</a> - This page detailed how to get Super cache working with Nginx.</li>
<li><a href="http://codex.wordpress.org/Nginx">Nginx</a> - This was a more generic article on WordPress and NGinx, the main thing I copied from here were the rules blocking access to .htaccess and other files.
</ul>