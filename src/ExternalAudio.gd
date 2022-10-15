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
	if(!has_user_signal(playerName)):
		add_user_signal(playerName)


#*
# 
#*
func playAudio(playerName : String, audioResource : AudioStream, volume = 1.0):
	if(!IexternalAudio): return;
	if(audioResource.has_method("get_data")):
		IexternalAudio.playOnPlayer(playerName,
			audioResource.get_path().get_extension(),
			Marshalls.raw_to_base64(audioResource.get_data()),
			volume
		);




# - - - - - - - - - -
# PRIVATE
# - - - - - - - - - -

#*
# Function ready override
#*
func _enter_tree():
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
		print("[ExternalAudio] :: Files evaluated correctly!\n\t::: GHEA is ready to use.");


	IexternalAudio = JavaScript.get_interface("externalAudio");
	externalAudioCallback = JavaScript.create_callback(self, "__onend_callback__");


#*
# Callback function informing when a defined player ended
# @param {String} playerName Ended player name
#*
func __onend_callback__(playerName : String):
	if(has_user_signal(playerName)):
		emit_signal( playerName);