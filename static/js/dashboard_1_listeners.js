
//Linear line listener
$("#linear").on("click", function(){
  $(".active").removeClass("active")
  $(this).addClass("active")
  curr_country = $("#linelogcard").attr("country")
  drawLine(curr_country)
});

//Log line chart listener
$("#log").on("click", function(){
  $(".active").removeClass("active")
  $(this).addClass("active")

  curr_country = $("#linelogcard").attr("country")
  logLine(curr_country);

});


//Bar chart listener
$("#bar_cum").on("click", function(){
  $(".active").removeClass("active")
  $(this).addClass("active")

  curr_country = $("#linelogcard").attr("country")
  drawBar(curr_country,"cum")
});


//Daily bar graph
$("#bar_daily").on("click", function(){
  $(".active").removeClass("active")
  $(this).addClass("active")

  curr_country = $("#linelogcard").attr("country")
  drawBar(curr_country,"daily")
});
