$(document).ready(function(){
	serSizes();
});


$(window).resize(function() {serSizes();});

function serSizes()
{
	$("#tree").css("height", $(window).height()-80);
	$("#param_list").css("height", $(window).height()-80);
	$("#analysis_panel").css("height", $(window).height()-80);
//	$("#chart_panel").css("height", $(window).height()-215);
}