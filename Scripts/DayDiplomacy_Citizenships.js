"use strict";
this.name = "DayDiplomacy_060_Citizenships";
this.author = "Loic Coissard";
this.copyright = "(C) 2019 Loic Coissard";
this.licence = "CC-NC-by-SA 4.0";
this.description = "This script displays the citizenship.";

/*************************** OXP private functions *******************************************************/
this._runCitizenship = function () {
    var opts = {
        screenID: "DiplomacyCitizenshipsScreenId",
        title: "Citizenship",
        allowInterrupt: true,
        exitScreen: "GUI_SCREEN_INTERFACES",
        choices: {"EXIT": "Exit"},
        message: String(system.info.galaxyID) +" "+ String(system.info.systemID)
    };
    mission.runScreen(opts);
};

this._displayF4Interface = function () {
    player.ship.hudHidden || (player.ship.hudHidden = true);
    this._runCitizenship();
};

this._initF4Interface = function () {
    player.ship.dockedStation.setInterface("DiplomacyCitizenships",
        {
            title: "Citizenships",
            category: "Diplomacy",
            summary: "You may see current citizenships",
            callback: this._displayF4Interface.bind(this)
        });
};
/*************************** End OXP private functions ***************************************************/

/*************************** OXP public functions ********************************************************/

/*************************** End OXP public functions ****************************************************/

/*************************** Oolite events ***************************************************************/
this.infoSystemChanged = function (currentSystemId, previousSystemId) {
    this._selectedSystemActorId = this._sapi.$getCurrentGalaxySystemsActorIdsBySystemsId()[currentSystemId];
};
this.shipDockedWithStation = function (station) {
    this._initF4Interface();
};
this.missionScreenEnded = function () {
    player.ship.hudHidden = false;
}
this._startUp = function () {
    var api = this._api = worldScripts.DayDiplomacy_002_EngineAPI;
    this._sapi = worldScripts.DayDiplomacy_012_SystemsAPI;
    this._F = api.$getFunctions();
    this._selectedSystemActorId = this._sapi.$getCurrentGalaxySystemsActorIdsBySystemsId()[system.info.systemID]; // FIXME perfectperf?
    this._eff = api.$initAndReturnSavedData("eventFormatingFunctionsIds", {}); // { eventType => functionId }

    this._initF4Interface();

    delete this._startUp; // No need to startup twice
};
this.startUp = function () {
    worldScripts.DayDiplomacy_000_Engine.$subscribe(this.name);
    delete this.startUp; // No need to startup twice
};
/*************************** End Oolite events ***********************************************************/








