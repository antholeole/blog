{
  description = "fastsqrt flake";

  inputs = { nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable"; };

  outputs = { self, nixpkgs }:
    let
      name = "fastsqrt";
      version = builtins.substring 0 8 self.lastModifiedDate;

      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in with pkgs; rec {
      packages.${system} = {
        benchmarks = pkgs.stdenv.mkDerivation {
          name = "${name}-benchmarks-${version}";

          src = lib.cleanSource ./.;

          nativeBuildInputs = [ 
            cmake
          ];

          buildInputs = [
            gbenchmark
          ];          
          
          buildPhase = "make -j $NIX_BUILD_CORES";
          installPhase = ''
            mkdir -p $out/bin
            mv fastsqrt_bench $out/bin
          '';
        };
      };

      devShells.${system}.default = pkgs.mkShell ({ packages = [ clang_18 ]; });
    };
}
