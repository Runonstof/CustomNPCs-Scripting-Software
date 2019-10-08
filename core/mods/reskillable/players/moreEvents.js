import "core/mods/reskillable/compatskills.js";
var skillLevelUp;
var __skill_values = {};
@block tick_event
if(!skillLevelUp) {
    checkLevelUp(e.player);
} else {
    checkLevelUp(e.player, skillLevelUp);
}



@endblock