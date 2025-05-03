---
title: "Setting up my Home Server Using NixOS & Kubernetes: a Success Story"
description: My home server
pubDate: Apr 24 2025
---

In spirit of writing a personal blogging engine and then writing a single blog post, I present to you a post about a home server running a single service - but not to worry. It's _extensible_ - it's a _platform_.

here's the repo, if you want to check out the code: [https://github.com/antholeole/home-server](https://github.com/antholeole/home-server)

## Services for Developing

I wanted to give credit where credit is due, so the first section of this post is going to rattle off a ton of the lesser-known services that I used to stand up the home server. Outside of the obvious (kubernetes, k3s, Linux, the editor I use etc ad infinium), I used a litany of tools to make my home server tick. Here are a few, some of which I will go into more depth on later.

- [colmena](https://github.com/zhaofengli/colmena), for simplifying NixOS rebuild on remote systems.
- [nix-snapshotter](https://github.com/pdtpartners/nix-snapshotter), for creating and de-duplicating files in images on my home server.
- [NixOS-anywhere](https://github.com/nix-community/nixos-anywhere), for getting NixOS booted on any which system _reproduce-ably_.
- [agenix](https://github.com/ryantm/agenix), [agenix-rekey](https://github.com/oddlama/agenix-rekey), [agenix-shell](https://github.com/aciceri/agenix-shell), for git style secret management.
- [sealed secrets](https://github.com/bitnami-labs/sealed-secrets), for the same as the above but with a "runtime" lean. More on this later.

## What Service (Singular, For Now) do I Host?

 I have a litany of services I'd love to host. I've seen cool apps for self ocr'ing and hosting your paper documents (paperless-ngx) and services for recipes (mealie.io), and of course plex and jellyfin. Instead, I have a single service: [tldraw](tldraw.com). Ever since the canning of google draw, I found myself using tldraw's hosted instance more and more. When I learned they had a self hostable option, I knew I had to try it. I've also had the itch to kubernetes-ify a personal app (I do kube stuff at work - which is fun, but using a managed GKE service an in-cloud makes me sometimes feel like I'm missing some crucial learning opportunities.).

Want to try it? go for it! [draw.oleina.xyz](https://draw.oleina.xyz). Leave me a message - hopefully non-vulgar, although I can't control you.

It's running on a single, 4GB RAM Lenovo think-server I got on eBay for 50 bucks. I have a second one laying around (I couldn't resist the good deal!), but as of yet I don't have enough services running to push the limits of the hardware, so I haven't plugged it in yet. I also have a tablet that is half setup, but life has gotten in the way of happy hacking so I will get to that when I get to it.

## Why Nix and Why Kubernetes?

My first attempt at a platform-of-random-disjoint-services used docker compose many years ago. Docker compose was fine, but it really did feel like a disjoint group of services. I didn't go too deep on it, partly because it did what I needed it to do at the time but partly because as systems grow, they become more and more unwieldy, and I had already felt the complexities of yaml start to creep up at line 50. I wasn't using any yaml generation at all, just straight vim'ing a docker-compose.yaml file like our ancestors intended, and duplication was already getting pretty bad. On a related note, I was pushing the boundaries of what you can do with yaml inside yaml, like anchoring and expanding.

NixOS first attracted me through home-manager (I think home-manager is nix's "killer app" - it has swallowed the ricing community and for good reason. It doesn't fall into any of the pitfalls that predecessors like GNU stow have.) and it's quickly become one of my favorite software for configuring servers, and configuring really _anything_. I also - unlike many - believe it's quite readable, and often find myself diving into packages source code to figure out how a certain software is packaged. 

The thing that hooked me in NixOS that your entire system is grep'able. Every single systemd service you're running is out there in the open, readable and not hiding behind a cli call. You can audit your system in your IDE - you don't accumulate random headers from `sudo apt get`'s that you found off of w3schools. Obviously, the reproduce-ability is very nice as well.

Kubernetes is also similar-ish with the grep-ability: while not perfect (the way I'm currently applying manifests is just services.k3s.manifests, which means it lets you put any garbage you want in there and it may reject when it gets to the control plane.), almost all 3rd party services, like grafana's LGTM stack and end-user services support a helm chart model of deployment. Another "future-proofing" reason kubernetes was attractive was the ease of adding a new nodes: [this section](https://github.com/NixOS/nixpkgs/blob/master/pkgs/applications/networking/cluster/k3s/docs/USAGE.md#multi-node) of the k3s documentation for NixOS paints a straightforward picture of attaching more nodes to the cluster. Through a combination of maintainability, observability and network effects, Kubernetes is an obvious choice given you have the time to understand it (and, it goes without saying that it can often be fun and rewarding to learn something new.).



### how images are build: nix-snapshotter

Here's a tool that makes NixOS such an attractive distro for Kubernetes: [nix-snapshotter](https://github.com/pdtpartners/nix-snapshotter). The text on the tin is a little confusing for those who've only used kubernetes the "standard" way: that is, pushing containers to GCR or ECR and then git-ops'ing some the URL into a manifest.

The main draw, for me, is how you teach your CRI to "speak nix" - as in, I can pass basically whatever derivation I want and it seamlessly works in-cluster.

Essentially, nix-snapshotter allows you to build containers like this:

```nix
caddy-container = let
    caddyfile = pkgs.writeTextFile {
      name = "Caddyfile";
      destination = "/Caddyfile";
      text = ''
        :${builtins.toString port} {
          bind 0.0.0.0
          root * ${static-assets}
          try_files {path} /index.html
          file_server
        }
      '';
    };
  in
    pkgs.nix-snapshotter.buildImage {
      name = "tldraw-frontend";
      tag = "latest";
      resolvedByNix = true;
      config.entrypoint = [
        "${pkgs.caddy}/bin/caddy"
        "run"
        "--config"
        "${caddyfile}/Caddyfile"
      ];
    };
```

For those who can read nix, some things are immediately kind of strange. For one, it's true that `caddyfile` creates a file, but it's not _built in_ to the container. The path is the path on the system's nix store. Using nix-snapshotter, it just works! We don't need to explicitly list the dependencies to be baked into the container, nix-snapshotter will figure it out for you.

other draws:
- files are totally de-duped on the host through the nix store (but they do have to be on the host - that means that even if a pod that uses some container is not scheduled onto that node, the node has it anyway. I could see this potentially being an issue if you had hundreds of pods, although one could think of some solutions involving taints and affinities.), so you don't have to worry about having the same files over and over on a tiny hard drive.
- since containers are pre-loaded, it means that all nodes have the containers it needs - you don't need to wait for a long pull time from some remote registry, you just have it locally.
- it seamlessly solves the disjointedness of having your containers be separate from your manifests. the output of that derivation above is the path to the containers tarball in the nix store;plug it into the final manifest and when you `colmena deploy`, the manifest is versioned with the container.

## colemna, NixOS-anywhere, disko

Here's a stack of three services that you'll never use unless you own and manage your own hardware (although colmena could be used in a cloud environment, or have cloud nodes if you choose to have those.). If you use `services.k3s.manifests` as manifest management, you're going to be `nixos-rebuild switch`'ing a lot. There's a way to do rebuilds remotely, over ssh, but only one at a time. If you have multiple nodes, that could get cumbersome. The solution is very anisble: apply labels to your nodes and rebuild them in groups. For instance, if you only have one main node, it doesn't make sense to rebuild all the replica nodes: you can label them all `k3s` or similar, and then only the main node `main`. Then, `colmenta apply --on @k3s` will rebuild all `k3s` nodes.

But I just bought a piece of hardware! How do I get it under colmena management? A helpful suite of tools are `nixos-anywhere` along with `disko`. These will walk you through the previously very manual process of getting a server to boot into NixOS, and then installing the first generation your NixOS config. Disk formatting has long been very manual, so being able to declaritively format a disk is wonderful.

### End

There's a lot more to mention, but those fall into implementation details: I use cloudflare tunnels to expose the service to the internet. sealed-secrets for "runtime" secrets - that is, secrets that the containers themselves need, and agenix for secrets that the host needs (like a wifi password, for instance.).

Will I revert to running a docker container and nginx on bare metal because the complexity of this system becomes too much to handle? Maybe! But it's currently all good fun, and hacking for hacking's sake. That's it - I'm off to install mealie!
