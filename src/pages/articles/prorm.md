---
layout: ../../layouts/articles.astro
title: PRORM
dateWritten: Jun 2026
timeSpan: 2019 - present
tech: [Docker, API Server, PC build, VNC, TTS]
---
I am a reformed gamer, and this is the smoking gun. This PC has enough RGB to light a room. But, as they say, you can remove the "gamer" from the "programmer", but you cant remove "prorm". This is the story of PRO~~g~~R~~am~~M~~er~~.

I'm currently running a docker container to have it function as my api server for my web based e reader project. _Edit: In light of potential legal issues, Speachify existing, having a target market of one, me being that one, and that [Parent Pod](/articles/ipod#parent-pod) paired with a kindle/book is a satisfactory enough solution, this has been deemed un worthy of development. The API is still used for conversion._
This is where the conversion of a .txt file into human-ish sounding audio is processed. I have been slowly tweaking the text to speech, it is still rough at times but at least it's better than the discontinued text to speech program from old FireOS versions on kindle, the inspiration of this project as it made reading much easier for me. But Amazon removed it in 2012, apparently due to writers guild complaints of this cutting into audiobook sales. Surprisingly enough, this first rolled out **after** Amazon acquired Audible.

For the first year in my Worcester apartment this computer sat unplugged under my desk. I decided that in order to not let the 2070 and 32 gb of ram in PRORM not go to waste sitting on my floor another year, I threw it headless into my [Worcester Networking Closet](/articles/woo-network) with TightVNC installed. This was a brutal battle. It would have been trivial if either of the two TVs in our closet worked, PRORM had wifi, I owned my 250ft spool of cat 6 and termination kit before, or had a spare monitor. Or if this thing didn't weigh 40 pounds.

My apartment in Worcester was about 70% hallway and my room was on the complete opposite end of the living room. This is the story of the voyages of PRORM on a fateful October afternoon that marked the start of my Fall term break.
### Trip # 1
###### Bedroom
As PRORM's wifi is non-functional and my bedroom no 50 foot ethernet cable running across the whole house, I installed TightVNC from my mac to a flash drive and installed on PRORM using the only functional monitor in the apartment.
###### Closet
Thanks to the lovely [Ubiquity set up and app](/articles/woo-network), I was able to give a DHCP reservation IP address PRORM and make sure it was live. VNC did not yet work but IP reservation at least did.
### Trip # 2
###### Bedroom
I thought the issue was with the version of TightVNC since I installed from a mac. I installed from a fellow windows device to the flash drive, and it was a different version this time so I figured I would try it.
###### Closet
When I plugged in the ethernet to have vnc not work again, I remembered I had set up some pretty strict Windows Firewall rules ages ago, so I tested the ports. I was able to ping the IP address I had given PRORM, but when I tried to telnet to the ip address on port 5900 (TCP port used by VNC) it timed out.


### Trip #3
###### Bedroom
I disabled Windows Firewall completely. This is not recommend, I turned it back on as soon as I could connect, this time turning on port 5900. As an extra precaution, I set up a firewall rule on my Ubiquity router to restrict all traffic from outside the network to the ip address of PRORM. I kept this rule as this is a Windows 10 PC, and since Windows 10 has reached EOL, I figured it be safer to just not have it connected to the internet.
###### Closet
Telnet on port 5900 is successful. But still no VNC. After digging through forums and reddit posts sitting cross legged on my pealing floor, I realized that TightVNC just does not work if there is no monitor. I still didn't have a spare monitor, but I did find the [DemoForge](https://www.softpedia.com/get/Internet/Remote-Utils/DemoForge-Mirage-Driver-for-TightVNC.shtml) driver made by TightVNC. Essentially this virtualizes an external display so that TightVNC is able to be run on a headless device. I shot up with wobbly, sleepy legs, and red paint scattered across my legs.

### Trip #4
###### Bedroom
Installed DemoForge
###### Closet
Bob's your uncle! After a long afternoon and gaining an excuse to no have to go to the gym that day, I was finally able to connect from my mac and use a real windows computer on my mac! Easy Peasy!

<hr/>

This is the **Computer of Theseus**, and personally I believe I have built this PC. It started as a prebuilt PC bought on Black Friday in 2019, saving almost $200 vs building it by myself, plus it came with a windows license key. I have modded this PC so much in fact that it doesn't even have an active version of windows anymore. Thanks Bill... My new girl Linus is so much nicer to me. I have Swapped the case, yes it was Corsair. Upgraded to 32g of RAM, yes it was Corsair. The 7th gen Intel Motherboard died out of warranty in 2023 (the previous one died within warranty, ASRock...). It was about 20 bucks more to get an new board and Ryzen 5 5500X, about 70% faster than the old 7700k, versus buying a used motherboard, so I replaced both. The SSD and the HDD both were shot after the first motherboard break, so I got an M.2 as my boot drive and upgraded to a 2TB HDD. I even replaced the PSU and the cables with modular ones. Yes. Corsair.