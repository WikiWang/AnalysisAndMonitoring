var type = "dataArea";
var id = null;
var zTree;
var leftCurStatus = "init", leftCurAsyncCount = 0, leftAsyncForAll = false, leftGoAsync = false;
var ifFirstAsync = true;
var setting_leftTree = {
		data: {
			key: {
				name: "mmName"
			},
			simpleData: {
				enable: true,
				idKey: "id",
				pIdKey: "parentId",
				rootPId: 0
			}
		},
		check: {
			enable: true
		},
		async: {
			autoParam:["id=parentId","name", "level=lv"],  
			enable: true,
			url:getUrl,
//			otherParam:{"type": type, "packet_id":id},
			dataFilter: filter1
		},
		callback: {
//			onCheck: leftZTreeOnCheck,
//			beforeAsync: leftZTreebeforeAsync,
//			onAsyncSuccess: leftZTreeonAsyncSuccess,
//			onAsyncError: leftZTreeonAsyncError,
//			onCheck: leftZTreeOnCheck,
		}

};

function getUrl(){
	return "/AnalysisAndMonitoring/TreeNode?type=" + type + "&id=" + id ;
}

var setting_middleTree = {
		data: {
			simpleData: {
				enable: true,
				idKey: "id",
				pIdKey: "pid",
				rootPId: 0
			},
			key: {
				name: "name"
			}
		},
		check: {
			enable: true
		},
		async: {
			autoParam:["id=parentId","name", "level=lv"],  
			enable: true,
			url:getParamUrl,
			otherParam:{"otherParam":"zTreeAsyncTest"},
			dataFilter: filter2
		},
		view: {
//			fontCss: getFontCss
		},
		callback : {    
			beforeAsync: leftZTreebeforeAsync,
			onAsyncSuccess: leftZTreeonAsyncSuccess,
			onAsyncError: leftZTreeonAsyncError
		}    

};

function getParamUrl(){
	return "/AnalysisAndMonitoring/TreeNodeParam?type=" + type + "&id=" + id ;
}

function filter1(treeId, parentNode, childNodes) {
	if (!childNodes) return null;
	for (var i=0, l=childNodes.length; i<l; i++) {
		childNodes[i].name = childNodes[i].mmName.replace(/\.n/g, '.');
	}
	return childNodes;
}

function filter2(treeId, parentNode, childNodes) {
	if (!childNodes) return null;
	for (var i=0, l=childNodes.length; i<l; i++) {
		childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
	}
	return childNodes;
}


function leftZTreebeforeAsync() {
	leftCurAsyncCount++;
}

function leftZTreeonAsyncSuccess(event, treeId, treeNode, msg) {
	leftCurAsyncCount--;
	if (leftCurStatus == "expand") {
		if(treeNode.children.length==0){
			treeNode.isParent = false;
			zTree.updateNode(treeNode);
		}else{
			leftExpandNodes(treeNode.children);
		}
	} else if (leftCurStatus == "async") {
		leftAsyncNodes(treeNode.children);
	} else if(leftCurStatus == "init"){
		leftExpandAll();
	}

	if (leftCurAsyncCount <= 0) {
		if (leftCurStatus != "init" && leftCurStatus != "") {
			leftAsyncForAll = true;
		}
		leftCurStatus = "";
	}
}

function leftZTreeonAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
	leftCurAsyncCount--;

	if (leftCurAsyncCount <= 0) {
		leftCurStatus = "";
		if (treeNode!=null) leftAsyncForAll = true;
	}
}


function leftExpandAll() {
	if (!leftCheck()) {
		return;
	}
	if (leftAsyncForAll) {
		zTree.expandAll(true);
	} else {
		leftExpandNodes(zTree.getNodes());
		if (!leftGoAsync) {
			leftCurStatus = "";
		}
	}
}
function leftExpandNodes(nodes) {
	if (!nodes) return;
	leftCurStatus = "expand";

	for (var i=0, l=nodes.length; i<l; i++) {
		zTree.expandNode(nodes[i], true, false, false);
		if (nodes[i].isParent && nodes[i].zAsync) {
			if(nodes[i].children.length==0){
				nodes[i].isParent = false;
				zTree.updateNode(treeNode);
			}else{
				leftExpandNodes(nodes[i].children);
			}
		} else {
			leftGoAsync = true;
		}
	}
}

function leftAsyncAll() {
	if (!leftCheck()) {
		return;
	}
	if (!leftAsyncForAll) {
		leftAsyncNodes(zTree.getNodes());
		if (!leftGoAsync) {
			leftCurStatus = "";
		}
	}
}
function leftAsyncNodes(nodes) {
	if (!nodes) return;
	leftCurStatus = "async";
	for (var i=0, l=nodes.length; i<l; i++) {
		if (nodes[i].isParent && nodes[i].zAsync) {
			leftAsyncNodes(nodes[i].children);
		} else {
			leftGoAsync = true;
			zTree.reAsyncChildNodes(nodes[i], "refresh", true);
		}
	}
}


function leftCheck() {
	if (leftCurAsyncCount > 0) {
		return false;
	}
	return true;
}


/** search start **/
var lastValue = "", nodeList = [], fontCss = {}, firstSearch = true;
var hideNodes, showNodes;
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
	var param_list_tree = $.fn.zTree.getZTreeObj("param_list_tree");
	var value = $.trim(key.get(0).value);
	var keyType = "name";
	if (key.hasClass("empty")) {
		value = "";
	}
	if (lastValue === value) return;
	lastValue = value;
	if (value === "") {
		showNodes = param_list_tree.getNodesByParam("isHidden", true);
		param_list_tree.showNodes(showNodes);
		return;
	}
//	updateNodes(false);

	nodeList = param_list_tree.getNodesByParamFuzzy(keyType, value);

	updateNodes(true);

}

function updateNodes(highlight) {
	var param_list_tree = $.fn.zTree.getZTreeObj("param_list_tree");
//	if(firstSearch && highlight){
//		hideNodes = param_list_tree.getNodes();
//		param_list_tree.hideNodes(hideNodes);
//		firstSearch = false;
//	}
	hideNodes = param_list_tree.getNodesByParam("isHidden", false);
	param_list_tree.hideNodes(hideNodes);
	var changeNodes = nodeList;
	for( var i=0, l=nodeList.length; i<l; i++) {
//		nodeList[i].highlight = highlight;
//		param_list_tree.updateNode(nodeList[i]);
		var tempNode = nodeList[i];
		while(tempNode!=null){
			changeNodes.push(tempNode);
			tempNode = tempNode.getParentNode();
		}
	}
	param_list_tree.showNodes(changeNodes);
//	if(changeNodes.length>0){
//		if(highlight == true){
//			param_list_tree.showNodes(changeNodes);
//		}else{
//			param_list_tree.hideNodes(changeNodes);
//		}
//	}
}

function getFontCss(treeId, treeNode) {
//	treeNode.isHidden = (!!treeNode.highlight) ? false : true;
	return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
}
/** search end **/

$(document).ready(function(){
	type = getUrlParam('type');
	var leftParentNodes;
	if(type == "mainModel"){
		objectName = "主模型";
	}else{
		objectName = "数据包";
	}
	id = getUrlParam('id');
	if(id == null){
		alert("id不能为空！");
	}else{
		var leftParentNodes = [
		             { 
		            	 mmName:objectName, 
		            	 open:true,
		            	 isParent:true,
		            	 id:0
		             }
		             ];
		$.fn.zTree.init($("#tree"), setting_leftTree, leftParentNodes);
		$.fn.zTree.init($("#param_list_tree"), setting_middleTree);
		zTree = $.fn.zTree.getZTreeObj("param_list_tree");
		key = $("#key");
		key.bind("focus", focusKey)
		.bind("blur", blurKey)
		.bind("propertychange", searchNode)
		.bind("input", searchNode);
	}

//	$.fn.zTree.init($("#param_list_tree"), setting2);
});