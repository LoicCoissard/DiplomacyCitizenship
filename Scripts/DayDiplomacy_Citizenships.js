"use strict";
this.name = "DayDiplomacy_060_Citizenships";
this.author = "Loic Coissard";
this.copyright = "(C) 2019 Loic Coissard";
this.licence = "CC-NC-by-SA 4.0";
this.description = "This script displays the citizenship.";

/*************************** OXP private functions *******************************************************/
this._buildID =function (galaxyID systemID){

}

this._F4InterfaceCallback = function (choice) {
    this._resetLinks();
    switch (choice) {
        case "BUY":
            this._buyCitizenship({"galaxyID":system.info.galaxyID, "systemID":system.info.systemID});
            break;
        case "LOSE":
            this._loseCitizenship({"galaxyID":system.info.galaxyID, "systemID":system.info.systemID});
            break;
        default : //"EXIT":
    }
};

this._myCitizenships=function(){
    var
    var message="";
    var c = this._citizenships;
    var i = c.length;
    while (i--){
        message += systemNameForID(this._citizenships[i])+"\n";
    }
    return message;
}

// citizenship: {"galaxyID"=>galaxyID, "systemID"=>systemID}
this._buyCitizenship = function(citizenship){
    var id = citizenship["galaxyID"] + " " + citizenship["systemID"];
    this._citizenships[id]=citizenship;
}

this._loseCitizenship = function(citizenship){
    //retirer clé :
    var id = citizenship["galaxyID"] + " " + citizenship["systemID"];
    delete this._citizenships[id];
}

this._runCitizenship = function () {
    var opts = {
        screenID: "DiplomacyCitizenshipsScreenId",
        title: "Citizenship",
        allowInterrupt: true,
        exitScreen: "GUI_SCREEN_INTERFACES",
        choices: {"BUY":"Buy","LOSE":"Lose","EXIT": "Exit"},
         message:this._myCitizenships() //String(system.info.galaxyID) +" "+ String(system.info.systemID)
    };
    mission.runScreen(opts, this._F4InterfaceCallback.bind(this));
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

this._publishNewsSubscribers=function(){
    var myNewSubscriber=this._;
    var l=myNewSubscriber.length;
    while (l--)
    for(subscriber in this._citizenshipsNewsSubscribers){
        subscriber.$citizenshipsChanged(this._citizenships);
    }
}
/*************************** End OXP private functions ***************************************************/

/*************************** OXP public functions ********************************************************/
this.$subscribeToCitizenshipsNews=function(){
    this._citizenshipsNewsSubscribers.push(scriptname); //permet de subscriber
}
this.$citizenshipsChanged(citizenships){

}

this.$getSystemsNameByGalaxyAndSystemId = function() {
    // FIXME perfectperf have the current galaxy saved somewhere?
    return this._systemsByGalaxyAndSystemId[system.info.galaxyID];
};
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
    this._systemsByGalaxyAndSystemId = api.$initAndReturnSavedData("systemsByGalaxyAndSystemId", {});
    this._sapi = worldScripts.DayDiplomacy_012_SystemsAPI;
    this._F = api.$getFunctions();
    this._selectedSystemActorId = this._sapi.$getCurrentGalaxySystemsActorIdsBySystemsId()[system.info.systemID]; // FIXME perfectperf?
    this._eff = api.$initAndReturnSavedData("eventFormatingFunctionsIds", {}); // { eventType => functionId }

    this._initF4Interface();

    this._citizenships = api.$initAndReturnSavedData("citizenships", {}); // { citizenship => citizenship }

    this._citizenshipsNewsSubscribers=[];

    delete this._startUp; // No need to startup twice
};
this.startUp = function () {
    worldScripts.DayDiplomacy_000_Engine.$subscribe(this.name);
    this._s.$subscribe(this.name);
    delete this.startUp; // No need to startup twice
};
/*************************** End Oolite events ***********************************************************/

