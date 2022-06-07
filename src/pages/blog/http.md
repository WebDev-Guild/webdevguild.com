---
setup: |
  import Aside from '../../components/Aside.astro'
  import Tooltip from '../../components/Tooltip.astro'
layout: "../../layouts/BlogPost.astro"
title: An Intro to HTTP
publishDate: 2022-06-02
description: Just a Hello World Post!
heroImage: "/social.png"
draft: true
---

When Tim Berners-Lee introduced the world to the Web in 1991, it consisted of three monumental innovations: HTML, URIs, and HTTP. If you had documents (HTML) on another server and a uniform way to reference them (URIs), by extension you also needed a way to get them from the server to a web browser. That's what <Tooltip content="Thats HyperText Transfer Protocol, but like SCUBA, HTTP has pretty much become its own word.">HTTP</Tooltip> is for.

<Aside>

In this post we'll cover the basics of HTTP/1.1, the most common version used today. We'll give an overview of the fundamentals, but if you want

</Aside>

HTTP is a <Tooltip content="Predefined instructions that two computers use to communicate">protocol</Tooltip> for a client to request a <Tooltip content="Resources could be documents, files, images, scripts, data saved in a database, or any other thing the server can transmit to the client.">resource</Tooltip> from a server, and for the server to respond to that request.

<Aside mode="question" title="What about FTP?">

There was already a protocol for transferring files that had been around for 20 years before HTTP came along. It had a lot of issues though that made it a poor choice for simple, ephemeral file transfers that HTTP enables. HTTP connections are _stateless_, which means once the request/response cycle is complete, the connection between the server and client is closed.

<details>
<summary>Show More</summary>

</details>

</Aside>

In the first version of HTTP, the client just sent the URI pathname of the resource it wanted, and the server responded with the contents of that resource, which is about as simple as it gets.

```text
# The request
GET /index.html

# The response
<html>
Hello world!
</html>
```

Unfortunately, this limited what HTTP could respond with, so in an effort to make HTTP more extensible, a few extra things were added to the protocol, including headers, more HTTP methods, and status codes.

<Aside title="How HTTP Works">

At it's core, HTTP is a request/response protocol where both the server and client follow specific rules about the messages being sent. Sending those messages has to happen a transport protocol, usually TCP/IP, but technically other transmission protocols could transmit HTTP messages.

<details>
<summary>Show More</summary>

Most of this stuff isn't important to understand for building apps that use HTTP, but shows how HTTP builds upon the foundation of other internet protocols.

The `IP` part of TCP/IP is the Internet Protocol, an [OSI](https://en.wikipedia.org/wiki/OSI_model) layer 3 protocol which defined IP addresses. TCP is an OSI layer 4 protocol which specifies ports, allowing a single server at a specific IP address to let multiple applications receive network requests.

Making an HTTP request starts with the TCP handshake, a series of messages back and forth to establish a connection between the client and the server. The client opens a random port to receive the request on, sends a `SYN`chronize packet to the server, waits for a `SYN`chronize-`ACK`noledge packet from the server, and then sends a final `ACK`noledge packet back to the server, establishing the connection.

Then the packet is formed, which includes the client's IP address, the IP address of the server, the client's random port, and the server port. For HTTP, that port is usually 80 for HTTP and 443 for HTTPS. Browsers automatically add the correct port, so you don't usually see it in the URI.

The final part of the packet is the payload, which is the text of the HTTP request.

The packet is then sent to the network router, which forwards it along from router to router until it finally ends up at the server. Each jump to a new router modifies the packet slightly, adding the router's IP address so the server knows how to send the packet back to the client.

The response packet looks very much like the request packet, except its destination is the client, and it includes the HTTP response payload.

</details>

</Aside>

## The Anatomy of an HTTP Request

First, lets look at the raw text of an HTTP request.

```
GET / HTTP/1.1
Host: example.com
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
DNT: 1
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Mobile Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
```

You can see the hallmarks of the original spec at the top - the request includes the `GET` HTTP method, the pathname of the resource, and adds the HTTP version. Everything after that is the HTTP headers - extra metadata included with the request to help the server know how to respond.

Let's start at the top and work our way down.

### Request Methods

The first line of HTTP requests specify a method, which changes how the server processes the request. If you've done any work with HTTP APIs before, you're probably familiar with <Tooltip content="Incidentally, HTTP methods are case-sensitive and should always be i uppercase.">GET</Tooltip>, which reads resources, and POST, which creates new resources. With PUT that updates and DELETE that... uh... deletes, you've got everything you need for a CRUD API.

Right next to that is the URI, which is the pathname to the resource. This request is accessing the root of the website at `/`, but any URI path (including URI params) could go there.

### Request Headers

Most of the time you don't have to worry about HTTP headers - the browser will send them for you. But these headers have a lot of power in shaping how the server responds.

For example, the `Host` header tells the server which domain the request is for, which allows multiple domains to be hosted on a single server and enables load balancing for forwarding requests to multiple servers.

The `Cache-Control` header is used for both requests and responses. For requests, it gives the client a way to override the server's default behavior for caching. I made this request through a force-reload, which cleared the cache in my browser and sent the `Cache-Control: no-cache` header to tell the server to send a fresh response.

`Connection: keep-alive` tells the server to keep the TCP/IP connection open for future requests, which speeds up any other resources that might be referenced by the HTML file.

`User-Agent` is a string to tell the server what kind of program or web browser is making the request. It's often been abused by browsers and servers alike for fingerprinting users or changing the response based on the user's browser, which is why it looks so funny. There are [efforts being made](https://developer.chrome.com/en/docs/privacy-sandbox/user-agent/) to reduce the amount of information sent in this header.

`Accept`, `Accept-Encoding`, and `Accept-Language` tell the server what kind of data the client is expecting. This includes the type of file, how the file is encoded or compressed, and what language the content is in. This request prefers to receive `text/html` files, which is the MIME type for HTML files, but the `*/*` wildcard says it will accept any kind of file.

The specification includes [_many_ other request headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) that can be included to affect how the request is handled, including authentication, cross-origin resource sharing, caching, cookies, security, and lots more.

<Aside mode="question" title="Do servers really respect all of this?">

It's ultimately up to the web server whether it will respect the headers and methods sent by the client. A classic example is the `DNT`, or "Do Not Track" header, which was introduced in 2009 to prevent websites from tracking users across the internet. Even when the browser sent this header, there was nothing keeping the server from fingerprinting the request and sharing user information with other sites. Because of this, the header was deprecated in 2019.

If you're building a web server and want it to be as robust as possible, you'll want to consider all of the headers and methods that might be sent by a client and tailor your responses to accommodate each of them.

Remember the robustness principle: "Be conservative in what you send, be liberal in what you accept."

</Aside>

That's the request. what about the response?

## HTTP Responses

Here's the raw text of the response from the earlier HTTP request.

```
HTTP/1.1 200 OK
Content-Encoding: gzip
Accept-Ranges: bytes
Age: 566333
Cache-Control: max-age=604800
Content-Type: text/html; charset=UTF-8
Date: Sat, 04 Jun 2022 00:48:51 GMT
Etag: "3147526947"
Expires: Sat, 11 Jun 2022 00:48:51 GMT
Last-Modified: Thu, 17 Oct 2019 07:18:26 GMT
Server: ECS (bsa/EB15)
Vary: Accept-Encoding
X-Cache: HIT
Content-Length: 648

<!doctype html>
<html>
<head>
    <title>Example Domain</title>

    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
    body {
        background-color: #f0f0f2;
        margin: 0;
        padding: 0;
        font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;

    }
    div {
        width: 600px;
        margin: 5em auto;
        padding: 2em;
        background-color: #fdfdff;
        border-radius: 0.5em;
        box-shadow: 2px 3px 7px 2px rgba(0,0,0,0.02);
    }
    a:link, a:visited {
        color: #38488f;
        text-decoration: none;
    }
    @media (max-width: 700px) {
        div {
            margin: 0 auto;
            width: auto;
        }
    }
    </style>
</head>

<body>
<div>
    <h1>Example Domain</h1>
    <p>This domain is for use in illustrative examples in documents. You may use this
    domain in literature without prior coordination or asking for permission.</p>
    <p><a href="https://www.iana.org/domains/example">More information...</a></p>
</div>
</body>
</html>
```

Most of it is the HTML payload at the bottom, but if you squint it almost looks like the request, just with different content in the top.

### Status Codes

Instead of specifying the method and URI like the request, the first line of the response is the [status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). It gives the client a summary of how the request went and possibly some instructions for how to handle the response.

There are lots of status codes you can use for certain situations, like `204 No Content` when the request was successful but there's nothing to return, or `405 Method Not Allowed` when the server can't handle the method, or `507 Insufficient Storage` when the server has run out of disk space.

<Aside title="🫖">

[`418 I'm a teapot`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418) is an actual status code that was added to HTTP in 1998 as an April Fools joke. There's now [a movement](https://save418.com) to keep this status code in the spec.

</Aside>

Status codes are separated into 5 groups, designated by the third digit:

- 1xx: Informational responses. I've only seen these used for websocket upgrades.
- 2xx: Successful responses.
- 3xx: Redirection, for sending the client to a different resource. These are commonly used for maintaining good SEO when a path changes or sending the user to the correct page after a login attempt. `307 Temporary Redirect` means the client can keep using the same URI for future requests, since the URI might change again in the future. `308 Permanent Redirect` means the resource will always be at the new URI. In either case, the `Location` response header should include the new URI.
- 4xx: Client errors, when the client has an error in the request. These include access and authentication errors (`401 Unauthorized` and `403 Forbidden`), timeout errors (`408 Request Timeout`), and rate limiting errors (`429 Too Many Requests`).
- 5xx: Server errors, when the server can't process the request due to problems on its end. Maybe a critical service it relies on is unavailable (`503 Service Unavailable`) or the server doesn't implement an HTTP method (`501 Not Implemented`).

Most commonly when you're writing a server, you'll use `200 OK` for successful requests, `404 Not Found` for resources that don't exist, and `500 Internal Server Error` for unexpected errors. But the other status codes can be helpful for clients to quickly know why the request failed. Like with request headers, it's up to you to decide how robust you want your server responses to be.

It's also helpful to remember that any status code can still send a payload, which can help the client understand what went wrong and any steps to fix it. Even the server can help provide a better user experience.
