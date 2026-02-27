# Nostalgic Portfolio Page
By: Gabriel G. Olafsson

##### To run locally
``` bash
npm run dev
```

## Below are the steps to add a new post
### 1. Format markdown files:
``` markdown
---
layout: {route to layout, the same on every file}

title: {title}
dateWritten: {date}
timeSpan: {dates}
---
{content}
```
###### ex:
``` markdown
---
layout: ../../layouts/articles.astro

title: 'Robots Are Cool'
dateWritten: 'Jan 1985'
timeSpan: 'Jan 1985 - Aug 2020'
---
# Robots
Cool! Am I right?
```
#### Note: make sure all references are [github flavored](https://github.github.com/gfm/) not obsidian flavored, really only two main differences:
``` markdown
--- 
Obsidain version
--- 
# title to go to:
go to [[#title to go to:|title]]
```
``` markdown
---
Altered version for astro
---
# title to go to:
go to [title](#title-to-go-to)
```
Basically, Obsidian uses wiki styled linking which is not supported and needs to be changed. Astro also does some formating to the replace all spaces with "-" and remove chars like ":". For more detailed information reference [markdown in Astro](https://docs.astro.build/en/guides/markdown-content/)
``` markdown
---
example of picture in markdown
---
look at this supper cool picture I took
![](../../../public/img/picture.png)
```
``` markdown
--- 
title: example of linking to another article
---

# linking to the article
[article](/article/article)
Note that Astro uses the file name as the route. Using the title will not work.

# linking another articles header 
i need to make a link to acticle's [title](/article/article#title-to-go-to)
```
#### Note: make new lines in markdown correctly! Put two spaces at the end of a line to have a break

### 2. Change the src/data/article-order.json (order will matter once paging is implemented):
``` json
{
  "articles": [
      "article"
  ]
}
```
To add an article after the first:
``` json
{
  "articles": [
      "article",
      "artwocle"
  ]
}
```

### 3. Uploading files
Keep in mind the file stucture! This is how I have set up my obsidian folder
``` markdown
/portfolio_content
  /public
    /img
      picture.png
      ...
  /src
    /pages
      /articles
        article.md
        ...
```
Grab your markdown files and put them into /src/pages/articles/article.md
Grab your photos and put them into /public/img

As long as it looks good, thats it! Just make a pr and merge it in, and cloudlflare will deploy!



# Current TODOs somewhat ordered by importance:
``` markdown
-[ ] Make a logo for myself
-[ ] Change the icon in the tab to be this logo

-[x] Astro (specifically the markdown implementation)
  -[x] Serving markdown files
  -[x] Styled well - really tough - for me
    -[x] Centered + space for arrows - zooming could cause issues?
    -[x] Use a color pallet close - lot of time for research  
    -[x] Use the font they use - easy? it has to be somebodies special interest
  -[x] Link to other articals (I know that the arrows will throw a wrench in this - it was pretty easy to account for in markdwon, might not be as big an issue as I though it would be)
  -[x] Be able to move from file to file (routing)

-[x] Main bottom banner. I COOKED with this one. looks great - onlything that needs some work would be generally supporting mobile. looked it up and it seems like you should be able to support 275px width and this does not do that. its not bad its kinda functional
  -[ ] fix scaling issues
    -[ ] spcifically for mobile i need to support 275px width
    -[ ] silly that the time display (also I want to make sure that I move away from the monospace - it was much easier to code initially, but i really dont like how it looks - ill have to do a better job animating with a non-monospaced font casue times like 11:11 are damned ugos)
  -[x] Circle buttons
    -[x] Styled
    -[x] Able to take svgs as an arg
  -[x] Outline in blue
  -[x] grey background
    -[ ] Fix small spacing glitch? I think all it is a rounding issue combining px and percent - maybe just round to the nearest pixel? this is an issue that needs to be solved in the way future - it is such a minimal issue that it is probably not worth the time that it takes in order to fix it
  -[x] Drop shadows on buttons
  -[x] Shadows from the outline. This one I have been struggling with a lot. I think I will have to make a new svg path for each with a height that is taller than it used to be for everything. that would solve the issue of the center line being cut off. But the curves are the real stickler. I have to do some research on how to cast a shaodow downwards from an svg. I thought I had something that would work (linear gradient) but it has not yet and it would be messed up on the scaling so I have not gotten anything that looks good yet. radial and linear??? make them all into one svg and use other variables in order to scale on the x????? Ive spent like 2 hours on this alone, I have to figure it out. I FIGURED IT OUT!!! Really really chalenging one. had to let it sit in the back of my mind working on other stuff and then finally i figured out that you could filter blur on a whole div and it would blur everything together. i now have a div with black lines along the path (which updates live) and then blur the hell out of it - like 60px. Works like a charm. the curves are a little bit thinner (8 thick instead of 10 because the curves kinda loop on themselves kinda) so when i would be testing it 
  -[x] svg mail icon for right side
  -[x] modal for the right side (email). this is were I will have all of the links to get in touch with me. I changed my mind a little - the modal would be cool but I just opted to make the message board - i think it has a lot more potential but i also have to really look into old recordings cause the referneces that I do have are few and far between.
    -[ ] link all [github, ~~linkedin~~, ~~email~~] (would be really cool if i found or recrated the ond linkedin logo and stuff like that to make it more acurate to the time period. it was cool finding it online and then converting it not all the way to an svg - it is missing the gradients. really not important to me. Claude could not do it for me so I am not spending the hour or two hours that it would take to figure it out)
  -[x] svg for the left side (do i mess with the outline?? i just cant tell)
    -[x] link to my resume (will be my resume link - not sure if I want a dedicated page at this time or just have it be a download link. Well have to think on it more.)

-[x] Article bottom nav
  -[x] grey color background
  -[x] svg with the ever so slightest curve to it 
    -[x] grey fill
    -[x] black line
    -[x] no shadow? correct. no shadow
  -[x] Buttons with blue outline [Home, Fullscreen] (~~in page navigation is going to be a little weird... i dont know a nice way to acomidate all the linking without the user just pressing the back button~~ Al told me how to open in a new tab which I had given up on but it is like super easy - implementing it in Astro might get a little weird tho. _blank)
    -[x] General styling
    -[x] Truely Styled (have the same size and really hone in that svg path) edit: done everything that I can do for now so I am marking it done. It does not look 100% correct yet because that crt filter has not been completed, or started for that matter
    -[ ] animation?? Specifically for the fullscreen mode. Edit: I have kind of changed my tune on what i think about the fullscreen mode - I feel like it really is not all too nessesare. I think it is definatly something that would be cool to have but it does not even fit the aesthetic. I feel likt it is solidly good down to the bottom of the priority list for a long while - way more cooler stuff that i can and am doing {marking done without the animation clicked - ill see if i want to do this once the cooler stuff I can do it done}

-[ ] Main Page
  -[ ] Create a 1d array from the json file 
    -[ ] have it be ordered in the way that is outlined in /src/data/article-order.json
    -[ ] make sure that going thru the articles
  -[ ] teasiers for each of the projects that I have worked on
    -[ ] want to acomidate the mobile users - this will 
  -[ ] if > 8 pages (this is something I dont think is wize to do at this time and this is something that is more of a very end game task)
    -[ ] page flipping 
    -[ ] tease the next few
  -[ ] Make the scaling for many sizes of monitors. have 4x3 be the default and what it will be scalling up from anything - ultrawides all that will have only 12 per screen. i dont really see the y getting scalled down from 3 at all - a thinner than square screen might have a 3x3 but i dont think they will ever have a 2x{} in any normal use case. this is the next thing that I am planning on making - maybe not the page flipping quite yet, but at least getting some of the style down. this is the very frist thing that people will see when they go on the page and I really want it to be something that it technically impressive. 


-[ ] three js
  -[ ] crt filter
  -[ ] animate full screen fuction (at this point - this is so much smaller a part of the project than i thought it would be. I am still really excited to get into three js, but this was originally going to be the way that I learn three js. now it is looking like this is going to teach me a little bit about it, maybe enough to gain a likeing or disliking to it and do more research acordingly. this really eneded up being a normal web dev project. I am learning a lot about front end - which is something that I have never really been intereested in because I was not trying to make something that was interesting just for the sake of observation. I have only really been parts of projects that are trying to solve a problem r do something so the frontend really takes a back seat while)
  -[ ] implement 3d files into markdown files (technical challenge, plus tedious to make the files)
    -[ ] validate the poly cam to three js pile line. edit: this is a royal pain in the ass. I have scanned 2 things (one of them failed) because I tried to do my ipod the same night as I did my test canand it took more than 10 min so I just gave up. this is something that will be so so so cool when it is done and completed, and I am really excited for it, but it is one of those things where it is probably hours of time that I will have to spend scanning in order to get the amount of files that I would Ideally have. So far I feel like I average like 10-15 min per scan. Once i get better it will be like 10 flat. But one of the articles that I have alread written would benifit from like 8 scans. that alone is probably 2 hours (and prob over the course of like 5 days cause I dont have much stamana for moving my phone around an object ackwardly). Claude has validated that it is something that is possible to be done and I have not closed the tab that I have my test can spinning around in and it has been like 3 days, I just get so filled with glee whenever i see it
  -[ ] hover pop out. I really would love to have something that when I hover over the arrow, there is a little animation that will open up like a magnifying glass that will grow out of the back of the arrow, it that little spot I have with the quad curve. That would show the animation that is on the home screen. we can just reuse this.

-[ ] mobile support
  -[ ] change clickable count (2 x 4 icons?) on main page (2x4 would almost definatly work - there is probably a lot more work in finding the comfortable values of the )
  -[ ] move arrow buttons to a more comfortable place edit: I dont know how big of a deal this will even end up being? it takes up maybe 10% total width and like 5% height. I feel like from the surface this feels like not too big of a deal. Edit: i feel like the best solution is just to hide the arrows when you scroll, then when you get to the bottom of the page then the arrows pop back up. I dont know how to do this at this current time, but I feel like that would be the best user exerience without sacrificing too much in the aesthetics
  -[ ] 

-[ ] change cursor (super small thing but i think it very important)

-[ ] Make a proper Readme - i kinda want to cross this one out because i feel pretty good about this readme. ill have to give it another read. also this is something that really is not done until the very end
```