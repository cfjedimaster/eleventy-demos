---
layout: post
title: "TIL - Pushing Node Apps to Azure with Visual Studio Code"
date: "2018-04-18"
categories: [development]
tags: [azure]
banner_image: /images/banners/azure.jpg
permalink: /2018/04/18/til-pushing-node-apps-to-azure-with-visual-studio-code
---

I've been playing, off and on, with Microsoft Azure for a while now. My main focus has been on the services areas (see my [post](https://www.raymondcamden.com/2017/06/15/testing-multiple-image-recognition-services-at-once/) comparing different visual recognition services) but I was also curious to see how well it worked as a PaaS for Node apps. About two or three months ago I tried to push a simple [LoopBack](https://loopback.io/) app up and I was not successful. I put the blame on me for not reading the docs well, but it wasn't a good experience. About a week or so ago I was talking to a Microsoft employee about deployment in general and when I mentioned my last experience, he pointed me to this great tutorial:

### [Deploy to Azure using App Service](https://code.visualstudio.com/tutorials/app-service-extension/getting-started)

This tutorial walks you through the process of installing the [Azure App Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) extension into Visual Studio Code and then using it to deploy a Node app to Azure. 

I'm not going to repeat what's in the tutorial as it generally just works fine as is. I will warn you about a few things you may run into while testing. 

First, when you begin the authentication process, it will ask you to open a URL and enter a code:

![Azure prompt](https://static.raymondcamden.com/images/2018/04/azurepin2.jpg) 

Do NOT click! If you do, the little panel there will disappear, and if your memory is like mine, you won't remember the code. I had to quit VSC and restart it to get the prompt again. You can select text in the dialog and put it in your clipboard, or just jot it down.

**Oops!** So notice how in the screenshot above it says Copy. As in, um, Copy, like Ray, how could you miss that? Yep, that's all on me. I think maybe I was expecting it to pre-fill the form field with the code. Either way - just paste. Duh.

Secondly, for me the first deployment was incredibly slow. I'd say about ten minutes. Maybe LoopBack is big (honestly I never really thought about it). Maybe it was provisioning things. But for whatever reason, that first push was definitely slow. *However*, after that it moved incredibly quick. I'd say maybe 30 seconds, or quicker, to get the app updated.

Finally, the extension supports [viewing logs](https://code.visualstudio.com/tutorials/app-service-extension/tailing-logs) from your application. That's cool, but it didn't always consistently work for me. That being said, last night when I was testing I was having a bit of trouble with it and this morning it seems to be working perfectly fine. 

![Logs](https://static.raymondcamden.com/images/2018/04/azure2.jpg) 

Finally, and a bit off topic, but if you develop Visual Studio Code extensions, check out this button from the guide:

![Install button](https://static.raymondcamden.com/images/2018/04/azure3.jpg) 

Clicking this will open Visual Studio Code right to the marketplace and the extension. It's just a properly formatted URL but I was surprised to see it work so well. (Obviously you would need VSC installed for it to work properly.) Like any good webdev I did a quick Inspect Element to see the URL: vscode:extension/ms-azuretools.vscode-azureappservice. I'm surprised I don't see that used more often.

<i>Header photo by <a href="https://unsplash.com/photos/N-XifMlQzjg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Lisheng Chang</a> on Unsplash</i>