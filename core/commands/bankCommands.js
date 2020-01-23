import "cst/datahandler/Bank.js";

@block register_commands_event
//REGISTER COMMANDS
var bankCommands = new CommandFactory("bank");

var bankCreationCost = getCoinAmount('20K');
var bankFreezePlans = [
    [getStringTime('1mon'), 5, '1 month'],
    [getStringTime('2mon'), 8, '2 months'],
    [getStringTime('3mon'), 11, '3 months'],
];

bankCommands
    .addSettable("cap", function(value) {
        return parseInt(value);
    }, [{
        "argname": "cap",
        "type": "number",
        "min": 1,
    }])
    .addInfoText(function(bank) {
        return "&6&lOwner: &e" + (bank.data.owner || CONFIG_SERVER.TITLE) + '\n' +
            "&6&lCapacity: &r:money:&e" + getAmountCoin(bank.data.cap) + '\n' +
            '&6&lBankcode: &b' + bank.name;
    })
    // .genDefault(['copy', 'list', 'create', 'remove'])
    .register();

registerXCommands([
    ['!bank remove <code>', function(pl, args, data) {
        var bank = new Bank(args.code).init(data);

        if (bank.data.isFrozen) {
            tellPlayer(pl, "&cThis bank is frozen.");
            return false;
        }


        if (!bank.isOwner(pl.getName()) && !new Permission('bank.admin').init(data).permitsPlayer(pl)) {
            tellPlayer(pl, "&cYou can't remove this bank");
            return false;
        }
        bank.remove(data);

        tellPlayer(pl, '&aRemoved bank \'' + (bank.data.displayName || bank.name) + '\'.');
    }, 'bank.remove', [{
        "argname": "code",
        "type": "datahandler",
        "datatype": "bank",
        "exists": true
    }]],
    ['!bank make <...displayName>', function(pl, args, data) {
        var p = new Player(pl.getName()).init(data);

        var banks = p.getBanks(data);
        //Todo bank cap
        var bankCount = 0;
        for (var i in banks as checkBank) {
            if (checkBank.isOwner(pl.getName())) {
                bankCount++;
            }
        }

        if (bankCount >= 2) {
            tellPlayer(pl, "&cYou have reached a maximum of 2 bank accounts");
            return false;
        }

        if (p.data.money < bankCreationCost) {
            tellPlayer(pl, "&cYou need &r:money:&e" + getAmountCoin(bankCreationCost) + "&c to create a bank account.");
            return false;
        }

        var code = Bank.genBankCode(data);

        var bank = new Bank(code);
        bank.data.owner = pl.getName();
        bank.data.displayName = args.displayName.join(' ');
        p.data.money -= bankCreationCost;
        p.save(data);
        bank.save(data);
        tellPlayer(pl, "&aTook &r:money:&e" + getAmountCoin(bankCreationCost) + "&a as bank creation cost.");
        tellPlayer(pl, "&aCreated new bank under code &e" + bank.name + "&a. Do &c!myBanks&a to manage your banks and the ones you're added to.");
    }, 'bank.make'],
    ['!myBanks [...matches]', function(pl, args, data) {
        var output = getTitleBar('Bank Accounts') + '\n';
        var params = getArgParams(args.matches);

        var banks = [];
        var allBanks = new Bank().getAllDataEntries(data);
        for (var i in allBanks as checkBank) {
            if (checkBank.canSee(pl.getName())) {
                banks.push(checkBank);
            }
        }

        output += "&6[[ &e[My Money]{run_command:!myMoney|show_text:$eClick to view your money.}&6 || &e[My Banks]{run_command:!myBanks|show_text:$eClick here to view your bank accounts.}&6 || &e[My Loan]{run_command:!myLoan|show_text:$eClick here to view your current active loan.}&6 || &e[My Emotes]{run_command:!myEmotes|show_text:$eClick here to view your emotes.}&6 ]]\n ";

        output += genDataPageList(
            banks,
            args.matches,
            parseInt(params.show || 10),
            parseInt(params.page || 1),
            '!myBanks {MATCHES} -show:{SHOW} -page:{PAGE} -sort:{SORT}',
            function(bank) {
                var infoText = '&dClick to see more details.\n' +
                    '&6&lBank Code: &e&o' + bank.name + '\n' +
                    '&e&o' + bank.data.displayName + '\n' +
                    '&f&o' + bank.data.description + '\n' +
                    '&6&lOwner: &e&o' + bank.data.owner + '\n' +
                    (bank.canWithdraw(pl.getName()) ? '&a[:check: Withdraw]' : '&c[:cross: Withdraw]') + ' ' +
                    (bank.canDeposit(pl.getName()) ? '&a[:check: Deposit]' : '&c[:cross: Deposit]') + ' ' +
                    (bank.isAdmin(pl.getName()) ? '&a[:check: Admin]' : '&c[:cross: Admin]') + '\n' +
                    '\n&6&lCapacity:\n' +
                    '&6Current: &r:money:&e' + getAmountCoin(bank.data.amount) + '&r\n' +
                    progressBar(bank.data.amount, bank.data.cap, 30) + ' &b' + roundDec(100 / bank.data.cap * bank.data.amount) + '%\n' +
                    '&6Max: &r:money:&e' + getAmountCoin(bank.data.cap);
                return '&r - &e&o' + bank.data.displayName + ' &6&o(' + bank.name + ') &d[Info]{run_command:!bank info ' + bank.name + '|show_text:' + infoText.replaceAll('&', '$') + '\n$dClick to see more details.} &r[:money:&e' + getAmountCoin(bank.data.amount) + '&r]' +
                    '\n |-- ' +
                    (bank.canWithdraw(pl.getName()) ? ' &a[+ Withdraw]{suggest_command:!bank withdraw ' + bank.name + ' |show_text:$aClick to withdraw $oan amount of your own choice$r$a from $e$o' + bank.name + '}' : ' &c&m[+ Withdraw]') +
                    (bank.canDeposit(pl.getName()) ? ' &a[- Deposit]{suggest_command:!bank deposit ' + bank.name + ' |show_text:$aClick to deposit $oan amount of your own choice$r$a in $e$o' + bank.name + '}&r' : ' &c&m[- Deposit]') + '\n';
            },
            function(a, b) {
                return (b.data.amount || 0) - (a.data.amount || 0);
            },
            function(bank, list) {
                return arrayOccurs(bank.name, list, false, false) > 0 ||
                    arrayOccurs(bank.data.displayName, list, false, false) > 0 ||
                    arrayOccurs(bank.data.description, list, false, false) > 0;
            },
            (params.sort || "").toLowerCase() == "desc"
        );

        tellPlayer(pl, output);
    }, 'myBanks'],
    ['!bank withdraw <code> <amount>', function(pl, args, data) {
        var bank = new Bank(args.code).init(data);
        var p = new Player(pl.getName()).init(data);
        var amount = getCoinAmount(args.amount);

        if (bank.data.isFrozen) {
            tellPlayer(pl, "&cThis bank is frozen.");
            return false;
        }

        if (!bank.canWithdraw(pl.getName()) && !new Permission('bank.admin').init(data).permitsPlayer(pl)) {
            tellPlayer(pl, "&cYou can't withdraw from this bank.");
            return false;
        }

        if (bank.data.amount < amount) {
            tellPlayer(pl, "&cNot enough money in bank" + (bank.data.amount > 0 ? ' &c&o[Withdraw the rest]{run_command:!bank withdraw ' + args.code + ' ' + getAmountCoin(bank.data.amount) + '|show_text:$aClick to withdraw $r:money:$e' + getAmountCoin(amount) + '}&r' : ''));
            return false;
        }



        bank.data.amount -= amount;
        p.data.money += amount;
        bank.save(data);
        p.save(data);

        tellPlayer(pl, "&aWithdrawed &r:money:&e" + getAmountCoin(amount) + "&a from bank &e&o" + bank.data.displayName);

    }, 'bank.withdraw', [{
        "argname": "code",
        "type": "datahandler",
        "datatype": "bank",
        "exists": true
    }, {
        "argname": "amount",
        "type": "currency",
        "min": 1
    }]],
    ['!bank deposit <code> <amount>', function(pl, args, data) {
        var bank = new Bank(args.code).init(data);
        var p = new Player(pl.getName()).init(data);
        var amount = getCoinAmount(args.amount);

        if (bank.data.isFrozen) {
            tellPlayer(pl, "&cThis bank is frozen.");
            return false;
        }

        if (!bank.canDeposit(pl.getName()) && !new Permission('bank.admin').init(data).permitsPlayer(pl)) {
            tellPlayer(pl, "&cYou can't deposit in this bank.");
            return false;
        }

        if (bank.data.amount + amount > bank.data.cap) {
            var overflow = Math.max(bank.data.cap - bank.data.amount, 0);
            tellPlayer(pl, "&c&cThe bank can only hold &r:money:&e" + getAmountCoin(overflow) + " &cmore money." + (overflow > 0 ? " &4[Deposit]{run_command:!bank deposit " + bank.name + " " + getAmountCoin(overflow) + "|show_text:$cClick to deposit $r:money:$e" + getAmountCoin(overflow) + "}&r" : ""));
            return false;
        }

        if (p.data.money < amount) {
            tellPlayer(pl, "&cYou don't have enough money in your money pouch.");
            return false;
        }


        bank.data.amount += amount;
        p.data.money -= amount;
        bank.save(data);
        p.save(data);

        tellPlayer(pl, "&aDeposited &r:money:&e" + getAmountCoin(amount) + "&a in bank &e&o" + bank.data.displayName);

    }, 'bank.deposit', [{
        "argname": "code",
        "type": "datahandler",
        "datatype": "bank",
        "exists": true
    }]],
    ['!bank info <code> [...matches]', function(pl, args, data) {
        var bank = new Bank(args.code).init(data);
        var params = getArgParams(args.matches);

        var page = params.showpage || 'info';

        if (!(bank.canSee(pl.getName()) || new Permission('bank.admin').init(data).permitsPlayer(pl))) {
            tellPlayer(pl, "&cYou can't see the info from this bank.");
            return false;
        }


        var output = '';

        var trustedName;

        switch (page) {
            case 'info':
                var freezeInfo = '&dClick to see more details.';
                if (bank.data.isFrozen) {
                    if (bank.isFrozenAndDone()) {
                        freezeInfo += '\n\n&bBank freeze is done, click further to collect profit.\n';
                    } else {
                        freezeInfo += '\n&bFreeze Time Left: &o' + getTimeString((bank.data.frozeAt + bank.data.freezeTime) - new Date().getTime(), ['ms']) + '\n' +
                            '&bProfit: &r:money:&e' + getAmountCoin(bank.getFreezeAmount() - bank.data.amount);
                    }
                    freezeInfo += '\n&dClick to see more details.';
                }
                output += getTitleBar('Bank Info') + '\n' +
                    '&6&lBank Code: &e&o' + bank.name + ' &a[:recycle: Regenerate for 5K]{run_command:!bank regencode ' + bank.name + '|show_text:$aClick to regenerate code for $r:money:$e5K\n$cWARNING: Any linked service to this bank, like a trader npc has to be manually re-set.}&r\n' +
                    '&6&lBank Name: &e&o' + bank.data.displayName + ' &a[Change]{suggest_command:!bank setDisplayName ' + bank.name + '|show_text:$aClick to change display name.}&r\n' +
                    '&6&lDescription:  &a[Change]{suggest_command:!bank setDesc ' + bank.name + '|show_text:$aClick to change description.}&r\n&e' + bank.data.description + '\n' +
                    '&6&lOwner: &e&o' + (bank.data.owner || CONFIG_SERVER.TITLE) + '\n' +
                    '&6&lMoney: &r:money:&e' + getAmountCoin(bank.data.amount) + '\n' +
                    '&6&lCapacity: &r' + progressBar(bank.data.amount, bank.data.cap, 30) + ' &d' + roundDec(100 / bank.data.cap * bank.data.amount) + '% &r:money:&e' + getAmountCoin(bank.data.amount) + '&6/&r:money:&e' + getAmountCoin(bank.data.cap) + '\n' +
                    '&6&lUpgrade Cost: &r:money:&e' + getAmountCoin(bank.data.increaseCost) + ' &a[Upgrade]{run_command:!bank upgrade ' + bank.name + '|show_text:$aClick to upgrade bank for $r:money:$e' + getAmountCoin(bank.data.increaseCost) + '$a to get:\n$e - $r:money:$e' + getAmountCoin(bank.data.increaseAmount) + ' $amore capacity\n$e - $c' + bank.data.trustedIncreaseAmount + '$a more trusted list capacity.}&r\n' +
                    '&b&lBank freeze: &e&o' + (bank.getFreezeStatus()) + ' &b[Show Info]{run_command:!bank info ' + bank.name + ' -showpage:freeze|show_text:' + freezeInfo.replaceAll('&', '$') + '}&r\n' +
                    '&6Trusted Admin List: &a' + bank.data.trustedAdmins.length + '/' + bank.data.trustedCap + ' &b[View List]{run_command:!bank info ' + bank.name + ' -showpage:trustedAdmins|show_text:$3Click to see trusted bank admins list.}&r\n' +
                    '&6Trusted Withdraw List: &a' + bank.data.trustedGet.length + '/' + bank.data.trustedCap + ' &b[View List]{run_command:!bank info ' + bank.name + ' -showpage:trustedGet|show_text:$3Click to see trusted bank withdraw list.}&r\n' +
                    '&6Trusted Deposit List: &a' + bank.data.trustedPut.length + '/' + bank.data.trustedCap + ' &b[View List]{run_command:!bank info ' + bank.name + ' -showpage:trustedPut|show_text:$3Click to see trusted bank deposit list.}&r\n';
                break;
            case 'freeze':
                var freezeStatusText = '';
                switch (bank.getFreezeStatus()) {
                    case 'none':
                        freezeStatusText = '&e&onone';
                        break;
                    case 'frozen':
                        freezeStatusText = '&b&ofrozen';
                        break;
                    case 'done':
                        freezeStatusText = '&a&odone &b[Collect]{run_command:!bank collect ' + bank.name + '|show_text:$bClick to collect freeze earnings.}&r';
                        break;
                }

                output += getTitleBar('Bank Freeze Info', false) + '\n' +
                    '&6&lFreeze Status: ' + (freezeStatusText) + '\n';

                // Show freeze plans
                if (!bank.data.isFrozen) {
                    var fpText;
                    for (var i in bankFreezePlans as freezePlan) {
                        fpText = '&3Click to freeze your bank account for ' + freezePlan[2] + ' to get:\n' +
                            '&r:money:&e' + getAmountCoin(bank.data.amount) + ' &3+ &b' + freezePlan[1] + '%&3 = &r:money:&e' + getAmountCoin(bank.getFreezeAmount(freezePlan[1])) + '\n' +
                            '&3Profit after ' + freezePlan[2] + ': &r:money:&e' + getAmountCoin(bank.getFreezeAmount(freezePlan[1]) - bank.data.amount);


                        output += '&b[Freeze ' + freezePlan[2] + ']{run_command:!bank freeze ' + bank.name + ' ' + i.toString() + '|show_text:' + fpText.replaceAll('&', '$') + '}&r\n';
                    }

                } else { // Show current freeze info
                    if (!bank.isFrozenAndDone()) {
                        output += '&6&lFreeze Time: &e&o' + getTimeString(bank.data.freezeTime, ['ms']) + '\n' +
                            '&6&lFreeze Time Left: &e&o' + getTimeString((bank.data.frozeAt + bank.data.freezeTime) - new Date().getTime(), ['ms']) + ' left\n' +
                            '&6&lFreeze Interest: &e&o' + bank.data.interest + '%\n' +
                            '&6&lProfit: &r:money:&e' + getAmountCoin(bank.getFreezeAmount() - bank.data.amount);
                    } else {
                        output += '&6&lProfit: &r:money:&e' + getAmountCoin(bank.getFreezeAmount() - bank.data.amount);
                    }
                }

                break;
            case 'trustedAdmins':
                trustedName = 'Admin';
            case 'trustedGet':
                if (!trustedName) { trustedName = 'Withdraw'; }
            case 'trustedPut':
                if (!trustedName) { trustedName = 'Deposit'; }

                var key = page;

                output += getTitleBar('Trusted Bank ' + trustedName + ' List', false) + '\n';

                output += '&e&l[<<< Back to bank info]{run_command:!bank info ' + bank.name + '|show_text:$eClick to go back to bank info}&r\n';

                output += genDataPageList(
                    bank.data[key],
                    args.matches,
                    parseInt(params.show || 10),
                    parseInt(params.page || 1),
                    "!bank info " + bank.name + " -showpage:" + page + " -show:{SHOWLEN} -page:{PAGE} -sort:{SORT}",
                    function(trusted) {
                        var txt = '&e - &a' + trusted + ' &c[:cross: Remove]{run_command:!bank removetrusted ' + trustedName.toLowerCase() + ' ' + bank.name + ' ' + trusted + '}&r\n';
                        return txt;
                    },
                    function(a, b) {
                        return b - a;
                    },
                    function(trusted, list) {
                        return arrayOccurs(trusted, list, false, false) > 0;
                    },
                    (params.sort || '').toLowerCase() == 'desc',
                    '&2[+ Add more players]{suggest_command:!bank addtrusted ' + trustedName.toLowerCase() + ' ' + bank.name + ' |show_text:$aClick to add a new player to the bank\'s ' + trustedName + ' list\n$c$o!bank add ' + trustedName.toLowerCase() + ' ' + bank.name + ' playerName otherPlayer}&r'
                );

                break;
            default:
                output += '&cPage not found.';
                break;
        }


        tellPlayer(pl, output);

    }, 'bank.info', [{
        "argname": "code",
        "type": "datahandler",
        "datatype": "bank",
        "exists": true
    }]],
    ['!bank list [...matches]', function(pl, args, data) {
        var output = getTitleBar('Bank List') + '\n';
        var params = getArgParams(args.matches);
        output += genDataPageList(
            new Bank().getAllDataEntries(data),
            args.matches,
            parseInt(params.show || 10),
            parseInt(params.page || 1),
            '!back list {MATCHES} -show:{SHOW} -page:{PAGE} -sort:{SORT}',
            function(bank) {
                var infoText = '&6&lBank Code: &e&o' + bank.name + '\n' +
                    '&e&o' + bank.data.displayName + '\n' +
                    '&f&o' + bank.data.description + '\n' +
                    '&6&lOwner: &e&o' + bank.data.owner + '\n' +
                    (bank.canWithdraw(pl.getName()) ? '&a[:check: Withdraw]' : '&c[:cross: Withdraw]') + ' ' +
                    (bank.canDeposit(pl.getName()) ? '&a[:check: Deposit]' : '&c[:cross: Deposit]') + ' ' +
                    (bank.isAdmin(pl.getName()) ? '&a[:check: Admin]' : '&c[:cross: Admin]') + '\n' +
                    '\n&6&lCapacity:\n' +
                    '&6Current: &r:money:&e' + getAmountCoin(bank.data.amount) + '&r\n' +
                    progressBar(bank.data.amount, bank.data.cap, 30) + ' &b' + roundDec(100 / bank.data.cap * bank.data.amount) + '%\n' +
                    '&6Max: &r:money:&e' + getAmountCoin(bank.data.cap);
                return '&r - &e&o' + bank.data.displayName + ' &6&o(' + bank.name + ') &d[Info]{run_command:!bank info ' + bank.name + '|show_text:' + infoText.replaceAll('&', '$') + '\n$dClick to see more details.} &r[:money:&e' + getAmountCoin(bank.data.amount) + '&r]\n';
            },
            function(a, b) {
                return (b.data.amount || 0) - (a.data.amount || 0);
            },
            function(bank, list) {
                return arrayOccurs(bank.name, list, false, false) > 0 ||
                    arrayOccurs(bank.data.displayName, list, false, false) > 0 ||
                    arrayOccurs(bank.data.description, list, false, false) > 0;
            },
            (params.sort || "").toLowerCase() == "desc"
        );

        tellPlayer(pl, output);
    }, 'bank.list'],
    ['!bank addtrusted <trustedList> <code> <...players>', function(pl, args, data) {
        var bank = new Bank(args.code).init(data);
        var adminPerm = new Permission('bank.admin').init(data);
        if (args.trustedList == 'admin') {
            if (!bank.isOwner(pl.getName()) && !adminPerm.permitsPlayer(pl)) {
                tellPlayer(pl, "&cYou don't have permission to add trusted players to this bank");
                return false;
            }
        } else {
            if (!bank.isAdmin(pl.getName()) && !adminPerm.permitsPlayer(pl)) {
                tellPlayer(pl, "&cYou don't have permission to add trusted players to this bank");
                return false;
            }
        }
        var trustedListKeys = {
            'admin': 'trustedAdmins',
            'withdraw': 'trustedGet',
            'deposit': 'trustedPut'
        };

        var trustedListKey = trustedListKeys[args.trustedList];

        if (bank.data[trustedListKey].length + args.players.length > bank.data.trustedCap && !adminPerm.permitsPlayer(pl)) {
            tellPlayer(pl, "&cYou can't add that many trusted players to the bank, upgrade your bank for more trusted capacity.");
            return false;
        }

        var addCount = 0;
        for (var i in args.players as player) {
            if (bank.data[trustedListKey].indexOf(player) == -1) {
                bank.data[trustedListKey].push(player);
                addCount++;
            }
        }

        bank.save(data);
        tellPlayer(pl, '&aSaved ' + addCount + ' players to trusted ' + args.trustedList);
        return true;
    }, 'bank.addtrusted', [{
            "argname": "trustedList",
            "type": "enum",
            "values": ["admin", "deposit", "withdraw"]
        },
        {
            "argname": "code",
            "type": "datahandler",
            "datatype": "bank",
            "exists": true
        }
    ]],
    ['!bank removetrusted <trustedList> <code> <...players>', function(pl, args, data) {
        var bank = new Bank(args.code).init(data);
        var adminPerm = new Permission('bank.admin').init(data);
        if (args.trustedList == 'admin') {
            if (!bank.isOwner(pl.getName()) && !adminPerm.permitsPlayer(pl)) {
                tellPlayer(pl, "&cYou don't have permission to remove trusted players from this bank");
                return false;
            }
        } else {
            if (!bank.isAdmin(pl.getName()) && !adminPerm.permitsPlayer(pl)) {
                tellPlayer(pl, "&cYou don't have permission to remove trusted players from this bank");
                return false;
            }
        }
        var trustedListKeys = {
            'admin': 'trustedAdmins',
            'withdraw': 'trustedGet',
            'deposit': 'trustedPut'
        };

        var trustedListKey = trustedListKeys[args.trustedList];

        var removeCount = 0;
        var newPlayers = [];
        for (var i in bank.data[trustedListKey] as trustedPlayer) {
            if (args.players.indexOf(trustedPlayer) == -1) {
                newPlayers.push(trustedPlayer);
                continue;
            }
            removeCount++;
        }

        bank.data[trustedListKey] = newPlayers;
        bank.save(data);
        tellPlayer(pl, "&aRemoved " + removeCount + " from " + args.trustedList);

    }, 'bank.removetrusted', [{
            "argname": "trustedList",
            "type": "enum",
            "values": ["admin", "deposit", "withdraw"]
        },
        {
            "argname": "code",
            "type": "datahandler",
            "datatype": "bank",
            "exists": true
        }

    ]],
    ['!bank setDesc <code> [...description]', function(pl, args, data) {
        var bank = new Bank(args.code).init(data);
        var desc = args.description.join(' ');
        var hasAdminPerm = new Permission('bank.admin').init(data).permitsPlayer(pl);

        if (!bank.isAdmin(pl.getName()) && !hasAdminPerm) {
            tellPlayer(pl, "&cYou can't set the description of this bank");
            return false;
        }
        bank.data.description = desc;
        bank.save(data);

        tellPlayer(pl, "&aChanged the description to: &r" + desc);
    }, 'bank.setDesc', [{
        "argname": "code",
        "type": "datahandler",
        "datatype": "bank",
        "exists": true
    }]],
    ['!bank setDisplayName <code> [...displayName]', function(pl, args, data) {
        var bank = new Bank(args.code).init(data);
        var displayName = args.displayName.join(' ');
        var hasAdminPerm = new Permission('bank.admin').init(data).permitsPlayer(pl);

        if (!bank.isAdmin(pl.getName()) && !hasAdminPerm) {
            tellPlayer(pl, "&cYou can't set the displayName of this bank");
            return false;
        }
        bank.data.displayName = displayName;
        bank.save(data);

        tellPlayer(pl, "&aChanged the displayName to: &r" + displayName);
    }, 'bank.setDisplayName', [{
        "argname": "code",
        "type": "datahandler",
        "datatype": "bank",
        "exists": true
    }]],
    ['!bank upgrade <code>', function(pl, args, data) {
        var bank = new Bank(args.code).init(data);
        var hasAdminPerm = new Permission('bank.admin').init(data).permitsPlayer(pl);

        if (bank.data.isFrozen) {
            tellPlayer(pl, "&cThis bank is frozen.");
            return false;
        }

        if (!bank.isAdmin(pl.getName()) && !hasAdminPerm) {
            tellPlayer(pl, "&cYou can't upgrade this bank");
            return false;
        }

        var p = new Player(pl.getName()).init(data);

        if (p.data.money < bank.data.increaseCost) {
            tellPlayer(pl, "&cYou don't have &r:money:&e" + getAmountCoin(bank.data.increaseCost) + "&c in your money pouch!");
            return false;
        }

        p.data.money -= bank.data.increaseCost;
        bank.data.cap += bank.data.increaseAmount;
        bank.data.trustedCap += bank.data.trustedIncreaseAmount;
        p.save(data);
        bank.save(data);

        tellPlayer(pl, "&aUpgraded bank for &r:money:&e" + getAmountCoin(bank.data.increaseCost) + "&a.\nThis has been takef from your money pouch. &2[Click here for bank info]{run_command:!bank info " + bank.name + "}&r");
    }, 'bank.upgrade', [{
        "argname": "code",
        "type": "datahandler",
        "datatype": "bank",
        "exists": true
    }]],
    ['!bank setDesc <code> [...description]', function(pl, args, data) {
        var bank = new Bank(args.code).init(data);
        var desc = args.description.join(' ');
        var hasAdminPerm = new Permission('bank.admin').init(data).permitsPlayer(pl);

        if (!bank.isAdmin(pl.getName()) && !hasAdminPerm) {
            tellPlayer(pl, "&cYou can't set the description of this bank");
            return false;
        }
        bank.data.description = desc;
        bank.save(data);

        tellPlayer(pl, "&aChanged the description to: &r" + desc);
    }, 'bank.setDesc', [{
        "argname": "code",
        "type": "datahandler",
        "datatype": "bank",
        "exists": true
    }]],
    ['!bank setDisplayName <code> [...displayName]', function(pl, args, data) {
        var bank = new Bank(args.code).init(data);
        var displayName = args.displayName.join(' ');
        var hasAdminPerm = new Permission('bank.admin').init(data).permitsPlayer(pl);

        if (!bank.isAdmin(pl.getName()) && !hasAdminPerm) {
            tellPlayer(pl, "&cYou can't set the displayName of this bank");
            return false;
        }
        bank.data.displayName = displayName;
        bank.save(data);

        tellPlayer(pl, "&aChanged the displayName to: &r" + displayName);
    }, 'bank.setDisplayName', [{
        "argname": "code",
        "type": "datahandler",
        "datatype": "bank",
        "exists": true
    }]],
    ['!bank freeze <code> <freezePlan>', function(pl, args, data) {
        var bank = new Bank(args.code).init(data);
        var hasAdminPerm = new Permission('bank.admin').init(data).permitsPlayer(pl);
        if (bank.data.isFrozen) {
            tellPlayer(pl, "&cThis bank is already frozen.");
            return false;
        }

        if (bank.getFreezeAmount() > bank.data.cap) {
            tellPlayer(pl, "&cThe earnings of freezing would exceed your capacity. Upgrade your bank or lower the amount of money in bank.");
        }

        if (!bank.isOwner(pl.getName()) && !hasAdminPerm) {
            tellPlayer(pl, "&cYou don't have permission to freeze this bank.");
            return false;
        }

        var freezePlan = bankFreezePlans[parseInt(args.freezePlan)];

        bank
            .set('interest', freezePlan[1])
            .freeze(freezePlan[0])
            .save(data);

        tellPlayer(pl, '&aFroze the bank for ' + getTimeString(freezePlan[0]));

    }, 'bank.freeze', [{
        "argname": "code",
        "type": "datahandler",
        "datatype": "bank",
        "exists": true
    }, {
        "argname": "freezePlan",
        "type": "number",
        "min": 0,
        "max": bankFreezePlans.length - 1
    }]],

    ['!bank collect <code>', function(pl, args, data) {
        var bank = new Bank(args.code).init(data);
        var hasAdminPerm = new Permission('bank.admin').init(data).permitsPlayer(pl);
        if (!bank.data.isFrozen) {
            tellPlayer(pl, "&cThis bank is not frozen.");
            return false;
        }

        if (!bank.isFrozenAndDone()) {
            tellPlayer(pl, "&cThis bank is still frozen.");
            return false;
        }

        if (!bank.isOwner(pl.getName()) && !hasAdminPerm) {
            tellPlayer(pl, "&cYou don't have permission to collect for this bank.");
            return false;
        }

        var profit = bank.getFreezeAmount() - bank.data.amount;

        bank
            .unfreeze()
            .set('interest', 0)
            .save(data);

        tellPlayer(pl, "&aCollected bank freeze profits. You made &r:money:&e" + getAmountCoin(profit) + " &aextra.");

    }, 'bank.collect', [{
        "argname": "code",
        "type": "datahandler",
        "datatype": "bank",
        "exists": true
    }]],
    ['!bank regencode <code>', function(pl, args, data) {
        var p = new Player(pl.getName()).init(data);
        var bank = new Bank(args.code).init(data);
        var hasAdminPerm = new Permission('bank.admin').init(data).permitsPlayer(pl);

        if (bank.data.isFrozen) {
            tellPlayer(pl, "&cThis bank is frozen.");
            return false;
        }


        if (!bank.isOwner(pl.getName()) && !hasAdminPerm) {
            tellPlayer(pl, "&cYou don't have permission to regenerate the code for this bank.");
            return false;
        }
        if (p.data.money < getCoinAmount('5K')) {
            tellPlayer(pl, '&cYou don\'t have &r:money:&e5K&c in your money pouch.');
            return false;
        }

        p.data.money -= getCoinAmount('5K');
        p.save(data);
        var newBank = new Bank(Bank.genBankCode(data));

        newBank.data = Object.assign(newBank.data, bank.data);

        newBank.save(data);
        bank.remove(data);

        tellPlayer(pl, "&aRegenerated bank code and took &r:money:&e5K&a from money pouch.");
    }, 'bank.regencode', [{
        "argname": "code",
        "type": "datahandler",
        "datatype": "bank",
        "exists": true
    }]]
]);
@endblock