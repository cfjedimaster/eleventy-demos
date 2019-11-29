---
layout: post
title: "Some Notes on Windows 10 and Ubuntu"
date: "2017-07-28T08:02:00-07:00"
categories: [development]
tags: [windows]
banner_image: 
permalink: /2017/07/28/some-notes-on-windows-10-and-ubuntu
---

I've got a few notes to share about Ubuntu on Windows. This will be a bit random, but hopefully it is helpful. First off - why am I writing about this now? As of a few weeks ago, Ubuntu is now available in the Windows Store, <storng>if, and only if</strong>, you are using the Insiders Build. I'm using it on my laptop, but not my desktop. However, what I ran into will apply to anyone who is currently using Bash and wants to upgrade to the "real" release. Ok, ready?

First and foremost, you want to read the blog post by Scott Hanselman: <a href="https://www.hanselman.com/blog/UbuntuNowInTheWindowsStoreUpdatesToLinuxOnWindows10AndImportantTips.aspx">Ubuntu now in the Windows Store: Updates to Linux on Windows 10 and Important Tips</a>. If you've already installed Bash, scroll down to: TODOS IF YOU HAVE WSL AND BASH FROM EARLIER BETAS. His tips worked just fine for me. Note that when you copy your home directory to the desktop, it may take a while. Be sure to clean any trash you may have beforehand. Even with me doing that it took about five minutes for everything to copy.

Ok, so here's what threw me a bit. First - how do you use the new Ubuntu app? You can either run it from the Start menu, or just type <code>unbuntu</code> in a regular command prompt.

How do you use it with [Hyper](https://hyper.is/)? Previously I had configured Hyper to use c:\windows\system32\bash.exe. But I had a heck of a time actually finding ubuntu.exe. You can find it in a special "WindowsStore" folder, but when I tried that path, Hyper would fail on startup. Again, Scott Hanselman helped me out. Configure Hyper.js like so:

<pre><code class="language-javascript">shell: 'cmd.exe',
shellArgs: ['/c ubuntu'],
</code></pre>

To configure [Visual Studio Code's](https://code.visualstudio.com) integrated terminal, you can just use ubuntu.exe:

<pre><code class="language-javascript">"terminal.integrated.shell.windows": "ubuntu.exe",
</code></pre>

And at that point, you're done, except for everything you had installed of course. For me, this was mainly Node and Node-related items. I used NVM (this [guide](https://gist.github.com/d2s/372b5943bce17b964a79) helped) to get Node installed. 

That's basically it. I still have the "old Bash" around and I'm going to keep it there until I'm sure everything is running ok. 

As an aside - I've found Bash on Windows to be excellent. My only real complaint is that heavy file operations, like npm installs or Git calls on large projects, seem to be slower when compared to OSX. This seems to be more of an issue for installing big CLIs versus installs I'll do for a Node project. It isn't enough to really bug me, but I've definitely noticed it. I raised this when speaking to an engineer at MS Build, so hopefully it's something that can be improved in the future, but it certainly isn't enough to stop me from using it.