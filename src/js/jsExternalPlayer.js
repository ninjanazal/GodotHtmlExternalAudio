
/**
 * Usefull for base54 buffer data, since this should 
 * be addded to the start of the array
 */
const PREFIXHEADER = "data:audio/";
const SUFIXHEADER = ";base64,"


/**
 * jsExternalPlayer constructor
 * @param {String} name Player name
 */
function jsExternalPlayer(name) {
	this.name = name;
	this.volume = 1.0;
	this.howlPlayer = undefined;
	this.__info = {
		buffer: undefined,
		format: undefined,
		loop: undefined,
		callback: undefined,
		paused: undefined
	};
}

/**
 * Pauses the current player
 */
jsExternalPlayer.prototype.pause = function () {
	if (this.howlPlayer !== undefined) {
		this.howlPlayer.pause();
	}
}


/**
 * Resume the current player
 */
jsExternalPlayer.prototype.resume = function () {
	if(this.howlPlayer !== undefined){
		this.howlPlayer.play();
	}
}

/**
 * Resumes the current player with a howler reload
 */
jsExternalPlayer.prototype.resumeReload = function (busVolume, busMute) {
	if (this.howlPlayer !== undefined) {
		this.howlPlayer.unload();
	}
	this.howlPlayer = undefined;
	this.play(busVolume, busMute, 
		this.__info.format, this.__info.buffer, this.volume,
		this.__info.loop, this.__info.callback);
}

/**
 * Get if the current player is paused, will return false if not playing
 * @returns {Boolean} Current pause state
 */
jsExternalPlayer.prototype.isPaused = function () {
	if (this.howlPlayer !== undefined) {
		return this.__info.paused;
	}
	return false;
}

/**
 * Change the mute state for the current howl if exist
 * @param {Boolean} muted Mute state
 */
jsExternalPlayer.prototype.mute = function (muted) {
	if (this.howlPlayer !== undefined) {
		this.howlPlayer.mute(muted);
	}
}

/**
 * Changes a playing howler volume
 * @param {Number} volume Bus volume
 */
jsExternalPlayer.prototype.changeVolume = function (volume) {
	if (this.howlPlayer !== undefined) {
		this.howlPlayer.volume(this.volume * volume);
	}
}


/**
 * @param {Number} busVolume The holder bus volume
 * @param {ArrayBuffer} buffer Base64 sound data
 * @param {string} format Target volume
 * @param {Number} volume Target volume
 * @param {Boolean} looping 
 * @param {Function} callback 
 */
jsExternalPlayer.prototype.play = function (
	busVolume, muted, format, buffer, volume,
	looping = false, callback = undefined) {
	if (this.howlPlayer !== undefined) {
		if (this.__info.callback !== undefined) { this.__info.callback(this.name); }
		this.howlPlayer.unload();
	}
	this._resetPlayerInfo();
	this.volume = volume;
	this.__info.buffer = buffer;
	this.__info.format = format;
	this.__info.loop = looping;
	this.__info.callback = callback;

	this.howlPlayer = new Howl({
		src: [PREFIXHEADER + format + SUFIXHEADER + buffer],
		format: [format],
		volume: this.volume * busVolume,
		loop: looping,
		mute: muted,
		onplayerror: function () {
			console.log("[ExternalAudioJS] :: " + this.name + " play error, waiting to unlock");

			this.howlPlayer.once("unlock", function () {	
				this.howlPlayer.play();
			})
		},
		onend: () => {
			if (this.__info.loop) { return; }
			console.log("[ExternalAudioJS] :: " + this.name + " has finished playing");
			if (this.__info.callback !== undefined) { this.__info.callback(this.name); }
			this.howlPlayer.unload();
			this._resetPlayerInfo();
		},
		onload: () => {
			console.log("[ExternalAudioJS] :: " + this.name + " has finished loading and is ready to play");
			this.howlPlayer.play();
		},
		onloaderror: (id, err) => {
			if (id !== null) {
				console.log('[ExternalAudioJS] :: Failed to load sound file: ', { id, err });
			}
		},
		onunlock: () => {
			console.log("[ExternalAudioJS] :: " + this.name + " is unlock and ready to play");
		},
		onpause: () => {
			console.log("[ExternalAudioJS] :: " + this.name + " is Paused");
			this.__info.paused = true;
		},
		onplay: () => {
			console.log("[ExternalAudioJS] :: " + this.name + " is Playing");
			this.__info.paused = false;
		}
	});
}

/**
 * Internals, reset the howler information
 */
jsExternalPlayer.prototype._resetPlayerInfo = function () {
	this.howlPlayer = undefined;

	this.volume = 1.0;
	this.__info.buffer = undefined;
	this.__info.format = undefined;
	this.__info.loop = undefined;
	this.__info.callback = undefined;
	this.__info.paused = undefined;
}