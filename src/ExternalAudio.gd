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


#*
# External Audio js object reference
#*
var IexternalAudio = null;

#*
# Holds reference to a generic callback function
#*
var externalAudioCallback = null;


# - - - - - - - - - -
# PUBLIC
# - - - - - - - - - -

#*
# Creates a New externalBus
# @param {String} name Defined bus name
#*
func createExternalBus (name : String):
	if(!IexternalAudio): return;

	IexternalAudio.createBus(name);


#*
# Creates a player to an existing bus
# @param {String} busName Target bus name
# @param {String} New player name
#*
func addPlayer (busName : String, playerName : String):
	if(!IexternalAudio): return;

	IexternalAudio.createPlayer(busName, playerName);


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
				JavaScript.eval(readerFile.get_as_text(), true);
				readerFile.close();
			else:
				print("[ExternalAudio] :: Failed to eval the defined files!");
				return;
		print("[ExternalAudio] :: Files evaluated correctly!");


	IexternalAudio = JavaScript.get_interface("externalAudio");
	externalAudioCallback = JavaScript.create_callback(self, "__onend_callback__");




#*
# Callback function informing when a defined player ended
# @param {String} playerName Ended player name
#*
func __onend_callback__(playerName : String):
	if(has_signal(playerName)):
		emit_signal(playerName);