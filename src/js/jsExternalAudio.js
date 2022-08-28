/**
 * jsExternalAudio class constructor
 */
function jsExternalAudio () {
    this.extBuses = {};
}


/**
 * Creates a new bus by name
 * @param {String} name New bus name 
 */
jsExternalAudio.prototype.createBus = function (name) {
    if (name in this.extBuses){ return; }
     //! CREATE A new Bus   
}