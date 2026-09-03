---
layout: ../../layouts/articles.astro
title: WPI Home Lab
dateWritten: Jan 2026
timeSpan: Aug 2024 - May 2026
tech: [Ubiquiti, Pi-hole, Ubuntu Server, DNS, Self-Host]
---
My apartment in Worcester was not a place of beauty. It was a place to sleep at night, and in the winter months, under 4 blankets. For the sake of my roommates, the networking had to be easily deployed and functional, but I also wanted the ability to mess around a little. After a conversation with a coworker whose job is to be a good network engineer, I opted for a Ubiquity setup, and I could not be more happy with the decision. Instead of renting a router from our ISP for two years, I chose to spend 20 dollars more up front for an Express 7 router, a Lite 8 PoE switch, and 2 U6+ Access Points. Plus I got to keep all the equipment after the fact, deploying them in my [home home lab](/articles/home-network) as a dedicated lab network with only my equipment connected to it.
### Cool things in the Networking Closet:
##### Prorm (pro~~g~~r~~am~~m~~er~~ PC):
Remote software installed to allow direct hardware access to a fairly competent windows computer. No virtualization software or Windows API (like [Wine](https://www.winehq.org/)) needed. A longer write-up @ [Prorm](/articles/home-network)
##### Pi-Hole:
My local DNS server for things such as [PRORM](#prorm-programmer-pc) and [CopyParty PC](#copyparty-pc). My biggest selling point for a [Pi Hole](https://pi-hole.net/) is that it can easily be configured as a network wide ad-blocker, filtering out known advertising DNS resolutions.
##### CopyParty PC:
Functions as a NAS with a Plex/Jellyfin experience accessible via a browser. Used a laptop I acquired for extremely cheap around the Windows 10 EOL. This laptop only had 500g of storage (less than [Parent Pod](/articles/ipod#parent-pod---512g)...) on one ssd, so TrueNAS was overkill and wouldn't allow for the redundancy features that TrueNAS has to offer. I installed Ubuntu Server and then [CopyParty](https://github.com/9001/copyparty). With one cronjob to run the CopyParty python file every reboot, CopyParty was ready to go! I highly recommend CopyParty, it can even play .mp3 and .mp4 files in the browser, all of this off a computer that would go wasted sitting in a bin.
##### tplink 5 port switch:
I needed this, and it was silly that I did. The culprit was EEE (Energy Efficient Ethernet), a power saving feature that caused the port to remain down. This was no problem for Network Equipment Hoarder Man! I used one of the extra ports for an old cisco router, which created another network and allowed me to play around with some lab equipment without messing with my roommates network.