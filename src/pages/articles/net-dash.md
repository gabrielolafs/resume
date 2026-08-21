---
layout: ../../layouts/articles.astro
title: Net Dash
dateWritten: Aug 2026
timeSpan: May - August 2025 & Ausust 2026 - current
---
A Docker containerized web app utilizing: Flask, PostgreSQL, React, Grafana, Prometheus, and most prominently, SNMP (Simple Network Monitoring Protocol). Able to operate off a single light weight computer or VM (400mb + ~5mb * devices_to_scrape_count RAM) for ease of self hosting.

The purpose of this website is to give network administrators the ability to see  and drill down to network issues with only a few clicks, while also showing graphs with really big numbers for the non networking folks, the hope being for a few of them to get the bug to learn more about networking. 

### Main Page  
Lists all of the "sites" of a network (this to admin to specifically define, dictated by a subnets IP range, typically used for a subnet of a different physical location), and shows the user if there is an issue with a site on the network. Beside the site name, it shows a green, yellow, or red dot based on status. If, for instance, there is a red dot on "Site 1", the admin can click on it, which directs them to a sub page of "Site 1". From there they can see if the issue resides on a Router, Switch, Access Point, or Firewall. The admin is able to drill down to find the route problem, all the way down to the device and specific port, if aplicable. From that page the admin has the device name, IP address, and port that is causing issues. With that information, they are able to solve the issue having never had to search where the problem was. It makes finding a network issue take 3 clicks at most.
### Admin page
This is where administrators can add and edit devices that Prometheus is getting SNMP information from. It is only accessible to administrators, which is determined by an Azure SSO sign in which checks that the user is in the proper user group (something like if they belong to the group "network_admins"). They are able to see all the devices that have already been added, and are able to alter, delete, or add new devices.  

On adding a device, the IP address is required. On input of an IP, a ping to that IP is triggered to ensure the device is reachable. After the device is confirmed to be reachable, and an SNMP community string (functionally a password for SNMP) is provided, the backend performs an snmpwalk to attempt to get the host name, device type, and to Site the device belongs to (cycling through sites to sees the one where the given IP falls within the ip range of a site). 

Once all that information is established, the admin is able to add the device. One more ping and SNMP command is attempted to make sure the IP is still reachable and the community string is valid. Once that is proved true, the device is sent to the backend.

Receiving the minimal information about the device, the backend adds the device to the database, and triggers a few actions. First it adds the device to Prometheus to make sure that it will be getting scraped in the future, that future being within the 30 second scrape timer of Prometheus. This requires an addition to the prometheus.yaml file with the new target, which also depends on whether the device is a router, switch, access point, or firewall, as the prevalent SNMP codes and subsiquent information are different for each. Then the backend modifies and adds to the Grafana dashboard. Every device has a dedicated page, that being built based on the device type. Then the page hierarchally above needs to be appended to with the added device (the site the device belongs to needs to have this device added to). 

I have a version of this website accessible via [GitHub](https://github.com/gabrielolafs/network-dashboard). Even though it is way overkill for my [home network](/articles/home-network), I am currently making modifications so I can have this hosted locally (I really want it on my [kubernetes cluster](/articles/kube) but this currently uses docker compose, I would defiantly have my work set ahead of me if I do decide to switch over)