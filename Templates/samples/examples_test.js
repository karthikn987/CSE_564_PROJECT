
// send all geojson countris to bacend to create country map
$.ajax({
    type: 'POST',
    contentType: 'application/json',
    url: 'http://127.0.0.1:5000/country',
    dataType : 'json',
    data : JSON.stringify({"data":country_map}),
    success : function(result) {
      console.log("done")
    },error : function(result){
       console.log(result);
    }
});


.datum(data[d3.select(this).attr('name')])



"<p><strong>" + d.properties.years[1996][0].county + ", " + d.properties.years[1996][0].state + "</strong></p>" +
    "<table><tbody><tr><td class='wide'>Smoking rate in 1996:</td><td>" + formatPercent((d.properties.years[1996][0].rate)/100) + "</td></tr>" +
    "<tr><td>Smoking rate in 2012:</td><td>" + formatPercent((d.properties.years[2012][0].rate)/100) + "</td></tr>" +
    "<tr><td>Change:</td><td>" + formatPercent((d.properties.years[2012][0].rate-d.properties.years[1996][0].rate)/100) + "</td></tr></tbody></table>"

background-color: lightblue;

timeScale.invert(1)

// New York Times
  var width = 800;
  var height = 120;
  var margin = { top: 20, right: 50, bottom: 50, left: 50 };

  var dataNewYorkTimes = d3v4.range(1, 41).map(d => ({
    year: d,
    value: 10000 * Math.exp(-(d - 1) / 40),
  }));


  var timeRange = d3v4.range(1,timeScale.range[1]).map(d=> ({
      month: month_mapping[timeScale.invert(d).getMonth()],
      day: timeScale.invert(d).getDay(),
      year: timeScale.invert(d).getFullYear()
  }));


  var svg = d3v4
    .select('div#slider-new-york-times')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  var padding = 0.1;

  var xBand = d3v4
    .scaleBand()
    .domain(timeRange.map(d => d.year))
    .range([margin.left, width - margin.right])
    .padding(padding);

  var xLinear = d3v4
    .scaleLinear()
    .domain([
      d3v4.min(timeRange, d => d.year),
      d3v4.max(dataNewYorkTimes, d => d.year),
    ])
    .range([
      margin.left + xBand.bandwidth() / 2 + xBand.step() * padding - 0.5,
      width -
        margin.right -
        xBand.bandwidth() / 2 -
        xBand.step() * padding -
        0.5,
    ]);

  var y = d3v4
    .scaleLinear()
    .domain([0, d3v4.max(dataNewYorkTimes, d => d.value)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  var yAxis = g =>
    g
      .attr('transform', `translate(${width - margin.right},0)`)
      .call(
        d3v4
          .axisRight(y)
          .tickValues([1e4])
          .tickFormat(d3v4.format('($.2s'))
      )
      .call(g => g.select('.domain').remove());

  var slider = g =>
    g.attr('transform', `translate(0,${height - margin.bottom})`).call(
      d3v4
        .sliderBottom(xLinear)
        .step(1)
        .ticks(4)
        .default(9)
        .on('onchange', value => draw(value))
    );

  var bars = svg
    .append('g')
    .selectAll('rect')
    .data(dataNewYorkTimes);

  var barsEnter = bars
    .enter()
    .append('rect')
    .attr('x', d => xBand(d.year))
    .attr('y', d => y(d.value))
    .attr('height', d => y(0) - y(d.value))
    .attr('width', xBand.bandwidth());

  svg.append('g').call(yAxis);
  svg.append('g').call(slider);

  var draw = selected => {
    barsEnter
      .merge(bars)
      .attr('fill', d => (d.year === selected ? '#bad80a' : '#e0e0e0'));

    d3v4.select('p#value-new-york-times').text(
      d3v4.format('$,.2r')(dataNewYorkTimes[selected - 1].value)
    );
  };

  draw(9);











    var formatNumber = d3.format(",d"),
      formatChange = d3.format("+,d"),
      formatDate = d3.time.format("%B %d, %Y"),
      formatTime = d3.time.format("%I:%M %p");

    // data across years
    var extant = [];

    var width = 960,
        height = 500;

    var rateById = d3.map(),
      popById = d3.map(),
      nameById = d3.map();

    var quantize = d3.scale.quantize()
        .domain([-.02, .05])
        .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

    var path = d3.geo.path();

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .direction('n')
      .html(function(d) {
        return nameById.get(d.id) + "<br/>Income change: " + (rateById.get(d.id)*100).toFixed(2) + "%" +
        "<br/>Population change: " + (popById.get(d.id)*100).toFixed(2) + "%"
     });

    svg.call(tip);

    var legend = d3.select("#map-legend").
      append("svg:svg").
      attr("width", 160).
      attr("height", 10)
    for (var i = 0; i <= 7; i++) {
      legend.append("svg:rect").
      attr("x", i*20).
      attr("height", 10).
      attr("width", 20).
      attr("class", "q" + i + "-9 ");//color
    };

    var nation = crossfilter(),
      all = nation.groupAll(),
      per_cap = nation.dimension(function(d) { return d.Per_capita_personal_income; }),
      per_caps = per_cap.group(),
      population = nation.dimension(function(d) { return d.Population; }),
      populations = population.group();

    queue()
        .defer(d3.json, "counties.json")
        .defer(d3.tsv, "county_growth.tsv", function(d) {

          for(var propertyName in d) {
            if (propertyName == "Area") {
              continue;
            };
            d[propertyName] = +d[propertyName];
          }

          nation.add([d]);
          extant.push(d.id);

          rateById.set(d.id, d.Per_capita_personal_income);
          popById.set(d.id, d.Population);
          nameById.set(d.id, d.Area);
        })
        .await(ready);

    function ready(error, us) {
      svg.append("g")
          .attr("class", "counties")
        .selectAll("path")
          .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
          .attr("class", function(d) { return quantize(rateById.get(d.id)); })
          .attr("id", function(d) { return d.id; })
          .attr("d", path)
          .on('mouseover',tip.show)
          .on('mouseout', tip.hide);

      var charts = [

        barChart(true)
          .dimension(population)
          .group(populations)
        .x(d3.scale.linear()
          .domain([-.34, .47])
          .range([0, 900])),

        barChart(true)
          .dimension(per_cap)
          .group(per_caps)
        .x(d3.scale.linear()
          .domain([-.34, .47])
          .range([0, 900]))

      ];

      var chart = d3.selectAll(".chart")
        .data(charts)
        .each(function(chart) { chart.on("brush", renderAll).on("brushend", renderAll); });

      renderAll();

      // barChart
      function barChart(percent) {
        if (!barChart.id) barChart.id = 0;

        percent = typeof percent !== 'undefined' ? percent : false;
        var formatAsPercentage = d3.format(".0%");

        var axis = d3.svg.axis().orient("bottom");
        if (percent == true) {
          axis.tickFormat(formatAsPercentage);

        }
        var margin = {top: 10, right: 10, bottom: 20, left: 10},
          x,
          y = d3.scale.linear().range([50, 0]),
          id = barChart.id++,
          brush = d3.svg.brush(),
          brushDirty,
          dimension,
          group,
          round;

        function chart(div) {
          var width = x.range()[1],
              height = y.range()[0];

          try {
            y.domain([0, group.top(1)[0].value]);
          }
          catch(err) {
            window.reset
          }

          div.each(function() {
            var div = d3.select(this),
                g = div.select("g");

            // Create the skeletal chart.
            if (g.empty()) {
              div.select(".title").append("a")
                  .attr("href", "javascript:reset(" + id + ")")
                  .attr("class", "reset")
                  .text("reset")
                  .style("display", "none");

              g = div.append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              g.append("clipPath")
                  .attr("id", "clip-" + id)
                .append("rect")
                  .attr("width", width)
                  .attr("height", height);

              g.selectAll(".bar")
                  .data(["background", "foreground"])
                .enter().append("path")
                  .attr("class", function(d) { return d + " bar"; })
                  .datum(group.all());

              g.selectAll(".foreground.bar")
                  .attr("clip-path", "url(#clip-" + id + ")");

              g.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(axis);

              // Initialize the brush component with pretty resize handles.
              var gBrush = g.append("g").attr("class", "brush").call(brush);
              gBrush.selectAll("rect").attr("height", height);
              gBrush.selectAll(".resize").append("path").attr("d", resizePath);
            }

            // Only redraw the brush if set externally.
            if (brushDirty) {
              brushDirty = false;
              g.selectAll(".brush").call(brush);
              div.select(".title a").style("display", brush.empty() ? "none" : null);
              if (brush.empty()) {
                g.selectAll("#clip-" + id + " rect")
                    .attr("x", 0)
                    .attr("width", width);
              } else {
                var extent = brush.extent();
                g.selectAll("#clip-" + id + " rect")
                    .attr("x", x(extent[0]))
                    .attr("width", x(extent[1]) - x(extent[0]));
              }
            }

            g.selectAll(".bar").attr("d", barPath);
          });

          function barPath(groups) {
            var path = [],
                i = -1,
                n = groups.length,
                d;
            while (++i < n) {
              d = groups[i];
              path.push("M", x(d.key), ",", height, "V", y(d.value), "h9V", height);
            }
            return path.join("");
          }

          function resizePath(d) {
            var e = +(d == "e"),
                x = e ? 1 : -1,
                y = height / 3;
            return "M" + (.5 * x) + "," + y
                + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
                + "V" + (2 * y - 6)
                + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
                + "Z"
                + "M" + (2.5 * x) + "," + (y + 8)
                + "V" + (2 * y - 8)
                + "M" + (4.5 * x) + "," + (y + 8)
                + "V" + (2 * y - 8);
          }
        }

        brush.on("brushstart.chart", function() {
          var div = d3.select(this.parentNode.parentNode.parentNode);
          div.select(".title a").style("display", null);
        });

        brush.on("brush.chart", function() {
          var g = d3.select(this.parentNode),
              extent = brush.extent();
          if (round) g.select(".brush")
              .call(brush.extent(extent = extent.map(round)))
            .selectAll(".resize")
              .style("display", null);
          g.select("#clip-" + id + " rect")
              .attr("x", x(extent[0]))
              .attr("width", x(extent[1]) - x(extent[0]));

          var selected = [];

          dimension.filterRange(extent).top(Infinity).forEach(function(d) {
            selected.push(d.id)
          });
          svg.attr("class", "counties")
            .selectAll("path")
              .attr("class", function(d) { if (selected.indexOf(d.id) >= 0) {return "q8-9"} else if (extant.indexOf(d.id) >= 0) {return "q5-9"} else {return null;}});

        });

        brush.on("brushend.chart", function() {
          if (brush.empty()) {
            var div = d3.select(this.parentNode.parentNode.parentNode);
            div.select(".title a").style("display", "none");
            div.select("#clip-" + id + " rect").attr("x", null).attr("width", "100%");
            dimension.filterAll();
          }
        });

        chart.margin = function(_) {
          if (!arguments.length) return margin;
          margin = _;
          return chart;
        };

        chart.x = function(_) {
          if (!arguments.length) return x;
          x = _;
          axis.scale(x);
          brush.x(x);
          return chart;
        };

        chart.y = function(_) {
          if (!arguments.length) return y;
          y = _;
          return chart;
        };

        chart.dimension = function(_) {
          if (!arguments.length) return dimension;
          dimension = _;
          return chart;
        };

        chart.filter = function(_) {
          if (_) {
            brush.extent(_);
            dimension.filterRange(_);
          } else {
            brush.clear();
            dimension.filterAll();
          }
          brushDirty = true;
          return chart;
        };

        chart.group = function(_) {
          if (!arguments.length) return group;
          group = _;
          return chart;
        };

        chart.round = function(_) {
          if (!arguments.length) return round;
          round = _;
          return chart;
        };

        return d3.rebind(chart, brush, "on");
      }

      // Renders the specified chart or list.
      function render(method) {
        d3.select(this).call(method);
      }

      // Whenever the brush moves, re-rendering everything.
      function renderAll() {
        chart.each(render);
      }

      window.filter = function(filters) {
        filters.forEach(function(d, i) { charts[i].filter(d); });
        renderAll();
      };

      window.reset = function(i) {
        charts.forEach(function (c) {
          c.filter(null);
        })
        renderAll();
        svg.attr("class", "counties")
          .selectAll("path")
            .attr("class", function(d) { return quantize(rateById.get(d.id)); });
      };

    }









    $.get('http://127.0.0.1:5000/drawmapdate',{date:getDateFormat(selected)}, function (data, textStatus, jqXHR) {
        d3.selectAll('.boundary')
          .style('fill',function(d,i){
            if (data[d['properties']['name']]){
              color = getColorScale()

              return color(data[d['properties']['name']]['Confirmed'])
            }

             return color(0);
          });

          //add stats attribute
          d3.selectAll('.boundary')
            .attr('stats',function() {
              return JSON.stringify(data[d3.select(this).attr('name')])
            });
    });




//stacked bars



var data = [
  { year: "2006", redDelicious: "10", mcintosh: "15", oranges: "9", pears: "6" },
  { year: "2007", redDelicious: "12", mcintosh: "18", oranges: "9", pears: "4" },
  { year: "2008", redDelicious: "05", mcintosh: "20", oranges: "8", pears: "2" },
  { year: "2009", redDelicious: "01", mcintosh: "15", oranges: "5", pears: "4" },
  { year: "2010", redDelicious: "02", mcintosh: "10", oranges: "4", pears: "2" },
  { year: "2011", redDelicious: "03", mcintosh: "12", oranges: "6", pears: "3" },
  { year: "2012", redDelicious: "04", mcintosh: "15", oranges: "8", pears: "1" },
  { year: "2013", redDelicious: "06", mcintosh: "11", oranges: "9", pears: "4" },
  { year: "2014", redDelicious: "10", mcintosh: "13", oranges: "9", pears: "5" },
  { year: "2015", redDelicious: "16", mcintosh: "19", oranges: "6", pears: "9" },
  { year: "2016", redDelicious: "19", mcintosh: "17", oranges: "5", pears: "7" },
];

var parse = d3.time.format("%Y").parse;


// Transpose the data into layers
var dataset = d3.layout.stack()(["redDelicious", "mcintosh", "oranges", "pears"].map(function(fruit) {
  return data.map(function(d) {
    return {x: parse(d.year), y: +d[fruit]};
  });
}));


// Set x, y and colors
var x = d3.scale.ordinal()
  .domain(dataset[0].map(function(d) { return d.x; }))
  .rangeRoundBands([10, width-10], 0.02);

var y = d3.scale.linear()
  .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
  .range([height, 0]);

var colors = ["b33040", "#d25c4d", "#f2b447", "#d9d574"];


// Define and draw axes
var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(5)
  .tickSize(-width, 0, 0)
  .tickFormat( function(d) { return d } );

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .tickFormat(d3.time.format("%Y"));

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);


// Create groups for each series, rects for each segment
var groups = svg.selectAll("g.cost")
  .data(dataset)
  .enter().append("g")
  .attr("class", "cost")
  .style("fill", function(d, i) { return colors[i]; });

var rect = groups.selectAll("rect")
  .data(function(d) { return d; })
  .enter()
  .append("rect")
  .attr("x", function(d) { return x(d.x); })
  .attr("y", function(d) { return y(d.y0 + d.y); })
  .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
  .attr("width", x.rangeBand())
  .on("mouseover", function() { tooltip.style("display", null); })
  .on("mouseout", function() { tooltip.style("display", "none"); })
  .on("mousemove", function(d) {
    var xPosition = d3.mouse(this)[0] - 15;
    var yPosition = d3.mouse(this)[1] - 25;
    tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
    tooltip.select("text").text(d.y);
  });


// Draw legend
var legend = svg.selectAll(".legend")
  .data(colors)
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

legend.append("rect")
  .attr("x", width - 18)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", function(d, i) {return colors.slice().reverse()[i];});

legend.append("text")
  .attr("x", width + 5)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .text(function(d, i) {
    switch (i) {
      case 0: return "Anjou pears";
      case 1: return "Naval oranges";
      case 2: return "McIntosh apples";
      case 3: return "Red Delicious apples";
    }
  });


// Prep the tooltip bits, initial display is hidden
var tooltip = svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none");

tooltip.append("rect")
  .attr("width", 30)
  .attr("height", 20)
  .attr("fill", "white")
  .style("opacity", 0.5);

tooltip.append("text")
  .attr("x", 15)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold");
