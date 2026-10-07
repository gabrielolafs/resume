---
layout: ../../layouts/articles.astro

title: Self-Titled
dateWritten: October 2026
timeSpan: February 2026 - September 2026
tech: ['Astro', 'Markdown', 'Responsive Design', 'CI/CD']

color: [138, 90, 21]
imgPaths: ["/img/channel/self_mobile_vp.png", "/img/channel/self_desktop_vp.png", "/img/channel/self_message_board.png"]
    
---
  
Retro-styled portfolio built with Astro. Uses CSS animations and 3D model rendering via Three.js. Images are converted and compressed on deployment, cutting page weight by 97%.

<hr/>

I love the design language of Nintendo, but I do hope that their litigious nature does not come to bite me. This is my love letter to the console I grew up with.

To add a new article, all I have to do is upload any images/3D files and the Markdown file, and edit the JSON file (and write the article too, I guess). The JSON file only holds the order of the articles, and I chose this because changing the order would have been very tedious or inconsistent otherwise. If I moved an article from the end to the start, it would either mean changing all the indexes in the Markdown files or having a number that no longer means index position (using a float of 0.5, for instance). This, I believe, is the cleanest way to approach the problem.

This is a fully responsive webpage. It has a mobile viewport that shows six channels per page and a desktop viewport that shows 12 channels per page. To achieve this, the bottom bar is significantly over-engineered, with five SVGs that are drawn and scaled based on the width, as I really wanted the scaling not to affect the angle of the curves.

The first version of this webpage with a working Three.js renderer transferred almost 48 MB of data, taking **minutes** to load when not on localhost. Because of this, I made a compression script that runs on deployment and handles all compression. The original version used OBJ files and several texture PNGs. Converting those to a single GLB file and using [Draco encoding](https://github.com/google/draco) reduced the file size by about 80%. The next step was to heavily compress the images, especially the ones on the main/channel page. I used [ImageMagick](https://imagemagick.org) to convert all of the files to WebP and then compress them heavily. All references to .png, .jpg, and similar image files have to be changed to .webp in every Markdown file, and the deployment script handles that as well. The current webpage deploys at 1.6 MB, **30x smaller**.