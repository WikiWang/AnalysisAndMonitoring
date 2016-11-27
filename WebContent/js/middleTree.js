var setting_middleTree = {
		data: {
			simpleData: {
				enable: true,
				idKey: "id",
				pIdKey: "parentId",
				rootPId: 0
			},
			key: {
				name: "mmName"
			}
		},
		check: {
			enable: true
		},
		async: {
			autoParam:["id=parentId","name", "level=lv"],  
			enable: true,
			url:"/AnalysisAndMonitoring/TreeNode",
			otherParam:{"otherParam":"zTreeAsyncTest"},
			dataFilter: filter
		},
		view: {
			fontCss: getFontCss
		},
		callback : {    
			beforeAsync: beforeAsync,
			onAsyncSuccess: onAsyncSuccess,
			onAsyncError: onAsyncError
		}    

};

function beforeAsync() {
	curAsyncCount++;
}

var ifFirstAsync = true;

function onAsyncSuccess(event, treeId, treeNode, msg) {
	curAsyncCount--;
	if (curStatus == "expand") {
		leftExpandNodes(treeNode.children);
	} else if (curStatus == "async") {
		leftAsyncNodes(treeNode.children);
	} else if(curStatus == "init"){
		leftExpandAll();
	}

	if (curAsyncCount <= 0) {
		if (curStatus != "init" && curStatus != "") {
			asyncForAll = true;
		}
		curStatus = "";
	}
}

function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
	curAsyncCount--;

	if (curAsyncCount <= 0) {
		curStatus = "";
		if (treeNode!=null) asyncForAll = true;
	}
}

var curStatus = "init", curAsyncCount = 0, asyncForAll = false,
goAsync = false;
function expandAll() {
	if (!leftCheck()) {
		return;
	}
	var zTree = $.fn.zTree.getZTreeObj("param_list_tree");
	if (asyncForAll) {
		zTree.expandAll(true);
	} else {
		leftExpandNodes(zTree.getNodes());
		if (!goAsync) {
			curStatus = "";
		}
	}
}
function expandNodes(nodes) {
	if (!nodes) return;
	curStatus = "expand";
	var zTree = $.fn.zTree.getZTreeObj("param_list_tree");
	for (var i=0, l=nodes.length; i<l; i++) {
		zTree.expandNode(nodes[i], true, false, false);
		if (nodes[i].isParent && nodes[i].zAsync) {
			leftExpandNodes(nodes[i].children);
		} else {
			goAsync = true;
		}
	}
}

function asyncAll() {
	if (!leftCheck()) {
		return;
	}
	var zTree = $.fn.zTree.getZTreeObj("param_list_tree");
	if (!asyncForAll) {
		leftAsyncNodes(zTree.getNodes());
		if (!goAsync) {
			curStatus = "";
		}
	}
}
function asyncNodes(nodes) {
	if (!nodes) return;
	curStatus = "async";
	var zTree = $.fn.zTree.getZTreeObj("param_list_tree");
	for (var i=0, l=nodes.length; i<l; i++) {
		if (nodes[i].isParent && nodes[i].zAsync) {
			leftAsyncNodes(nodes[i].children);
		} else {
			goAsync = true;
			zTree.reAsyncChildNodes(nodes[i], "refresh", true);
		}
	}
}


function check() {
	if (curAsyncCount > 0) {
		return false;
	}
	return true;
}

/** search start **/
var lastValue = "", nodeList = [], fontCss = {};
function focusKey(e) {
	if (key.hasClass("empty")) {
		key.removeClass("empty");
	}
}

function blurKey(e) {
	if (key.get(0).value === "") {
		key.addClass("empty");
	}
}

function searchNode(e) {
	var zTree = $.fn.zTree.getZTreeObj("param_list_tree");
	var value = $.trim(key.get(0).value);
	var keyType = "name";
	if (key.hasClass("empty")) {
		value = "";
	}
	if (lastValue === value) return;
	lastValue = value;
	if (value === "") return;
	updateNodes(false);

	nodeList = zTree.getNodesByParamFuzzy(keyType, value);

	updateNodes(true);

}

function updateNodes(highlight) {
	var zTree = $.fn.zTree.getZTreeObj("param_list_tree");
	for( var i=0, l=nodeList.length; i<l; i++) {
		nodeList[i].highlight = highlight;
		zTree.updateNode(nodeList[i]);
	}
}

function getFontCss(treeId, treeNode) {
	return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
}
/** search end **/


var key;
$(document).ready(function(){
	type = getUrlParam('type');
	packet_id = getUrlParam('packet_id');
	if(type == "packets" && packet_id == null){
		alert("数据包id不能为空！");
	}else{
		$.fn.zTree.init($("#tree"), setting_leftTree);
		key = $("#key");
		key.bind("focus", focusKey)
		.bind("blur", blurKey)
		.bind("propertychange", searchNode)
		.bind("input", searchNode);
	}
	
//	$.fn.zTree.init($("#param_list_tree"), setting2);
});
