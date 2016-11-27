$(function() {
	$("#table_to_excel").click(function(){
		$(".table2excel").table2excel({
			exclude: ".noExl",
			name: "Excel Document Name",
			filename: "myFileName",
			exclude_img: true,
			exclude_links: true,
			exclude_inputs: true
		});
	});

});