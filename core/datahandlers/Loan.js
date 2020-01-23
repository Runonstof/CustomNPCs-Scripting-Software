import "core/utils/Uniqid.js";
import "core/DataHandler.js";
import "core/JavaScript/Date.js";
import "core/datahandlers/Player.js";

registerDataHandler("loan", Loan);

function Loan(player) {
    DataHandler.apply(this, ['loan', player]);
    this.addData({
        loanedFrom: null,
        player: player,
        took: new Date().getTime(),
        amount: 1,
        paid: 0,
        payRate: 12.5,
        payInterval: getStringTime('3d')
    });

    this.onRemove(function(loan, data) {
        var p = new Player(loan.data.player).init(data);
        var overflow = loan.data.paid - loan.getPaybackAmount();

        if (overflow > 0) {
            p.data.money += overflow;
            p.save(data);
        }
    });

    this.getPaybackAmount = function() {
        return Math.floor(this.data.amount + (this.data.amount / 100 * this.data.payRate));
    };

    this.getPayTime = function() {
        var maxAmount = getCoinAmount('1M');
        var maxTime = getStringTime('4mon2w');

        return Math.min(getStringTime('10d') + (maxTime / maxAmount * this.data.amount), maxTime);
        // return Math.min(getStringTime('9d') + (Math.floor(Math.pow(1.4, (this.data.amount / maxAmount))) * this.data.payInterval), maxTime);
    };

    this.getTermPrice = function() {
        return Math.round(this.getPaybackAmount() / Math.ceil(this.getPayTime() / this.data.payInterval));
    };
    this.getPaymentTerms = function() {
        var terms = [];
        var amount = this.getPaybackAmount();
        var mustPayBefore = new Date().getTime() + this.getPaybackAmount();
        var termCount = Math.ceil(this.getPayTime() / this.data.payInterval);
        var termPrice = Math.round(amount / Math.ceil(this.getPayTime() / this.data.payInterval));
        for (var i = 0; i < termCount; i++) {
            var currentTermPrice = Math.min((i + 1) * termPrice, this.getPaybackAmount());
            var isPaid = this.data.paid >= currentTermPrice;

            terms.push({
                index: i,
                termPrice: termPrice,
                payTreshold: currentTermPrice,
                isPaid: isPaid,
                payBefore: this.data.took + (this.data.payInterval * (i + 1)),
            });
        }

        return terms;
    };

    this.isPaid = function() {
        return this.data.paid >= this.getPaybackAmount();
    };

    this.isLate = function() {
        var now = new Date().getTime();
        var terms = this.getPaymentTerms();
        var late = false;

        for (var i in terms as term) {
            if (now > term.payBefore && !term.isPaid) {
                late = true;
                break;
            }
        }

        return late;
    };
}