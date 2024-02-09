{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.05";
    devenv.url = "github:cachix/devenv";
  };

  outputs = { self, nixpkgs, devenv, ... }@inputs:
    let pkgs = import nixpkgs { system = "x86_64-linux"; };
    in {
      devShell."${pkgs.system}" = devenv.lib.mkShell {
        inherit inputs pkgs;
        modules = [
          ({ pkgs, ... }: {
            packages = with pkgs; [
              miniserve
            ];

            languages.javascript = {
              enable = true;
              corepack.enable = true;
              npm.install.enable = true;
            };
          })
        ];
      };
    };
}
