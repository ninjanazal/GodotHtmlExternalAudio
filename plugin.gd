tool
extends EditorPlugin



# # # # # # # # # # # # # # # # # # # #
# Godot HTML External Audio plugin    #
# # # # # # # # # # # # # # # # # # # #


#*
# Holds the path to the singleton script
#*
const SINGLETONPATH = "res://addons/GodotHtmlExternalAudio/src/ExternalAudio.gd";


#*
# On plugin enter tree function override
#*
func _enter_tree():
	add_autoload_singleton("ExternalAudio", SINGLETONPATH);


#*
# On Plugin exit tree function override
#*
func _exit_tree():
	if (Engine.has_singleton("ExternalAudio")):
		remove_autoload_singleton("ExternalAudio");
