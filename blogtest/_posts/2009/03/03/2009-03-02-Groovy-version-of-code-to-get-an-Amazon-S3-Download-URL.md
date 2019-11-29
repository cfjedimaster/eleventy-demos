---
layout: post
title: "Groovy version of code to get an Amazon S3 Download URL"
date: "2009-03-03T10:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2009/03/03/Groovy-version-of-code-to-get-an-Amazon-S3-Download-URL
guid: 3260
---

Recently I had need of some Groovy code to integrate with Amazon S3. I searched around, but it seemed as if they only code out there was set up for Grails. I couldn't find a simple class that I could drop into our code at work and run with that. Now maybe I didn't search long enough, and maybe the Grails-related stuff would have worked, but it just didn't feel right.

I then ran across this UDF written by ColdFusion developer Barney Boisvert: <a href="http://www.barneyb.com/barneyblog/2008/04/04/amazon-s3-url-builder-for-coldfusion/">Amazon S3 URL Builder for ColdFusion</a>

This was perfect. While I had been looking for an S3 "library", all I really needed was a way to generate the URL. I took his CFML and converted it into the following Groovy code. Groovy people - feel free to laugh/comment on how I could improve this:

<code>
private String getS3URL(key,secret,bucket,objectkey,expires=900) {
	def algo = 'HmacSHA1'
	def expireValue = ((new Date().getTime())/1000+expires).intValue()
	def stringToSign = 'GET\n\n\n'+expireValue+'\n/'+bucket+'/'+objectkey
	def signingKey = new javax.crypto.spec.SecretKeySpec(secret.getBytes(),algo)
   	def mymac = Mac.getInstance(algo)
   	mymac.init(signingKey)

	def rawSig = mymac.doFinal(stringToSign.getBytes())
	def sig = new sun.misc.BASE64Encoder().encode(rawSig);

	sig = java.net.URLEncoder.encode(sig)
	def destURL = "https://s3.amazonaws.com/$bucket/$objectkey?AWSAccessKeyId="+key+"&Signature=$sig&Expires=$expireValue"
	return destURL
}
</code>

I think it's interesting to compare both versions. My version got rid of the requestType parameter since we didn't need to worry about that for our code.

You know it's funny - I never used to understand why people didn't use semicolons at the end of their code when it was allowed - but now that I'm getting used to it, it <i>really</i> bugs me when I have to use them.