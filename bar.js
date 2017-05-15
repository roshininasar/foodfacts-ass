 let margin={top:40, bottom:100, left:150, right:90},
    width=1000-margin.left-margin.right,
    height=600-margin.top-margin.bottom;

  let horizontal=d3.scale.ordinal().rangeRoundBands([0,width],0.12),
    vertical=d3.scale.linear().rangeRound([height,0]);

  let color = d3.scale.ordinal().range(["#d0743c", "#ff8c00"]);

  let xAxis=d3.svg.axis()
    .scale(horizontal)
    .orient("bottom");

  let yAxis=d3.svg.axis()
    .scale(vertical)
    .orient("left");

  let svg=d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  d3.json("output/chart1.json",function(err,data){
  data.forEach(function(x){
    x.Countries=x.Country;
    x.Salts=x.Salt;
    x.Sugars=x.Sugar;
  });
  let xData=["Sugar","Salt"];
  let dataIntermediate = xData.map(function (c) {
        return data.map(function (d) {
            return {x: d.Countries, y: d[c]};
        });
    });
  let dataStackLayout = d3.layout.stack()(dataIntermediate);

  horizontal.domain(dataStackLayout[0].map(function (d) {
        return d.x;
    }));
  vertical.domain([0,
        d3.max(dataStackLayout[dataStackLayout.length - 1],
                  function (d) { return d.y0 + d.y;})
      ])
      .nice();
  let layer = svg.selectAll(".stack")
          .data(dataStackLayout)
          .enter().append("g")
          .attr("class", "stack")
          .style("fill", function (d, i) {
                return color(i);
    });

  layer.selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")

        .attr("x", function (d) {
            return horizontal(d.x);
          })
          .attr("y", function (d) {
              return vertical(d.y + d.y0);
          })
          .attr("height", function (d) {
              return vertical(d.y0) - vertical(d.y + d.y0);
        })
          .transition().duration(1000)
          .delay( function(d,i){return i * 150;})

      .attr("width", horizontal.rangeBand());

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
       .attr("transform", "translate(" + width + ",0)")
       .attr("dy","1.3em")
       .attr("dx","1.2em")
       .transition()
      .duration(1500)
       .style("font-size","15px")
       .style("font-weight","bold")
       .style("color","BLUE")
       .text("Country");

  svg.append("g")
    .attr("class", "axis")
    .call(yAxis)
    .append("text")
       .attr("transform", "rotate(-90)")
       .attr("dy","1em")
       .transition()
      .duration(1500)
       .style("text-anchor", "end")
       .style("font-size","12px")
       .style("font-weight","bold")
       .style("color","red")
       .text("Sugar,Salt");

       var legend = svg.selectAll(".legend")
         .data(color.domain().slice())
       .enter().append("g")
         .attr("class", "legend")
         .attr("transform", function(d, i) { return "translate(0," + i * 20 +
  ")"; });


     legend.append("rect")
         .attr("x", width - 18)
         .attr("width", 18)
         .attr("height", 18)
         .transition()
         .duration(1500)
         .style("fill", color);

     legend.append("text")
         .attr("x", width - 24)
         .attr("y", 9)
         .attr("dy", ".35em")
         .transition()
        .duration(1500)
         .style("text-anchor", "end")
         .style("fill","green")
         .text(function(d,i) { return xData[i]; });

  });
