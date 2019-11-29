---
layout: post
title: "Uploading multiple files in Flex as one \"unit\""
date: "2007-03-15T17:03:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2007/03/15/Uploading-multiple-files-in-Flex-as-one-unit
guid: 1894
---

I had an interesting problem to fix today in Flex and I thought I'd share my solution. I'm not sure it is the best solution, but maybe someone can suggest an improvement.
<!--more-->
So my problem was this: File Uploads. File uploads aren't hard to do in Flex. It isn't quite as... nice... as other parts of Flex, but it is doable. (And I think it can definitely improved for Flex 3.) I had my file upload working just fine when the client threw a curve ball at me.

The original request was to allow you to upload images along with an optional caption. These images are tied to a resource. So as an example - think of screen shots tied to a project record.

My Flex code prompted you to select a file and then processed the upload by doing a POST to a CFM page. I passed along the project ID and the caption. The CFM then handled the upload, added the record to an Images table and tied to my Projects table.

Makes sense so far? Now for the client's curve ball. He wanted thumbnails for the images, and he didn't want to do server side thumbnails. Instead, the user would optionally select a second file for the thumbnail. 

Now in HTML this is trivial. You simply have two input type="file" tags. However, in Flex, the upload is tied to a FileRef object. In HTML land, imagine the upload being tied not to the Form, but to the singular input type="file" tag.

This poses a problem. How do I upload 2 files? Uploading multiple files isn't too hard, and there is a great <a href="http://www.adobe.com/devnet/coldfusion/articles/multifile_upload.html">article</a> at Adobe.com on the subject.

But in that article, the uploads are not tied together. I.e., you upload N files and the back end has no idea they were a combined "unit" of uploads.

What I needed was to upload 1 or 2 files, and then insert <i>one</i> record into the database. 

So my solution was this. When I hit the upload button, I would handle the upload. When the upload was complete (which is an event I can capture in Flex), I would then fire the second upload. But the second upload needed to know it was different - that it was the Thumbnail file for the image I had just uploaded. 

My first thought was - let me look at the response. I can have ColdFusion output the primary key of the row it just added. 

But when I looked at the event object I was getting back, it didn't contain anything (as far as I could tell.) Turns out I was using Event.COMPLETE, a rather generic event. My friend <a href="http://appliedliberally.com/blog/">Tai</a> pointed me to <i>another</i> event: DataEvent.UPLOAD_COMPLETE_DATA. If you listen for this event, you can actually look at the text that was returned from the server.

So - problem solved. It still feeds like a hack to me. I should be able to send N files in one POST. But for now - I'm happy I found a solution. I'm sure someone out there has a better answer, right?