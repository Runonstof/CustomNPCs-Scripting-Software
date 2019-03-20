# Gramados Server Script
Script for Custom NPCs 1.12.2
Adds:
 - Regions
 - Jobs
 - Permission system
 - !-commands
 - Chat Channels
 - Custom Chat
 
**HOW DOES IT WORK?**

`<argument>` Means it is required    
`[argument]` Means it is optional    
`<...arguments>` Means you can provide multiple, *but at least provide one*    
`[...arguments]` Means you can provide multiple, *but is optional*    

**FORMATTING TIME**

```
year = y
month = mon
week = w
day = d
hour = h
minute = min
second = s
millisec = ms
So 1 year 2 months and 3 second should be written as
1y2mon3s
```

Keep in mind that the commands themselves and their arguments like teams and players are case-sensitive!

**SYSTEM ADMINISTRATION COMMANDS**

The `permission_id` of for example `!perms removePlayers <permission_id> <...players>` would be `perms.removePlayers`

Be careful of changing permissioncommand-permissions!    
`!perms add <permission_id>` Adds a new permission, is currently impractical to do as permission are now automatic, and no cool things for custom permission yet :(    
`!perms setEnabled <permission_id> <value>` Disabled or Enabled an permission, `<value>` should be true or false.    
`!perms remove <permission_id>` ONLY REMOVE PERMISSIONS ADDED BY YOURSELF!    
`!perms addTeams <permission_id> <...teams>` This command add teams to a permission    
`!perms removeTeams <permission_id> <...teams>` This command removes teams from a permission    
`!perms addPlayers <permission_id> <...players>` This command add players to a permission, if you want to make exceptions    
`!perms removePlayers <permission_id> <...players>` This command removes players from a permission    
`!perms list [...matches]` Shows all the permission ids, and if at least one match is given, it shows only the ids that match it    
`!perms info <permission_id>` Shows all the info about the permission    

And much more to come

**UTILITY COMMANDS**

`!convertNpcLoot <radius>` Convert the old money in NPC dropchances to new money    
`!convertMoney` Converts the old money in your hand to new money.    
`!giveMoney <amount> [...players]` Gives yourself or the given players the amount of money, write `<amount>` like this: `29m248k98G2c`    
Most of you wont probably have access to this command    
`!sayas <player> <...message>` Say something as someone else >:)    
`!listEnchants [...matches]` Get all enchants (including those added by mods)    
`!listPotions [...matches]` Lists all potion effects (including those added by mods)    
`!listBiomes [...matches]` Lists all biomes (including those added by mods)    

**ITEM COMMANDS**

Only a few commands yet, but there is gonna be an item edit interface for custom-attributes etc.    
`!renameItem <...name>` Rename the item in hand, you can use color codes with the `&` character    
`!renameLore <slot> [...name]` Rename lore of item in your hand, slot starts at `0`    


**JOB COMMANDS**

`!jobs add <name> [...display_name]` Adds a job, `<name>` should only contain `a-zA-Z0-9_` (no spaces), so `Oil Treater` would be `oil_treater`    
`!jobs remove <name>` Removes a job    
`!jobs setPay <name> <amount>` Sets the salary of a job, use `1M23K485G2C`-like notation for `<amount>`    
`!jobs setPayTime <name> <time>` Set the interval of the salary, check this channel of how to format `<time>` correctly    
`!jobs setOpen <name> <open>` Sets the job open, `<open>` should be true or false    
`!jobs setDisplayName <name> <...display_name>` Sets the display name of a job    
`!jobs list [...matches]` Lists all jobs or matching with one of given matches    
`!jobs info <name>` Shows info about an jobs    
`!jobs playerList <name>` List all players who work at that job (can also be seen soon with `!player income`)    
`!jobs addPlayers <name> <...players>` Force-add players to a job, this is an admin-command    
`!jobs removePlayers <name> <...players>` Force-removes players from a job    
`!jobs setPlaces <name> <amount>` Set the available places in a job, set to `-1` for infinite    
`!jobs setFireTime <name> <time>` If `<time>` has passed, and player has still not logged in, he get fired.    

`!jobs apply <name>` and `!jobs fire <name> <...players>` are in the making    

**PLAYER COMMANDS** *Made for regular players*    

`!myIncome` Shows your salary, how much time between salaries and when you will get your next one
^^ Job salary info to be added    
`!home <name>` TPs you to home `<name>`    
`!addHome <name>` Creates a home    
`!delHome <name>` Deletes a home    
`!listHomes` Lists all your homes    
 - `!myStats` and `!mySkills` planned when skill system is there    
 
**PLAYER MANAGEMENT COMMANDS**

`!player setPay <player> <amount>` Sets `<player>`'s base income to `<amount>`    
`!player setPayTime <player> <time>` Every time that `<time>` has passed, `<player>` receives his base-income. Use time notation    
`!player setMaxJobs <player> <amount>` Sets the maximum jobs `<player>` can have, set to `-1` for infinite jobs    
`!player setMaxHomes <player> <amount>` Sets the maximum homes `<player>` can have. (`-1` is infinite)    
 
**CHAT CHANNEL COMMANDS**

`!chat create <name>` Creates a chat channel, name should only contain `A-Za-z0-9_`    
`!chat remove <name>` Removes a chat channel    
`!chat list [...match]` Lists all chat channels (and in what you're talking in), and if at least one match is given, it shows only matching these    
`!chat setColor <name> <color>` Sets chat color, defaults to `blue` like Discord    
`!chat setDisplayName <name> <...displayName>` Sets display name, spaces allowed, *no color coding* (auto-handled)  
`!chat setDesc <name> [...desc]` Sets description, can also be nothing.    
`!chat join <name>` Hmmmmmmmmm???????    
`!chat leave <name>` ^^    
`!chat addPlayers <name> <...players>` admin command planned for force-adding players    
