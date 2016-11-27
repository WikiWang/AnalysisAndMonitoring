function CreateTree(sid) {
	var param_list=[];
	var tree_data;
	$.getJSON("/AnalysisAndMonitoring/TreeNode?sid=" + sid, function(data){
		tree_data = data;
		$('#tree')
		.jstree({
			'core' : {
				'themes' : {
					'responsive' : false,
					'variant' : 'small',
					'dots' : true, 
				},
				'data' : data,
			},
			'types' : {
				'default' : { 'icon' : 'folder' },
				'file' : { 'valid_children' : [], 'icon' : 'file' }
			},
			/*'plugins' : ['state','dnd','types', 'checkbox','contextmenu']*/
			'plugins' : [ 'wholerow', 'checkbox', 'types', 'state' ]
		}).on('changed.jstree', function (e, data) {
			alert("aaa");
		  })
		  .jstree();
		
	});
	
//	var param_tree = $('#param_list')
//	.jstree({
//		'core' : {
//			'themes' : {
//				'responsive' : false,
//				'variant' : 'small',
//				'dots' : true, 
//			},
//			'data' : param_list,
//		},
//		'types' : {
//			'default' : { 'icon' : 'folder' },
//			'file' : { 'valid_children' : [], 'icon' : 'file' }
//		},
//		'plugins' : [ 'wholerow', 'checkbox', 'types', 'state' ]
//	})
//	.bind("select_node.jstree", function (event, data) {
//	});
}
