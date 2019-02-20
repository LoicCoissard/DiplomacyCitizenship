"use strict";
this.name = "DayDiplomacy_062_CitizenshipsEngineAPI.js";
this.author = "Loic Coissard";
this.copyright = "(C) 2019 Loic Coissard";
this.licence = "CC-NC-by-SA 4.0";
this.description = "This script is the citizenships API.";

/*************************** OXP private functions *******************************************************/
/*************************** End OXP private functions ***************************************************/

/*************************** OXP public functions ********************************************************/
this.$buildCitizenshipsString = function (citizenships) {
    return this._capi.$buildCitizenshipsString(citizenships);
};

this.$subscribeToCitizenshipsNews = function (scriptname) {
    return this.capi.$subscribeToCitizenshipsNews(scriptname);
};
/*************************** End OXP public functions ****************************************************/

/*************************** Oolite events ***************************************************************/
this._startUp = function () {
    this._capi = worldScripts.DayDiplomacy_060_CitizenshipsEngine;
    delete this._startUp();
};

this.startUp = function () {
     worldScripts.DayDiplomacy_000_Engine.$subscribe(this.name);
     delete this.startUp; // No need to startup twice
};
/*************************** End Oolite events ***********************************************************/