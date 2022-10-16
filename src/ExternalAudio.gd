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
var externalAudioCallback : JavaScriptObject = null

#*
# Holds reference to a visibility callback function
#*
var externalVisibilityCallback : JavaScriptObject = null;

#*
# Marks if focus should mute the audio
#*
var useFocusStateMute : bool = false;



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
# Pauses a player by name
# @param {String} playerName Target player name
#*
func pausePlayer(playerName : String):
	if(!IexternalAudio): return;
	IexternalAudio.pausePlayer(playerName);

#*
# Resumes a player by name
# @param {String} playerName Target player name
#*
func resumePlayer(playerName : String):
	if(!IexternalAudio): return;
	IexternalAudio.resumePlayer(playerName);

#*
# Get if a player is paused
# Will return false if not found
#*
func isPlayerPaused(playerName : String):
	if(!IexternalAudio): return false;
	return IexternalAudio.isPlayerPaused(playerName);


#*
# Plays a audioStrean on player, by name, with a volume
#*
func playAudio(playerName : String, audioResource : AudioStream, volume = 1.0, loop = false):
	if(!IexternalAudio || !has_user_signal(playerName)): 
		print("[ExternalAudio] :: Invalid playerName on undefined ExternalAudioJs, aborting play request");
		
	if(audioResource.has_method("get_data")):
		print("[ExternalAudio] :: Playing %s" % audioResource.get_path().get_file().get_basename());
		IexternalAudio.playOnPlayer(playerName,
			audioResource.get_path().get_extension(),
			Marshalls.raw_to_base64(audioResource.get_data()),
			volume, loop, externalAudioCallback
		);

		yield(self, playerName);
		print("[ExternalAudio] :: %s played %s" % [playerName, audioResource.get_path().get_file().get_basename()]);


#*
# Changes the mute state for a target bus
# @params {String} busName Target bus name
# @param {bool} muted Mute state
#*
func muteBus(busName : String, muted : bool):
	if(!IexternalAudio): return;
	IexternalAudio.muteBus(busName, muted);

#*
# Get if a target bus is muted
# Will return false if bus not found
# @param {String} Target bus name
# @returns Target bus mute state
#*
func isBusMuted(busName : String) -> bool:
	if(!IexternalAudio): return false;
	return IexternalAudio.isBusMuted(busName);


#*
# Set the bus volume by name
# @param {String} busName Target bus name
# @param {float} volume new volume value
#*
func changeBusVolume(busName : String, volume : float):
	if(!IexternalAudio): return;
	IexternalAudio.changeBusVolume(busName, volume);


#*
# Get a bus volume by name, if not found will return 0.0
# @return {float} Current bus volume
#*
func getBusVolume(busName : String)-> float:
	if(!IexternalAudio): return 0.0;
	return IexternalAudio.getBusVolume(busName);

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
	externalAudioCallback = JavaScript.create_callback(self, "onEndCallback");
	externalVisibilityCallback = JavaScript.create_callback(self, "onVisiblityChange");
	IexternalAudio.createVisibleCallback(externalVisibilityCallback);

#*
# Callback function informing when a defined player ended
# @param {Array} playerName Ended player name
#*
func onEndCallback(args):
	if(has_user_signal(args[0])):
		emit_signal(args[0]);


#*
# Use document visibility change to mute/resume audio
#*
func onVisiblityChange(arg):
	if(!useFocusStateMute && arg[0]):
		IexternalAudio.onFocusIn();
	elif(!useFocusStateMute && !arg[0]):
		IexternalAudio.onFocusOut();

#*
# Using focus to mute/Resume audio
#*
func _notification(what):
	if(useFocusStateMute && what == NOTIFICATION_WM_FOCUS_IN):
		if(!IexternalAudio): return;
		IexternalAudio.onFocusIn();
	elif (useFocusStateMute && what == NOTIFICATION_WM_FOCUS_OUT):
		if(!IexternalAudio): return;
		IexternalAudio.onFocusOut();