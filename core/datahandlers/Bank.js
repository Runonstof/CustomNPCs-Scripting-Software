registerDataHandler("bank", Bank);

function Bank(code) {
    DataHandler.apply(this, ['bank', code]);

    this.addData({
        displayName: 'New Bank Account',
        description: '',
        owner: null,
        trustedAdmins: [],
        trustedGet: [],
        trustedPut: [],
        autopayPlayers: [],
        autopayAmount: 0,
        autopayInterval: getStringTime('1d'),
        amount: 0,
        cap: getCoinAmount('25K'),
        trustedCap: 2,
        increaseCost: getCoinAmount('10K'),
        increaseAmount: getCoinAmount('10K'),
        trustedIncreaseAmount: 1,
        frozeAt: -1,
        isFrozen: false,
        interest: 0,
        freezeTime: 0,
        linkedTraders: []
    });

    this.onRemove(function(bank, data) {
        if (bank.data.owner) {
            var p = new Player(bank.data.owner).init(data);
            p.data.money += bank.data.amount;
            p.save(data);
        }
    });

    this.upgrade = function(times = 1) {
        for (var i = 1; i <= times; i++) {
            this.data.cap += this.data.increaseAmount;
            this.data.trustedCap += this.data.trustedIncreaseAmount;
        }

        return this;
    };

    this.validateLinkedTraders = function(world) {
        var newTraders = [];
        var changed = false;
        for (var i in this.data.linkedTraders as linkedTrader) {
            var trader = world.getEntity(linkedTrader);
            if (!trader) {
                changed = true;
                continue;
            }

            if (trader.getName() === 'customnpcs:customnpc') {
                // if()
            }
            newTraders.push(trader);
        }

    };

    this.getFreezeAmount = function(interest = null) {
        interest = interest || this.data.interest;

        return this.data.amount + Math.floor(this.data.amount / 100 * interest);
    };

    this.freeze = function(time) {
        this.data.frozeAt = new Date().getTime();
        this.data.isFrozen = true;
        this.data.freezeTime = time;

        return this;
    };

    this.getFreezeStatus = function() {
        return this.data.isFrozen ? (this.isFrozenAndDone() ? 'done' : 'frozen') : 'none'
    };

    this.isFrozenAndDone = function() {
        return this.data.isFrozen && new Date().getTime() >= this.data.frozeAt + this.data.freezeTime;
    }

    this.unfreeze = function(time) {
        this.data.amount = this.getFreezeAmount(this.data.interest);
        this.data.frozeAt = -1;
        this.data.isFrozen = false;
        this.data.freezeTime = 0;

        return this;
    };


    this.canDeposit = function(playerName) {
        return (this.isAdmin(playerName) || (this.data.trustedPut.indexOf(playerName) > -1));
    };
    this.canWithdraw = function(playerName) {
        return (this.isAdmin(playerName) || (this.data.trustedGet.indexOf(playerName) > -1));
    };

    this.isAdmin = function(playerName) {
        return this.isOwner(playerName) || (this.data.trustedAdmins.indexOf(playerName) > -1);
    };

    this.isOwner = function(playerName) {
        return (playerName == this.data.owner);
    }

    this.canSee = function(playerName) {
        return this.canWithdraw(playerName) || this.canDeposit(playerName);
    }
}

Bank.__proto__.genBankCode = function(data) {
        var code;
        var allCodes = new Bank().getAllDataIds(data);
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        do {
            code = '';
            for (var i = 0; i < 9; i++) {
                code += chars[Math.floor(Math.random() * chars.length)];
            }
        } while (allCodes.indexOf(code) > -1);

        return code;
    }
    //