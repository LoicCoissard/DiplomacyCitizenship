"use strict";
this.name = "DayDiplomacy_065_Citizenships";
this.author = "Loic Coissard";
this.copyright = "(C) 2019 Loic Coissard";
this.licence = "CC-NC-by-SA 4.0";
this.description = "This script displays the citizenship.";

/*************************** OXP private functions *******************************************************/
// this._buildID =function (galaxyID, systemID){ //engine
//     // For us, the unique identifier is the name.
//     return this._api.$getActors()[this._sapi.$getSystemsActorIdsByGalaxyAndSystemId()[galaxyID][systemID]].name;
// };
//
// this._F4InterfaceCallback = function (choice) {//engine
//     switch (choice) {
//         case "BUY":
//             this._buyCitizenship({"galaxyID":system.info.galaxyID, "systemID":system.info.systemID});
//             this._publishNewsSubscribers();
//             this._runCitizenship();
//             break;
//         case "LOSE":
//             this._loseCitizenship({"galaxyID":system.info.galaxyID, "systemID":system.info.systemID});
//             this._publishNewsSubscribers();
//             this._runCitizenship();
//             break;
//         default : //"EXIT":
//     }
// };
//
// this._payForCitizenship=function(){//engine ?
//     var CitizenshipPrice= 1;
//     if(player.credits>=CitizenshipPrice){
//         player.credits -= CitizenshipPrice;
//     }
//     else{
//         ignore();
//     }
// };
//
// // citizenship: {"galaxyID"=>galaxyID, "systemID"=>systemID}
// this._buyCitizenship = function(citizenship){//engine
//     this._payForCitizenship();
//     this._citizenships[this._buildID(citizenship.galaxyID, citizenship.systemID)]=citizenship;
// };
//
// this._loseCitizenship = function(citizenship){//engine
//     //retirer clé :
//     this._payForCitizenship();
//     delete this._citizenships[this._buildID(citizenship.galaxyID, citizenship.systemID)];
// };
//
// this._runCitizenship = function () {//engine
//     var opts = {
//         screenID: "DiplomacyCitizenshipsScreenId",
//         title: "Citizenship",
//         allowInterrupt: true,
//         exitScreen: "GUI_SCREEN_INTERFACES",
//         choices: {BUY:"Buy","LOSE":"Lose","EXIT": "Exit"},
//         message:"Citizenships: "+this.$buildCitizenshipsString(this._citizenships)
//     };
//     mission.runScreen(opts, this._F4InterfaceCallback.bind(this));
// };
//
// this._displayF4Interface = function () {//engine
//     player.ship.hudHidden || (player.ship.hudHidden = true);
//     this._runCitizenship();
// };
//
// this._initF4Interface = function () {//enine
//     player.ship.dockedStation.setInterface("DiplomacyCitizenships",
//         {
//             title: "Citizenships",
//             category: "Diplomacy",
//             summary: "You may see current citizenships",
//             callback: this._displayF4Interface.bind(this)
//         });
// };
//
// this._publishNewsSubscribers=function() {//engine
//     var myNewSubscribers = this._citizenshipsNewsSubscribers;
//     var l = myNewSubscribers.length;
//     while (l--){
//         worldScripts[myNewSubscribers[l]].$citizenshipsChanged(this._citizenships);
//     }
// };
/*************************** End OXP private functions ***************************************************/

/*************************** OXP public functions ********************************************************/
// this.$buildCitizenshipsString = function(citizenships) {//engine et dans l'api mettre une fonction qui peut l'appeler
//     var result = "";
//     for (var name in citizenships) {
//         if (citizenships.hasOwnProperty(name)) {
//             result += name + ", ";
//         }
//     }
//     if (result.length) {
//         result = result.substring(0, result.length-2);
//     }
//     return result;
// };

// this.$subscribeToCitizenshipsNews=function(scriptname){//engine et API
//     this._citizenshipsNewsSubscribers.push(scriptname); //permet de subscriber
// };

this.$citizenshipsChanged=function(citizenships){//laisser ici
    log("DayDiplomacy_60_citizenships.$citizenshipsChanged","new citizenships: "
        +this.$buildCitizenshipsString(citizenships));
};
/*************************** End OXP public functions ****************************************************/

/*************************** Oolite events ***************************************************************/
// this.shipDockedWithStation = function (station) {//engine
//     this._initF4Interface();
// };

this.missionScreenEnded = function () {
    player.ship.hudHidden = false;
};

this._startUp = function () {
    // var api = this._api = worldScripts.DayDiplomacy_002_EngineAPI;
    // this._sapi = worldScripts.DayDiplomacy_012_SystemsAPI;

    // this._citizenships = api.$initAndReturnSavedData("citizenships", {}); // { systemName => citizenship }
    // this._citizenshipsNewsSubscribers = api.$initAndReturnSavedData("citizenshipsNewsSubscribers",[]);
    this.$subscribeToCitizenshipsNews(this.name); //laisser ici
    //this._initF4Interface(); //engine
    delete this._startUp; // No need to startup twice
};
//
this.startUp = function () {
    worldScripts.DayDiplomacy_000_Engine.$subscribe(this.name);

    delete this.startUp; // No need to startup twice
};
/*************************** End Oolite events ***********************************************************/

