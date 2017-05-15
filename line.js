var margin={top:40, bottom:100, left:150, right:90},
    width=1000-margin.left-margin.right,
    height=600-margin.top-margin.bottom;

  var horizontal=d3.scale.ordinal().rangeRoundBands([0,width],0.12),
    vertical=d3.scale.linear().rangeRound([height,0]);

var x = d3.scale.ordinal()
    .rangeRoundBands([0,width], 0.9,0.8);
var	y = d3.scale.linear().range([height, 0]);

 var	xAxis = d3.svg.axis().scale(x)
 	.orient("bottom");

var	yAxis = d3.svg.axis().scale(y)
	.orient("left");

var	valueline = d3.svg.line()
	.x(function(d) { return x(d.Region); })
	.y(function(d) { return y(d.fat); });

var	valueline2 = d3.svg.line()
	.x(function(d) { return x(d.Region); })
	.y(function(d) { return y(d.protein); });

  var	valueline3 = d3.svg.line()
  	.x(function(d) { return x(d.Region); })
  	.y(function(d) { return y(d.Carbohydrates); });

var	svg = d3.select("#multiline")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.json("output/chart2.json", function(error, data) {
	data.forEach(function(d) {
		d.Region = d.Region;
		d.fat = d.fat;
		d.protien = d.protein;
    d.Carbohydrates = d.Carbohydrates;
	});

  x.domain(data.map(function(d){
      return d.Region;
  }));
	// Scale the range of the data
	
	y.domain([0, d3.max(data, function(d) { return Math.max(d.fat, d.protein,d.Carbohydrates); })]);

	svg.append("path")		
		.attr("class", "line")
    .transition()
    .duration(2500).delay(500)
    .style("stroke", "red") 
                             //counrty Vs fat
    .attr("d", valueline(data));



	svg.append("path")		
		.attr("class", "line")
    .transition()
    .duration(500).delay(200)
		.style("stroke", "green")  //counrty Vs protein
		.attr("d", valueline2(data));

    svg.append("path")		
      .attr("class", "line")
      .transition()
      .duration(3000).delay(800)
      .style("stroke", "blue")   //counrty Vs carbohyderate
      .attr("d", valueline3(data));


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
       .style("color","red")
       .text("Regions");

	

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
       .text("fat,protein,carbo");

       var text = svg.append("svg:text");

       
});
