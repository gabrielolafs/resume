---
layout: ../../layouts/articles.astro

title: Self-Titled
dateWritten: October 2026
timeSpan: February 2026 - September 2026
tech: ['Astro', 'Markdown', 'Responsive Design', 'CI/CD']

color: [138, 90, 21]
imgPaths: ["/img/channel/self_mobile_vp.png", "/img/channel/self_desktop_vp.png", "/img/channel/self_message_board.png"]
    
---
  
Retro-styled portfolio built with Astro. Uses css animations and 3d model rendering via ThreeJS. Images are converted and compressed on deployment, cutting page weight by 97%.

<hr/>  

I love the design language of Nintendo, but I do hope that their litigious nature does not come to bite me. This is my love letter to the console I grew up with.

To add a new article, all I have to do is (I guess write it too) upload any images/3d files & markdown file and edit the json file. The json file only holds the order of the articles and I chose this because changing order would have been very tedious or inconsistent otherwise. If I moved an article to the start from the end, it would either mean changing all the indexes in the markdown files, or having a number that no longer means index position (using a float of 0.5 for instance). This, I believe, is the cleanest way to approach this problem.

This is a fully responsive webpage, it has a mobile view port, which has six channels per page, and a desktop view port that shows 12 channels per page. In order to achieve this, the bottom bar is significantly over engineered, having five SVG’s that are and scale based off of the width as I really wanted the scaling to not effect the angle of the curves.

The first version of this webpage with a working three JS renderer transferred almost 48 MB of data, taking **minutes** to load when not on local host. Because of this, I made a compression script that would be run on deployment that would handle all compression. The original version used OBJ files and several texture PNG‘s. Converting that instead to a single GLB file and using [draco encoding](https://github.com/google/draco) reduced file size by about 80%. The next thing was to heavily compress the images, especially the ones on the main page. I used [Image Magick](https://imagemagick.org) to convert all of the files into webp files, and then heavily compress. All references from .png, .jpg, and such image files have to be changed to .webp in every markdown file, the deployment script handles that as well. The current webpage deploys at 1.6MB, **30x smaller**.