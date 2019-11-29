---
layout: post
title: "Quick Demo - KML and CFMAP"
date: "2010-03-03T22:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/03/03/Quick-Demo-KML-and-CFMAP
guid: 3739
---

A while ago I shared a few emails with a reader who wanted to know if it was possible to do KML operations with CFMAP. For those who don't know, <a href="http://code.google.com/apis/kml/documentation/kml_tut.html">KML</a> is an XML format for geographical data. From what I've read, it allows for various types of overlays and data "skins" over map or Earth data. The reader, Richard Zawadzki, and I went back and forth a bit, but it was he who finally got it working and graciously allowed me to share his code.
<!--more-->
<p/>

To use KML with Google Maps, you simply need to follow the previous examples I've shared - get the map object. ColdFusion gives you the hooks to do so. Once you have it, you can then follow <a href="http://code.google.com/apis/kml/documentation/topicsinkml.html">Google's KML docs</a> to work with your data. Here is a quick example of the JavaScript here used. Only the first call is ColdFusion specific:

<p/>

<pre><code class="language-javascript">
function AddKMLOverlay() {
	
	var map = ColdFusion.Map.getMapObject("mainMap");
	map.setCenter(new google.maps.LatLng(28.291889, -81.407793), 9);
	map.setZoom(9);
	
	var DRIKML = new GGeoXml("http://maps.google.com/maps/ms?ie=UTF8&hl=en&vps=4&jsv=201b&msa=0&output=nl&msid=101779661887239513456.000465f6105cf06ca4c63"); 
	map.addOverlay(DRIKML);
	
	var ParksKML = new GGeoXml("http://maps.google.com/maps/ms?ie=UTF8&hl=en&vps=5&jsv=201b&oe=UTF8&msa=0&output=nl&msid=101779661887239513456.000465f607e578d46cf83"); 
	map.addOverlay(ParksKML);
	
	var CountyKML = new GGeoXml("http://maps.google.com/maps/ms?ie=UTF8&hl=en&vps=5&jsv=201b&oe=UTF8&msa=0&output=nl&msid=101779661887239513456.00047e28dce659094bcb5"); 
	map.addOverlay(CountyKML);
 
}
</code></pre>

<p/>

<strike>You can see a demo of what he came up with here.</strike> (You can download the old code here: https://static.raymondcamden.com/enclosures/kmldemo.zip) I've included the complete code below. (And once again - I'm <i>really</i> impressed with everything that can be done with Google Maps!) (Note - I forgot to mention this when I first posted, but Richard asked that I also credit Steve Gongage, his coworker, for working on this as well.)

<p/>

<pre><code class="language-javascript">
&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;
&lt;head&gt;
&lt;meta http-equiv="Content-Type" content="text/html; charset=utf-8" /&gt;
&lt;title&gt;Google Maps KML Overlays&lt;/title&gt;

&lt;script&gt;
//&lt;![CDATA[
function AddKMLOverlay() {
	
	var map = ColdFusion.Map.getMapObject("mainMap");
	map.setCenter(new google.maps.LatLng(28.291889, -81.407793), 9);
	map.setZoom(9);
	
	var DRIKML = new GGeoXml("http://maps.google.com/maps/ms?ie=UTF8&hl=en&vps=4&jsv=201b&msa=0&output=nl&msid=101779661887239513456.000465f6105cf06ca4c63"); 
	map.addOverlay(DRIKML);
	
	var ParksKML = new GGeoXml("http://maps.google.com/maps/ms?ie=UTF8&hl=en&vps=5&jsv=201b&oe=UTF8&msa=0&output=nl&msid=101779661887239513456.000465f607e578d46cf83"); 
	map.addOverlay(ParksKML);
	
	var CountyKML = new GGeoXml("http://maps.google.com/maps/ms?ie=UTF8&hl=en&vps=5&jsv=201b&oe=UTF8&msa=0&output=nl&msid=101779661887239513456.00047e28dce659094bcb5"); 
	map.addOverlay(CountyKML);

}

function init() {
	AddKMLOverlay();
}
//]]&gt;
&lt;/script&gt;


&lt;/head&gt;

&lt;body&gt;

    &lt;table width="100{% raw %}%" height="100%{% endraw %}"&gt;
    &lt;tr&gt;
      &lt;td align="center"&gt;
        &lt;table&gt;
          
          &lt;tr align="left" valign="top"&gt;
            &lt;td&gt;
               &lt;cfmap width="680" height="400" centeraddress="34741" zoomlevel="9" name="mainMap"&gt;    
                    &lt;cfmapitem name="marker01"    
                        address="1 Courthouse Sq, Kissimmee, FL 34741 USA"    
                        tip="Osceola County Administration Building"/&gt;    
                &lt;/cfmap&gt;
            &lt;/td&gt;
          &lt;/tr&gt;

        &lt;/table&gt;

      &lt;/td&gt;
    &lt;/tr&gt;
  &lt;/table&gt;

&lt;/body&gt;
&lt;/html&gt;
&lt;cfset ajaxOnLoad("init")&gt;
</code></pre>