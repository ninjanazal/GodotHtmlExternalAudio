/**
 * jsExternalAudio class constructor
 */
function jsExternalAudio() {
	this.extBuses = {};
}


/**
 * Creates a new bus by name
 * @param {String} name New bus name 
 */
jsExternalAudio.prototype.createBus = function (name) {
	if (name in this.extBuses) { return; }
	this.extBuses[name] = new jsExternalBus();
}


/**
 * Creates a new player on the defined bus
 * @param {String} busname Target bus
 * @param {String} playername Player name to be added
 * @returns 
 */
jsExternalAudio.prototype.createPlayer = function (busname, playername) {
	if (!(busname in this.extBuses)) { return; }

	this.extBuses[busname].createPlayer(playername);
}

/**
 * Play a sample on a defined player name 
 * @param {String} playerName 
 * @param {Number} busVolume 
 * @param {String} format 
 * @param {ArrayBuffer} buffer 
 * @param {Number} volume 
 * @param {Boolean} looping 
 * @param {Function} callback 
 */
jsExternalAudio.prototype.playOnPlayer = function (playerName, busVolume, format, buffer, volume, looping = false, callback = undefined) {
	Object.values(this.extBuses).forEach((extBus) => {
		if (playerName in extBus.extPlayers) {
			extBus.extPlayers[playerName].play(busVolume, format, buffer, volume, looping, callback);
		}
	})
}


/**
 * ExternalAudio object
 */
var externalAudio = new jsExternalAudio();