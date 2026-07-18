---
title: "WeatherLens — Climate Dashboard"
description: "An interactive weather visualization dashboard with historical data analysis, forecast maps, and customizable alerts for multiple locations."
pubDate: 2025-08-22
heroImage: "/projects/weatherlens.jpg"
tags: ["Next.js", "D3.js", "Tailwind CSS", "OpenWeather API"]
repoUrl: "https://github.com/username/weatherlens"
liveUrl: "https://weatherlens.vercel.app"
featured: false
---

## Overview

WeatherLens transforms raw meteorological data into beautiful, interactive visualizations. It pulls data from multiple weather APIs and presents it through charts, maps, and customizable dashboards.

## Key Features

- **Interactive Maps** — Zoomable weather maps with real-time overlays
- **Historical Charts** — D3.js-powered visualizations of temperature, precipitation, and wind trends
- **Multi-location** — Track weather across multiple saved locations
- **Custom Alerts** — Set up notifications for specific weather conditions
- **Data Export** — Export historical data as CSV or JSON

## Technical Highlights

The app is built with Next.js for server-side rendering and API route handling. D3.js powers the data visualizations, while Tailwind CSS provides the responsive styling. Weather data is fetched from the OpenWeather API with a caching layer to minimize API calls and improve performance.

## Lessons Learned

Working with D3.js inside React components was the most challenging part of this project. I learned to properly manage D3's imperative DOM manipulation alongside React's declarative rendering by using refs and useEffect hooks strategically.
