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
                    withPCRE2 = false;
                };
            })];
        };
    in {
        # this has pandas! It didn't even exist before our overlay.
        packages."x86_64-linux".ripgrep = pkgs.ripgrep;
    };
}
