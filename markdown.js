var gui = require('nw.gui');
var markdown = require('markdown');
var win = gui.Window.get();
win.resizeTo(800, 600);

var fs = require('fs');

function changeToMarkdown(input){
	input = input.replace(/<br>/g,"\n");
	input = input.replace(/<div>/g,"\n");
	input = input.replace(/<\/div>/g,"");
	var out = markdown.markdown.toHTML(input);
	if($('#optionsRadiosHTML').is(':checked')){
		$("#previewArea").text(out);
	}else{
		$("#previewArea").html(out);
	}
}

$(window).keydown(function(event){
	if(event.keyCode == 9) { return false; }  
});

$("#inputArea").live("focus",function(){
	var that = $(this);
	that.data('before',that.html());
	return that;
}).live('blur keyup paste',function(event){
	var that = $(this);

	if(that.data('before') !== that.html()){
		that.data('before',that.html());
		changeToMarkdown(that.html());
	}
	return that;
});

$("#optionsRadiosHTML,#optionsRadiosView").live("click", function() { 
	changeToMarkdown($("#inputArea").html());
});


$("#fileDialog").live("change",function(){
	var val = $(this).val();
	var path = val.replace(/\\/g, '/');
	if(!path.match(/\.(txt|md|markdown)$/i)){
		alert('このファイル形式には対応していません');
		return;
	}
	fs.readFile(path, 'utf8',function (err, data) {
		if (err) throw err;
		$('#inputArea').html(data.toString());
		changeToMarkdown($("#inputArea").html());
	});

});

$("#open").live('click',function(){
	var chooser = $('#fileDialog');
	chooser.trigger('click'); 
});

$("#save").live('click',function(){
	var chooser = $('#saveDialog');
	chooser.trigger('click'); 
});

$('#exit').live('click',function(){
	win.close();
});

$("#saveDialog").live("change",function(){
	var input = $('#inputArea').html();
	input = input.replace(/<br>/g,"\n");
	input = input.replace(/<div>/g,"\n");
	input = input.replace(/<\/div>/g,"");

	var val = $(this).val();
	var path = val.replace(/\\/g, '/');
	if(!path.match(/\.(txt|md|markdown)$/i)){
		alert('このファイル形式には対応していません');
		return;
	}
	fs.writeFile(path, input , function (err) {
		if (err) throw err;
		alert('保存が完了しました');
	});

});


function onDrop(event){
	event.preventDefault();
	console.log(event.dataTransfer.files);
	var val = event.dataTransfer.files[0].path;
	var path = val.replace(/\\/g, '/');
	if(!path.match(/\.(txt|md|markdown)$/i)){
		alert('このファイル形式には対応していません');
		return;
	}
	fs.readFile(path, 'utf8',function (err, data) {
		if (err) throw err;
		$('#inputArea').html(data.toString());
		changeToMarkdown($("#inputArea").html());
	});

	//var files = event.dataTransfer.files;
}

window.addEventListener("drop", onDrop,false);
