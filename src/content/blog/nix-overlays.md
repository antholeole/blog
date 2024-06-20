---
title: "How To: Nix Overlays"
description: Nix Overlays are very useful tools.
pubDate: Mar 08 2024
---

### Prelude

I'm intentionally choosing to not learn Haskell: It's not because I don't think I have the ability to write Haskell; it's that if I learn it, it will poison every other language I write. Formalized type systems are a one way door, I've heard.

That's how I feel about nix, anyway. I have to use Bazel at work (not in a Google monorepo, either!), and the amount of times the build has broken because the default cloud-workstation image changes and we have to figure out what `sudo apt` to run to get the old version leaves me in a cold sweat at night. 

I've been holding my tongue on a transition to nix as the build system, though: having an esoteric language in a codebase just elevates the maintenance burden (It's not only because of this. Incremental compiles from bazel are also a major blessing - so at least I have a hard reason for not pushing the switch.) (I try to run the mental calculation for the long term benefits of non-breaking builds, and when k8's enter the picture the pot sure does look sweeter.).

That being said, I write literally everything I do for my personal self using nix. When I was first trying to learn nix, I made a Reddit post asking a question about overlays; Some very helpful Redditors tried to explain them, but unfortunately I was all too lost in the nix sauce. But perseverance rewarded, I know feel that I am in a good place to start smoothing the on-ramp (This comes with the warning that I am no nix expert; while I believe everything in this post is factually correct, I may be missing some nuances. I don't think this is all bad; the worst professors are those who are such experts they have forgotten what it is like to be a beginner.).
### Overlays

Some groundwork: while nix flakes aren't stable, they're stable enough that if the proposal was rejected I'm reasonably certain at least half the nix community would move onto a fork with nix flakes. So I'm going to be going through this the "flake" way. The lessons are the same in the flake world and not flake world anyway.

Here are some use cases (I often find it useful to go through potential use cases first.): 

1. If you need a very specific version of a package that is not in the standard nixpkgs.
2. You want all downstream referrers to be able to just say `pkgs.<your-package>` - you don't have to pass them a derivation alongside the package set. 
3. You want to override some detail of a package: maybe you want to make it specifically for wayland, or maybe you want to add some global python packages.
4. You want to add your _own_ package to a package set, so every function doesn't need to also take that package. e.g. `{pkgs, my-package, ...}: my-package.do-something` vs. `{pkgs, ...}: pkgs.my-package.do-something`. 

Some of those look trivial, but tend to actually really clean things up in practice - if you find yourself prop drilling a package everywhere, it might be time to consider an overlay!

In practice, we see 1 in combination with 2 a lot. A popular example is [rust-overlay](https://github.com/oxalica/rust-overlay), which puts a very specific version of rust in the pkgs, so whenever we talk about rust, we know we mean exactly the rust the overlay applied (It ends up being a ton of boilerplate to get a specific rust nightly without that overlay.).

The first important tidbit of information is that nix is lazily evaluated. This means that it is perfectly okay to stuff the entire contents of modern development into a massive set, and then pass it to every single nix derivation. The packages don't actually get _built_ until you evaluate them; `pkgs` takes no time, but `pkgs.redis` builds or fetches you redis!

But how do we actually _get_ a `pkgs`? In the flake land, you specify it as input:

```nix
{
    inputs = {
        # here is nix 23.05 (https://github.com/NixOS/nixpkgs/tree/nixos-23.05)
        nixpkgs-2305.url = "github:NixOS/nixpkgs/nixos-23.05";

        # here is nix unstable (https://github.com/NixOS/nixpkgs/tree/nixos-unstable)
        nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixos-unstable";

        # use whatever version of nixpkgs you want!
        nixpkgs-whatever.url = "<however you want to get nixpkgs>";
    };

    # the inputs are... well, inputs!
    outputs = { nixpkgs-2305, nixpkgs-unstable, ... }: 
    let
        pkgs-2305 = import nixpkgs-2305 { system = "x86_64-linux"; };
        pkgs-unstable = import nixpkgs-unstable { system = "x86_64-linux"; };
    in {
       # derivations, tests, runnables, whatever... 
    };
}
```

You can even select a `nixpkgs` from a specific commit to get an exact version of a package that you want - for example, say you want golang 1.20.4: 

1. Go to [nixhub.io/packages/go](https://nixhub.io/packages/go)
2. Search find the correct package set revision for go 1.20.3
3. Use it as in input to your flake!


```nix
{
    inputs = {
        nix-with-go-1203.url = "https://github.com/NixOS/nixpkgs/e040aab15638aaf8d0786894851a2b1ca09a7baf";
    };

    outputs = { nix-with-go-1203, ... }: 
    let
        pkgs-with-go-1203 = import nix-with-go-1203 { system = "x86_64-linux"; };
    in {
        # this is the go version we want!
        packages."x86_64-linux".my-go = pkgs-with-go-1203.go;
    };
}
```

Okay, that's great; `pkgs` does the trick most of the time. But what if you need one of those use-cases, like you want the python3 instance in that package set to have pandas? We can make it so that any time anyone ever grabs a package from your instance of `pkgs`, they get the one you put there.

If you think about it, overlays are pretty aptly named. You have a packageset, and you "overlay" some modifications on top of it to derive a new package set with some modifications.

```nix
{
    inputs = {
        nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.05";
    };

    outputs = { nixpkgs,... }: 
    let
        pkgs = import nixpkgs { 
            system = "x86_64-linux"; 
            # This is a bit of notation that is a little confusing at first. `final` refers 
            # to the "output" package set, or what the pkg set will look like after the overlay
            # is applied. 
            # "Prev" is the packageset before the current overlay; this is helpful because we don't
            # have to worry about "retouching" the overlay. For example, if we set `final.a` in the
            # overlay and also use it, it will infinitely evaluate the overlay.
            overlays = [(final: prev: {
                # you create some new package in the overlay,
                # or modify an old one.
                pythonWithPandas = prev.python311.withPackages(pythonPackages: [ 
                    pythonPackages.pandas 
                ]);
            })];
        };
    in {
        # this has pandas! It didn't even exist before our overlay.
        packages."x86_64-linux".pythonWithPandas = pkgs.pythonWithPandas;
    };
}
```

Now, we just go to the directory with that flake and run `nix build .#pythonWithPandas`, we can do `./result/bin/python3`  and you'll see that `import pandas` works in that repl! There are some very useful things you can do with overlays. They can get pretty complicated, but they are very powerful.

Sometimes, packages in nix will have inputs that we can override; For example, ripgrep allows us to specify an input withPCRE2 (This means "Perl Compatible Regexp"). It's enabled by default, so if we wanted to disable it, we could pass false to the flag.

[Here's where the flag is specified in nixpkgs](https://github.com/NixOS/nixpkgs/blob/de66856bf823415928efe2088c1cc125fce7fffc/pkgs/tools/text/ripgrep/default.nix#L8C3-L8C12).


```nix
{
    inputs = {
        nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.05";
    };

    outputs = { nixpkgs,... }: 
    let
        pkgs = import nixpkgs { 
            system = "x86_64-linux"; 
            overlays = [(final: prev: {
                ripgrep = prev.ripgrep.override {
                    # this is the flag specified in nixpkgs.
                    withPCRE2 = false;
                };
            })];
        };
    in {
        # this would work without the overlay, we'd just have PCRE2.
        packages."x86_64-linux".ripgrep = pkgs.ripgrep;
    };
}
```

and running `nix build .#ripgrep` kicks off a build! The reason we have to build is because the cached version of `ripgrep` does include PCRE2; when you stray off the beaten path, it likely will require a build. 

That's all I'll be going through currently, but overlays are really quite convenient. I'd recommend giving them a whirl - if not because you can use them right now, then because they'll be helpful on your nix journey eventually.


