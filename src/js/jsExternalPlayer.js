
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
}

/**
 * @param {Number} busVolume The holder bus volume
 * @param {ArrayBuffer} buffer Base64 sound data
 * @param {string} format Target volume
 * @param {Number} volume Target volume
 * @param {Boolean} looping 
 * @param {Function} callback 
 */
jsExternalPlayer.prototype.play = function (busVolume, format, buffer, volume, looping = false, callback = undefined) {
	if (this.howlPlayer !== undefined) {
		this.howlPlayer.unload();
	}

	this.volume = volume;

	this.howlPlayer = new Howl({
		src: [PREFIXHEADER + format + SUFIXHEADER + buffer],
		format: [format],
		volume: this.volume * busVolume,
		loop: looping,
		onplayerror: function () {
			this.howlPlayer.once("unlock", function () {
				this.howlPlayer.play();
			})
		},
		onend: () => {
			if (callback !== undefined) { callback(this.name); }
			this.howlPlayer.unload();
			this.howlPlayer = undefined;
		}
	});
	this.howlPlayer.play();
}