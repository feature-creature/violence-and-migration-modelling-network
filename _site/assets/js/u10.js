var tagsUl = d3.select("#tags");
var pinsUl = d3.select("#pins");
var svg = d3.select("svg");
var zoomLayer = svg.append("g");
var graph = {"links":[],"nodes":[]};

var simulation = d3.forceSimulation()
  .force("center", d3.forceCenter(
    svg.style("width").substring(0,svg.style("width").length-2) * 0.5,
    svg.style("height").substring(0,svg.style("height").length-2) * 0.5
  ))
  .force("link", d3.forceLink()
    .id(function(d){return d.id;}))
  .force("charge", d3.forceManyBody()
    .distanceMin(100)
    .distanceMax(1000)
    .strength(-5000) //3000
  );


d3.csv("assets/data/keywords.csv", function(error, keywords) {

  if (error) throw error;

  graph.nodes.push({
    "id":"VAMM",
    "name":"VaMM",
    "nodeType":"tag",
    "description":"The Violence and Migration Modelling (VaMM) Network is an interdisciplinary group of researchers who are collaborating to develop new methods at the intersection of public health, complexity science, and data visualisation. The network includes experts in a range of disciplines and domains, including for example, violence and health, migration, intervention design and evaluation, agent-based modelling, Bayesian networks, graphic communication design, and simulation visualisations.\n This interdisciplinary and cross-institutional network was launched in 2021 as part of an ESRC-funded methods development project entitled: Complex systems simulations for intervention development: Human trafficking and conflict-related violence.",
    "href":""
  })

  for(var i = 0; i < keywords.length; i++){
    var tempKeyword = keywords[i];
    tempKeyword.href = tempKeyword.link;
    tempKeyword.nodeType = "tag";
    graph.nodes.push(tempKeyword);
    graph.links.push({"source":"VAMM", "target":keywords[i].id, "value": 1});
  }

  d3.csv("assets/data/library.csv", function(error, library) {
    if (error) throw error;


    for(var i = 0; i < library.length; i++){
      var tempPin = library[i];
      tempPin.href = tempPin.link;
      tempPin.nodeType = "pin";
      graph.nodes.push(tempPin)

      tempKeywords = tempPin.keywords.split(" ");
      for(var j = 0; j < tempKeywords.length; j++){
        graph.links.push({"source":tempPin.id, "target":tempKeywords[j], "value": 1});
      }

    }

    var tag = tagsUl
      .selectAll("button")
      .data(graph.nodes)
      .enter()
      .filter(function(d){return d.nodeType == "tag"})
      .append("button")
      .attr("class","btn")
      .attr("keyword",function(d){return d.id})
      .attr("links", function(d){return d.keywords})
      .text(function(d){return d.name});

    var pin = pinsUl
      .selectAll("button")
      .data(graph.nodes)
      .enter()
      .filter(function(d){return d.nodeType == "pin";})
      .append("button")
      .attr("class","btn")
      .attr("keyword",function(d){return d.id})
      .attr("links", function(d){return d.keywords})
      .text(function(d){return d.name});


    var link = zoomLayer.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("source", function(d){return d.source;})
      .attr("target", function(d){return d.target;})
      .attr("stroke-width", function(d){return Math.sqrt(d.value);});

    var node = zoomLayer.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graph.nodes)
      .enter()
      .append("g")
      .attr("keyword", function(d){return d.id})
      .attr("links", function(d){return d.tags});

    var circles = node.append("circle")
      .attr("r", function(d) {
        var size = d.nodeType == "tag" ? 10:5;
        return size;
      })
      .attr("fill", function(d) {
        text = d.nodeType == "tag" ? "#ea7600" : "gray";
        return text;
      })
      .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

    var lables = node.append("text")
      .text(function(d) {
        return d.name;
      })
      .attr('y', 7)
      .attr('x', function(d){
        return d.nodeType == "tag" ? 20:15;
      });

    node.append("title").text(function(d) { return d.name; });

    simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

    simulation.force("link").links(graph.links);

    function ticked() {
      link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
    }

    tagsUl.selectAll('button')
      .on("click",function(d){
          // hide visible infos
          d3.select(".library-info").classed('active',false);
          //clear highlighted list-items, highlight selected list-item
          tagsUl.selectAll('button').classed('active',false);
          pinsUl.selectAll('button').classed('active',false);
          d3.select("button[keyword='"+d.id+"']").attr("class","active btn");
          pinsUl.selectAll('button[links*="'+d.id+'"]').attr("class","active btn");
          // resort lis -> active to the top
          //clear highlighted nodes, highlight selected nodes
          d3.selectAll(".nodes g").classed("active",false);
          d3.selectAll('.nodes g[keyword="'+d.id+'"]').classed("active",true);
          d3.selectAll('.nodes g[links*="'+d.id+'"]').classed("active",true);
          //clear highlighted links, highlight selected links
          d3.selectAll(".links line").classed("active",false);
          d3.selectAll(".links line[source='"+d.id+"'],.links line[target='"+d.id+"']").classed("active",true);
          // center graph to selected node + keep zoom ratio

          var t = d3.transition()
            .duration(750)
            .ease(d3.easeLinear);

          var loc = d3.select("g[keyword='"+d.id+"']").attr("transform");
          loc = loc.replace("translate(","");
          loc = loc.replace(")","");
          loc = loc.replace(" ","");
          loc = loc.replace("px","");

          var x = loc.split(",")[0];
          var y = loc.split(",")[1];

          var w = svg.style("width");
          w = w.replace("px","");
          w /= 2;

          var h = svg.style("height");
          h = h.replace("px","");
          h /= 2;

          z = 1.1;

          var cx = (w-x*z);
          var cy = (h-y*z);

          var refocus = d3.zoomIdentity.translate(cx, cy).scale(z)

          svg.transition(t).call(zoom.transform, refocus);

        }
      )

    pinsUl.selectAll('button')
        .on("click",function(d){
          // hide visible infos
          d3.select(".library-info").classed('active',false);
          //clear highlighted list-items, highlight selected list-item
          tagsUl.selectAll('button').classed('active',false);
          pinsUl.selectAll('button').classed('active',false);
          d3.select("button[keyword='"+d.id+"']").attr("class","active btn");
          d3.select(".library-info .description").text(d.description);
          d3.select(".library-info").classed("active",true);
          //tagsUl.selectAll('li[links*="'+d.id+'"]').attr("class","active");
          //clear highlighted nodes, highlight new nodes
          d3.selectAll(".nodes g").classed("active",false);
          d3.selectAll('.nodes g[keyword="'+d.id+'"]').classed("active",true);
          d3.selectAll('.nodes g[links*="'+d.id+'"]').classed("active",true);
          //clear highlighted links, highlight selected links
          d3.selectAll(".links line").classed("active",false);
          d3.selectAll(".links line[source='"+d.id+"'],.links line[target='"+d.id+"']").classed("active",true);
          // center graph to selected node + keep zoom ratio

          var loc = d3.select("g[keyword='"+d.id+"']").attr("transform");
          loc = loc.replace("translate(","");
          loc = loc.replace(")","");
          loc = loc.replace(" ","");
          loc = loc.replace("px","");

          var x = loc.split(",")[0];
          var y = loc.split(",")[1];

          var w = svg.style("width");
          w = w.replace("px","");
          w /= 2;

          var h = svg.style("height");
          h = h.replace("px","");
          h /= 2;

          z = 1.1;

          var cx = (w-x*z);
          var cy = (h-y*z);

          var t = d3.transition()
              .duration(750)
              .ease(d3.easeLinear);

          var refocus = d3.zoomIdentity.translate(cx, cy).scale(z)

          svg.transition(t).call(zoom.transform, refocus);

        }
      )


    node.filter(function(d){return d.nodeType == "tag"})
      .on("click",function(d){
          // hide visible infos
          d3.select(".library-info").classed('active',false);
          //clear highlighted list-items, highlight selected list-item
          tagsUl.selectAll('button').classed('active',false);
          pinsUl.selectAll('button').classed('active',false);
          d3.select("button[keyword='"+d.id+"']").attr("class","active btn");
          pinsUl.selectAll('button[links*="'+d.id+'"]').attr("class","active btn");
          // resort lis -> active to the top
          //clear highlighted nodes, highlight selected nodes
          d3.selectAll(".nodes g").classed("active",false);
          d3.selectAll('.nodes g[keyword="'+d.id+'"]').classed("active",true);
          d3.selectAll('.nodes g[links*="'+d.id+'"]').classed("active",true);
          //clear highlighted links, highlight selected links
          d3.selectAll(".links line").classed("active",false);
          d3.selectAll(".links line[source='"+d.id+"'],.links line[target='"+d.id+"']").classed("active",true);

          var t = d3.transition()
            .duration(750)
            .ease(d3.easeLinear);

          var loc = d3.select("g[keyword='"+d.id+"']").attr("transform");
          loc = loc.replace("translate(","");
          loc = loc.replace(")","");
          loc = loc.replace(" ","");
          loc = loc.replace("px","");

          var x = loc.split(",")[0];
          var y = loc.split(",")[1];

          var w = svg.style("width");
          w = w.replace("px","");
          w /= 2;

          var h = svg.style("height");
          h = h.replace("px","");
          h /= 2;

          z = 1.1;

          var cx = (w-x*z);
          var cy = (h-y*z);

          var refocus = d3.zoomIdentity.translate(cx, cy).scale(z)

          svg.transition(t).call(zoom.transform, refocus);
        }
      )


    node.filter(function(d){return d.nodeType == "pin"})
      .on("click",function(d){
          // hide visible infos
          d3.select(".library-info").classed('active',false);
          //clear highlighted list-items, highlight selected list-item
          tagsUl.selectAll('button').classed('active',false);
          pinsUl.selectAll('button').classed('active',false);
          d3.select("button[keyword='"+d.id+"']").attr("class","active btn");
          d3.select(".library-info .description").text(d.description);
          d3.select(".library-info").classed("active",true);
          //tagsUl.selectAll('li[links*="'+d.id+'"]').attr("class","active");
          //clear highlighted nodes, highlight new nodes
          d3.selectAll(".nodes g").classed("active",false);
          d3.selectAll('.nodes g[keyword="'+d.id+'"]').classed("active",true);
          d3.selectAll('.nodes g[links*="'+d.id+'"]').classed("active",true);
          //clear highlighted links, highlight selected links
          d3.selectAll(".links line").classed("active",false);
          d3.selectAll(".links line[source='"+d.id+"'],.links line[target='"+d.id+"']").classed("active",true);
          // center graph to selected node + keep zoom ratio

          var loc = d3.select("g[keyword='"+d.id+"']").attr("transform");
          loc = loc.replace("translate(","");
          loc = loc.replace(")","");
          loc = loc.replace(" ","");
          loc = loc.replace("px","");

          var x = loc.split(",")[0];
          var y = loc.split(",")[1];

          var w = svg.style("width");
          w = w.replace("px","");
          w /= 2;

          var h = svg.style("height");
          h = h.replace("px","");
          h /= 2;

          z = 1.1;

          var cx = (w-x*z);
          var cy = (h-y*z);

          var t = d3.transition()
              .duration(750)
              .ease(d3.easeLinear);

          var refocus = d3.zoomIdentity.translate(cx, cy).scale(z)

          svg.transition(t).call(zoom.transform, refocus);
        }
      )


  });
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

var zooming = function() {
  zoomLayer.attr("transform", d3.event.transform);
}

var zoom = d3.zoom()
  .scaleExtent([1/32, 1000])
  .on("zoom", zooming)

svg.call(zoom);




