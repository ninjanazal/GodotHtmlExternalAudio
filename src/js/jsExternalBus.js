/**
 * External bus constructor
 */
function jsExternalBus() {
	this.extPlayers = {};
	this.busVolume = 1.0;
	this.busMuted = false;
}


/**
 * Creates a new player to the current bus
 * @param {String} name Player Name
 */
jsExternalBus.prototype.createPlayer = function (name) {
	if (name in this.extPlayers) { return; }
	this.extPlayers[name] = new jsExternalPlayer(name);
}