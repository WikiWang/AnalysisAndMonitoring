$("#chart_panel").css("height", 480);
window.onresize = function(){

	myChart.resize();

};
$(document).ready(function(){
	showTable();
});
var myChart = echarts.init(document.getElementById('chart_panel'));  

window.onresize = myChart.resize;      

function showTable() {
	myChart.clear();
	$("#chart_panel").css('display','none'); 
	$("#chart_table").css('display','block'); 
	lastChartSelectorValue = $("#chart_selector ").val();
}

function showLineChart() {
	//echarts把复杂的图表结构化，图表的基本结构包括以下部分：标题，x轴，y轴，数值序列。  
	var lineChart = {
			title : {
//				text: '折线图',
			},
			tooltip : {
				trigger: 'axis'
			},
			legend: {
				data:paramArray,
			},
			toolbox: {
				show : false,
				feature : {
					mark : {show: true},
					dataView : {show: true, readOnly: false},
//					magicType : {show: true, type: ['line', 'bar']},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			calculable : true,
			xAxis : [
			         {
			        	 type : 'category',
			        	 boundaryGap : false,
			        	 data : mainArray
			         }
			         ],
			yAxis : [
			         {
			        	 type : 'value',
			        	 axisLabel : {
			        		 formatter: '{value}'
			        			 }
			         }
			         ],
			series : getLineSeries()
	};
	$("#chart_table").css('display','none'); 
	$("#chart_panel").css('display','block');
	myChart.setOption(lineChart,true); 
	lastChartSelectorValue = $("#chart_selector ").val();
}	   

function getLineSeries(){
	var series=[];
	for(var i=0; i<dataArray.length; i++){
		var item={
    		name:paramArray[i],
    		type: 'line',
    		data:dataArray[i],
    	};
		series.push(item);
    }
	return series;
}

function showPieChart() {
	
	var pieChart = {
		    title : {
//		        text: '饼图',
		        x:'center'
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		        orient : 'vertical',
		        x : 'left',
		    },
		    toolbox: {
		        show : false,
		        feature : {
		            mark : {show: true},
		            dataView : {show: true, readOnly: false},
		            magicType : {
		                show: true, 
		                type: ['pie', 'funnel'],
		                option: {
		                    funnel: {
		                        x: '25%',
		                        width: '50%',
		                        funnelAlign: 'left',
		                        max: 1548
		                    }
		                }
		            },
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    series : [
		              {
		                  type:'pie',
		                  radius : '55%',
		                  center: ['50%', '60%'],
		                  data:[]
		              }
		          ],
		    calculable : true,
		};
	
	if(mainArray.length == 1 && paramArray.length > 1){
		
		pieChart.legend.data = paramArray;
		pieChart.series[0].name = mainArray[0];
		var seriesData = new Array();
		for(var i=0; i<paramArray.length; i++){
			if(isNaN(dataArray[i][0])){
				alert("请选择数值型参数，参数("+paramArray[i]+")为非数值型参数！");
				$("#chart_selector ").val(lastChartSelectorValue);
				return;
			}
			seriesData.push({
				name:paramArray[i],
				value:dataArray[i][0]
			});
		}
		pieChart.series[0].data = seriesData;
		
	}else if(mainArray.length > 1 && paramArray.length == 1){
		
		pieChart.legend.data = mainArray;
		pieChart.series[0].name = mainArray[0];
		var seriesData = new Array();
		if(isNaN(dataArray[0][0])){
			alert("请选择数值型参数，参数("+paramArray[0]+")为非数值型参数！");
			$("#chart_selector ").val(lastChartSelectorValue);
			return;
		}
		for(var i=0; i<mainArray.length; i++){
			seriesData.push({
				name:mainArray[i],
				value:dataArray[0][i]
			});
		}
		pieChart.series[0].data = seriesData;
	}else{
		alert("请选择一个实例多个属性或一个属性多个实例");
		$("#chart_selector ").val(lastChartSelectorValue);
		return;
	}
	$("#chart_table").css('display','none'); 
	$("#chart_panel").css('display','block');
	myChart.setOption(pieChart,true); 
	lastChartSelectorValue = $("#chart_selector ").val();
}	

function showAreaChart() {
	var areaChart = {
			title : {
//				text: '面积图',
			},
			tooltip : {
				trigger: 'axis'
			},
			legend: {
				data:paramArray,
			},
			toolbox: {
				show : false,
				feature : {
					mark : {show: true},
					dataView : {show: true, readOnly: false},
//					magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			calculable : true,
			xAxis : [
			         {
			        	 type : 'category',
			        	 boundaryGap : false,
			        	 data : mainArray
			         }
			],
			yAxis : [
			         {
			        	 type : 'value'
			         }
			],
			series : getAreaSeries()
	};
	$("#chart_table").css('display','none'); 
	$("#chart_panel").css('display','block');
	myChart.setOption(areaChart,true);
	lastChartSelectorValue = $("#chart_selector ").val();
}

function getAreaSeries(){
	var series=[];
	for(var i=0; i<dataArray.length; i++){
		var item={
    		name:paramArray[i],
    		type: 'line',
    		stack: '总量',
    		itemStyle: {normal: {areaStyle: {type: 'default'}}},
    		data:dataArray[i],
    	};
		series.push(item);
    }
	return series;

}


function showBarChart() {
	var barChart = {
			title : {
//				text: '柱状图',
			},
			tooltip : {
				trigger: 'axis'
			},
			legend: {
				data:paramArray,
			},
			toolbox: {
				show : false,
				feature : {
					mark : {show: true},
					dataView : {show: true, readOnly: false},
//					magicType : {show: true, type: ['line', 'bar']},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			calculable : true,
			xAxis : [
			         {
			        	 type : 'category',
			        	 data : mainArray
			         }
			         ],
			yAxis : [
			         {
			             type : 'value'
			         }
			         ],
			series : getBarSeries()
	};
	$("#chart_table").css('display','none'); 
	$("#chart_panel").css('display','block');
	myChart.setOption(barChart,true); 
}	

function getBarSeries(){
	var series=[];
	for(var i=0; i<dataArray.length; i++){
		var item={
    		name:paramArray[i],
    		type: 'bar',
    		data:dataArray[i],
    	};
		series.push(item);
    }
	return series;
}


function showScatterChart() {
	
	scatterChart = {
		    title : {
//		        text: '散点图',
//				orient:'vertical',
		    },
		    tooltip : {
		        trigger: 'axis',
		        showDelay : 0,
		        formatter : function (params) {
		        	return params.seriesName + ' :<br/>'
		        		+ "(" + params.value[0] + ', ' 
		                + params.value[1] + ")" ;
		        },  
		        axisPointer:{
		            show: true,
		            type : 'cross',
		            lineStyle: {
		                type : 'dashed',
		                width : 1
		            }
		        }
		    },
		    legend: {
//		        data:mainArray,
		    },
		    toolbox: {
		        show : false,
		        feature : {
		            mark : {show: true},
		            dataZoom : {show: true},
		            dataView : {show: true, readOnly: false},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    xAxis : [
		        {
		            type : 'value',
		            scale:true,
		            name:paramArray[0],
//		            axisLabel : {
//		                formatter: '{value}'
//		            }
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value',
		            scale:true,
		            name:paramArray[1],
//		            axisLabel : {
//		                formatter: '{value}'
//		            }
		        }
		    ],
		};
	if(mainArray.length > 0 && paramArray.length == 2){
		if(isNaN(dataArray[0][0])){
			alert("请选择数值型参数！["+paramArray[0]+"]为非数值型参数");
			$("#chart_selector ").val(lastChartSelectorValue);
			return;
		}else if(isNaN(dataArray[1][0])){
			alert("请选择数值型参数！["+paramArray[1]+"]为非数值型参数");
			$("#chart_selector ").val(lastChartSelectorValue);
			return;
		}
		scatterChart.legend.data = mainArray;
		var series=[];
		for(var i=0; i<dataArray[0].length; i++){
			var item={
	    		name:mainArray[i],
	    		type:'scatter',
	    		data:[[dataArray[0][i], dataArray[1][i]]],
	    	};
			series.push(item);
	    }
		scatterChart.series = series;
		$("#chart_table").css('display','none'); 
		$("#chart_panel").css('display','block');
		myChart.setOption(scatterChart,true); 
	}else{
		alert("请选择两个属性！");
		$("#chart_selector ").val(lastChartSelectorValue);
		return;
	}
	
}	

function getScatterSeries(){
	
	return series;
}


var dataArray;//value数组
var paramArray;//参数数组
var mainArray;//主模型或数据包版本数组
var lastChartSelectorValue;
function analysis() {

	var leftTree = $.fn.zTree.getZTreeObj("tree");
	var milldeTree = $.fn.zTree.getZTreeObj("param_list_tree");
	var leftNodes = leftTree.getCheckedNodes(true);
	var middleNodes = milldeTree.getCheckedNodes(true);

	var table = $("#tableChart");
	var thead = table.find("thead");
	var thRows =  thead.find("tr:has(th)");
//	thRows.remove();
	$("#tableChart tr").remove();

	var newRow = "<tr><td></td>";

//	$("table thead").append($("tbody tr:eq(0)"));
//	var newRow = "<tr><td>新行第一列</td><td>新行第二列</td><td>新行第三列</td><td>新行第四列</td><td>新行第五列</td></tr>";
//	$("#table thead tr:last").after(newRow);

//	var copy = thRows.clone(true).appendTo("thead");"<td>新行第二列</td><td>新行第三列</td><td>新行第四列</td><td>新行第五列</td></tr>";

	/*定义存储表格内容的数组*/
	dataArray = new Array();  
	paramArray = new Array();
	mainArray = new Array();

	/*设置表头*/
	for(var i=0; i<leftNodes.length; i++){
		if(!leftNodes[i].isParent){
			newRow += "<td>"+ leftNodes[i].mmName +"</td>";
			mainArray.push(leftNodes[i].mmName);
		}
	}
	newRow += "</tr>";
	thead.append(newRow);

	/*设置表格内容*/
	var tbody = table.find("tbody");
	type = getUrlParam('type');
	mainId = getUrlParam('id');
	for(var k=0; k<middleNodes.length; k++){
		if(!middleNodes[k].isParent){
			paramArray.push(middleNodes[k].name);
			var rowArray = new Array();//表格行数据
			var newTdRow = "<td>" + middleNodes[k].name + "</td>";
			var ifSame = true;
			var ifFirstValue=true;
			var lastValue;
			for(var j=0; j<leftNodes.length; j++){
				if(!leftNodes[j].isParent){
					$.ajax({
						type: 'POST',
						url: "/AnalysisAndMonitoring/DataValueServlet",
						async: false,
						data: {id:mainId, parentId:middleNodes[k].id, version:leftNodes[j].version, type:type},
						dataType: 'json',
						success:function(data){
							if(data[0] != null){
								newTdRow += "<td>"+ data[0].value +"</td>";
								rowArray.push(data[0].value);
								if(ifFirstValue){
									lastValue = data[0].value;
									ifFirstValue = false;
								}else if(lastValue != data[0].value){
									ifSame = false;
								}
							}else{
								newTdRow += "<td></td>";
								rowArray.push(null);
							}
						}
					});
				}
			}
			dataArray.push(rowArray);
			if(ifSame){
				newTdRow = "<tr>" + newTdRow + "</tr>";
			}else{
				newTdRow = "<tr class='tr_red'>" + newTdRow + "</tr>";
			}
			tbody.append(newTdRow);
		}
	}
	$("#chart_selector ").val(1);
	lastChartSelectorValue = 1;
	showTable();
}


function select_change(){
	var type = $("#chart_selector ").val();
	switch (type) {
	case "1":
		showTable();
		break;
	case "2":
		showPieChart();
		break;
	case "3":
		showLineChart();
		break;
	case "4":
		showAreaChart();
		break;
	case "5":
		showBarChart();
		break;
	case "6":
		showScatterChart();
		break;
	default:s
	break;
	}
}