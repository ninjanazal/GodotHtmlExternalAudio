extends Node

# # # # # # # # # # # # # # # # # # # #
# Godot HTML External Audio Singleton #
# # # # # # # # # # # # # # # # # # # #

#*
# Ordered file to be evaluated by the Javascript context
#*
const JSFILES = [
	"res://addons/GodotHtmlExternalAudio/src/Vendor/howler.core.min.js",
	"res://addons/GodotHtmlExternalAudio/src/js/jsExternalPlayer.js",
	"res://addons/GodotHtmlExternalAudio/src/js/jsExternalBus.js",
	"res://addons/GodotHtmlExternalAudio/src/js/jsExternalAudio.js"

];


func createExternalBus (name : String):
	pass;


# - - - - - - - - - -
# PRIVATE
# - - - - - - - - - -


#*
# Function ready override
#*
func _ready():
	if (OS.has_feature("JavaScript")):
		var readerFile = File.new();

		for i in JSFILES.size():
			if(readerFile.file_exists(JSFILES[i])):
				readerFile.open(JSFILES[i], File.READ);
				readerFile.close();
			else:
				print("[ExternalAudio] :: Failed to eval the defined files!");
				return;