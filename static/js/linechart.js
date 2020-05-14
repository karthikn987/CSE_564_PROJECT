
var drawLine = function(country){

      var d3 = window.d3v4;

      d3.select("#linegraph").selectAll('*').remove();


      d3.json("static/all_stats.json", function(data) {

        var margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = 500 - margin.left - margin.right,
          height = 268 - margin.top - margin.bottom;

        // parse the date / time
        var parseTime = d3.timeParse("%m/%d/%Y");

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // define the 1st line
        var valueline = d3.line()
            .x(function(d) { return x(d["key"]); })
            .y(function(d) { return y(d["value"][country]["Confirmed"]); });

        // define the 2nd line
        var valueline2 = d3.line()
            .x(function(d) { return x(d["key"]); })
            .y(function(d) { return y(d["value"][country]["Deaths"]); });


        var valueline3 = d3.line()
            .x(function(d) { return x(d["key"]); })
            .y(function(d) { return y(d["value"][country]["Recovered"]); });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("#linegraph")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");


          var data = d3.entries(data);
          var maxConfirmed = 0;
          maxConfirmed = d3.max(data,function(d){return d["value"][country]["Confirmed"];})
          data = data.filter(function(d,maxConfirmed){
              var dat = d["value"][country]["Confirmed"]
              return dat>20;
          });

          // format the data

          data.forEach(function(d) {
              d["key"] = parseTime(d["key"]);
          });

          // Scale the range of the data
          x.domain(d3.extent(data, function(d) { return d["key"]; }));
          y.domain([0, d3.max(data, function(d) {
        	  return Math.max(0,maxConfirmed); })]);



          // Add the valueline path.
          svg.append("path")
              .data([data])
              .attr("class", "line")
              .attr("d", valueline);

          // Add the valueline2 path.
          svg.append("path")
              .data([data])
              .attr("class", "line")
              .style("stroke", "red")
              .attr("d", valueline2);

          //add 3rd line

          svg.append("path")
              .data([data])
              .attr("class", "line")
              .style("stroke", "green")
              .attr("d", valueline3);

          // Add the X Axis
          svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x).ticks(6));
          // Add the Y Axis
          svg.append("g")
              .call(d3.axisLeft(y));
          //add legends
          addLegend_Line(svg,d3,width);
  });
}

var logLine = function(country){

  var d3 = window.d3v4;
  d3.select("#linegraph").selectAll('*').remove();

  d3.json("static/all_stats.json", function(data) {

      var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 500 - margin.left - margin.right,
        height = 268 - margin.top - margin.bottom;

      // parse the date / time
      var parseTime = d3.timeParse("%m/%d/%Y");

      // set the ranges
      var x = d3.scaleTime().range([0, width]);
      var y = d3.scaleLog().range([height, 0]);

      // define the 1st line
      var valueline = d3.line()
          .x(function(d) { return x(d["key"]); })
          .y(function(d) {return y(d["value"][country]["Confirmed"]); });

      //line for deaths
      var valueline2 = d3.line()
          .x(function(d) { return x(d["key"]); })
          .y(function(d) { return y(d["value"][country]["Deaths"]); });

      //Recovered
      var valueline3 = d3.line()
          .x(function(d) { return x(d["key"]); })
          .y(function(d) { return y(d["value"][country]["Recovered"]); });


      // append the svg obgect to the body of the page
      // appends a 'group' element to 'svg'
      // moves the 'group' element to the top left margin
      var svg = d3.select("#linegraph")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        var data = d3.entries(data);
        var maxConfirmed = 0;
        maxConfirmed = d3.max(data,function(d){return d["value"][country]["Confirmed"];})
        data = data.filter(function(d,maxConfirmed){
            var dat = d["value"][country]["Confirmed"]
            return dat>10;
        });

        dataRecovered = data.filter(function(d,maxConfirmed){
            var dat = d["value"][country]["Recovered"]
            return dat>0;
        });

        dataDeath = data.filter(function(d,maxConfirmed){
            var dat = d["value"][country]["Deaths"]
            return dat>0;
        });

        // format the data

        data.forEach(function(d) {
            d["key"] = parseTime(d["key"]);
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d["key"]; }));
        y.domain([1, d3.max(data, function(d) {
          return Math.max(0,maxConfirmed); })]);

        //console.log(d3.extent(data, function(d) { return d["key"]; }))



        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);

        // Add the valueline2 path.
        svg.append("path")
            .data([dataDeath])
            .attr("class", "line")
            .style("stroke", "red")
            .attr("d", valueline2);

        //add 3rd line

        svg.append("path")
            .data([dataRecovered])
            .attr("class", "line")
            .style("stroke", "green")
            .attr("d", valueline3);

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(6));

        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y).ticks(Math.floor(Math.log(y.domain()[1])/Math.log(10))));


        //add legends

        addLegend_Line(svg,d3,width)

});

}


var drawBar = function(country,graph_type){


    var d3 = window.d3v4;
    d3.select("#linegraph").selectAll('*').remove();
    var d3 = window.d3v3;
    var bar_cond =0
    if (graph_type=="cum"){
      file_name = "static/all_stats.json"
      bar_cond = 60
    }
    else if (graph_type=="daily") {
      file_name = "static/all_stats_daily.json"
      bar_cond = 5
    }

    var margin = {top: 20, right: 20, bottom: 30, left: 50};

    var width = 500 - margin.left - margin.right,
        height = 268 - margin.top - margin.bottom;

    var svg = d3.select("#linegraph")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //parse time
    var parse = d3.time.format("%m/%d/%Y").parse;

    //Read data
    d3.json(file_name, function(data) {

      data = d3.entries(data);
      data = data.filter(function(d){
          var dat = d["value"][country]["Confirmed"]
          return dat>bar_cond;
      });

      data = d3.layout.stack()(["Confirmed", "Recovered","Deaths" ].map(function(type) {
        return data.map(function(d) {
          if (type == "Confirmed" && graph_type=="cum"){
              return {x: parse(d["key"]), y: +d["value"][country][type] - (d["value"][country]["Recovered"]+d["value"][country]["Deaths"])}
            }
          return {x: parse(d["key"]), y: +d["value"][country][type]};
        });
      }));
      console.log(data);

      var dateArr = data[0].map(function(d){return d['x'];})


      // date add one day
      var prev_day = new Date(data[0][data[0].length-1]['x'])
      prev_day.setDate(prev_day.getDate()+1);

      //scales
      var x = d3.time.scale()
        .domain([data[0][0]['x'],prev_day])
        .range([0,width]);


      var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
        .range([height, 0]);

      var colors = ["blue", "#7CFC00","red" ];

      // Define and draw axes
      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5)
        .tickFormat( function(d) { return d } );

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(5)
        .tickFormat(d3.time.format("%d,%B"));

      svg.append("g")
        .attr("class", "y axis bar")
        .call(yAxis);

      svg.append("g")
        .attr("class", "x axis bar")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      var groups = svg.selectAll("stat.bar")
        .data(data)
        .enter().append("g")
        .attr("class", "stat.bar")
        .style("fill", function(d, i) { return colors[i]; });

      var rect = groups.selectAll("rect")
        .data(function(d) { return d; })
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y0 + d.y); })
        .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
        .attr("width", function(d){ var wide = x.range()[1]/dateArr.length; return wide-2})
        .on("mouseover", function() { tooltip.style("display", null); })
        .on("mouseout", function() { tooltip.style("display", "none"); })
        .on("mousemove", function(d) {
          var xPosition = d3.mouse(this)[0] - 15;
          var yPosition = d3.mouse(this)[1] - 25;
          tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
          tooltip.select("text").text(d.y);
        });

      addLegend_Line(svg,d3,width)

      var tooltip = svg.append("g")
        .attr("class", "bar tooltip")
        .style("display", "none");

      tooltip.append("rect")
        .attr("width", 40)
        .attr("height", 20)
        .attr("fill", "grey")
        .style("opacity", 0.8);

      tooltip.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

    });



}




function addLegend_Line(svg1,d3,width){

  var legendText = ["Confirmed Cases", "Deaths" , "Recovered"];
  var legendColors = ["blue", "Red" , "Green"];


  var legend = svg1.append("g")
    .attr("id", "linelegendid");


  var legenditem = legend.selectAll(".linelegend")
      .data(d3.range(3))
      .enter()
      .append("g")
        .attr("class", "linelegend")
        .attr("transform", function(d, i) { return "translate(30,"+i*20+")"; });

    legenditem.append("circle")
      .attr("cx", width - 420)
      .attr("cy", 20)
      .attr('r',5)
      .attr("class", "circleLegend")
      .style("fill", function(d, i) { return legendColors[i]; });

    legenditem.append("text")
      .attr("x", width - 405)
      .attr("y", 24)
      .text(function(d, i) { return legendText[i]; });
}


//drawBar("United States of America")
//drawLine("China")
//logLine("China");
