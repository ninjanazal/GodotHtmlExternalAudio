
/**
 * Usefull for base54 buffer data, since this should 
 * be addded to the start of the array
 */
const PREFIXMP3 = "data:audio/mp3;base64,"

/** - - - - - - - - - - - - - - -
 *  
 */ - - - - - - - - - - - - - - -

    function jsExternalPlayer(name) {
        this.name = name;
        this.volume = 1.0;
        this.howlPlayer = undefined;
    }

/**
 * 
 * @param {Number) busVolume The holder bus volume
 * @param {ArrayBuffer) buffer Base64 sound data
 * @param {Number} volume Target volume
 * @param {Boolean} looping 
 * @param {Function} callback 
 */
jsExternalPlayer.prototype.play = function (
    busVolume, buffer, volume, looping, callback) {
    if (this.howlPlayer !== undefined) {
        this.howlPlayer.unload();
    }

    this

    this.howlPlayer = new Howl({
        src: [PREFIXMP3 + buffer],
        format: ["mp3"],
        volume: this.volume * busVolume,
        loop: looping,
        onplayerror: function () {
            this.howlPlayer.once("unlock", function () {
                this.howlPlayer.play();
            })
        }
    });

    this.howlPlayer.play();
}