/**
 * External bus constructor
 */
function jsExternalBus() {
	this.extPlayers = {};
	this.busVolume = 1.0;
	this.busMuted = false;
	this.muted = false;
}


/**
 * Creates a new player to the current bus
 * @param {String} name Player Name
 */
jsExternalBus.prototype.createPlayer = function (name) {
	if (name in this.extPlayers) { return; }
	this.extPlayers[name] = new jsExternalPlayer(name);
}

/**
 * Mutes the current bus
 * @param {Boolean} muted Mute state
 */
jsExternalBus.prototype.mute = function (muted) {
	this.muted = muted;
	Object.values(this.extPlayers).forEach((player) => {
		player.mute(muted);
	});
}

/**
 * Get current bus mute state
 * @returns Current mute state
 */
jsExternalBus.prototype.isMuted = function () {
	return this.muted;
}

/**
 * Changes a bus volume
 * @param {Number} volume Target bus volume
 */
jsExternalBus.prototype.changeVolume = function (volume) {
	this.busVolume = volume;
	Object.values(this.extPlayers).forEach((player) => {
		player.changeVolume(volume);
	});
}

/**
 * Get the current bus volume
 * @returns Bus Volume
 */
jsExternalBus.prototype.getBusVolume = function () {
	return this.busVolume;
}