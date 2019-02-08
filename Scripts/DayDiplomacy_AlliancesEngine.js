"use strict";
this.name = "DayDiplomacy_040_AlliancesEngine";
this.author = "David (Day) Pradier";
this.copyright = "(C) 2017 David Pradier";
this.licence = "CC-NC-by-SA 4.0";
this.description = "This script is the alliances engine of the Diplomacy OXP.";

/*************************** OXP public functions ********************************************************/
this.$getScoringFunctions = function () {
    return this._asf;
};
this.$addScoringFunction = function (keyword, f, position) {
    this._api.$setFunction(keyword, f);
    this._asf.splice(position, 0, keyword);
};
this.$recalculateScores = function (observedActor, observerActor) {
    var asf = this._asf, funcs = this._F, as = this._as;
    var observedId = observedActor.id, observerId = observerActor.id;
    var observedAs = as[observedId] || (as[observedId] = {});
    var score = observedAs[observerId] || (observedAs[observerId] = {});
    var finalScore = 0, z = asf.length, z0 = z - 1;
    while (z--) {
        var keyword = asf[z0 - z];
        var thatScore = funcs[keyword](observerActor, observedActor);
        score[keyword] = thatScore;
        finalScore += thatScore;
    }
    score.SCORE = finalScore;
};
this.$setAllianceThreshold = function (threshold) {
    this._F["diplomacyAlliancesRecurrentAction"].allianceThreshold = threshold;
    this._s.State.allianceThreshold = threshold;
};
/*************************** End OXP public functions ****************************************************/

/*************************** OXP private functions *******************************************************/
this._ally = function (aSystem, anotherSystemId) {
    var alliances = this._a;
    var aSystemId = aSystem.id;
    alliances[aSystemId] = alliances[aSystemId] || {};
    alliances[aSystemId][anotherSystemId] = 1; // Alliance
    alliances[anotherSystemId] = alliances[anotherSystemId] || {};
    alliances[anotherSystemId][aSystemId] = 1; // Alliance
    this._api.$makeActorEventKnownToUniverse(aSystemId, "ALLY", [anotherSystemId]);
    this._api.$makeActorEventKnownToUniverse(anotherSystemId, "ALLY", [aSystemId]);
};
this._breakAlliance = function(aSystem, anotherSystemId) {
    var alliances = this._a;
    var aSystemId = aSystem.id;
    alliances[aSystemId] && (delete alliances[aSystemId][anotherSystemId]); // Breaking alliance
    alliances[anotherSystemId] && (delete alliances[anotherSystemId][aSystemId]); // Breaking alliance
    this._api.$makeActorEventKnownToUniverse(aSystemId, "BREAK", [anotherSystemId]);
    this._api.$makeActorEventKnownToUniverse(anotherSystemId, "BREAK", [aSystemId]);
};
this._startUp = function () {
    var api = this._api = worldScripts.DayDiplomacy_002_EngineAPI;
    var hapi = this._hapi = worldScripts.DayDiplomacy_022_HistoryAPI;
    this._F = api.$getFunctions();

    // Alliances Scoring Functions: { keyword => fid }
    this._asf = api.$initAndReturnSavedData("alliancesScoringFunctions", []);
    // Alliances Scores: { observedId => { observerId => { keyword => score } } }
    this._as = api.$initAndReturnSavedData("alliancesScores", {});
    this._a = api.$initAndReturnSavedData("alliances", {});

    if (api.$getEventTypes().indexOf("ALLYSCORE") === -1) {
        api.$addEventType("ALLYSCORE", 1);
    }
    if (api.$getEventTypes().indexOf("BREAK") === -1) {
        api.$addEventType("BREAK", 2);
        // Managing history
        hapi.$setEventFormattingFunction("BREAK", function breakEventFormattingFunction(breakEvent) {
            var f = breakEventFormattingFunction, api = f._api || (f._api = worldScripts.DayDiplomacy_002_EngineAPI);
            var actors = api.$getActors();
            return actors[breakEvent.actorId].name + " broke their alliance with " + actors[breakEvent.args[0]].name + ".";
        });
    }
    if (api.$getEventTypes().indexOf("ALLY") === -1) {
        api.$addEventType("ALLY", 3);
        // Managing history
        hapi.$setEventFormattingFunction("ALLY", function allyEventFormattingFunction(allyEvent) {
            var f = allyEventFormattingFunction, api = f._api || (f._api = worldScripts.DayDiplomacy_002_EngineAPI);
            var actors = api.$getActors();
            return actors[allyEvent.actorId].name + " allied with " + actors[allyEvent.args[0]].name + ".";
        });
    }

    var fid = "diplomacyAlliancesRecurrentAction";
    var f = this._F[fid];
    if (!f) {

        // Function to calculate scores, here is the system for which scores are calculated
        var diplomacyAlliancesScoringRecurrentAction = function diplomacyAlliancesScoringRecurrentAction(aSystem) {
            // FIXME perfectfunc should be actor-agnostic
            var observersId = aSystem.observers["SYSTEM"];
            if (!observersId) {
                return; // There may be no observer yet.
            }
            var that = diplomacyAlliancesScoringRecurrentAction;
            var ae = that.alliancesEngine || (that.alliancesEngine = worldScripts.DayDiplomacy_040_AlliancesEngine);
            var api = that.api || (that.api = worldScripts.DayDiplomacy_002_EngineAPI);
            var actors = api.$getActors();
            var y = observersId.length;
            while (y--) {
                ae.$recalculateScores(actors[observersId[y]], aSystem);
            }
        };
        var fid2 = "diplomacyAlliancesScoringRecurrentAction";
        api.$setFunction(fid2, diplomacyAlliancesScoringRecurrentAction);
        api.$setRecurrentAction(api.$buildAction(api.$buildNewActionId(), "ALLYSCORE", "SYSTEM", fid2));

        // Function to break alliance: here, aSystem is the system with which the alliance might be broken.
        var diplomacyAlliancesBreakRecurrentAction = function diplomacyAlliancesBreakRecurrentAction(aSystem) {
            var that = diplomacyAlliancesBreakRecurrentAction;
            var alliancesScores = that.alliancesScores || (that.alliancesScores = worldScripts.DayDiplomacy_000_Engine.State.alliancesScores);
            var alliances = that.alliances || (that.alliances = worldScripts.DayDiplomacy_000_Engine.State.alliances);
            var allianceThreshold = that.allianceThreshold || (that.allianceThreshold = worldScripts.DayDiplomacy_000_Engine.State.allianceThreshold);
            var aSystemId = aSystem.id;
            var aSystemScores = alliancesScores[aSystemId];
            for (var breakerId in aSystemScores) {
                if (aSystemScores.hasOwnProperty(breakerId)) {
                    if (!alliances.hasOwnProperty(breakerId) || !alliances[breakerId].hasOwnProperty(aSystemId)) {
                        continue; // Not yet allied
                    }

                    if (aSystemScores[breakerId].SCORE < allianceThreshold || alliancesScores[breakerId][aSystemId].SCORE < allianceThreshold) { // One is willing to break
                        var alliancesEngine = alliancesEngine || (worldScripts.DayDiplomacy_030_AlliancesEngine);
                        alliancesEngine._breakAlliance(aSystem, breakerId);
                    }
                }
            }
        };
        var fid3 = "diplomacyAlliancesBreakRecurrentAction";
        api.$setFunction(fid3, diplomacyAlliancesBreakRecurrentAction);
        api.$setRecurrentAction(api.$buildAction(api.$buildNewActionId(), "BREAK", "SYSTEM", fid3));

        // Function to ally: here, aSystem is the system to which the alliance might be proposed.
        var diplomacyAlliancesRecurrentAction = function diplomacyAlliancesRecurrentAction(aSystem) {
            var that = diplomacyAlliancesRecurrentAction;
            var alliancesScores = that.alliancesScores || (that.alliancesScores = worldScripts.DayDiplomacy_000_Engine.State.alliancesScores);
            var alliances = that.alliances || (that.alliances = worldScripts.DayDiplomacy_000_Engine.State.alliances);
            var allianceThreshold = that.allianceThreshold || (that.allianceThreshold = worldScripts.DayDiplomacy_000_Engine.State.allianceThreshold);
            var aSystemId = aSystem.id;
            var aSystemScores = alliancesScores[aSystemId];
            for (var proposerId in aSystemScores) {
                if (aSystemScores.hasOwnProperty(proposerId)) {
                    if (alliances.hasOwnProperty(proposerId) && alliances[proposerId].hasOwnProperty(aSystemId)) {
                        continue; // Already allied
                    }

                    if (aSystemScores[proposerId].SCORE >= allianceThreshold && alliancesScores[proposerId][aSystemId].SCORE >= allianceThreshold) { // Both are willing
                        var alliancesEngine = alliancesEngine || (worldScripts.DayDiplomacy_040_AlliancesEngine);
                        alliancesEngine._ally(aSystem, proposerId);
                    }
                }
            }
        };
        api.$setFunction(fid, diplomacyAlliancesRecurrentAction);
        api.$setRecurrentAction(api.$buildAction(api.$buildNewActionId(), "ALLY", "SYSTEM", fid));
        this.$setAllianceThreshold(.5); // Default value for the very first initialization
    }
    this.$setAllianceThreshold(this._s.State.allianceThreshold); // Startup init using saved value

    delete this._startUp; // No need to startup twice
};
/*************************** End OXP private functions ***************************************************/

/*************************** Oolite events ***************************************************************/
this.startUp = function () {
    this._s = worldScripts.DayDiplomacy_000_Engine;
    this._s.$subscribe(this.name);
    delete this.startUp; // No need to startup twice
};
/*************************** End Oolite events ***********************************************************/