/**
 * jsExternalAudio class constructor
 */
function jsExternalAudio() {
	this.extBuses = {};
}


/**
 * Adds a callback to visiblitiy change event
 * @param {Callback} callback Visibility callback function
 */
jsExternalAudio.prototype.createVisibleCallback = function (callback) {
	document.addEventListener("visibilitychange", () => {
		callback(document.visibilityState == "visible");
	});
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
jsExternalAudio.prototype.playOnPlayer = function (playerName, format, buffer,
	volume, looping = false, callback = undefined) {
	Object.values(this.extBuses).forEach((extBus) => {
		if (playerName in extBus.extPlayers) {
			extBus.extPlayers[playerName].play(
				extBus.busVolume, extBus.muted,
				format, buffer, volume, looping, callback
			);
		}
	})
}

/**
 * On Focus in, resume all the buses and players
 */
jsExternalAudio.prototype.onFocusIn = function () {
	Howler.unload();
	Object.values(this.extBuses).forEach((extBus) => {
		extBus.onFocusIn();
	});
}

/**
 * On Focus out, pause all the buses and players
 */
jsExternalAudio.prototype.onFocusOut = function () {
	Object.values(this.extBuses).forEach((extBus) => {
		extBus.onFocusOut();
	});
}


/**
 * Pauses a playing player by name
 * @param {String} playerName Target player name
 */
jsExternalAudio.prototype.pausePlayer = function (playerName) {
	Object.values(this.extBuses).forEach((extBus) => {
		if (playerName in extBus.extPlayers) {
			extBus.extPlayers[playerName].pause();
		}
	});
}

/**
 * Resume a player by name
 * @param {String} playerName Target player name 
 */
jsExternalAudio.prototype.resumePlayer = function (playerName) {
	Object.values(this.extBuses).forEach((extBus) => {
		if (playerName in extBus.extPlayers) {
			extBus.extPlayers[playerName].resume();
		}
	})
}

/**
 * Mutes a bus by name
 * @param {String} busName Target bus name 
 * @param {Boolean} muted Mute State 
 */
jsExternalAudio.prototype.muteBus = function (busName, muted) {
	if (busName in this.extBuses) {
		this.extBuses[busName].mute(muted);
	}
}

/**
 * Get if a target bus is muted
 * Will return false if bus not found
 * @param {String} busName Target bus name
 * @returns Target bus mute state
 */
jsExternalAudio.prototype.isBusMuted = function (busName) {
	if (busName in this.extBuses) {
		return this.extBuses[busName].isMuted();
	}
	return false;
}

/**
 * Get if a target player is currently muted
 * Will return false if not found
 * @param {String} playerName Target Player Name 
 * @returns 
 */
jsExternalAudio.prototype.isPlayerPaused = function (playerName) {
	for (let i = 0; i < Object.values(this.extBuses).length; i++) {
		const elem = Object.values(this.extBuses)[i];
		if (playerName in elem.extPlayers) {
			return elem.extPlayers[playerName].isPaused();
		}
	}
	console.log("[ExternalAudioJS] :: Failed do find player " + playerName);
	return false;
}


/**
 * Changes a bus volume by name 
 * @param {String} busName Target bus name
 * @param {*} volume Target volume value
 */
jsExternalAudio.prototype.changeBusVolume = function (busName, volume) {
	if (busName in this.extBuses) {
		this.extBuses[busName].changeVolume(volume);
	}
}

/**
 * Get the target bus volume, if not found will return 0.0
 * @param {String} busName Target bus name
 * @returns Bus volume, from 0.0 to 1.0
 */
jsExternalAudio.prototype.getBusVolume = function (busName) {
	if (busName in this.extBuses) {
		return this.extBuses[busName].getBusVolume();
	}
	return 0.0;
}


/**
 * ExternalAudio object
 */
var externalAudio = new jsExternalAudio();