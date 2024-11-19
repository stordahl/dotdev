---
title: Dynamic Styles at the Edge
slug: dynamic-styles-at-the-edge
description: Serving dynamic stylesheets faster than a CDN
date: '2024-11-18'
published: true
---

I recently deployed a really interesting service to production at my day job, and wanted to write a bit about it.

## Some Context

My team builds and deploys ~20 [white label](https://en.wikipedia.org/wiki/White-label_product) Third Party JavaScript widgets to hundreds of e-commerce sites. These widgets render UI that displays different shop-able content to users. These widgets are essentially tiny [Single Page Apps](https://en.wikipedia.org/wiki/Single-page_application) with the following rendering strategy.

1. Download JS and CSS onto the page
2. Create a widget instance, providing a root element to render into
3. Call the widget instance render method to fetch API data and render the UI

At a basic level this works pretty well, but there were a few problems we ran into as we scaled, particularly around CSS.

## Problems

For e-commerce retailers, unified UI styles are critical for cohesive pages, especially when adding third party experiences to a page. This is why our clients will often write custom CSS that targets our widgets HTML. However, this comes with a downside - we have to be very careful about updates to our HTML. Any updates can break the custom CSS clients have written. For example...

```html
<!-- before update -->
<!-- HTML -->
<div class="container">
  <button>
    <span>Shop</span>
  </button>
</div>

<!-- Client Custom CSS --->
<style>
  .container button span {
    color: red;
  }
</style>

<!-- after update -->
<!-- HTML -->
<div class="container">
  <button>Shop</button>
</div>
```
This kind of update would break the CSS our client has added to their pages. The end result of this is that we can't improve our HTML structure, which is especially painful for older products that were built before elements like `dialog` were added to the platform.

The second problem is that, we want the ability to provide "no-lift" updates for high tier clients that often have little engineering resources, or during extensive code-freeze periods around the holiday shopping season. With our previous method for handling CSS, it was difficult to handle client specific styling edge cases as we scaled to more clients.

The last issue is around granular a/b testing of UI styles. As is common in e-commerce, we like to perform very granular a/b tests around small bits of UI; a call to action button size or color, product promotion label color, and sale price treatment, are all examples of meaningful a/b tests we could perform using only CSS. Previously, the strategy has been to provide any number of classes that can dynamically be applied based on the a/b test. However, this means our components are a lot larger than they need to be, and we are shipping styles for every single variant, to every single user. 

## Project Constraints

There is one huge constraint we had for this project - we need to continue to only load one stylesheet on the page. The original proposal for this project simply entailed loading additional stylesheets onto the page. The benefits with this approach are that, by loading these styles across multiple stylesheets (often called code splitting), we can make use of multiple concurrent HTTP connections. However the issue we ran into is around scale. We ship JS and CSS assets through a [CDN](https://en.wikipedia.org/wiki/Content_delivery_network), typically to hundreds of millions of users a month. When we started thinking about expanding this service, it became apparent that we would balloon our CDN bill. So what can we build that solves the previous problems and meets this constraint?

## A Serverless CSS API

If we need to serve a single stylesheet, and we don't know what stylesheets we need until the widget loads in the client (remember we need a/b testing data for the users session), it's pretty obvious we need a server of some kind. My team has previously deployed a few services using Google Cloud Functions, which made it an obvious consideration. However, I know traditional lambda serverless functions suffer from [cold start](https://mikhail.io/serverless/coldstarts/aws/), which could be an issue when serving a response that needs to be fast in order to not result in a flash of unstyled HTML. 

During the planning of this project, I had been building a few side projects with Cloudflare workers which are architecturally different than lambdas, so I decided to build two prototypes; one with Google Cloud Functions, and one with Cloudflare Workers.

## The Prototypes

Both prototypes work in almost the same way...

1. Parse URL search parameters from the incoming request to identify which CSS files are needed
2. Request all needed CSS files directly from our public asset storage bucket (bypassing the CDN)
3. Concatenate the contents of all files into one string
4. Return the concatenated string as the response

The main difference here is that Cloudflare Workers have a feature called the Worker Cache where you can cache a response by defining a key and pushing the response to the cache before responding to the request. This means that we first check if a cached response exists for this particular set of URL search parameters, and if not, we make sure to push to the cache.

## Performance Testing the Prototypes

Since we already have multiple GCP Functions in our codebase, we need to make a pretty good case for diverging from that norm, so I set out to do some basic testing of these two prototypes. For these tests I used [autocannon](https://github.com/mcollina/autocannon), a popular Node based http 1.1 testing tool. Besides testing the prototypes, I wanted some kind of control so I ran autocannon against a static CSS file from our storage bucket. For each test I spawned 100 connections. The results were pretty convincing...

| Service | Total requests | p50 | p90 | p99 |
| --- | --- | --- | --- | --- |
| Static File | 11k | 89ms | 117ms | 188ms |
| GCP | 9k | 96ms | 117ms | 1255ms |
| CF  | 25k | 36ms | 48ms | 70ms |

The GCP function wasn't too far behind the control in terms of total requests served, however the p99 was extremely unsatisfactory for this use case. The CF Worker on the other hand, was 18x faster than the GCP function and 2.5x faster than even the static file. These numbers were enough to convince us that a CF Worker was the right choice for this service.

## To Production

After testing, I fleshed out the prototype to have solid error handling and gracious fallbacks, and soon it was deployed to production. We rolled this new API out to a few of our larger clients and after one month in production, we saw 53 million requests come through with a 0.01% error rate. If you're doing any holiday shopping on a major US retailer website in a different tab, you're possibly using it.

What stood out to me the most while working through this project was the power of Cloudflare Workers. We were able to go from idea to production incredibly quickly and immediately integrate this service as a critical part of our infrastructure. There aren't many tools I can say that about.

Anyways; off to build more stuff with Cloudflare.
