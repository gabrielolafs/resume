---
layout: ../../layouts/articles.astro

title: De-Natured Path Finding
dateWritten: May 2026
timeSpan: March 2026 - May 2026
tech: [Graph Traversal, Python, OOP, MainsailOS, Klipper, CoreXY]

color: [250, 200, 25]
imgPaths: ["/img/channel/path_finding_01.webp", "/img/channel/path_finding_03.webp", "/img/channel/path_finding_02.webp"]
---

Designed and built an autonomous magnetic CoreXY plotter that drives a wrecking-ball figure across a bed of Chia sprouts. Powered by DeWalt 20V batteries stepped down to 12V for an SKR stepper board and 5V for a Raspberry Pi running Klipper/MainsailOS that also runs the code for movement of the wrecking-ball. 

<hr/>

As a computer science major, all I know is creating code that changes bits in memory or pixels on a screen, or if I'm *really lucky*, bits on persistent storage. In past projects, I have found it to be almost impossible to be satisfied with the end product as it's so easy to push just a few more lines of code to make it that little bit better. I wanted to make something tangible that challenged me and put my engineering skills to work.

The expansion of data centers destroys nature, and much of that damage is unseen ([2](#2)). The concept came naturally from this frustration: if technology is consuming the physical world through data centers, deforestation, and ecological damage ([3](#3)), I wanted to make something that made that destruction visible. I wanted this piece to show this precarious relationship between nature and technology.

The first thing I started on was the electrical components. I got a few 20V DeWalt batteries that needed to be stepped down to 12V for my SKR board that provided silent movement of the motors and logic of the movement via a CoreXY configuration. Then that 12V was stepped down to 5V in order to power the Raspberry Pi that sends the commands, via a python library, to the SKR board and contains all the code for position manipulation ([_fig 2_](#fig-2)). 

##### _Fig 1:_
![fig 1](/img/article/path_finding_fig_1.webp)

Once the components were proved to be functional and this idea viable, I built out the frame from 2020 aluminum. Inside of this frame there needed to be support to maintain smooth motion. For the y support, I used two 400mm guide rails attached to the frame at the max x and min x. For x support I attached a 600mm guide rail directly to the two 400mm rails. On the 600mm rail, I placed a magnet on top of 4 screws, just high enough to guide another magnet through the sewing mat. Then the stepper motors were secured to the frame and so were the supports for the [CoreXY setup](https://corexy.com/theory.html). Next was to get the CoreXY set up and functional. A belt was run through as per the documentation ([1](#1)) calls for and it all attached to the head. Finally, for this frame, I made the support for the sewing mat, just enough distance so that the powerful magnets would be close enough to glide across the surface ([_fig 2_](#fig-2)).

##### _Fig 2:_
![fig 2](/img/article/path_finding_fig_2.webp)

While I was building out the frame, I was germinating the Chia seeds so that they would grow in the time before the showcase. I placed paper towel across the entire sewing mat, dampened it all, and carefully placed chia seeds in the general area that I wanted them to grow. This was then watered 3 times a day for the next 2 weeks.

Finally it came time to code. I created an object for every "decision point" (any point that a change in direction needs to occur) with their associated x and y position. All of these points had to know where they could travel to, inside each object was a can_travel_to list of other objects that could be directly accessed from this location. I also wanted there to be no way for movement to get stuck going back and forth, so I stored the object id of where it just came from. At every point it randomly chose the next point to go to out of the can_travel_to list, with the previous point removed from the list. 

The code first zeroed the x and the y with the switches on the frame, set its current position to the decision point at the very bottom left of the frame and then continuously chose a position to go to and ran G-code to get to the position.

The last physical element I built was the wrecking ball figure ([_fig 3_](#fig-3)) a small form whittled from wood, with a sewing needle arm and a ball of aluminum foil serving as the wrecking ball. In the base was a magnet that hovered just above the head at all times. It was very simple, but it carried the most meaning, and made the entire piece feel more alive. The ball was constantly swinging, responding to the movement of the magnet, even hitting the chia seeds as it moved, giving the piece chaotic motion that was mesmerizing to watch.

#### _Fig 3:_
![Fig 3](/img/article/path_finding_fig_3.webp)

In the last few hours leading up to the final showcase, I ran my suitcase for about an hour with 80-grit sandpaper glued to a magnet. This was done to create wear patterns of the path traveled.

Seeing my piece running at the showcase gave me a monumental feeling of pride. There was no chance to change it, it was complete and nothing more could be tweaked. The chia was alive, the figure with the wrecking ball was moving, and people were stopping to watch it as it traveled. Personally, I was mesmerized for a good 20 minutes just watching it go around, watching the chaotic movement of the wrecking ball, hitting chia sprouts.

### Footnote:
This was for a course called "multimedia art in a suitcase"

### Sources:
#### 1. 
“CoreXY | Cartesian Motion Platform.” n.d. Corexy.com. [https://corexy.com/theory.html](https://corexy.com/theory.html).
#### 2. 
Benn Jordan. 2026. “Datacenters Behaving like Acoustic Weapons.” YouTube. February 18, 2026. [https://www.youtube.com/watch?v=_bP80DEAbuo](https://www.youtube.com/watch?v=_bP80DEAbuo).
#### 3. 
“More Data Centers, More Environmental Problems?” 2025. National Wildlife Federation. 2025. [https://www.nwf.org/Magazines/National-Wildlife/2025/Fall/Conservation/AI-Data-Centers](https://www.nwf.org/Magazines/National-Wildlife/2025/Fall/Conservation/AI-Data-Centers).