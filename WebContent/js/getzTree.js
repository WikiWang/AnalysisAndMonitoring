var type = "dataArea";
var packet_id = null;
var zTree;
var leftCurStatus = "init", leftCurAsyncCount = 0, leftAsyncForAll = false, leftGoAsync = false;
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
			url:"/AnalysisAndMonitoring/TreeNode",
			otherParam:{"type": type, "packet_id":packet_id},
			dataFilter: filter
		},
		callback: {
//			onCheck: leftZTreeOnCheck,
			beforeAsync: leftZTreebeforeAsync,
			onAsyncSuccess: leftZTreeonAsyncSuccess,
			onAsyncError: leftZTreeonAsyncError,
			onClick: zTreeOnClick
		}

};

function zTreeOnClick(event, treeId, treeNode) {
    alert(treeNode.isParent);
};

function filter(treeId, parentNode, childNodes) {
	if (!childNodes) return null;
	for (var i=0, l=childNodes.length; i<l; i++) {
		childNodes[i].name = childNodes[i].mmName.replace(/\.n/g, '.');
	}
	return childNodes;
}


function leftZTreebeforeAsync() {
	leftCurAsyncCount++;
}

var ifFirstAsync = true;

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
	var zTree = $.fn.zTree.getZTreeObj("tree");
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
	var zTree = $.fn.zTree.getZTreeObj("tree");
	var nodes = zTree.getNodes();
	zTree.updateNode(nodes);
	return true;
}


$(document).ready(function(){
	type = getUrlParam('type');
	packet_id = getUrlParam('packet_id');
	if(type == "packets" && packet_id == null){
		alert("数据包id不能为空！");
	}else{
		$.fn.zTree.init($("#tree"), setting_leftTree);
		zTree = $.fn.zTree.getZTreeObj("tree");
	}
	
//	$.fn.zTree.init($("#param_list_tree"), setting2);
});