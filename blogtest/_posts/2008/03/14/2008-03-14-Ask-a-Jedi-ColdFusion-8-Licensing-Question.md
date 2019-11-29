---
layout: post
title: "Ask a Jedi: ColdFusion 8 Licensing Question"
date: "2008-03-14T12:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/14/Ask-a-Jedi-ColdFusion-8-Licensing-Question
guid: 2708
---

A while back I got a question from a reader concerning ColdFusion licensing. As I know next to nothing about this I went right to <a href="http://blog.joshuaadams.com/">Josh Adams</a>, Adobe's newest ColdFusion specialist. He graciously helped me out and his reply is below. First, the question, from Andy:

<blockquote>
<p>
Here at the County we are heading into a virtualized blade sever environment (using VMware). I can't find conclusive, non-conflicting information on Adobe's site that states what version of CF is compatible with a virtual environment. I
found a PDF that says CF8 Enterprise is compatible and CF8 Standard is not, and I even found another page that says MX is compatible with virtualization. Can you direct me to the correct answer?
</p>
</blockquote>

Josh's reply:

<blockquote>
<p>
First let's start with the licensing generally; from <a href="http://www.adobe.com/products/coldfusion/faq">the Adobe ColdFusion 8 FAQ</a> we have this:</p><p>
ColdFusion 8 is licensed based on the number of physical processors (CPUs) on the server on which it is running. ColdFusion is licensed in two-CPU increments. Each license of ColdFusion, whether Standard or Enterprise Edition, allows the software to be installed on a server with one or two CPUs. Additional CPUs on the server require additional licenses. Note that the total number of computers on which ColdFusion 8 is installed and used may not exceed the total number of licenses purchased. That means you cannot purchase one two-CPU license and use it on two separate single-CPU servers. Each server, in that case, needs its own license. View <a href="http://www.adobe.com/products/eula/server/">information regarding the licensing of ColdFusion 8</a>.</p><p>Next let's move to additional licensing considerations related to VMs: there are no restrictions on the number of VMs onto which ColdFusion 8 Enterprise may be installed. However, ColdFusion 8 Standard can be used on no more than one VM per license. Note that this is consistent with ColdFusion 8 Enterprise's allowance of unlimited instances per license and ColdFusion 8 Standard's restriction to a single instance per license.</p><p>Finally, let's take a look at platform support considerations: the VMWare and Microsoft Virtual Server platforms are officially supported for ColdFusion 8 Enterprise but not for ColdFusion 8 Standard. That means that Adobe Support will investigate issues encountered on ColdFusion 8 Enterprise running in a VM, but they may not investigate issues encountered on ColdFusion 8 Standard running in a VM but instead they may require that those issues be reproduced on a supported platform.
</p>
</blockquote>

Thank you Josh!