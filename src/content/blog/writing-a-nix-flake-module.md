---
title: "Writing and Using Nix Modules"
description: Nix modules
pubDate: Apr 04 2024
---

Look at the [following documentation page](https://nix-community.github.io/home-manager/options.xhtml). It is beautiful. Hundreds of options all well-documented and explained, with examples, defaults, and source code locations. 

This is the beauty of the nix module system. Projects define how to create or consume a nix module; for instance, the wonderful [nix-index-database](https://github.com/nix-community/nix-index-database/blob/93aed67288be60c9ef6133ba2f8de128f4ef265c/flake.nix#L42-L45) defines a `home-manager` module. We can plug it into our [dotfiles](https://github.com/antholeole/nixconfig/blob/fcbe37f177435fb8817ed6b71190dd8e0e12f25b/hmModules/anthony.nix#L13) and [use it](https://github.com/antholeole/nixconfig/blob/main/hmModules/nix-index.nix)! 

Projects often define their own module system, like we just saw with `home-manager`. Another popular project that allows us to define modules is [flake parts](https://flake.parts/), a library that splits your flake up into multiple, smaller parts - and gives you more control into the components that you "plug in" to your `flake.nix`. 

## What is a module, and how do we use it?

A module plugs into a module system to expose a new set of features. In the following example, we'll use the `treefmt-nix` module and plug it into a `flake-parts` module system to expose some formatting features.

Perhaps I have a big project that's written in `terraform` - `tffmt` works for me for the most part, but now I want to lint my markdown files as well. I could stuff my `flake.nix` with `tree-fmt`:

```nix
{
  inputs.treefmt-nix.url = "github:numtide/treefmt-nix";

  outputs = { self, nixpkgs, systems, treefmt-nix }:
    let
      eachSystem = f: nixpkgs.lib.genAttrs (import systems) (system: f nixpkgs.legacyPackages.${system});
      treefmt = eachSystem (pkgs: {
        projectRootFile = "flake.nix";

        programs.terraform.enable = true;
        programs.markdown.enable = true;
    });
    in
    {
      formatter = eachSystem (pkgs: treefmt.${pkgs.system}.config.build.wrapper);
      checks = eachSystem (pkgs: {
        formatting = treefmtEval.${pkgs.system}.config.build.check self;
      });
    };
}
```

This works well, but after a flake gets large it begins to get really, really messy - and besides importing files, there's no "vanilla" way of splitting this up.

Instead, we can do the following:

```nix
{
  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    treefmt-nix.url = "github:numtide/treefmt-nix";
  };

  outputs = inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "x86_64-linux" ];
      imports = [
        inputs.treefmt-nix.flakeModule
        ./modules/treefmt.nix
      ];
    };
}
```

most "module consumers" will specify an `imports` attribute, which allow you to load in different modules. In this example, we load in the `treefmt-nix` module - this tells `flake-parts` that we want to expose the features of `treefmt-nix`. That is, `treefmt-nix.flakeModule` is a template of sorts and lets us configure it. 

and then, in `./modules/treefmt.nix`:

```nix
{ inputs, ... }:
{
    perSystem = {}: {
        treefmt = {
            programs.terraform.enable = true;
            programs.markdown.enable = true;
        };
    };
}
```

So the `treefmt-nix.flakeModule` exposed a `treefmt.programs.terraform.enable` option, and we configured it in this module.

What a useful abstraction! we can now put as much `treefmt` specific stuff in that file without worrying that we will get stuff tangled.

Typically, projects will expose some sort of module-system plugin; whether it be a `hm-module`, a `flake-module`, or a `nixos-module`, modules tend to be a very easy way to consume external nix code.

## Writing a Module 

So what does it take to _produce_ a nix flake module? Remember: everything in nix boils down to attribute sets - so a module is an attribute set that conforms to a specific format. 

In this example, we will write a `flake-parts` module - the modules for all module systems consume the same-ish API, so if you're after a tutorial for writing e.g. a `nixOS` module, this is pretty much the same thing. 

Lets get some details: at the end of the day, we need to expose _something_ to the user - for example, in `nixOS`, we can e.g. write a module that exposes a nice API for configuring a systemd service. The module provider will give you the tools to do things, and your module is an API around it.

Lets say we want to  have a nice API for some package we are creating - we want to configure it in a `flake-parts`-y way. First, we need to have some way for the user to consume our module. The easiest way is to write a flake and publish it on github - or something like [flakehub](flakehub.com), a kind of registry for flake modules. 

Lets write a package that takes a string and a number, and then outputs it to stdout that number times. We want the user, the consumer of the flake, to say something like:

```nix
{
    string = "some string";
    times = 3;
}
```

and then when we execute the binary for our derivation, we echo `<some stringsome stringsomestring>` to stdout! Very useful, I know.

lets start by writing that flake we mentioned earlier:

```nix
{
  description = "String repeater";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = {
    self,
    nixpkgs,
  }: let
    systems = [
      "x86_64-linux"
      "aarch64-linux"
      "x86_64-darwin"
      "aarch64-darwin"
    ];

    forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
  in {
    flakeModule = import ./module.nix;
  };
}
```

ta-da! now, if we run `nix flake show`, we see something like:

```
󰘧 nix flake show .#
git+file:///some/dir
└───flakeModule: unknown
```

lets create that `./module.nix` file now.

```nix
{ lib, flake-parts-lib, ... }: {
  options = {
    perSystem = flake-parts-lib.mkPerSystemOption
      ({ system, pkgs, ... }: { options = { }; });
  };
}
```

`flake-parts` exposes a nice `flake-parts-lib` library with useful features like `mkPerSystemOption`. If you're unfamilar with flake parts, `per-system` is the way that `flake-parts` nicely abstracts around having to sepecify `system` everywhere. It automatically applies the `system` parameter to these options, meaning any system we define in `flake.nix` is useable.

Lets define our options. First, we want to be nice to our nighbors and tuck away this option set into a nested one; that way the user isn't setting `repeat = 3` on the gobal scope, which means literally nothing to most readers; we want them to have to set `string-repeater.repeat = 3`. 

```nix
{ lib, flake-parts-lib, ... }: {
  options = {
    perSystem = flake-parts-lib.mkPerSystemOption ({ system, pkgs, ... }: {
      options = {
        string-repeater = lib.mkOption {
            type = lib.types.submoduleWith {
          modules = [
            ({ config, ... }: {
              options = with lib; {};
            })
          ];
        };
        };
      };
    });
  };
}
```

what does _that_ say? We defined a sub-module called `string-repeater`. the type of the submodule is... well, a submodule! we pass in `system` and `pkgs` into that submodule. Either we define some primative, or a submodule. Any "nested attribute" is a submodule. That submodule needs its own `options` section, too.

Lets first add the `repeat` and `times` part that we talked about:

```nix
{ lib, flake-parts-lib, ... }: {
  options = {
    perSystem = flake-parts-lib.mkPerSystemOption ({ system, pkgs, ... }: {
      options = {
        string-repeater = lib.mkOption {
            type = lib.types.submoduleWith {
          modules = [
            ({ config, ... }: {
              options = with lib; {                
                string = mkOption {
                  type = types.str;
                  description = mdDoc "The string to repeat";

                  example = "hello world!";
                };

                times = mkOption {
                  type = types.int;
                  default = 1;
                  description = mdDoc "number of times to repeat the string";
                };
              };
            })
          ];
        };
        };
      };
    });
  };
}
```

And we have the options defined! We can now _use_ them to create the package that we need. Notice how the structure of this module is pretty similar to what we want? It follows the `{string = "hello world!"; times = 5; }` pattern. 

So how do we use our options? well, at the top level, we configure an `options`; we can also configure a `config`; the `config` can set values on our options. Why would we want to do that? Because we can set a option as _output only_! This means that the user can read from the option but never set to it, which is exactly what we want.

```nix
{ lib, flake-parts-lib, ... }: {
  options = {
    perSystem = flake-parts-lib.mkPerSystemOption ({ system, pkgs, ... }: {
      options = {
        string-repeater = lib.mkOption {
            type = lib.types.submoduleWith {
          modules = [
            ({ config, ... }: {
              options = with lib; {                
                string = mkOption {
                  type = types.str;
                  description = mdDoc "The string to repeat";

                  example = "hello world!";
                };

                times = mkOption {
                  type = types.int;
                  default = 1;
                  description = mdDoc "number of times to repeat the string";
                };

                package = mkOption {
                  type = types.package;
                  description = mdDoc "Final package for string ";
                  readOnly = true;
                };
              };
            })
          ];
        };
        };
      };
    });
  };
}
```

Now lets use that `config` block that we talked about:


```nix
{ lib, flake-parts-lib, ... }: {
  options = {
    perSystem = flake-parts-lib.mkPerSystemOption ({ system, pkgs, ... }: {
      options = {
        string-repeater = lib.mkOption {
            type = lib.types.submoduleWith {
          modules = [
            ({ config, ... }: {
              options = with lib; {                
                string = mkOption {
                  type = types.str;
                  description = mdDoc "The string to repeat";

                  example = "hello world!";
                };

                times = mkOption {
                  type = types.int;
                  default = 1;
                  description = mdDoc "number of times to repeat the string";
                };

                package = mkOption {
                  type = types.package;
                  description = mdDoc "Final package for string ";
                  readOnly = true;
                };
              };

              config = with lib; {
                package = pkgs.writeShellScriptBin "string-repeater" ''
                yes ${config.string} | head -${builtins.toString (config.times)}
                '';
              };
            })
          ];
        };
        };
      };
    });
  };
}
```

That's our module, all complete! Now, the user can configure `string-repeater` and access the output package as `config.string-repeater.package`. 

Here's a flake that _consumes_ that package (It just imports the module like a path instead of going through the flake):

```nix
{
  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "x86_64-linux" ];
      imports = [
        ../module.nix
      ];

      perSystem = {
        config,
        pkgs,
        ...
      }: {
        string-repeater = {
            times = 2;
            string = "hello world!";
        };

        devShells.default = pkgs.mkShell {
           packages = [ config.string-repeater.package ];    
        };
      };
    };
}
```

running `nix develop .#` and then `string-repeater` yields:

```
hello world!
hello world!
```
 
It worked! We wrote a nix module! Publishing is out of scope, but I've seen people use a github action to publish a to flakehub. Otherwise, if you push to github, you can use your module in the `inputs` section, similar to how we're importing `flake-parts` above.

I'd suggest [flakehub](flakehub.com), because you get a nice documentation page, but github is easier - especially for your first flake.