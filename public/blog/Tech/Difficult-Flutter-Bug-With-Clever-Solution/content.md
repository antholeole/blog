# WIP ARTICLE!!!

Flutter is a dangerous tool: Allow developers to build apps at the speed of light, and they're going to do just that! It can be easy to skip the basics without fully understanding them. Who cares about state when there's hundreds of widgets that do exactly what I need to - no state required?

Here's a case where a developer can fly too high, only to get their wings burnt by the sun.

---------

Here's a very simple widget:

https://gist.github.com/cac4943e3aef33e5bee2a1b8653e04a7

All that this does is render an infinite scrolling rainbow list, and when you click on the floating action button, the number on each tile increments. 

![A screenshot of the app so far](inital.png)

Amazing what you can do with less then 40 lines of code in flutter - full blown app that runs on like 10 different platforms.

Now, imagine we want to let the user see the RGB of the color when they tap on it. This is where things get a *little* complex, so we'll walk through it:

In short, a `LayerLink` allows two layers of the widget tree to be spacially linked together without having to worry about overriding the position of the widget tree.

This means that first, we should extract the `RainbowTile` into it's own widget:

https://gist.github.com/26281d05e7673164dd72e09c78884339

Then, in order to make the RGB label follow the tile, we need two things: a link follower and a link target. Because we want the RGB label to *follow* the tile, it makes sense that the RGB label is the follower, and the tile is the target:

https://gist.github.com/cbd1cedb463fb2a04fa87aa75899d554


But, we need to be able to pass the `layerLink` up the widget tree, so lets add a `ontap` callback to the rainbow tile, so that when it gets tapped, we can tell the follower that there is now a layerLink for it to follow:

https://gist.github.com/a4567fe527a8227717f478237f0f03ac

This way, when we tap on the container, the parent gets both the RGB of the color we tapped on as well as the layer link, so we can label it.

Now, with all the pieces, we can make the RGB label: 

