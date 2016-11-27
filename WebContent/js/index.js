/*
	@author: WangKui
*/

$(function(){
	
	var cid = getUrlParam('cid');
	var sid = "";
	
	$.getJSON("/AnalysisAndMonitoring/DataPacket?arg=sid&cid=" + cid, function(data){
		sid = data.sid;
		
//		CreateTree(sid);
		
		// update the data items
//		$.getJSON("/imweb/DataItem?cid=" + cid + "&sid=" + sid, function(data){
//			$.each(data, function(idx, item){
//				$("#dataItems").append(DataItemProc(item));
//			});
//			
//			ImageSilde();
//			
//			PlotContainer();
//		});
		
		//update the versions
//		$.getJSON("/imweb/DataPacket?arg=version&cid=" + cid + "&sid=" + sid, function(data){
//			$("#versions").empty();
//			$.each(data, function(idx, item){
//				var href = "/imweb/?cid=" + item.id;
//				var itemStr = "<tr>" 
//					+  "<th scope='row'><a target='_blank' href=\""+ href
//					+"\">"+ item.name +"</a></th>"
//					+ "<td>" + item.date + "</td>"
//					+ "<td>" + item.person + "</td>"
//					+ "<td>" + item.abs + "</td></tr>";
//				$("#versions").append(itemStr);
//			});
//		});
	});  	
	
//	//update the abstraction
//	$.getJSON("/imweb/DataPacket?arg=abs&cid=" + cid, function(data){
//		var html = "<tr>";
//		$.each(data, function(idx, item){
//			if (idx > 0 && idx % 2 == 0){
//				html += "</tr><tr>";
//			}
//			html += "<th class=\"col-md-3\">"+item.name+":</th>"
//				+ "<td class=\"col-md-3\">"+item.value+"</td>";		
//		});
//		html += "</tr>";
//		
//		$("#abs_table").html(html);
//	});  	
//	
 });

//$(document).ready(function(){
//	$("input.table_radio").click(function(){
//		
//	});
//});
//
//function RadioClick(obj){
//	var tokens = $(obj)[0].name.split("_")
//	var ContainerId = tokens[1] + "_" + tokens[2] + "_plot_container";
//	var x = GetXAxis(ContainerId);
//	PlotOneContainer(ContainerId, x);
//}
//
//function GetXAxis(ContainerId)
//{
//	var tokens = ContainerId.split("_")
//	var tableid = tokens[0] + "_" + tokens[1] + "_table";
//	
//	var r = 0;
//	$.each($("#" + tableid + " thead th input"), function(idx, item){
//		 if($(item)[0].checked)
//			 r = idx;
//	});
//	return r;
//}
//    
//
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}