{
  description = "fastsqrt flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: let 
    pkgs = import <nixpkgs> {};
  in with pkgs; rec {
    devShells.x86_64-linux.default = pkgs.mkShell ({
        packages = [
            llvm_18
        ];
    });
  };
}
