
d3v4 = window.d3v4
var month_mapping = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
var month_day_count = [0,31,60,91,121]
var monthPicker = function(day){
    if (day<=31){return 0}
    else if (day<=60) {return 1}
    else if (day<=91) {return 2}
    else if (day<=121) {return 3}
    else{return 4}
}

start = new Date(2020, 00, 23)
end = new Date(2020, 03, 17)

numberOfDays = d3v4.timeDay.count(start, end)


timeScale = d3v4.scaleTime()
  .domain([start, end])
	.range([0, numberOfDays])

function getDateFormat(d){

  month_index = monthPicker(d)
  month = '0'+ (monthPicker(d)+1)
  day = d - month_day_count[month_index]

  if (day<10){
    day = '0' + day
  }

  return month + '/' + day + '/2020'
}



var dateSlider = function(){
  // New York Times
    var width = 700;
    var height = 120;
    var margin = { top: 20, right: 50, bottom: 50, left: 50 };

/*
    var dataNewYorkTimes = d3v4.range(1, 41).map(d => ({
      year: d,
      value: 10000 * Math.exp(-(d - 1) / 40),
    }));
*/

    var timeRange = d3v4.range(1,timeScale.range()[1]).map(d=> ({
        month: timeScale.invert(d).getMonth(),
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
      .domain(timeRange.map(d => (month_day_count[d.month] + d.day)))
      .range([margin.left, width - margin.right])
      .padding(padding);

    var xLinear = d3v4
      .scaleLinear()
      .domain([
        d3v4.min(timeRange, d => 0),
        d3v4.max(timeRange, d => numberOfDays),
      ])
      .range([
        margin.left + xBand.bandwidth() / 2 + xBand.step() * padding - 0.5,
        width -
          margin.right -
          xBand.bandwidth() / 2 -
          xBand.step() * padding -
          0.5,
      ]);

/*
    var y = d3v4
      .scaleLinear()
      .domain([0, d3v4.max(timeRange, d => d.day)])
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
*/
    var slider = g =>
      g.attr('transform', `translate(0,${height - margin.bottom})`).call(
        d3v4
          .sliderBottom(xLinear)
          .step(1)
          .tickFormat(function(d,i){
            d=d+23
            month = monthPicker(d)
            m = month_day_count[month]
            day_no = d - m
            return month_mapping[month] + "," + day_no
          })
          .ticks(4)
          .default(numberOfDays+23)
          .on('onchange', value => draw(value))
      );

      svg.selectAll('text').attr('fill', 'blue');

    var bars = svg
      .append('g')
      .selectAll('rect')
      .data(timeRange);

    /*
    var barsEnter = bars
      .enter()
      .append('rect')
      .attr('x', d => xBand(d.year))
      .attr('y', d => y(d.value))
      .attr('height', d => y(0) - y(d.value))
      .attr('width', xBand.bandwidth());
      */
    /*
    svg.append('g').call(yAxis);
    */
    svg.append('g').call(slider);

    var draw = selected => {
      selected = selected + 23

      date = getDateFormat(selected)

      d3.json("static/all_stats.json", function(data) {

        data = data[date]
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
    };

    //draw(9);

}

dateSlider();
