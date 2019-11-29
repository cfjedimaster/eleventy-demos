---
layout: post
title: "Converting the color space of an image for PDF consumption"
date: "2009-06-08T15:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/06/08/Converting-the-color-space-of-an-image-for-PDF-consumption
guid: 3387
---

Reader Morgan W. wrote in a few days ago with an interesting problem:
<p/>
<blockquote>
<p>
I'm having some troubles with ColdFusion and Images. I'm using cffile to upload images (typically in jpeg format) to the server. From there I'm using CFDocument to write a pdf including these images. 
</p>
<p>
The problem is that the color space of the uploaded jpeg does not react well to cfdocument for some reason. I've been told by people at Adobe that all you have to do is 'Just use Java to change the color space' (and maybe convert it to a png) of the image and I won't have the problem any longer. Problem is, I have no idea how to 'Just use Java to change the colorspace'.
</p>
</blockquote>
<p/>

The first thing I recommended to Morgan was to try the simple PNG conversion. ColdFusion makes this pretty trivial. If you read in foo.jpg, and then save it as foo.png, the image is converted. There is no separate conversion function. Unfortunately, this didn't help with her PDFs.
<p/>

As a bit more background on why this was important to Morgan, she noticed that when building a PDF by hand (I assume 'by hand' means with Acrobat and not needlepoint) she saw file sizes between 300K and 1 meg. When using CFDOCUMENT the file sizes ranged from 20-30 megs. That's a pretty huge difference.
<p/>

So I did a bit of digging into color spaces and images. As always, the Java SDK API docs (<a href="http://java.sun.com/javase/6/docs/api/">http://java.sun.com/javase/6/docs/api/</a> is the URL I used last time I believe) is a good place to start. 
<p/>

After a lot of trial an error, I was able to get the following code working:
<p/>

<code>
&lt;cfset img = imageRead("ray.png")&gt;

&lt;cfset bimg = imageGetBufferedImage(img)&gt;
&lt;cfset colorModel = bimg.getColorModel()&gt;
&lt;cfset colorSpace = colorModel.getColorSpace()&gt;

&lt;!--- gray scale ---&gt;
&lt;cfset gCS = createObject("java","java.awt.color.ColorSpace").CS_GRAY&gt;

&lt;cfset gray = createObject("java","java.awt.color.ColorSpace").getInstance(gCS)&gt;

&lt;cfset convert = createObject("java",
"java.awt.image.ColorConvertOp").init(gray,javaCast("null",""))&gt;

&lt;cfset newImage = convert.filter(bimg, javaCast("null",""))&gt;

&lt;cfset newImageOb = imageNew(newImage)&gt;
&lt;cfimage action="writeToBrowser" source="#img#"&gt;
&lt;cfimage action="writeToBrowser" source="#newImageOb#"&gt;

&lt;cfdump var="#img#"&gt;&lt;cfdump var="#newImageOb#"&gt;
</code>
<p/>

Line by line, and note, I will be guessing a bit here in terms of some of the Java code, this is what the template does. First I load in a source image. I then use getBufferedImage to read in the underlying Java object for the image. From that, I can get the colorModel and colorSpace. I didn't actually use them though so you could remove those lines from any real production code. 
<p/>

I create my own color space. From the <a href="http://java.sun.com/javase/6/docs/api/java/awt/color/ColorSpace.html">docs</a> for ColorSpace, I chose CS_GRAY since it represented a gray scale color and I figured it would be easy to eyeball the difference, if it worked. The first line simply gets the field whereas the second then gets an instance of the grayscale colorspace. 
<p/>

Next up, I create an instance of the COlorConvertOp class. As you can guess, this will handle doing color space conversions. The next line uses the filter operation to do just that.
<p/>

Finally, I use imageNew to suck in the new buffered image and create a ColdFusion image out of it. I write both images out to the screen, and dump both as well to see if ColdFusion notices a difference. 
<p/>

The result:
<p/>

<img src="https://static.raymondcamden.com/images//Picture 161.png">
<p/>

You can see that the color space is definitely different in both images.
<p/>

I wonder if this is would be a worthwhile addition to <a href="http://imageutils.riaforge.org/">ImageUtils</a>?