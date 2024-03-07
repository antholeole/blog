# Patch Files are Wonderful: A Journey Through Patching VSCode

8 months ago, I re-discovered linux. Prior, I was a Macintosh devotee - one of those Apple fanboys that wouldn't consider a machine as ugly as a thinkpad (I now use a thinkpad as a daily driver).

At some point, I entered a world where there is no return: the world that measures build system quality in hermeticity. I was obsessed with packaging my software with nix flakes; it was fully reproducable! Never
again would I have to list the dev dependencies in the `README`. 

As people who willingly learn nix tend to do, though, I soon went off the deep end. My next `brew install` 
command caused me physical pain, and from that point onward I was destined to convert my entire desktop to NixOS.

_but that is all a story for another day._

Today, we talk about one of the fruits of my reproduceable labor. At some point in my path towards reproduciblity
of the soul, I begain to heavily customize my VSCode. I would jot down every single issue I had with it during the
work day: perhaps the integrated terminal was too small, or I wanted to be able to jump to the next error on the page. Or perhaps I would discover the joys of modal editing and install a [Kakoune plugin](https://marketplace.visualstudio.com/items?itemName=gregoire.dance) (aside: kakoune keybinds are superior to vim motions). 

Near the tail end of this experience, I realized that the menu was too far up my screen: I typically keep my
cursor near the center of my screen. The command pallet would open near the top of my screen, and my eyes would
have to break their standard position to move up the screen. 

This simply could not work. I was determined to optimize my setup to to keep the menu at the center of the screen.
