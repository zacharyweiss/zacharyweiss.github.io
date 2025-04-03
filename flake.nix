{
  description = "The Monospaced Web devshell + minor modifications";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";
  };

  outputs = {
    self,
    systems,
    nixpkgs,
  }: let
    eachSystem = nixpkgs.lib.genAttrs (import systems);
  in {
    devShells = eachSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};
      in {
        default = pkgs.mkShell {
          name = "web";
          packages = with pkgs; [
            live-server
            pandoc
            jq
            gnumake
            entr

            # Auto remake on src/ file change
            # Done this way as direnv doesn't like aliases
            (pkgs.writeShellScriptBin "automk" "find src/ | entr make")
          ];

          shellHook = ''
            echo 'Run `automk` to watch for file changes & rebuild automatically'
          '';
        };
      }
    );
  };
}
