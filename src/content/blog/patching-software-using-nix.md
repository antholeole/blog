---
title: "Patching Software Using Nix (For Laymen)"
description: A laymen tutorial.
pubDate: Mar 17 2024
---

Patching software (a quick rundown on patching, since it has become apparent that it is not in every dev's toolbox: code is just text files. There exists a file format that is a diff between real code and desired code; for instance, maybe you want to add a feature or change some functionality. You can make your edits and generate a patch file and then apply it to the source to get a version with your changes.) is incredibly powerful. Instead of having to maintain a fork, or figure out how to distribute your version of the patched software, you can keep a `.patch` file alongside your nix code and apply it at build time. 

Nix makes it easy to apply patches to code in the `nixpkgs` set, but like many things in nix, the functionality is kind of buried behind a lack of documentation - you can do it, it is not difficult, but figuring out how is non-trivial. 

I'll attempt to bridge the gap here and show how patching software using nix is relatively easy compared to other build systems or package managers.

## Finding a patch target

The first step is to find the software you want to patch. For our case, lets patch a VSCode extension (This is what I was doing that inspired me to write this article.). You can patch any derivation, not just ones in the nix package set.

The vscode extension in question is going to be the [Picat extension](https://github.com/arthwang/vsc-picat); the extension hasn't been touched in 7 years but still does _roughly_ what is asked of it. In this case, I just want to add a quick `console.log()`. A special note here: This file is not in the nix package set! We get it from [nix-vscode-extensions](https://github.com/nix-community/nix-vscode-extensions), a helper flake that puts the entirety of openvsx and the vsc marketplace into nix derivations.

## Isolating the derivation

A useful tool is to create a flake with a single output: the package you'd like to patch. Here's what that looks like for this case:

```nix
{
    inputs = {
	vsc.url = "github:nix-community/nix-vscode-extensions";
    };


    outputs = {vsc, ... }: {
        # Change this to your architecture if you're not running on x86 linux.
	    packages.x86_64-linux.default = vsc.extensions.x86_64-linux.vscode-marketplace.arthurwang.vsc-picat;
    };
}
```

This flake is _dead simple_. We specify only a single input (not even nixpkgs - we don't even need it!) and a single output, where the output just shells out to the extension we need. 

We can test that it works by running `nix build .#`. the # is the symbol for a "flake" - so this is saying "build the flake in the current directory" (hence the dot.). When we're running nix build, we want to build a package. If we don't specify which one, it will look for `packages.<your system>.default`. If you did specify a package name, e.g. `nix build .#foo` it would look for `packages.<your system>.foo`. 

If the build worked, you'll see a directory called `result` in your pwd which contains the finished derivation.

## Creating the patch 

Sometimes, the derivation will do something strange with the source - in this case, nix isn't just cloning a git repo like many derivations do. If that is the case for your package, this step is very easy and you can just generate a patch the standard git way. Otherwise, we need to figure out the format of the zip file. Sometimes we can look at the declaration of the derivation and download the zip ourselves, but I find it easier to drop into the nix builder environment since it reduces the guesswork.

How do we do this? `nix develop .#`! Once you run that command, you'll enter a new shell that the derivation uses to build. You now have access to the different [build phases](https://nixos.org/manual/nixpkgs/stable/#sec-stdenv-phases) as cli commands. The one that we're after is the [unpack phase](https://nixos.org/manual/nixpkgs/stable/#ssec-unpack-phase). The manual is pretty good at explaining this, but essentially it just downloads what is in the `src` field and unpacks it as required. In our case, it will unzip the downloaded zip to `$out`. Since we're in a nix shell, `$out` is the current directory. 

Lets not pollute our cwd and go into a sub-directory: `mkdir drv && cd drv` (Name this dir literally whatever you want). Now, run the unpack phase: 

```
$unpackPhase

unpacking source archive /nix/store/0jy87nci368bq2dv2zir6yyk61ihaxlh-vsc-picat-0.1.21.zip
source root is extension
setting SOURCE_DATE_EPOCH to timestamp 1549945778 of file extension/README.md
```
How nice of nix - it tells us that the source root is actually in another directory (Specifically, it says: "source root is extension", telling us that the source is in the "extension" directory.). If we run `ls`, the output is:

```
extension  
[Content_Types].xml  
extension.vsixmanifest
```

Some other stuff came with the archive, but we actually want to edit the extension directory. Here's an important note: we should apply the already-specified patches now! This package does not have any patches by default, but some derivations do. If we were to edit the same file that the already specified patches do, there would be a conflict. Both patches apply to the source well, but when combined it causes problems (Consider the case where we have a file foo.txt. Someone adds a line to the very top of the file, and we add a line somewhere below that. Our line would be off by one if we let their patch apply first!). 

cd into the source root (`cd extension`) run the following command: `patchPhase`. This will apply the patches that the original package has asked to apply. In this case, it does nothing - but it's always prudent to check and avoid headaches later down the line.

We can now make our patch! The easiest way to do this is to initialize a git repo. In the source root: `git init . && git add --all && git commit -m "init"`. Now we can make our changes in the code.

Go ahead and make your changes to the source code; I'll wait here until you're done. For me, I'll be adding my `console.log`. 

--- 

Once you're done, we're ready to generate that patch: `git diff HEAD` will show us the diff (If you have git setup to use difftastic by default, it will generate a non-patch file compatible diff. You should add the --no-ext-diff flag.). If the diff looks correct to you, put it next to wherever your flake is: `git diff HEAD > ../../mypatch.patch`. 

And thats our patch! Feel free to delete the `drv` directory now, or wait until the end just incase we messed up.

## Applying the patch

Now we get to apply the patch. All derivations come with the `.overrideAttrs` attribute, which does what it says on the tin: it allows us to override some attributes on the derivation. We want to override the `patch` attribute to also take our patches.

```nix
{
    inputs = {
	vsc.url = "github:nix-community/nix-vscode-extensions";
    };


    outputs = {vsc, ... }: {
	packages.x86_64-linux.default = vsc.extensions.x86_64-linux.vscode-marketplace.arthurwang.vsc-picat.overrideAttrs (o: {
        	patches = (o.patches or []) ++ [ ./mypatch.patch ];
      });
    };
}

```

Remember how we said we want to apply the default patches first? that's where the `o.patches or []` comes from. We're telling nix that we want to create a list that either has the patches specified or an empty list, and then appending our own patches. If you're initialize this as a git repo, remember to `git add mypatch.patch` - otherwise nix will say it can't find that file.

## Running and verifying

That's it for applying the patch! run the build command `nix build .#` again. Now you should see the build happening. In the `./result` directory, you should see the code with your patches applied (This is easier in a interpreted language like JS or Python - it's hard to find code differences in binaries. If you have a compiled language, run the steps of nix develop and patchPhase. You can then verify the source code is in your desired state.%). 

Figuring out how to integrate the patched package into a bigger system is out of scope, but nix makes it easy to apply vscode extensions with the `vscodeWithExtensions` [derivation](https://nixos.wiki/wiki/Visual_Studio_Code).

And that's it: congrats! You've patched source code in a portable way. 