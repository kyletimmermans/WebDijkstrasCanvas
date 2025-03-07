![Version 1.2](https://img.shields.io/badge/Version-1.2-lightblue.svg)
![d3.js 5.9.2](https://img.shields.io/badge/d3.js-5.9.2-EE7234.svg)
![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5-8B11FA.svg)
![Lastest Commit](https://img.shields.io/github/last-commit/kyletimmermans/webdijkstrascanvas?color=success&label=Latest%20Commit)
[![kyletimmermans Twitter](http://img.shields.io/twitter/url/http/shields.io.svg?style=social&label=Follow)](https://twitter.com/kyletimmermans)


# <div align="center">Web Dijkstra's Canvas</div>

Web Dijkstra's Canvas is a web app that allows users to draw a visual undirected weighted graph with the mouse,
where weights are automatically assigned to the the edges based on their length. After drawing the graph, Dijkstra's algorithm
can be applied to the graph, giving the shortest path between two given vertices.

<div>&#8203;</div>

### Installation:
1. `git clone https://github.com/kyletimmermans/WebDijkstrasCanvas.git && cd WebDijkstrasCanvas`
2. `cd src`
3. `python3 -m http.server`
4. Visit localhost:8000 in your web browser (Chrome works best)
5. Use right-click to place vertices, and use left-click to draw edges between them

_Note_: If the Shortest path that gets printed is too long and cuts off to the right of the screen, hover over the text and
you'll be able to scroll to the right and see the rest of the printed path and distance

<div>&#8203;</div>

### Program Screenshots

#### Main Page
<p align="center">
  <img src="/media/main_page.png?raw=true" alt="Main Page"/>
</p>

#### About Modal
<p align="center">
  <img src="/media/about_modal.png?raw=true" alt="About Modal"/>
</p>

<div>&#8203;</div>

### Changelog
<div><b>v1.0</b>: Initial-Release</div>
<div><b>v1.1</b>:</div>
<div>&ensp;&ensp;-Better error handling for getting shortest paths to non-existant nodes</div>
<div>&ensp;&ensp;-Added dynamic font size for larger screens</div>
<div>&ensp;&ensp;-Reset button now also removes pervious shortest path results and error messages</div>
<div><b>v1.2</b>:</div>
<div>&ensp;&ensp;-Fixed bug where long "Shortest Paths" result would be wrap to lines below and potentially be hidden by the "Console" section</div>
<div>&ensp;&ensp;-Fixed an issue where going fullscreen or exiting fullscreen would not resize the height of elements</div>
<div>&ensp;&ensp;-Added feature where hitting 'Enter' while in the input box for specifying the shortest path acts just like clicking the "Get Shortest Path" button</div>
<div>&ensp;&ensp;-Renamed main.html to index.html</div>

<div>&#8203;</div>

### Extra Notes
* canvas.js is a bit messy, it deals with all of the drawing to screen. However, graph.js is much cleaner and intended
to be the main code which is meant to help teach and give a good example of Dijkstra's shortest path algorithm
* Using d3.js v5.9.2 and not a recent version because it has `d3.mouse()`, which is not present in later versions
* Also check out the original [Dijkstra's Canvas](https://github.com/kyletimmermans/dijkstras-canvas/) which was made in Python3 and Tkinter!
