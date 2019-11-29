---
layout: post
title: "Copying to Clipboard with Windows Subsystem for Linux"
date: "2017-10-19T07:52:00-07:00"
categories: [development]
tags: []
banner_image: 
permalink: /2017/10/19/copying-to-clipboard-with-windows-subsystem-for-linux
---

This tip is 100% thanks to [Ben Hillis](https://twitter.com/benhillis), a developer working on the Windows Subsystem for Linux (WSL). Yesterday I needed to copy a file under WSL to the my system clipboard. If you Google for how to do this, you'll see a CLI called `clip` that works under Unbuntu, however, that doesn't work under WSL. If I had to guess I'd say because there's isn't a GUI involved with WSL but to be honest, I'd be guessing.

When I asked on Twitter, Ben had a simple solution - use clip.exe. I keep forgetting that WSL provides complete access to Windows executables. I knew this - heck - it's how my [tip](https://www.raymondcamden.com/2017/09/19/run-visual-studio-code-insiders-from-wsl/) on loading VSCode Insiders from WSL worked. But I didn't even think to check if Windows had a utility to copy to the clipboard.

In case you're curious, this is how you would copy a file under WSL to your Windows clipboard:

	cat report.txt | clip.exe

And I'm sure there's numerous other ways too. Anyway, I'm mainly just blogging this so I don't forget.