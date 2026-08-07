---
layout: ../../layouts/articles.astro
title: PRORM
dateWritten: Jun 2026
timeSpan: 2019 - present
scanned: flase
---
I am a reformed gamer, and this is the smoking gun. This PC has enough RGB to light a room. But, as they say, you can remove the "gamer" from the "programmer", but you cant remove "prorm". This is the story of PRO~~g~~R~~am~~M~~er~~.

As this PC is always online, I'm currently running a docker container to have it function as my api endpoint for my web based e reader project. Essentially whenever I want to convert a .txt file into human sounding audio, this is where it ends up to be processed. So far I have converted two books and put them on [Parent Pod](/articles/ipod#parent-pod) while I test reading along physical book, being my own tester. I am using a c library that does the conversions, I've made small improvments, but it still needs much personalization. I have a kindle and an iPod and Im testing if the website that would combine these and make it accessible across multiple device would even be worth the effort it would take (plus I assume the legal problems). Its better than the old discontinued text to speech program that the old kindles used to have before Amazon removed it in 2012, aparently due to writters guild complains of this cutting into audiobook sales, and Amazon first rolled this out **after** aquiring Audible. Apparently they tried again in 2024 - 2025 with Assistive Reader but it was shortlived, now the only option is to buy the audiobook with Audible. I'm sure it was the writters guild again.

For the first year in my Worcester apartment this computer sat unplugged under my desk. I decided that in order to not let the 2070 and 32 gb of ram in PRORM to not go to waste sitting on my floor another year, I threw it headless into my [Worcester Networking Closet](/articles/woo-network) with TightVNC installed. This was a brutal battle. It would have been trivial if either of the two TVs in our closet worked, PRORM had wifi, I owned my 250ft spool of cat 6 and termination kit before, or had a spare monitor. Or if this thing didn't weigh 40 pounds.

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

This is the **Computer of Theseus**, and personally I believe I have built this PC. It started as a prebuilt PC bought on Black Friday in 2019, saving almost $200 vs building it by myself, plus it came with a windows license key. I have modded this PC so much in fact that it doesn't even have an active version of windows anymore. Thanks Bill... My new girl Linus is so much nicer to me. I have Swapped the case, yes it was Corsair. Upgraded to 32g of RAM, yes it was Corsair. The 7th gen Intel Motherboard died out of warranty in 2023 (the previous one died within warranty, ASRock...). It was about 20 bucks more to get an new board and Ryzen 5 5500X, about 70% faster than the old 7700k, versus buying a used motherboard, so I replaced both. The SSD and the HDD both were shot after the first motherboard break, so I got an M.2 as my boot drive and upgraded to a 2TB HDD. I even replaced the PSU and the cables with modular ones. Yes. Corsair.