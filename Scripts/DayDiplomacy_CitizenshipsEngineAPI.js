"use strict";
this.name = "DayDiplomacy_062_CitizenshipsEngineAPI.js";
this.author = "Loic Coissard";
this.copyright = "(C) 2019 Loic Coissard";
this.licence = "CC-NC-by-SA 4.0";
this.description = "This script is the citizenships API.";

/*************************** OXP private functions *******************************************************/
/*************************** End OXP private functions ***************************************************/

/*************************** OXP public functions ********************************************************/
/*************************** End OXP public functions ****************************************************/

/*************************** Oolite events ***************************************************************/
this._startUp = function () {
    var api = this._api = worldScripts.DayDiplomacy_002_EngineAPI;
    this._sapi = worldScripts.DayDiplomacy_012_SystemsAPI;
    delete this._startUp();
};

this.startUp = function () {
     worldScripts.DayDiplomacy_000_Engine.$subscribe(this.name);
     delete this.startUp; // No need to startup twice
};
/*************************** End Oolite events ***********************************************************/