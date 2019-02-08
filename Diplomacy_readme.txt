Diplomacy OXP

==============================
Summary
1. Description
2. What's currently implemented functionality-wise?
3. What's currently implemented technically?
4. Effects on game difficulty
5. Effects on game performance
6. Compatibility
7. Dependencies
8. Instructions
9. License
10. Known bugs
11. Changelog

==============================
Description

Hello everybody,

this is the Diplomacy OXP. Its intended goal is to allow historical events to happen between systems (attacks, loots,
 alliances, taxes...), and to have actions depending on this (news, massed flottillas, state racket, who knows?).
Technically, I see it as a war/diplomacy framework.
It includes an easy API for oxp developers.

It is STILL a Work In Progress.

In particular, the savefile format might change in the future; so it wouldn't do to expect a savefile from an old
 version to work with a newer version code.
If experimenting problems, the easy way is to edit the savefile and remove the lines including "Diplomacy".
 Then next start, the oxp will begin anew.

==============================
What's currently implemented functionality-wise?

Systems treasury!
    Wars require money, and countries are defeated either by battles or by bankruptcy,
     sometimes the latter producing the former.
    The Treasury and Tax levels are displayed in the F7 system information.
    Each system treasury is increased through taxation each player jump,
     depending on the time past since the last jump.

Strategic map!
    New F4 Interface screen: the Diplomacy Strategic Map!
    There, you can see the systems which (dis)like each other...

Systems alliances!
    Two systems within 7ly of each other may now form an alliance, if they like each other enough.
    They may break their alliance, too =-o !
    New F4 Interface screen: the Systems History!

News!
    Some Snooper news are now displayed when an alliance is formed or broken between two systems,
    and the player is within 7ly of one of those systems.

==============================
What's currently implemented technically?

The oxp contains Engines which may be accessed through APIs: EngineAPI, AlliancesEngineAPI, HistoryAPI, SystemsAPI.

The APIs are designed to be easy to use by developers to implement interesting galaxy-spanning events.

High-level behaviors are currently implemented using these APIs in the aptly named following scripts:
 Systems, Tax, Alliances, History.

==============================
Effects on game difficulty

None yet.

==============================
Effects on game performance

This oxp works only when the player is docked, so there is no impact during the flight time.
During the docking, it works once every ten frames, the effect on player experience should be negligible.
If it isn't negligible, tell me and I'll put in the ability to choose the number of frames.
Even if the effect is negligible on the player, it uses lots of cpu, so it might not be negligible on the battery.

==============================
Compatibility

==============================
Dependencies

- Snoopers OXP

==============================
Instructions

Do not unzip the .oxz file, just move into the AddOns folder of your Oolite installation.

==============================
License

This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike License version 4.0.
If you are re-using any piece of this OXP, please let me know by sending an e-mail to david at pradier dot info

==============================
Known bugs

None.

==============================
Changelog

0.13    Bugfix: manifest.plist for the oxz manager.
0.12    Bugfix: manifest.plist for the oxz manager.
0.11    Improvement, flavor: added a F4 Alliances Map, showing alliances between systems.
        Improvement, flavor: having only news for the player current system.
        Improvement, flavor: fixed Diziet Sma citation
        Improvement, code consistency: the tax script becomes the economy script.
        Improvement, code consistency: removed the TechnicalPrinciples.txt file, as its content is now mainly in the new OXP Performance thread.
        Improvement, dev func: added a beginning of Economy Engine API.
        Improvement, dev func: added a _debug flag in the Engine to start as if you just spent a turn and entered the station; ie, events are processing.
0.10    Improvement, flavor: added a F4 System history, showing the F7-selected system events history. The displayed text depends on a formatting function definable through API per event.
        Improvement, flavor: the alliance and alliance break events are now displayed in the history.
        Improvement, dev func: the EngineAPI provides the events, and the events by actor.
        Improvement, dev func: the EngineAPI allows now to store a variable in the saved state with the other saved variables of the oxp.
        Improvement, dev func: introduced a Systems API and a History API. The systems API provides the system actors indexed by galaxyID and systemID.
0.9     Improvement, flavor: the score given to a system by another depend on who they are allied to.
        Improvement, flavor: systems may now break their alliances.
        Bugfix: systems within 7 ly of any of both systems in the alliance are now informed of the alliance.
        Improvement, dev func: introduced an Alliance API.
0.8     Improvement, flavor: Two systems within 7ly of each other may now form an alliance, depending
        on their relation quality. Currently, each must have a score for the other of at least +0.5.
        Improvement, flavor: some Snooper news are now displayed when an alliance is formed between two systems,
        and the player is within 7ly of one of the allied systems.
        New, oxp dev func: introduced a functional Event system.
0.7     Improvement, flavor: added a F4 Strategic Map, showing links between systems nearer than 7. The relation between systems is currently based on their government.
0.6     Improvement, flavor: tax amount depends on the time spent since the last taxation.
        Improvement, speed: major refactor to remove closures, dereferences, JSON (de)serialization special functions.
0.5     Bugfix manifest.plist for the oxz manager.
0.4     Put into the oxz manager.
0.3     New, oxp dev func: delivered DiplomacyEngineAPI for oxp developers, provided a dedicated readme file.
        New, doc: provided a dedicated file DiplomacyRoadmap.txt
        Improvement, code consistency: the Systems and Tax js script now use the API rather than the native engine calls.
        Improvement, speed: optimized the loops in the engine
        Improvement, logic: when starting, the player is docked, so we should process the saved actions.
        Bugfix: solved a bug in the Tax script recurrent tax task after a savefile load.
        Bugfix: the init action using the api wasn't working after a restore from the savefile.
        Cleaning: log cleaning, file cleaning.
0.2     The actions are made progressively, one every 10 frames when docked, so as not to need more execution time than allowed at the same time, and to avoid slowdowns during the game.
0.1     First version of the Diplomacy engine. Systems are introduced as a type of "Actor". "SELFTAX" is introduced as an event for systems. Tax level and treasury are displayed on the F7 screen.