---
title: "The Weird and Wonderful Way I Deploy Manifests to my Homelab"
description: getting into homelabbing for enterprised brain
pubDate: July 05, 2025
---

There was originally a long article here about how I got to where I am, and I figured no one would read it so I added this TL;DR at the top.

Turns out, the TL;DR was much better than the article itself so I got rid of it and just kept the TL;DR.

---

tl;dr:


1. I use [cdk8s](https://cdk8s.io/) to create manifests. I have a [nix derivation](https://github.com/antholeole/home-server/blob/df45bd9b18bc535a8b682ef16e2130d587a0ef9a/cdk8s/default.nix) that generates the manifests. 
2. I create the images I need with [nix-snapshotter](https://github.com/pdtpartners/nix-snapshotter), and then use `kustomize` to put the image with the correct tag into the manifests. Fully declarative manifests!
3. I use [colmena](https://github.com/zhaofengli/colmena) to basically `nixos rebuild switch` across many nodes.
4. Those manifests get statically served in-cluster by [rclone](https://rclone.org/commands/rclone_serve_s3/)...
5. which [fluxcd](https://fluxcd.io/) scans every 30 seconds for new, dead, or updated manifests.
6. flux applies my manifests!

The benefits of my rube-goldberg machine are:

1. flux garbage collects old manifests. This means I don't have to manually remove dead manifests from the API server.
2. CDK8's stops me from shooting myself in the foot by e.g. exposing the wrong port of a service.
3. By serving through rsync instead of git pushing, I can iterate quickly buy not having to make a git commit for every change. We've all been there: `did it work commit1`, `did it work commit2`, ... Flux doesn't have an http server source btw - only S3.
4. My manifests are tied to my nixos config, so I can change the hardware and the manifests in lockstep.

So far, it's working great! I need some sort of notification that tells me if fluxcd is failing to reconcile.... perhaps an arduino with a LED that turns red if it can't reconcile (/foreshadow!)?

the entire apply cycle takes roughly a minute and a half. A minute to build the manifests (this is my fault - a ton of things get rebuilt that don't need to. At some point I need to go audit my nix file sets), and 30 seconds for flux to pick up the manifests and begin to reconcile.

