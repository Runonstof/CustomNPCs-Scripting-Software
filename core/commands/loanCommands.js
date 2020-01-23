import "core/datahandlers/Player.js";

@block register_commands_event
registerXCommands([
    ['!loan take <amount>', function(pl, args, data) {
        var amount = getCoinAmount(args.amount);
        var loan = new Loan(pl.getName());
        loan.load(data);

        if (loan.exists(data)) {
            if (!loan.isPaid()) {
                tellPlayer(pl, "&cYou already have a loan that isn't paid!");
                return false;
            } else {
                loan.remove(data);
            }
        }

        loan = new Loan(pl.getName());

        loan.data.amount = amount;
        loan.save(data);

        var p = new Player(pl.getName()).init(data);
        p.data.money += amount;
        p.save(data);

        tellPlayer(pl, "&aLoaned &r:money:&e" + getAmountCoin(amount) + "&a! See &e!myLoan&a to see your payment plan!");
    }, 'loan.take', [{
        "argname": "amount",
        "type": "currency",
        "min": getCoinAmount('5K'),
        "max": getCoinAmount('1M')
    }]],
    ['!loan takefor <player> <amount> [interest] [timePerTerm]', function(pl, args, data) {
        var p = new Player(args.player);
        if (!p.exists(data)) {
            tellPlayer(pl, "&c" + args.player + " isn't known in this server, needs to be at least joined once.");
            return false;
        }
        var amount = getCoinAmount(args.amount);
        var loan = new Loan(args.player);
        loan.load(data);

        if (loan.exists(data)) {
            if (!loan.isPaid()) {
                tellPlayer(pl, "&c" + args.player + " already has an active loan, you don't want to give it for free &e[Spy]{run_command:!loan spy " + args.player + "}");
                return false;
            } else {
                loan.remove(data);
            }
        }

        loan = new Loan(args.player);

        loan.data.amount = amount;
        loan.data.payRate = parseFloat(args.interest || loan.data.payRate);
        loan.data.payInterval = getStringTime(args.timePerTerm || '1d');
        loan.save(data);

        var p = new Player(args.player).init(data);
        p.data.money += amount;
        p.save(data);

        tellPlayer(pl, "&aLoaned &r:money:&e" + getAmountCoin(amount) + "&a for " + args.player + "!");
    }, 'loan.takefor', [{
            "argname": "amount",
            "type": "currency",
            "min": getCoinAmount('100G'),
        },
        {
            "argname": "interest",
            "type": "number",
            "min": 0,
            "max": 100
        },
        {
            "argname": "timePerTerm",
            "type": "time",
            "min": getStringTime('1h'),
        }
    ]],
    ['!myLoan [...matches]', function(pl, args, data) {
        var loan = new Loan(pl.getName());
        var params = getArgParams(args.matches);
        if (!loan.exists(data)) {
            tellPlayer(pl, "&cYou don't have an open loan currently");
            return false;
        }

        loan.load(data);


        tellPlayer(pl, formatLoanInfo(loan, params, 'Info', '!myLoan'));
        // print(JSON.stringify([loan.getPaymentTerms(), loan.getPaybackAmount()]));
    }, 'myLoan'],
    ['!loan pay <amount>', function(pl, args, data) {
        var loan = new Loan(pl.getName());
        if (!loan.exists(data)) {
            tellPlayer(pl, "&cYou don't have an open loan currently.");
            return false;
        }
        loan.load(data);
        var amount = Math.min(getCoinAmount(args.amount), loan.getPaybackAmount() - loan.data.paid);
        var p = new Player(pl.getName()).init(data);
        if (p.data.money < amount) {
            tellPlayer(pl, "&cYou don't have enough money in your money pouch.");
            return false;
        }

        p.data.money -= amount;
        loan.data.paid += amount;

        if (loan.data.loanedFrom) {
            var loanedFrom = new Player(loan.data.loanedFrom).init(data);

            if (playerIsOnline(pl.world, loan.data.loanedFrom)) {
                tellPlayer(pl.world.getPlayer(loanedFrom.name), "&a" + pl.getName() + " payed &r:money:&e" + getAmountCoin(amount) + "&a towards your loan.");
            }

            loanedFrom.data.money += amount;
            loanedFrom.save(data);
        }



        p.save(data);

        if (loan.data.paid >= loan.getPaybackAmount()) {
            loan.remove(data);
            tellPlayer(pl, "&aYou paid &r:money:&e" + getAmountCoin(amount) + " &aand finished off your loan!");
            tellPlayer(pl, "&aLoan removed.");
        } else {
            loan.save(data);
            tellPlayer(pl, "&aYou paid &r:money:&e" + getAmountCoin(amount) + " &ato your loan.");
        }

        return false;

    }, 'loan.pay', [{
        'argname': 'amount',
        'type': 'currency',
        'min': 100
    }]],
    ['!loan spy <player> [...matches]', function(pl, args, data) {
        var loan = new Loan(args.player);
        var params = getArgParams(args.matches);
        if (!loan.exists(data)) {
            tellPlayer(pl, "&cThis player doesn't have an open loan currently");
            return false;
        }

        loan.load(data);

        tellPlayer(pl, formatLoanInfo(loan, params, 'Spy ' + loan.data.player, '!loan spy ' + args.player));
    }, 'loan.spy'],
    ['!loan help <amount> [interest] [timePerTerm] [...matches]', function(pl, args, data) {
        var loan = new Loan(args.player);
        var amount = getCoinAmount(args.amount);
        var interest = parseInt(args.interest);
        var params = getArgParams((args.matches.join(" ") + ' ' + args.interest + ' ' + args.timePerTerm).split(" "));

        loan.data.amount = amount;
        loan.data.payRate = isNaN(interest) ? loan.data.payRate : interest;
        loan.data.payInterval = getStringTime(args.timePerTerm || getTimeString(loan.data.payInterval));

        tellPlayer(pl, formatLoanInfo(loan, params, 'Help', '!loan help ' + getAmountCoin(loan.data.amount) + ' ' + loan.data.payRate + ' ' + getTimeString(loan.data.payInterval)));
    }, 'loan.help', [{
            "argname": "amount",
            "type": "currency",
            "min": getCoinAmount('5K'),
            "max": getCoinAmount('1M')
        },
        {
            "argname": "interest",
            "type": "number",
            "min": 1,
            "max": 100
        },
        {
            "argname": "timePerTerm",
            "type": "time",
            "min": getStringTime('1h'),
        }
    ]],
    ['!loan unpaid [...matches]', function(pl, args, data) {
        var unpaid = [];
        var loans = new Loan().getAllDataEntries(data);
        var params = getArgParams(args.matches);

        for (var i in loans as loan) {
            if (!loan.isLate()) {
                continue;
            }

            unpaid.push(loan);
        }

        var output = getTitleBar('Unpaid Loans') + '\n';

        output += genDataPageList(
            unpaid,
            args.matches,
            parseInt(params.show || 10),
            parseInt(params.page || 1),
            "!loan unpaid {MATCHES} -show:{SHOW} -page:{PAGE} -sort:{SORT}",
            function(loan) {
                return "&e - &c&l" + loan.data.player + "&r &e[Spy]{run_command:!loan spy " + loan.data.player + "|show_text:$cClick to see loan of this player}&r\n";
            },
            function(a, b) {
                var al = a.player.toLowerCase();
                var bl = b.player.toLowerCase();

                if (al < bl) return -1;
                if (al > bl) return 1;

                return 0;
            },
            function(loan, list) {
                return arrayOccurs(loan.data.player, list, false, false) > 0
            },
            (params.sort || "").toLowerCase() == "desc"
        );

        tellPlayer(pl, output);
    }, 'loan.unpaid'],
    ['!loan change interest <player> <interest>', function(pl, args, data) {
        var loan = new Loan(args.player);
        var params = getArgParams(args.matches);
        if (!loan.exists(data)) {
            tellPlayer(pl, "&cThis player doesn't have an open loan currently");
            return false;
        }
        loan.load(data);

        loan.data.payRate = parseFloat(args.interest);
        loan.save(data);

        tellPlayer(pl, "&aChanged the interest to &e" + loan.data.payRate + "%&a of " + loan.data.player + "'s loan.");
        return true;

    }, 'loan.change.interest'],
    ['!loan change timePerTerm <player> <time>', function(pl, args, data) {
        var loan = new Loan(args.player);
        var params = getArgParams(args.matches);
        if (!loan.exists(data)) {
            tellPlayer(pl, "&cThis player doesn't have an open loan currently");
            return false;
        }
        loan.load(data);

        loan.data.payInterval = getStringTime(args.time);
        loan.save(data);

        tellPlayer(pl, "&aChanged the time per payment to &e" + getTimeString(loan.data.payInterval) + "&a of " + loan.data.player + "'s loan.");
        return true;

    }, 'loan.change.timePerTerm', [{
        "argname": "time",
        "type": "time",
        "min": getStringTime('1h')
    }]],
    ['!loan list [...matches]', function(pl, args, data) {
        var loans = new Loan().getAllDataEntries(data);
        var params = getArgParams(args.matches);

        var output = getTitleBar('Loan List') + '\n';

        output += genDataPageList(
            loans,
            args.matches,
            parseInt(params.show || 10),
            parseInt(params.page || 1),
            "!loan list {MATCHES} -show:{SHOW} -page:{PAGE} -sort:{SORT}",
            function(loan) {
                return "&e - &" + (loan.isLate() ? 'c' : 'a') + "&l" + loan.data.player + "&r :money:&e" + getAmountCoin(loan.data.amount) + "&r &6+ &e" + loan.data.payRate + "% &6[Spy]{run_command:!loan spy " + loan.data.player + "|show_text:$cClick to see loan of this player}&r\n";
            },
            function(a, b) {
                var al = (a.player || "").toLowerCase();
                var bl = (b.player || "").toLowerCase();

                if (al < bl) return -1;
                if (al > bl) return 1;

                return 0;
            },
            function(loan, list) {
                return arrayOccurs(loan.data.player, list, false, false) > 0
            },
            (params.sort || "").toLowerCase() == "desc"
        );

        tellPlayer(pl, output);
    }, 'loan.list'],


]);
@endblock

function formatLoanInfo(loan, params = {}, title = 'Info', cmdPrefix) {
    var now = new Date().getTime();

    var terms = loan.getPaymentTerms();
    var payBefore = loan.data.took + loan.getPayTime();
    var payPercentage = roundDec(100 / loan.getPaybackAmount() * loan.data.paid).toString();
    var output = getTitleBar('Loan ' + title, false) + '\n';

    output += "&6[[ &e[My Money]{run_command:!myMoney|show_text:$eClick to view your money.}&6 || &e[My Banks]{run_command:!myBanks|show_text:$eClick here to view your bank accounts.}&6 || &e[My Loan]{run_command:!myLoan|show_text:$eClick here to view your current active loan.}&6 || &e[My Emotes]{run_command:!myEmotes|show_text:$eClick here to view your emotes.}&6 ]]\n ";

    if (!params.payments) {

        output +=
            '&6&lLoaned from: &e' + (loan.data.loanedFrom || CONFIG_SERVER.TITLE) + '\n' +
            '&6&lLoan type: &ePayment Plan &5[Info]{*|show_text:$6Every $e' + getTimeString(loan.data.payInterval) + ' $6you need to pay $r:money:$e' + getAmountCoin(loan.getTermPrice()) + '. $6See the $e' + terms.length + ' $6payments listed below.}&r\n' +
            '&6&lLoan Info: &r:money:&e' + getAmountCoin(loan.data.amount) + '&6 + &e' + loan.data.payRate + '% &6= &r:money:&e' + getAmountCoin(loan.getPaybackAmount()) + '\n' +
            '&6&lPaid: &r:money:&e' + getAmountCoin(loan.data.paid) + ' ' + progressBar(loan.data.paid, loan.getPaybackAmount(), 30) + ' &r:money:&e' + getAmountCoin(loan.getPaybackAmount()) + ' &6| &b' + payPercentage + '%\n' +
            '&6&lTime left: ' + (now > payBefore ? '&c' + getTimeString(now - payBefore, ['ms']) + ' too late.' : '&e' + getTimeString(payBefore - now, ['ms']) + ' left.') + '\n' +
            '&6&lPayments: &a' + terms.length + ' &b[Show my payments]{run_command:' + cmdPrefix + ' -payments|show_text:$bClick to show your payments ' + cmdPrefix + ' -payments}&r';
    } else {
        output += '&e&l[<< Back to loan info]{run_command:' + cmdPrefix + '|show_text:$bClick to go back to loan info ' + cmdPrefix + '}&r\n' +
            genDataPageList(
                terms, [],
                parseInt(params.show || 10),
                parseInt(params.page || 1),
                cmdPrefix + " {MATCHES} -payments -show:{SHOW} -page:{PAGE} -sort:{SORT}",
                function(term) {
                    var termNum = (parseInt(term.index) + 1);
                    var termString = '';
                    var paymentColor = term.isPaid ? '&a' : '&b';

                    //gen hover info
                    var termInfo = '{*|show_text:$r:money:$e' + getAmountCoin(term.termPrice) + '$b';
                    var prevPayTreshold = term.payTreshold - term.termPrice;
                    if (now <= term.payBefore) {
                        termInfo += ' pay before $b$o' + getTimeString(term.payBefore - now, ['ms']);

                    } else if (!term.isPaid) {
                        termInfo += ' $c ' + getTimeString(now - term.payBefore, ['ms']) + ' too late$r';
                        paymentColor = '&c';
                    }
                    var termCurrentPay = Math.max(Math.min(loan.data.paid - prevPayTreshold, term.termPrice), 0);

                    termInfo += '\n$r:money:$e' + getAmountCoin(termCurrentPay) + '$r' + progressBar(termCurrentPay, term.termPrice, 20).replace(/&/g, '$') + '$r:money:$e' + getAmountCoin(term.termPrice) + '$r\n';

                    termInfo += '}';


                    //gen text info
                    termString += paymentColor + 'Payment ' + paymentColor + '&l#' + termNum + ':&r ' + progressBar(termCurrentPay, term.termPrice, 20) + ' &a' + roundDec(100 / term.termPrice * termCurrentPay) + '%&r ';


                    termString += '&d[Info]' + termInfo + '&r :money:&e' + getAmountCoin(term.termPrice) + '\n';


                    return termString;

                },
                function(a, b) {
                    return a.index - b.index;
                },
                function(term, list) {
                    return arrayOccurs(term.index, list, false, false) > 0
                },
                (params.sort || "").toLowerCase() == "desc"
            );
    }

    return output;
}