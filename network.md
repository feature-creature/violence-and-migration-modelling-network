---
layout: default
---

<style>
svg{
    width:100%; 
    height:600px;
    border: solid 1px black;
}
svg>g{
 width:100%;
}

button.btn.active {
    color: rgba(234, 118, 0, 0.8);
    text-decoration: none;
    background-color: rgba(255, 255, 255, 0.2);
    border-color: rgba(234, 118, 0, 0.8);
}

button.btn{
    color: #000;
    background-color: rgba(0, 0, 0, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transition: color 0.2s, background-color 0.2s, border-color 0.2s;
    transition-property: color, background-color, border-color;
    transition-duration: 0.2s, 0.2s, 0.2s;
    transition-timing-function: ease, ease, ease;
    transition-delay: 0s, 0s, 0s;
}

g {
  stroke: #999;
}

.links line {
  stroke: #999;
  stroke-opacity: 0.6;
}

.nodes circle {
  stroke: #999;
  stroke-width: 1.5px;
}

text {
  font-size: 15px;
  font-weight:lighter;
  fill: #999;
}
div.active{
  display:block;
}
g.active {
  stroke: black;
}
g.active circle {
  stroke: #000;
  stroke-width: 1.5px;
  r: 12;
}

g.active text{
  fill: #000;
}
.links line.active {
  stroke: #000;
  stroke-opacity: 1;
}

g.nodes:hover{
    cursor: pointer;
}

</style>

[Home](index.html){: .btn}
[Project](project.html){: .btn}
[People](people.html){: .btn}
[Network](network.html){: .btn.current}
[Contact](contact.html){: .btn}

## VaMM Network
  <div id="library">
    <svg></svg>
  </div>

## Institutions
  <div id="tags"></div>

## People
  <div id="pins"></div>
  <div id="" class="library-info">
    <div class="description"></div>
  </div>

<script src="assets/js/d3.min.js"></script>
<script src="assets/js/u10.js"></script>

