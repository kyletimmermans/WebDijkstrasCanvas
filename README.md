![Version 1.1](https://img.shields.io/badge/version-v1.1-lightblue.svg)
![d3.js 7.8](https://img.shields.io/badge/d3.js-5.9.2-EE7234.svg)
![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5-8B11FA.svg)
![Last Updated](https://img.shields.io/github/last-commit/kyletimmermans/webdijkstrascanvas?color=success)
[![kyletimmermans Twitter](http://img.shields.io/twitter/url/http/shields.io.svg?style=social&label=Follow)](https://twitter.com/kyletimmermans)


# <div align="center">Web Dijkstra's Canvas</div>

Web Dijkstra's Canvas is a web app that allows users to draw a visual undirected weighted graph with the mouse,
where weights are automatically assigned to the the edges based on their length. After drawing the graph, Dijkstra's algorithm
can be applied to the graph, giving the shortest path between two given vertices.

</br>

## How to run it:
1. **git clone htt<span>ps://github.com</span>/kyletimmermans/WebDijkstrasCanvas.git**
2. cd into _/src_
3. Run: **python3 -m http.server**
4. Visit localhost:8000/main.html in your web browser (Chrome works best)
5. Use right-click to place vertices, and use left-click to draw edges between them

</br>

### Program Screenshot
<p align="center">
  <img src="https://github.com/kyletimmermans/WebDijkstrasCanvas/blob/main/example_screenshot.png?raw=true" alt="Dijkstra's Canvas"/>
</p>

</br>

### Changelog
<div>v1.0: Initial-Release</div>
<div>v1.1:<div>
<div>&ensp;&ensp;-Better error handling for getting shortest paths to non-existant nodes</div>
<div>&ensp;&ensp;-Added dynamic font size for larger screens</div>

</br>

Also check out the original [Dijkstra's Canvas](https://github.com/kyletimmermans/dijkstras-canvas/) which was made in Python3 and Tkinter!
