"use strict";
this.name = "DayDiplomacy_060_CitizenshipsEngine";
this.author = "Loic Coissard";
this.copyright = "(C) 2019 Loic Coissard";
this.licence = "CC-NC-by-SA 4.0";
this.description = "This script is the citizenships engine.";

/*************************** OXP private functions *******************************************************/
// citizenships: {systemName: citizenship, ...}
// citizenship: {"galaxyID"=>galaxyID, "systemID"=>systemID}

// {"galaxyID"=>galaxyID, "systemID"=>systemID : name}

/*
@Description: allows the script which name is given as argument to be called through the method $playerCitizenshipsUpdated each time the player citizenships are updated. The script must implement that method. An example of that method is available in DayDiplomacy_Citizenships.js
@param scriptname: String ; the script name property
*
*/
this._retrieveNameFromSystem = function (galaxyID, systemID) {
    // For us, the unique identifier is the name.
    return this._api.$getActors()[this._sapi.$getSystemsActorIdsByGalaxyAndSystemId()[galaxyID][systemID]].name;
};

// choice:{String:function()}
this._F4InterfaceCallback = function (choice) {
    if (choice === "BUY") {
        this._buyCitizenship({"galaxyID": system.info.galaxyID, "systemID": system.info.systemID});
        this._publishNewsSubscribers();
        this._runCitizenship();
    } else if (choice === "LOSE") {
        this._loseCitizenship({"galaxyID": system.info.galaxyID, "systemID": system.info.systemID});
        this._publishNewsSubscribers();
        this._runCitizenship();
    } else if (choice.startsWith("DISPLAY_")) {
        var systemId= choice.substring(8);
        PlayerShip.homeSystem = systemId;
        log("DayDiplomacyCitizenshipsEngine.(choice.startsWith(\"DISPLAY_\"))","player homeSystem"+PlayerShip.homeSystem);
    }else {
        // EXIT
    }
};

// define the price of the citizenship
this._payForCitizenship = function () {
    var CitizenshipPrice = 1;
    if (player.credits >= CitizenshipPrice) {
        player.credits -= CitizenshipPrice;
    }
};

//citizenship: {"galaxyID"=>galaxyID, "systemID"=>systemID}
this._buyCitizenship = function (citizenship) {
    this._payForCitizenship();
    this._citizenships[this._retrieveNameFromSystem(citizenship.galaxyID, citizenship.systemID)] = citizenship;
};

//citizenship: {"galaxyID"=>galaxyID, "systemID"=>systemID}
this._loseCitizenship = function (citizenship) {
    this._payForCitizenship();
    delete this._citizenships[this._retrieveNameFromSystem(citizenship.galaxyID, citizenship.systemID)];
};

this._runCitizenship = function () {
    var currentSystemName = this._retrieveNameFromSystem(system.info.galaxyID, system.info.systemID);
    var opts = {
        screenID: "DiplomacyCitizenshipsScreenId",
        title: "Citizenship",
        allowInterrupt: true,
        exitScreen: "GUI_SCREEN_INTERFACES",
        choices: {BUY: "Buy "+currentSystemName+" citizenship",
            LOSE: "Lose " +currentSystemName+" citizenship",
            EXIT: "Exit"},
        message: "Citizenships: " + this.$buildCitizenshipsString(this._citizenships)
    };
    var currentgalaxyID=system.info.galaxyID;
    var currentCitizenships = this._citizenships;
    var currentChoices = opts.choices;
    for (var systemName in currentCitizenships){
        if (currentCitizenships.hasOwnProperty(systemName)){
            if (currentgalaxyID===currentCitizenships[systemName].galaxyID){
                currentChoices["DISPLAY_"+currentCitizenships[systemName].systemID] = "Display "+systemName+" citizenship";
            }
        }
    }
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

this._publishNewsSubscribers = function () {
    var myNewSubscribers = this._citizenshipsNewsSubscribers;
    var l = myNewSubscribers.length;
    while (l--) {
        worldScripts[myNewSubscribers[l]].$playerCitizenshipsUpdated(this._citizenships);
    }
};
/*************************** End OXP private functions ***************************************************/

/*************************** OXP public functions ********************************************************/
// citizenships: {systemName: citizenship, ...}

this.$buildCitizenshipsString = function (citizenships) {
    var result = "";
    for (var name in citizenships) {
        if (citizenships.hasOwnProperty(name)) {
            result += name + ", ";
        }
    }
    if (result.length) {
        result = result.substring(0, result.length - 2);
    }
    return result;
};

/*
@Description: allows the script which name is given as argument to be called throught the method $playerCitizenshipsUpdated each time the player citizenships are updated. The script must implement that method.
@param scriptname: String ; the script name property
*/
this.$subscribeToPlayerCitizenshipsUpdates = function (scriptname) {
    this._citizenshipsNewsSubscribers.push(scriptname);
};
/*************************** End OXP public functions ****************************************************/

/*************************** Oolite events ***************************************************************/
this.shipDockedWithStation = function (station) {
    this._initF4Interface();
};

this.missionScreenEnded = function () {
    player.ship.hudHidden = false;
};

this._startUp = function () {
    var api = this._api = worldScripts.DayDiplomacy_002_EngineAPI;
    this._sapi = worldScripts.DayDiplomacy_012_SystemsAPI;
    this._citizenships = api.$initAndReturnSavedData("citizenships", {}); // { systemName => citizenship }
    this._citizenshipsNewsSubscribers = api.$initAndReturnSavedData("citizenshipsNewsSubscribers", []);
    this._initF4Interface();
    delete this._startUp; // No need to startup twice
};

this.startUp = function () {
    worldScripts.DayDiplomacy_000_Engine.$subscribe(this.name);

    delete this.startUp; // No need to startup twice
};
/*************************** End Oolite events ***********************************************************/