var type = "dataArea";
var id = null;
var left_tree;
var middle_tree;
/**
 * left tree setting start
 */
var leftCurStatus = "left_init", leftCurAsyncCount = 0, leftAsyncForAll = false, leftGoAsync = false;
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
			dataFilter: filter1
		},
		callback: {
			beforeAsync: leftZTreebeforeAsync,
			onAsyncSuccess: leftZTreeonAsyncSuccess,
			onAsyncError: leftZTreeonAsyncError,
		}

};

function getUrl(){
	return "/AnalysisAndMonitoring/TreeNode?type=" + type + "&id=" + id ;
}

function filter1(treeId, parentNode, childNodes) {
	if (!childNodes) return null;
	for (var i=0, l=childNodes.length; i<l; i++) {
		childNodes[i].name = childNodes[i].mmName.replace(/\.n/g, '.');
		if(versions != null){
			for(var j=0; j<versions.length; j++){
				if(childNodes[i].version == versions[j]){
					childNodes[i].checked = true;
				}
			}
		}
	}
	return childNodes;
}

function leftZTreebeforeAsync() {
	leftCurAsyncCount++;
}

function leftZTreeonAsyncSuccess(event, treeId, treeNode, msg) {
	leftCurAsyncCount--;
	if (leftCurStatus == "left_expand") {
		if(treeNode.children.length==0){
			treeNode.isParent = false;
			left_tree.updateNode(treeNode);
		}else{
			leftExpandNodes(treeNode.children);
		}
	} else if (leftCurStatus == "left_async") {
		leftAsyncNodes(treeNode.children);
	}

	if (leftCurAsyncCount <= 0) {
		if (leftCurStatus != "left_init" && leftCurStatus != "") {
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
		left_tree.expandAll(true);
	} else {
		leftExpandNodes(left_tree.getNodes());
		if (!leftGoAsync) {
			leftCurStatus = "";
		}
	}
}
function leftExpandNodes(nodes) {
	if (!nodes) return;
	leftCurStatus = "left_expand";

	for (var i=0, l=nodes.length; i<l; i++) {
		left_tree.expandNode(nodes[i], true, false, false);
		if (nodes[i].isParent && nodes[i].zAsync) {
			if(nodes[i].children.length==0){
				nodes[i].isParent = false;
				left_tree.updateNode(treeNode);
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
		leftAsyncNodes(left_tree.getNodes());
		if (!leftGoAsync) {
			leftCurStatus = "";
		}
	}
}
function leftAsyncNodes(nodes) {
	if (!nodes) return;
	leftCurStatus = "left_async";
	for (var i=0, l=nodes.length; i<l; i++) {
		if (nodes[i].isParent && nodes[i].zAsync) {
			leftAsyncNodes(nodes[i].children);
		} else {
			leftGoAsync = true;
			left_tree.reAsyncChildNodes(nodes[i], "refresh", true);
		}
	}
}


function leftCheck() {
	if (leftCurAsyncCount > 0) {
		return false;
	}
	return true;
}
/**
 * left tree setting end
 */

/**
 * middle tree setting start
 */
var middleCurStatus = "middle_init", middleCurAsyncCount = 0, middleAsyncForAll = false, middleGoAsync = false;
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
			beforeAsync: middleZTreebeforeAsync,
			onAsyncSuccess: middleZTreeonAsyncSuccess,
			onAsyncError: middleZTreeonAsyncError
		}    

};

function getParamUrl(){
	return "/AnalysisAndMonitoring/TreeNodeParam?type=" + type + "&id=" + id ;
}

function filter2(treeId, parentNode, childNodes) {
	if (!childNodes) return null;
	for (var i=0, l=childNodes.length; i<l; i++) {
		childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
	}
	return childNodes;
}

function middleZTreebeforeAsync() {
	middleCurAsyncCount++;
}

function middleZTreeonAsyncSuccess(event, treeId, treeNode, msg) {
	middleCurAsyncCount--;
	if (middleCurStatus == "middle_expand") {
		if(treeNode.children.length==0){
			treeNode.isParent = false;
			middle_tree.updateNode(treeNode);
		}else{
			middleExpandNodes(treeNode.children);
		}
	} else if (middleCurStatus == "middle_async") {
		middleAsyncNodes(treeNode.children);
	} else if(middleCurStatus == "middle_init"){
		middleExpandAll();
	}

	if (middleCurAsyncCount <= 0) {
		if (middleCurStatus != "middle_init" && middleCurStatus != "") {
			middleAsyncForAll = true;
		}
		middleCurStatus = "";
	}
}

function middleZTreeonAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
	middleCurAsyncCount--;

	if (middleCurAsyncCount <= 0) {
		middleCurStatus = "";
		if (treeNode!=null) middleAsyncForAll = true;
	}
}


function middleExpandAll() {
	if (!middleCheck()) {
		return;
	}
	if (middleAsyncForAll) {
		middle_tree.expandAll(true);
	} else {
		middleExpandNodes(middle_tree.getNodes());
		if (!middleGoAsync) {
			middleCurStatus = "";
		}
	}
}
function middleExpandNodes(nodes) {
	if (!nodes) return;
	middleCurStatus = "middle_expand";

	for (var i=0, l=nodes.length; i<l; i++) {
		middle_tree.expandNode(nodes[i], true, false, false);
		if (nodes[i].isParent && nodes[i].zAsync) {
			if(nodes[i].children.length==0){
				nodes[i].isParent = false;
				middle_tree.updateNode(treeNode);
			}else{
				middleExpandNodes(nodes[i].children);
			}
		} else {
			middleGoAsync = true;
		}
	}
}

function middleAsyncAll() {
	if (!middleCheck()) {
		return;
	}
	if (!middleAsyncForAll) {
		middleAsyncNodes(middle_tree.getNodes());
		if (!middleGoAsync) {
			middleCurStatus = "";
		}
	}
}
function middleAsyncNodes(nodes) {
	if (!nodes) return;
	middleCurStatus = "middle_async";
	for (var i=0, l=nodes.length; i<l; i++) {
		if (nodes[i].isParent && nodes[i].zAsync) {
			middleAsyncNodes(nodes[i].children);
		} else {
			middleGoAsync = true;
			middle_tree.reAsyncChildNodes(nodes[i], "refresh", true);
		}
	}
}


function middleCheck() {
	if (middleCurAsyncCount > 0) {
		return false;
	}
	return true;
}
/**
 * middle tree setting end
 */

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
	var value = $.trim(key.get(0).value);
	var keyType = "name";
	if (key.hasClass("empty")) {
		value = "";
	}
	if (lastValue === value) return;
	lastValue = value;
	if (value === "") {
		showNodes = middle_tree.getNodesByParam("isHidden", true);
		middle_tree.showNodes(showNodes);
		return;
	}
//	updateNodes(false);

	nodeList = middle_tree.getNodesByParamFuzzy(keyType, value);

	updateNodes(true);

}

function updateNodes(highlight) {
	hideNodes = middle_tree.getNodesByParam("isHidden", false);
	middle_tree.hideNodes(hideNodes);
	var changeNodes = nodeList;
	for( var i=0, l=nodeList.length; i<l; i++) {
		var tempNode = nodeList[i];
		while(tempNode!=null){
			changeNodes.push(tempNode);
			tempNode = tempNode.getParentNode();
		}
	}
	middle_tree.showNodes(changeNodes);
}

function getFontCss(treeId, treeNode) {
	return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
}
/** search end **/

var versions;
$(document).ready(function(){
	type = getUrlParam('type');
	var leftParentNodes;
	id = getUrlParam('id');
	var versionstr = getUrlParam("versions");
	if(versionstr != null){
		versions = versionstr.split(",");
	}
	if(id == null){
		alert("id不能为空！");
	}else{
		var leftParentNodes = [
		             { 
		            	 mmName:"全部", 
		            	 open:true,
		            	 isParent:true,
		            	 id:0
		             }
		             ];
		$.fn.zTree.init($("#tree"), setting_leftTree, leftParentNodes);
		$.fn.zTree.init($("#param_list_tree"), setting_middleTree);
		left_tree = $.fn.zTree.getZTreeObj("tree");
		middle_tree = $.fn.zTree.getZTreeObj("param_list_tree");
		leftExpandAll();
		key = $("#key");
		key.bind("focus", focusKey)
		.bind("blur", blurKey)
		.bind("propertychange", searchNode)
		.bind("input", searchNode);
	}

//	$.fn.zTree.init($("#param_list_tree"), setting2);
});