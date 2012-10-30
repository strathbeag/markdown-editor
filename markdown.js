var gui = require('nw.gui');
var markdown = require('markdown');
var win = gui.Window.get();
win.resizeTo(800, 600);

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

$( "#optionsRadiosHTML,#optionsRadiosView" ).live("click", function() { 
	console.log('clicked!');
	changeToMarkdown($("#inputArea").html());
});
