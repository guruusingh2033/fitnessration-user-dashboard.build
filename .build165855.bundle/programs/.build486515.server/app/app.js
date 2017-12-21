var require = meteorInstall({"imports":{"common":{"scripts":{"DateSet.ts":["./DateSet.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/common/scripts/DateSet.ts                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = require("./DateSet.js");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"DateSet.js":["lodash","./date",function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/common/scripts/DateSet.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = require('lodash');                                                                                             // 1
var date_1 = require('./date');                                                                                        // 2
var DateSet = (function () {                                                                                           // 4
    function DateSet() {                                                                                               //
        this.rules = {};                                                                                               //
    }                                                                                                                  //
    DateSet.prototype.clearCache = function () {                                                                       //
    };                                                                                                                 //
    DateSet.prototype.addRule = function (type, rule, priority) {                                                      //
        if (priority === void 0) { priority = 0; }                                                                     //
        if (!this.rules[priority])                                                                                     //
            this.rules[priority] = [];                                                                                 //
        this.rules[priority].push([type, rule]);                                                                       //
        this.clearCache();                                                                                             //
    };                                                                                                                 //
    DateSet.testRule = function (type, rule, date) {                                                                   //
        var result = rule(date);                                                                                       //
        if (type == 'include') {                                                                                       //
            if (result)                                                                                                //
                return true;                                                                                           //
            else                                                                                                       //
                return 0;                                                                                              //
        }                                                                                                              //
        else if (type == 'exclude') {                                                                                  //
            if (result)                                                                                                //
                return false;                                                                                          //
            else                                                                                                       //
                return 1;                                                                                              //
        }                                                                                                              //
    };                                                                                                                 //
    DateSet.prototype.resolveRules = function () {                                                                     //
        var priorities = _.map(_.keys(this.rules), function (key) { return parseInt(key); }).sort(); //.reverse();     //
        var rules = [];                                                                                                //
        for (var _i = 0, priorities_1 = priorities; _i < priorities_1.length; _i++) {                                  //
            var priority = priorities_1[_i];                                                                           //
            rules = rules.concat(this.rules[priority]);                                                                //
        }                                                                                                              //
        return rules;                                                                                                  //
    };                                                                                                                 //
    DateSet.prototype.test = function (date) {                                                                         //
        var currentResult;                                                                                             //
        var definiteDate = date_1.convertToDate(date);                                                                 //
        var rules = this.resolveRules();                                                                               //
        for (var i = rules.length - 1; i >= 0; --i) {                                                                  //
            currentResult = DateSet.testRule(rules[i][0], rules[i][1], definiteDate);                                  //
            if (typeof currentResult == 'boolean')                                                                     //
                return currentResult;                                                                                  //
        }                                                                                                              //
        return currentResult;                                                                                          //
    };                                                                                                                 //
    DateSet.prototype.earliestDate = function (maxDaysInFuture) {                                                      //
        if (maxDaysInFuture === void 0) { maxDaysInFuture = 30; }                                                      //
        var date = date_1.today();                                                                                     //
        var daysAhead = 0;                                                                                             //
        while (!this.test(date) && daysAhead < maxDaysInFuture) {                                                      //
            date = date_1.addDays(date, 1);                                                                            //
            ++daysAhead;                                                                                               //
        }                                                                                                              //
        if (this.test(date)) {                                                                                         //
            return date;                                                                                               //
        }                                                                                                              //
        else {                                                                                                         //
            return null;                                                                                               //
        }                                                                                                              //
    };                                                                                                                 //
    DateSet.rule = {                                                                                                   //
        all: function () {                                                                                             //
            return true;                                                                                               //
        },                                                                                                             //
        weekday: function (weekday) {                                                                                  //
            return function (testDate) {                                                                               //
                return testDate.getDay() == weekday;                                                                   //
            };                                                                                                         //
        },                                                                                                             //
        range: function (beginDate, endDate) {                                                                         //
            beginDate = date_1.convertToDate(beginDate);                                                               //
            endDate = date_1.convertToDate(endDate);                                                                   //
            return function (testDate) {                                                                               //
                return testDate >= beginDate && testDate <= endDate;                                                   //
            };                                                                                                         //
        },                                                                                                             //
        invertedRange: function (beginDate, endDate) {                                                                 //
            beginDate = date_1.convertToDate(beginDate);                                                               //
            endDate = date_1.convertToDate(endDate);                                                                   //
            return function (testDate) {                                                                               //
                return testDate < beginDate || testDate > endDate;                                                     //
            };                                                                                                         //
        },                                                                                                             //
        date: function (date) {                                                                                        //
            date = date_1.convertToDate(date);                                                                         //
            return function (testDate) {                                                                               //
                return date.valueOf() == testDate.valueOf();                                                           //
            };                                                                                                         //
        },                                                                                                             //
        dayOfYear: function (dayOfYear) {                                                                              //
            var parts = dayOfYear.split('-');                                                                          //
            var month = parseInt(parts[0]);                                                                            //
            var day = parseInt(parts[1]);                                                                              //
            return function (testDate) {                                                                               //
                return testDate.getDate() == day && (testDate.getMonth() + 1) == month;                                //
            };                                                                                                         //
        },                                                                                                             //
        after: function (date) {                                                                                       //
            date = date_1.convertToDate(date);                                                                         //
            return function (testDate) {                                                                               //
                return testDate > date;                                                                                //
            };                                                                                                         //
        },                                                                                                             //
        before: function (date) {                                                                                      //
            date = date_1.convertToDate(date);                                                                         //
            return function (testDate) {                                                                               //
                return testDate < date;                                                                                //
            };                                                                                                         //
        },                                                                                                             //
        dateSet: function (dateSet) {                                                                                  //
            return function (testDate) {                                                                               //
                return dateSet.test(testDate) == true;                                                                 //
            };                                                                                                         //
        }                                                                                                              //
    };                                                                                                                 //
    return DateSet;                                                                                                    //
}());                                                                                                                  // 121
exports.DateSet = DateSet;                                                                                             // 4
//# sourceMappingURL=DateSet.js.map                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"date.ts":["./date.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/common/scripts/date.ts                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = require("./date.js");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"date.js":["lodash",function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/common/scripts/date.js                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = require('lodash');                                                                                             // 1
function today() {                                                                                                     // 3
    var now = new Date();                                                                                              //
    return createDay(now.getFullYear(), now.getMonth(), now.getDate());                                                //
}                                                                                                                      // 6
exports.today = today;                                                                                                 // 3
function createDay(year, month, day) {                                                                                 // 8
    return new Date(year, month, day, 0, 0, 0);                                                                        //
}                                                                                                                      // 10
exports.createDay = createDay;                                                                                         // 8
function addDays(date, days) {                                                                                         // 11
    return createDay(date.getFullYear(), date.getMonth(), date.getDate() + days);                                      //
}                                                                                                                      // 13
exports.addDays = addDays;                                                                                             // 11
function firstDayOfMonth(month) {                                                                                      // 14
    return createDay(month.getFullYear(), month.getMonth(), 1);                                                        //
}                                                                                                                      // 16
exports.firstDayOfMonth = firstDayOfMonth;                                                                             // 14
function calendarDaysForMonth(month) {                                                                                 // 17
    var days = [];                                                                                                     //
    var firstDay = firstDayOfMonth(month);                                                                             //
    for (var i = 0; i < 7 - (7 - firstDay.getDay()); ++i) {                                                            //
        days.unshift(addDays(firstDay, -(i + 1)));                                                                     //
    }                                                                                                                  //
    var day = firstDay;                                                                                                //
    while (day.getMonth() == month.getMonth() || day.getMonth() > month.getMonth() && days.length % 7) {               //
        days.push(day);                                                                                                //
        day = addDays(day, 1);                                                                                         //
    }                                                                                                                  //
    return days;                                                                                                       //
}                                                                                                                      // 29
exports.calendarDaysForMonth = calendarDaysForMonth;                                                                   // 17
function convertToDate(date) {                                                                                         // 31
    if (typeof date == 'string') {                                                                                     //
        return new Date(Date.parse(date + ' 00:00'));                                                                  //
    }                                                                                                                  //
    else {                                                                                                             //
        return date;                                                                                                   //
    }                                                                                                                  //
}                                                                                                                      // 38
exports.convertToDate = convertToDate;                                                                                 // 31
function formatDate(date) {                                                                                            // 40
    return date.getFullYear() + '-' + _.padStart(date.getMonth() + 1, 2, '0') + '-' + _.padStart(date.getDate(), 2, '0');
}                                                                                                                      // 42
exports.formatDate = formatDate;                                                                                       // 40
function weeksForMonth(month) {                                                                                        // 45
    var days = calendarDaysForMonth(month);                                                                            //
    var weeks = [];                                                                                                    //
    for (var i = 0; i < days.length / 7; ++i) {                                                                        //
        weeks.push(days.slice(i * 7, i * 7 + 7));                                                                      //
    }                                                                                                                  //
    return weeks;                                                                                                      //
}                                                                                                                      // 52
exports.weeksForMonth = weeksForMonth;                                                                                 // 45
//# sourceMappingURL=date.js.map                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"order.ts":["./order.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/common/scripts/order.ts                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = require("./order.js");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"order.js":["lodash","./date",function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/common/scripts/order.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = require('lodash');                                                                                             // 1
var date_1 = require('./date');                                                                                        // 2
function round(amount) {                                                                                               // 4
    return parseFloat(amount.toFixed(2));                                                                              //
}                                                                                                                      // 6
function orderFlagged(order, api) {                                                                                    // 8
    for (var _i = 0, _a = order.bundles; _i < _a.length; _i++) {                                                       //
        var bundle = _a[_i];                                                                                           //
        if (api.compareObjectId(bundle.mealPlan._id, api.findOne('mealPlans', { name: 'Heavy Duty' })._id) && api.compareObjectId(bundle.portion._id, api.findOne('portions', { name: 'For Her' })._id)) {
            return true;                                                                                               //
        }                                                                                                              //
        for (var _b = 0, _c = bundle.mealSelections; _b < _c.length; _b++) {                                           //
            var mealSelection = _c[_b];                                                                                //
            if (mealSelection.quantity >= 7) {                                                                         //
                return true;                                                                                           //
            }                                                                                                          //
            if (api.mealStock(mealSelection.meal) < mealSelection.quantity) {                                          //
                return true;                                                                                           //
            }                                                                                                          //
        }                                                                                                              //
    }                                                                                                                  //
    return false;                                                                                                      //
}                                                                                                                      // 23
exports.orderFlagged = orderFlagged;                                                                                   // 8
function orderFulfillmentDays(order, api) {                                                                            // 25
    if (orderFlagged(order, api)) {                                                                                    //
        return 3;                                                                                                      //
    }                                                                                                                  //
    else {                                                                                                             //
        return 0;                                                                                                      //
    }                                                                                                                  //
}                                                                                                                      // 32
exports.orderFulfillmentDays = orderFulfillmentDays;                                                                   // 25
function excludeAvailabilityDate(opts) {                                                                               // 34
    return function (date) {                                                                                           //
        if (opts.excludedFulfillmentDates.test(date)) {                                                                //
            return true;                                                                                               //
        }                                                                                                              //
        var fulfillmentDays = opts.fulfillmentDays();                                                                  //
        var day = date_1.today();                                                                                      //
        if (new Date().getHours() >= 9) {                                                                              //
            day = date_1.addDays(day, 1);                                                                              //
        }                                                                                                              //
        while (fulfillmentDays) {                                                                                      //
            day = date_1.addDays(day, 1);                                                                              //
            if (!opts.excludedFulfillmentDates.test(day)) {                                                            //
                --fulfillmentDays;                                                                                     //
            }                                                                                                          //
        }                                                                                                              //
        return date < day;                                                                                             //
    };                                                                                                                 //
}                                                                                                                      // 57
exports.excludeAvailabilityDate = excludeAvailabilityDate;                                                             // 34
function orderTotalMeals(order) {                                                                                      // 59
    return _.reduce(order.bundles, function (totalMeals, bundle) {                                                     //
        return totalMeals + _.reduce(bundle.mealSelections, function (t, mealSelection) {                              //
            return t + mealSelection.quantity;                                                                         //
        }, 0);                                                                                                         //
    }, 0);                                                                                                             //
}                                                                                                                      // 65
exports.orderTotalMeals = orderTotalMeals;                                                                             // 59
function bundlePrice(bundle) {                                                                                         // 68
    if (bundle.promotion) {                                                                                            //
        var promotionPrice;                                                                                            //
        if (bundle.promotion.type == 'discount') {                                                                     //
            promotionPrice = bundle.type.price * (100 - bundle.promotion.discount) / 100;                              //
        }                                                                                                              //
        else if (bundle.promotion.type == 'override') {                                                                //
            promotionPrice = bundle.promotion.overridePrice;                                                           //
        }                                                                                                              //
        return round(promotionPrice);                                                                                  //
    }                                                                                                                  //
    else {                                                                                                             //
        return bundle.type.price;                                                                                      //
    }                                                                                                                  //
}                                                                                                                      // 82
exports.bundlePrice = bundlePrice;                                                                                     // 68
function bundleTotal(bundle) {                                                                                         // 84
    var total = bundle.price;                                                                                          //
    var totalPremiumMeals = 0;                                                                                         //
    for (var _i = 0, _a = bundle.mealSelections; _i < _a.length; _i++) {                                               //
        var mealSelection = _a[_i];                                                                                    //
        if (mealSelection.meal.grade == 'premium') {                                                                   //
            for (var i = 0; i < mealSelection.quantity; ++i) {                                                         //
                totalPremiumMeals++;                                                                                   //
                if (totalPremiumMeals > (bundle.promotion && typeof bundle.promotion.premiumAllowance == 'number' ? bundle.promotion.premiumAllowance : bundle.type.premiumMeals)) {
                    total += mealSelection.meal.price;                                                                 //
                }                                                                                                      //
            }                                                                                                          //
        }                                                                                                              //
    }                                                                                                                  //
    for (var _b = 0, _c = bundle.allergies; _b < _c.length; _b++) {                                                    //
        var allergy = _c[_b];                                                                                          //
        if (allergy.action == 'substitute') {                                                                          //
            for (var _d = 0, _e = bundle.mealSelections; _d < _e.length; _d++) {                                       //
                var mealSelection = _e[_d];                                                                            //
                if (_.some(mealSelection.meal.allergens, { _id: allergy._id })) {                                      //
                    total += allergy.surcharge * mealSelection.quantity;                                               //
                }                                                                                                      //
            }                                                                                                          //
        }                                                                                                              //
    }                                                                                                                  //
    return round(total);                                                                                               //
}                                                                                                                      // 107
exports.bundleTotal = bundleTotal;                                                                                     // 84
function orderSubtotal(order) {                                                                                        // 109
    var subtotal = 0;                                                                                                  //
    var allergyRemovals = {};                                                                                          //
    for (var _i = 0, _a = order.bundles; _i < _a.length; _i++) {                                                       //
        var bundle = _a[_i];                                                                                           //
        subtotal += bundle.total;                                                                                      //
        for (var _b = 0, _c = bundle.allergies; _b < _c.length; _b++) {                                                //
            var allergy = _c[_b];                                                                                      //
            if (allergy.action == 'remove') {                                                                          //
                for (var _d = 0, _e = bundle.mealSelections; _d < _e.length; _d++) {                                   //
                    var mealSelection = _e[_d];                                                                        //
                    if (_.some(mealSelection.meal.allergens, { _id: allergy._id })) {                                  //
                        allergyRemovals[allergy._id] = allergy;                                                        //
                    }                                                                                                  //
                }                                                                                                      //
            }                                                                                                          //
        }                                                                                                              //
    }                                                                                                                  //
    for (var _f = 0, _g = order.addOnSelections; _f < _g.length; _f++) {                                               //
        var addOnSelection = _g[_f];                                                                                   //
        subtotal += addOnSelection.addOn.price * addOnSelection.quantity;                                              //
    }                                                                                                                  //
    for (var id in allergyRemovals) {                                                                                  //
        subtotal += allergyRemovals[id].surcharge;                                                                     //
    }                                                                                                                  //
    return round(subtotal);                                                                                            //
}                                                                                                                      // 133
exports.orderSubtotal = orderSubtotal;                                                                                 // 109
function orderTotal(order) {                                                                                           // 135
    var total = order.subtotal + order.deliveryFee;                                                                    //
    return round(total);                                                                                               //
}                                                                                                                      // 138
exports.orderTotal = orderTotal;                                                                                       // 135
function orderLocationSurcharge(order, api) {                                                                          // 140
    for (var _i = 0, _a = api.locationSurcharges; _i < _a.length; _i++) {                                              //
        var locationSurcharge = _a[_i];                                                                                //
        if (_.startsWith(order.deliveryOptions.postalCode, locationSurcharge.postalPrefix)) {                          //
            return locationSurcharge.surcharge;                                                                        //
        }                                                                                                              //
    }                                                                                                                  //
    return 0;                                                                                                          //
}                                                                                                                      // 147
exports.orderLocationSurcharge = orderLocationSurcharge;                                                               // 140
function orderDeliveryFee(order, api) {                                                                                // 149
    if (order.deliveryOptions.selfCollection) {                                                                        //
        return 0;                                                                                                      //
    }                                                                                                                  //
    var deliveryFee;                                                                                                   //
    for (var _i = 0, _a = order.bundles; _i < _a.length; _i++) {                                                       //
        var bundle = _a[_i];                                                                                           //
        if (!bundle.type.deliveryFee || (bundle.promotion && !bundle.promotion.deliveryFee)) {                         //
            deliveryFee = 0;                                                                                           //
            break;                                                                                                     //
        }                                                                                                              //
    }                                                                                                                  //
    if (typeof deliveryFee == 'undefined') {                                                                           //
        if (api.totalMeals(order) >= api.fulfillmentSettings.freeDeliveryThreshold) {                                  //
            deliveryFee = 0;                                                                                           //
        }                                                                                                              //
        else {                                                                                                         //
            deliveryFee = api.fulfillmentSettings.deliveryFee;                                                         //
        }                                                                                                              //
    }                                                                                                                  //
    deliveryFee += 'locationSurcharge' in order ? order.locationSurcharge : orderLocationSurcharge(order, api);        //
    // for (var locationSurcharge of api.locationSurcharges) {                                                         //
    //   if (_.startsWith(order.deliveryOptions.postalCode, locationSurcharge.postalPrefix)) {                         //
    //     deliveryFee += locationSurcharge.surcharge;                                                                 //
    //     break;                                                                                                      //
    //   }                                                                                                             //
    // }                                                                                                               //
    return deliveryFee;                                                                                                //
}                                                                                                                      // 179
exports.orderDeliveryFee = orderDeliveryFee;                                                                           // 149
//# sourceMappingURL=order.js.map                                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},"api":{"addOns.js":["meteor/mongo",function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/addOns.js                                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var mongo_1 = require('meteor/mongo');                                                                                 // 1
exports.AddOns = new mongo_1.Mongo.Collection('addOns', { idGeneration: 'MONGO' });                                    // 2
//# sourceMappingURL=addOns.js.map                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"blocks.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/blocks.js                                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Object.defineProperty(exports, '__esModule', {                                                                         //
  value: true                                                                                                          //
});                                                                                                                    //
var Blocks = new Mongo.Collection('blocks', { idGeneration: 'MONGO' });                                                // 1
exports.Blocks = Blocks;                                                                                               //
if (Meteor.isServer) {                                                                                                 // 2
  Meteor.publish('blocks', function () {                                                                               // 3
    return Blocks.find();                                                                                              // 4
  });                                                                                                                  //
}                                                                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"bundleTypes.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/bundleTypes.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Object.defineProperty(exports, '__esModule', {                                                                         //
  value: true                                                                                                          //
});                                                                                                                    //
var BundleTypes = new Mongo.Collection('bundleTypes', { idGeneration: 'MONGO' });                                      // 1
exports.BundleTypes = BundleTypes;                                                                                     //
if (Meteor.isServer) {                                                                                                 // 2
  Meteor.publish('bundleTypes', function () {                                                                          // 3
    return BundleTypes.find();                                                                                         // 4
  });                                                                                                                  //
}                                                                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fulfillmentSettings.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/fulfillmentSettings.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Object.defineProperty(exports, '__esModule', {                                                                         //
  value: true                                                                                                          //
});                                                                                                                    //
var FulfillmentSettings = new Mongo.Collection('fulfillmentSettings', { idGeneration: 'MONGO' });                      // 1
exports.FulfillmentSettings = FulfillmentSettings;                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ingredients.js":["meteor/mongo","meteor/meteor",function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/ingredients.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var mongo_1 = require('meteor/mongo');                                                                                 // 1
var meteor_1 = require('meteor/meteor');                                                                               // 2
exports.Ingredients = new mongo_1.Mongo.Collection('ingredients', { idGeneration: 'MONGO' });                          // 3
if (meteor_1.Meteor.isServer) {                                                                                        // 4
    meteor_1.Meteor.publish('ingredients', function () {                                                               //
        return exports.Ingredients.find();                                                                             //
    });                                                                                                                //
}                                                                                                                      // 8
//# sourceMappingURL=ingredients.js.map                                                                                //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"locationSurcharges.js":["meteor/mongo",function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/locationSurcharges.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var mongo_1 = require('meteor/mongo');                                                                                 // 1
exports.LocationSurcharges = new mongo_1.Mongo.Collection('locationSurcharges', { idGeneration: 'MONGO' });            // 2
//# sourceMappingURL=locationSurcharges.js.map                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"mealPlans.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/mealPlans.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Object.defineProperty(exports, '__esModule', {                                                                         //
  value: true                                                                                                          //
});                                                                                                                    //
var MealPlans = new Mongo.Collection('mealPlans', { idGeneration: 'MONGO' });                                          // 1
exports.MealPlans = MealPlans;                                                                                         //
if (Meteor.isServer) {                                                                                                 // 2
  Meteor.publish('mealPlans', function () {                                                                            // 3
    return MealPlans.find();                                                                                           // 4
  });                                                                                                                  //
}                                                                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"meals.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/meals.js                                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Object.defineProperty(exports, '__esModule', {                                                                         //
  value: true                                                                                                          //
});                                                                                                                    //
var Meals = new Mongo.Collection('meals', { idGeneration: 'MONGO' });                                                  // 1
exports.Meals = Meals;                                                                                                 //
if (Meteor.isServer) {                                                                                                 // 2
  Meteor.publish('meals', function () {                                                                                // 3
    return Meals.find();                                                                                               // 4
  });                                                                                                                  //
}                                                                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"orders.js":["meteor/mongo",function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/orders.js                                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Object.defineProperty(exports, '__esModule', {                                                                         //
  value: true                                                                                                          //
});                                                                                                                    //
                                                                                                                       //
var _meteorMongo = require('meteor/mongo');                                                                            //
                                                                                                                       //
var Orders = new _meteorMongo.Mongo.Collection('orders', { idGeneration: 'MONGO' });                                   // 3
                                                                                                                       //
exports.Orders = Orders;                                                                                               //
if (Meteor.isServer) {                                                                                                 // 5
  Meteor.publish('orders', function () {                                                                               // 6
    return Orders.find({ userId: this.userId });                                                                       // 7
  });                                                                                                                  //
}                                                                                                                      //
                                                                                                                       //
// Tasks.allow({                                                                                                       //
// 	remove(userId, doc) {                                                                                              //
// 		if (doc.private && doc.owner != userId) return false;                                                             //
// 		return true;                                                                                                      //
// 	},                                                                                                                 //
// 	insert(userId) {                                                                                                   //
// 		return userId;                                                                                                    //
// 	},                                                                                                                 //
// 	update(userId, doc) {                                                                                              //
// 		return true;                                                                                                      //
// 	},                                                                                                                 //
// 	fetch: ['owner', 'private']                                                                                        //
// });                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"portions.js":["meteor/mongo","meteor/meteor",function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/portions.js                                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var mongo_1 = require('meteor/mongo');                                                                                 // 1
var meteor_1 = require('meteor/meteor');                                                                               // 2
exports.Portions = new mongo_1.Mongo.Collection('portions', { idGeneration: 'MONGO' });                                // 3
if (meteor_1.Meteor.isServer) {                                                                                        // 4
    meteor_1.Meteor.publish('portions', function () {                                                                  //
        return exports.Portions.find();                                                                                //
    });                                                                                                                //
}                                                                                                                      // 8
//# sourceMappingURL=portions.js.map                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"promotions.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/promotions.js                                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Object.defineProperty(exports, '__esModule', {                                                                         //
  value: true                                                                                                          //
});                                                                                                                    //
var Promotions = new Mongo.Collection('promotions', { idGeneration: 'MONGO' });                                        // 1
exports.Promotions = Promotions;                                                                                       //
if (Meteor.isServer) {                                                                                                 // 2
  Meteor.publish('promotions', function () {                                                                           // 3
    return Pormotions.find();                                                                                          // 4
  });                                                                                                                  //
}                                                                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"surveys.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/surveys.js                                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Object.defineProperty(exports, '__esModule', {                                                                         //
  value: true                                                                                                          //
});                                                                                                                    //
var Surveys = new Mongo.Collection('surveys', { idGeneration: 'MONGO' });                                              // 1
exports.Surveys = Surveys;                                                                                             //
if (Meteor.isServer) {                                                                                                 // 2
  Meteor.publish('surveys', function () {                                                                              // 3
    return Surveys.find();                                                                                             // 4
  });                                                                                                                  //
}                                                                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"timeSlots.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/timeSlots.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Object.defineProperty(exports, '__esModule', {                                                                         //
  value: true                                                                                                          //
});                                                                                                                    //
var TimeSlots = new Mongo.Collection('timeSlots', { idGeneration: 'MONGO' });                                          // 1
exports.TimeSlots = TimeSlots;                                                                                         //
if (Meteor.isServer) {                                                                                                 // 2
  Meteor.publish('timeSlots', function () {                                                                            // 3
    return TimeSlots.find();                                                                                           // 4
  });                                                                                                                  //
}                                                                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"main.js":["meteor/meteor","meteor/mongo","../api/orders","../api/meals","../api/addOns","../api/bundleTypes","../api/mealPlans","../api/timeSlots","../api/promotions","../api/fulfillmentSettings","../api/locationSurcharges","../api/ingredients","../api/portions","../api/blocks","../common/scripts/date.ts","../common/scripts/DateSet.ts","lodash","../common/scripts/order.ts","meteor/http",function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/server/main.js                                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var meteor_1 = require('meteor/meteor');                                                                               // 1
var mongo_1 = require('meteor/mongo');                                                                                 // 2
var orders_1 = require('../api/orders');                                                                               // 3
var meals_1 = require('../api/meals');                                                                                 // 4
var addOns_1 = require('../api/addOns');                                                                               // 5
var bundleTypes_1 = require('../api/bundleTypes');                                                                     // 6
var mealPlans_1 = require('../api/mealPlans');                                                                         // 7
var timeSlots_1 = require('../api/timeSlots');                                                                         // 8
var promotions_1 = require('../api/promotions');                                                                       // 9
var fulfillmentSettings_1 = require('../api/fulfillmentSettings');                                                     // 10
var locationSurcharges_1 = require('../api/locationSurcharges');                                                       // 11
var ingredients_1 = require('../api/ingredients');                                                                     // 13
var portions_1 = require('../api/portions');                                                                           // 14
var blocks_1 = require('../api/blocks');                                                                               // 15
var date_ts_1 = require('../common/scripts/date.ts');                                                                  // 16
var DateSet_ts_1 = require('../common/scripts/DateSet.ts');                                                            // 17
var _ = require('lodash');                                                                                             // 18
var order_ts_1 = require('../common/scripts/order.ts');                                                                // 19
var http_1 = require('meteor/http');                                                                                   // 21
function getToday() {                                                                                                  // 23
    var now = new Date();                                                                                              //
    return date_ts_1.createDay(now.getFullYear(), now.getMonth(), now.getDate());                                      //
}                                                                                                                      // 26
;                                                                                                                      // 47
;                                                                                                                      // 51
exports.Errors = new mongo_1.Mongo.Collection('errors', { idGeneration: 'MONGO' });                                    // 166
if (!('toJSON' in Error.prototype))                                                                                    // 170
    Object.defineProperty(Error.prototype, 'toJSON', {                                                                 //
        value: function () {                                                                                           //
            var alt = {};                                                                                              //
            Object.getOwnPropertyNames(this).forEach(function (key) {                                                  //
                alt[key] = this[key];                                                                                  //
            }, this);                                                                                                  //
            return alt;                                                                                                //
        },                                                                                                             //
        configurable: true,                                                                                            //
        writable: true                                                                                                 //
    });                                                                                                                //
function nextOrderNumber() {                                                                                           // 185
    var order = orders_1.Orders.findOne({ debug: null }, { sort: { number: -1 } });                                    //
    if (order) {                                                                                                       //
        return order.number + 1;                                                                                       //
    }                                                                                                                  //
    else {                                                                                                             //
        return 8050;                                                                                                   //
    }                                                                                                                  //
}                                                                                                                      // 193
function amPm(time, appendSuffix) {                                                                                    // 195
    if (appendSuffix === void 0) { appendSuffix = true; }                                                              //
    var date = new Date(Date.parse('Jan 1 ' + time));                                                                  //
    var hours = date.getHours();                                                                                       //
    var suffix = hours >= 12 ? "pm" : "am";                                                                            //
    hours = ((hours + 11) % 12 + 1);                                                                                   //
    return hours + (appendSuffix ? '' + suffix : '');                                                                  //
}                                                                                                                      // 202
var _mealStock = null;                                                                                                 // 205
var _mealStockDate = null;                                                                                             // 206
function getMealStock() {                                                                                              // 207
    var today = getToday();                                                                                            //
    if (_mealStock && _mealStockDate.valueOf() == today.valueOf()) {                                                   //
        return _mealStock;                                                                                             //
    }                                                                                                                  //
    _mealStock = http_1.HTTP.get(meteor_1.Meteor.settings.public.adminUrl + 'api/stock').data;                         //
    _mealStockDate = getToday();                                                                                       //
    return _mealStock;                                                                                                 //
}                                                                                                                      // 215
var OrderApi = (function () {                                                                                          // 217
    function OrderApi() {                                                                                              //
        this._mealStock = null;                                                                                        //
        this._mealStockDate = null;                                                                                    //
    }                                                                                                                  //
    OrderApi.prototype.findOne = function (collectionName, query) {                                                    //
        var collection;                                                                                                //
        switch (collectionName) {                                                                                      //
            case 'mealPlans':                                                                                          //
                collection = mealPlans_1.MealPlans;                                                                    //
                break;                                                                                                 //
            case 'portions':                                                                                           //
                collection = portions_1.Portions;                                                                      //
                break;                                                                                                 //
        }                                                                                                              //
        return collection.findOne(query);                                                                              //
    };                                                                                                                 //
    OrderApi.prototype.compareObjectId = function (a, b) {                                                             //
        return a._str == b._str;                                                                                       //
    };                                                                                                                 //
    OrderApi.prototype.mealStock = function (meal) {                                                                   //
        var _this = this;                                                                                              //
        // var _mealStock = null;                                                                                      //
        // var _mealStockDate = null;                                                                                  //
        var getMealStock = function () {                                                                               //
            var today = getToday();                                                                                    //
            if (_this._mealStock && _this._mealStockDate.valueOf() == today.valueOf()) {                               //
                return _mealStock;                                                                                     //
            }                                                                                                          //
            _this._mealStock = http_1.HTTP.get(meteor_1.Meteor.settings.public.adminUrl + 'api/stock').data;           //
            _this._mealStockDate = getToday();                                                                         //
            return _this._mealStock;                                                                                   //
        };                                                                                                             //
        return getMealStock()[meal._id._str];                                                                          //
    };                                                                                                                 //
    return OrderApi;                                                                                                   //
}());                                                                                                                  // 246
function timeSlotsForMonth(month) {                                                                                    // 248
    return timeSlotsForDates(date_ts_1.calendarDaysForMonth(month));                                                   //
}                                                                                                                      // 250
exports.timeSlotsForMonth = timeSlotsForMonth;                                                                         // 248
function timeSlotsForDates(dates) {                                                                                    // 252
    var minDate = date_ts_1.formatDate(dates[0]);                                                                      //
    var maxDate = date_ts_1.formatDate(dates[dates.length - 1]);                                                       //
    var orders = orders_1.Orders.find({ 'deliveryOptions.date': { $gte: minDate, $lte: maxDate }, state: 'completed' }).fetch();
    var ordersByDate = {};                                                                                             //
    for (var _i = 0, orders_2 = orders; _i < orders_2.length; _i++) {                                                  //
        var order = orders_2[_i];                                                                                      //
        if (!ordersByDate[order.deliveryOptions.date]) {                                                               //
            ordersByDate[order.deliveryOptions.date] = [];                                                             //
        }                                                                                                              //
        ordersByDate[order.deliveryOptions.date].push(order);                                                          //
    }                                                                                                                  //
    var timeSlotsById = _.reduce(timeSlots_1.TimeSlots.find().fetch(), function (timeSlotsById, timeSlot) {            //
        timeSlotsById[timeSlot._id._str] = timeSlot;                                                                   //
        return timeSlotsById;                                                                                          //
    }, {});                                                                                                            //
    var availableTimeSlotsByDate = {};                                                                                 //
    for (var _a = 0, dates_1 = dates; _a < dates_1.length; _a++) {                                                     //
        var date = dates_1[_a];                                                                                        //
        var timeSlotsForDate = [];                                                                                     //
        for (var timeSlotId in timeSlotsById) {                                                                        //
            if (timeSlotsById[timeSlotId].days[date.getDay()] && timeSlotsById[timeSlotId].capacity) {                 //
                timeSlotsForDate.push(timeSlotId);                                                                     //
            }                                                                                                          //
        }                                                                                                              //
        date = date_ts_1.formatDate(date);                                                                             //
        var ordersByTimeSlot = {};                                                                                     //
        if (ordersByDate[date]) {                                                                                      //
            var ordersByTimeSlot_1 = {};                                                                               //
            for (var _b = 0, _c = ordersByDate[date]; _b < _c.length; _b++) {                                          //
                var order = _c[_b];                                                                                    //
                if (!ordersByTimeSlot_1[order.deliveryOptions.time._id._str]) {                                        //
                    ordersByTimeSlot_1[order.deliveryOptions.time._id._str] = [];                                      //
                }                                                                                                      //
                ordersByTimeSlot_1[order.deliveryOptions.time._id._str].push(order);                                   //
            }                                                                                                          //
            availableTimeSlotsByDate[date] = [];                                                                       //
            for (var _d = 0, timeSlotsForDate_1 = timeSlotsForDate; _d < timeSlotsForDate_1.length; _d++) {            //
                var timeSlotId = timeSlotsForDate_1[_d];                                                               //
                var timeSlot = timeSlotsById[timeSlotId];                                                              //
                if (!ordersByTimeSlot_1[timeSlotId] || ordersByTimeSlot_1[timeSlotId].length < timeSlot.capacity) {    //
                    availableTimeSlotsByDate[date].push(timeSlotId);                                                   //
                }                                                                                                      //
            }                                                                                                          //
        }                                                                                                              //
        else {                                                                                                         //
            availableTimeSlotsByDate[date] = timeSlotsForDate;                                                         //
        }                                                                                                              //
    }                                                                                                                  //
    return availableTimeSlotsByDate;                                                                                   //
}                                                                                                                      // 301
exports.timeSlotsForDates = timeSlotsForDates;                                                                         // 252
function createOrder(orderData, userId, opts) {                                                                        // 310
    if (opts === void 0) { opts = {}; }                                                                                //
    try {                                                                                                              //
        var user = meteor_1.Meteor.users.findOne({ _id: userId });                                                     //
        if (orderData.userId) {                                                                                        //
            if (user.role == 'admin') {                                                                                //
                userId = orderData.userId;                                                                             //
            }                                                                                                          //
            else {                                                                                                     //
                return false;                                                                                          //
            }                                                                                                          //
        }                                                                                                              //
        var index = 0;                                                                                                 //
        for (var _i = 0, _a = orderData.bundles; _i < _a.length; _i++) {                                               //
            var bundle = _a[_i];                                                                                       //
            if (bundle.promotion) {                                                                                    //
                var result = validatePromotion(userId, orderData, promotions_1.Promotions.findOne({ _id: new mongo_1.Mongo.ObjectID(bundle.promotion) }));
                if (_.isArray(result) && result.indexOf(index) == -1 || !_.isArray(result)) {                          //
                    return {                                                                                           //
                        success: false,                                                                                //
                        error: 'invalidPromotion',                                                                     //
                        promotionStatus: result                                                                        //
                    };                                                                                                 //
                }                                                                                                      //
            }                                                                                                          //
            ++index;                                                                                                   //
        }                                                                                                              //
        var order = resolveOrder(orderData, userId);                                                                   //
        var availabilityDates = availablilityDatesForOrder(order);                                                     //
        var timeSlots = timeSlotsForDates([date_ts_1.convertToDate(order.deliveryOptions.date)])[order.deliveryOptions.date];
        if (availabilityDates.test(date_ts_1.convertToDate(order.deliveryOptions.date)) && timeSlots && timeSlots.indexOf(order.deliveryOptions.time._id._str) != -1) {
            order.state = 'charging';                                                                                  //
            order.createdAt = new Date();                                                                              //
            var orderId = orders_1.Orders.insert(order);                                                               //
            var response = void 0;                                                                                     //
            if (order.total > 0 && opts.charge && !user.profile.debug) {                                               //
                response = meteor_1.Meteor.wrapAsync(opts.gateway.transaction.sale, opts.gateway.transaction)({        //
                    amount: order.total,                                                                               //
                    paymentMethodNonce: orderData.paymentNonce,                                                        //
                    options: {                                                                                         //
                        submitForSettlement: true                                                                      //
                    },                                                                                                 //
                    customer: {                                                                                        //
                        firstName: order.deliveryOptions.firstName                                                     //
                    }                                                                                                  //
                });                                                                                                    //
            }                                                                                                          //
            if (!opts.charge || order.total === 0 || user.profile.debug || (opts.charge && response.success)) {        //
                if (response)                                                                                          //
                    order.transaction = response.transaction;                                                          //
                order.state = 'processing';                                                                            //
                orders_1.Orders.update({ _id: orderId }, order);                                                       //
                var userUpdates = {};                                                                                  //
                if (!user.profile.firstName) {                                                                         //
                    user.profile.firstName = userUpdates['profile.firstName'] = orderData.deliveryOptions.firstName;   //
                }                                                                                                      //
                if (!user.profile.surname) {                                                                           //
                    userUpdates['profile.surname'] = orderData.deliveryOptions.surname;                                //
                }                                                                                                      //
                if (!user.profile.phoneNumber) {                                                                       //
                    userUpdates['profile.phoneNumber'] = orderData.deliveryOptions.contactNumber;                      //
                }                                                                                                      //
                if (!user.profile.deliveryAddresses.length) {                                                          //
                    userUpdates['profile.deliveryAddresses'] = [{ address: orderData.deliveryOptions.address, postalCode: orderData.deliveryOptions.postalCode }];
                    userUpdates['profile.selectedDeliveryAddress'] = 0;                                                //
                }                                                                                                      //
                if (!_.isEmpty(userUpdates)) {                                                                         //
                    meteor_1.Meteor.users.update({ _id: userId }, { $set: userUpdates });                              //
                }                                                                                                      //
                if (user.profile.debug) {                                                                              //
                    order.debug = true;                                                                                //
                }                                                                                                      //
                if (opts.sendEmails) {                                                                                 //
                    try {                                                                                              //
                        if (order.deliveryOptions.selfCollection) {                                                    //
                            Email.send({                                                                               //
                                to: user.emails[0].address,                                                            //
                                from: Accounts.emailTemplates.from,                                                    //
                                subject: 'Self-Collection of your Fitness Ration meals',                               //
                                html: "\n\t\t\t\t\t\t\t\t\t<p>Dear " + user.profile.firstName + ",</p>\n\t\t\t\t\t\t\t\t\t<p>Your order #" + order.number + " is confirmed for self-collection on " + order.deliveryOptions.date + " at " + amPm(order.deliveryOptions.time.start) + "-" + amPm(order.deliveryOptions.time.end) + ".</p>\n\t\t\t\t\t\t\t\t\t<p>To view your current order summary and e-receipt, <a href=\"http://www.fitnessration.com.sg/#login\">log in to your account here.</a></p>\n\t\t\t\t\t\t\t\t\t<p>Have a question?<br>\n\t\t\t\t\t\t\t\t\tRefer to our <a href=\"http://www.fitnessration.com.sg/faq.php\">FAQ</a> or drop us an email at enquiries@fitnessration.com.sg</p>\n\t\t\t\t\t\t\t\t\t<p>Remember to like us on <a href=\"http://www.facebook.com/fitnessration\">Facebook</a> for the latest menu, promotions and events.</p>\n\t\t\t\t\t\t\t\t\t<p>Enjoy your meals!<br>\n\t\t\t\t\t\t\t\t\tTeam Fitness Ration</p>"
                            });                                                                                        //
                        }                                                                                              //
                        else {                                                                                         //
                            Email.send({                                                                               //
                                to: user.emails[0].address,                                                            //
                                from: Accounts.emailTemplates.from,                                                    //
                                subject: 'Confirmed delivery of your Fitness Ration meals',                            //
                                html: "\n\t\t\t\t\t\t\t\t\t<p>Dear " + user.profile.firstName + ",</p>\n\t\t\t\t\t\t\t\t\t<p>Your order #" + order.number + " is confirmed for delivery on " + order.deliveryOptions.date + " at " + amPm(order.deliveryOptions.time.start) + "-" + amPm(order.deliveryOptions.time.end) + ". Be sure to have someone to receive your bundles on delivery day!</p>\n\t\t\t\t\t\t\t\t\t<p>To view your current order summary and e-receipt, <a href=\"http://www.fitnessration.com.sg/#login\">log in to your account here.</a></p>\n\t\t\t\t\t\t\t\t\t<p>Have a question?<br>\n\t\t\t\t\t\t\t\t\tRefer to our <a href=\"http://www.fitnessration.com.sg/faq.php\">FAQ</a> or drop us an email at enquiries@fitnessration.com.sg</p>\n\t\t\t\t\t\t\t\t\t<p>Remember to like us on <a href=\"http://www.facebook.com/fitnessration\">Facebook</a> for the latest menu, promotions and events.</p>\n\t\t\t\t\t\t\t\t\t<p>Enjoy your meals!<br>\n\t\t\t\t\t\t\t\t\tTeam Fitness Ration</p>"
                            });                                                                                        //
                        }                                                                                              //
                    }                                                                                                  //
                    catch (e) {                                                                                        //
                        order.emailError = JSON.parse(JSON.stringify(e));                                              //
                    }                                                                                                  //
                }                                                                                                      //
                order.status = 'pending';                                                                              //
                order.flagged = order_ts_1.orderFlagged(order, new OrderApi);                                          //
                order.state = 'completed';                                                                             //
                if (opts.transactions)                                                                                 //
                    tx.start('create order');                                                                          //
                orders_1.Orders.update({ _id: orderId }, order);                                                       //
                if (opts.transactions)                                                                                 //
                    tx.commit();                                                                                       //
                return {                                                                                               //
                    success: true,                                                                                     //
                    orderId: orderId._str                                                                              //
                };                                                                                                     //
            }                                                                                                          //
            else {                                                                                                     //
                order.state = 'failed';                                                                                //
                order.error = 'payment';                                                                               //
                order.paymentResponse = response;                                                                      //
                orders_1.Orders.update({ _id: orderId }, order);                                                       //
                return {                                                                                               //
                    success: false,                                                                                    //
                    error: 'payment',                                                                                  //
                    response: response                                                                                 //
                };                                                                                                     //
            }                                                                                                          //
        }                                                                                                              //
        else {                                                                                                         //
            var cursor = meals_1.Meals.find();                                                                         //
            var stock_1 = {};                                                                                          //
            cursor.forEach(function (meal) {                                                                           //
                stock_1[meal._id._str] = meal.stock;                                                                   //
            });                                                                                                        //
            return {                                                                                                   //
                success: false,                                                                                        //
                error: 'deliveryDate',                                                                                 //
                stock: stock_1,                                                                                        //
            };                                                                                                         //
        }                                                                                                              //
    }                                                                                                                  //
    catch (e) {                                                                                                        //
        var error = JSON.parse(JSON.stringify(e));                                                                     //
        error.createdAt = new Date();                                                                                  //
        error.orderData = orderData;                                                                                   //
        exports.Errors.insert(error);                                                                                  //
        return {                                                                                                       //
            success: false,                                                                                            //
            error: 'inernalError',                                                                                     //
            e: e                                                                                                       //
        };                                                                                                             //
    }                                                                                                                  //
}                                                                                                                      // 477
exports.createOrder = createOrder;                                                                                     // 310
function availablilityDatesForOrder(order) {                                                                           // 479
    var excluded = [                                                                                                   //
        ['dayOfYear', '10-29'],                                                                                        //
        ['dayOfYear', '09-12']                                                                                         //
    ];                                                                                                                 //
    var blocks = blocks_1.Blocks.find().fetch();                                                                       //
    for (var _i = 0, blocks_2 = blocks; _i < blocks_2.length; _i++) {                                                  //
        var block = blocks_2[_i];                                                                                      //
        excluded.push(['range', date_ts_1.formatDate(block.start), date_ts_1.formatDate(block.end)]);                  //
    }                                                                                                                  //
    var excludedDates = new DateSet_ts_1.DateSet();                                                                    //
    for (var _a = 0, excluded_1 = excluded; _a < excluded_1.length; _a++) {                                            //
        var rule = excluded_1[_a];                                                                                     //
        excludedDates.addRule('include', DateSet_ts_1.DateSet.rule[rule[0]].apply(DateSet_ts_1.DateSet, rule.slice(1)));
    }                                                                                                                  //
    var availabilityDates = new DateSet_ts_1.DateSet();                                                                //
    availabilityDates.addRule('exclude', order_ts_1.excludeAvailabilityDate({                                          //
        excludedFulfillmentDates: excludedDates,                                                                       //
        fulfillmentDays: function () { return order_ts_1.orderFulfillmentDays(order, new OrderApi); }                  //
    }));                                                                                                               //
    for (var _b = 0, _c = order.bundles; _b < _c.length; _b++) {                                                       //
        var bundle = _c[_b];                                                                                           //
        if (bundle.promotion && bundle.promotion.fulfillmentStart && bundle.promotion.fulfillmentEnd) {                //
            availabilityDates.addRule('exclude', DateSet_ts_1.DateSet.rule.invertedRange(bundle.promotion.fulfillmentStart, bundle.promotion.fulfillmentEnd));
        }                                                                                                              //
    }                                                                                                                  //
    return availabilityDates;                                                                                          //
}                                                                                                                      // 506
exports.availablilityDatesForOrder = availablilityDatesForOrder;                                                       // 479
// TODO: Eliminate nesting                                                                                             // 509
function validatePromotion(userId, order, promotion) {                                                                 // 510
    if (promotion) {                                                                                                   //
        var now = new Date();                                                                                          //
        var today = date_ts_1.formatDate(now);                                                                         //
        if (now.getTime() >= Date.parse(promotion.start)) {                                                            //
            if (now.getTime() < Date.parse(promotion.end)) {                                                           //
                if (!order.deliveryOptions.date || !(promotion.fulfillmentStart && promotion.fulfillmentEnd) || order.deliveryOptions.date >= promotion.fulfillmentStart && order.deliveryOptions.date <= promotion.fulfillmentEnd) {
                    var used = false;                                                                                  //
                    if (promotion.usageLimit) {                                                                        //
                        var count = orders_1.Orders.find({ userId: userId, bundles: { $elemMatch: { 'promotion._id': promotion._id } } }).count();
                        used = count >= promotion.usageLimit;                                                          //
                    }                                                                                                  //
                    if (!used) {                                                                                       //
                        if (promotion.premiumCap !== null) {                                                           //
                            var premiumCount = 0;                                                                      //
                            for (var _i = 0, _a = order.bundles; _i < _a.length; _i++) {                               //
                                var bundle = _a[_i];                                                                   //
                                for (var _b = 0, _c = bundle.mealSelections; _b < _c.length; _b++) {                   //
                                    var mealSelection = _c[_b];                                                        //
                                    if (meals_1.Meals.findOne(new mongo_1.Mongo.ObjectID(mealSelection.mealId)).grade == 'premium') {
                                        premiumCount += mealSelection.quantity;                                        //
                                        if (premiumCount > promotion.premiumCap) {                                     //
                                            return { error: 'surpassedPremiumCap', premiumCap: promotion.premiumCap };
                                        }                                                                              //
                                    }                                                                                  //
                                }                                                                                      //
                            }                                                                                          //
                        }                                                                                              //
                        var bundles = [];                                                                              //
                        var index = 0;                                                                                 //
                        for (var _d = 0, _e = order.bundles; _d < _e.length; _d++) {                                   //
                            var bundle = _e[_d];                                                                       //
                            if (promotion.mealPlan && bundle.mealPlan != promotion.mealPlan._str)                      //
                                continue;                                                                              //
                            if (promotion.portion && bundle.portion != promotion.portion._str)                         //
                                continue;                                                                              //
                            if (promotion.bundleType && bundle.type != promotion.bundleType._str)                      //
                                continue;                                                                              //
                            bundles.push(index);                                                                       //
                            ++index;                                                                                   //
                        }                                                                                              //
                        if (bundles.length) {                                                                          //
                            return bundles;                                                                            //
                        }                                                                                              //
                        else {                                                                                         //
                            return 'notCompatible';                                                                    //
                        }                                                                                              //
                    }                                                                                                  //
                    else {                                                                                             //
                        return 'alreadyUsed';                                                                          //
                    }                                                                                                  //
                }                                                                                                      //
                else {                                                                                                 //
                    return 'invalidFulfillmentDate';                                                                   //
                }                                                                                                      //
            }                                                                                                          //
            else {                                                                                                     //
                return 'promotionEnded';                                                                               //
            }                                                                                                          //
        }                                                                                                              //
        else {                                                                                                         //
            return 'promotionNotStarted';                                                                              //
        }                                                                                                              //
    }                                                                                                                  //
    else {                                                                                                             //
        return 'invalidPromoCode';                                                                                     //
    }                                                                                                                  //
}                                                                                                                      // 572
exports.validatePromotion = validatePromotion;                                                                         // 510
function resolveOrder(orderData, userId) {                                                                             // 575
    var fulfillmentSettings = fulfillmentSettings_1.FulfillmentSettings.findOne();                                     //
    var bundles = [];                                                                                                  //
    for (var _i = 0, _a = orderData.bundles; _i < _a.length; _i++) {                                                   //
        var bundleData = _a[_i];                                                                                       //
        var bundle = {                                                                                                 //
            portion: portions_1.Portions.findOne({ _id: new mongo_1.Mongo.ObjectID(bundleData.portion) }),             //
            mealPlan: mealPlans_1.MealPlans.findOne({ _id: new mongo_1.Mongo.ObjectID(bundleData.mealPlan) }),         //
            type: bundleTypes_1.BundleTypes.findOne({ _id: new mongo_1.Mongo.ObjectID(bundleData.type) }),             //
            allergies: _.map(bundleData.allergies, function (allergyId) { return ingredients_1.Ingredients.findOne({ _id: new mongo_1.Mongo.ObjectID(allergyId) }); }),
            mealSelections: _.map(bundleData.mealSelections, function (mealSelection) {                                //
                return {                                                                                               //
                    meal: meals_1.Meals.findOne({ _id: new mongo_1.Mongo.ObjectID(mealSelection.mealId) }),            //
                    quantity: mealSelection.quantity                                                                   //
                };                                                                                                     //
            }),                                                                                                        //
            promotion: bundleData.promotion ? promotions_1.Promotions.findOne({ _id: new mongo_1.Mongo.ObjectID(bundleData.promotion) }) : undefined
        };                                                                                                             //
        bundle.price = order_ts_1.bundlePrice(bundle);                                                                 //
        bundle.total = order_ts_1.bundleTotal(bundle);                                                                 //
        bundles.push(bundle);                                                                                          //
    }                                                                                                                  //
    var order = {                                                                                                      //
        userId: userId,                                                                                                //
        addOnSelections: _.map(orderData.addOnSelections, function (addOnSelection) {                                  //
            return {                                                                                                   //
                addOn: addOns_1.AddOns.findOne({ _id: new mongo_1.Mongo.ObjectID(addOnSelection.addOnId) }),           //
                variant: addOnSelection.variant,                                                                       //
                quantity: addOnSelection.quantity,                                                                     //
            };                                                                                                         //
        }),                                                                                                            //
        bundles: bundles,                                                                                              //
        deliveryOptions: orderData.deliveryOptions,                                                                    //
    };                                                                                                                 //
    if (orderData.deliveryOptions) {                                                                                   //
        if (orderData.deliveryOptions.time) {                                                                          //
            var timeSlot = timeSlots_1.TimeSlots.findOne({ _id: new mongo_1.Mongo.ObjectID(orderData.deliveryOptions.time) });
            order.deliveryOptions.time = { _id: timeSlot._id, start: timeSlot.start, end: timeSlot.end };              //
        }                                                                                                              //
        order.locationSurcharge = order_ts_1.orderLocationSurcharge(order, {                                           //
            locationSurcharges: locationSurcharges_1.LocationSurcharges.find().fetch()                                 //
        });                                                                                                            //
        order.deliveryFee = order_ts_1.orderDeliveryFee(order, {                                                       //
            totalMeals: function (order) {                                                                             //
                return order_ts_1.orderTotalMeals(order);                                                              //
            },                                                                                                         //
            fulfillmentSettings: fulfillmentSettings,                                                                  //
            locationSurcharges: locationSurcharges_1.LocationSurcharges.find().fetch()                                 //
        });                                                                                                            //
    }                                                                                                                  //
    order.subtotal = order_ts_1.orderSubtotal(order);                                                                  //
    order.total = order_ts_1.orderTotal(order);                                                                        //
    order.number = nextOrderNumber();                                                                                  //
    return order;                                                                                                      //
}                                                                                                                      // 629
exports.resolveOrder = resolveOrder;                                                                                   // 575
//# sourceMappingURL=main.js.map                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},"server":{"main.js":["fb","meteor/meteor","../imports/api/surveys","../imports/api/meals","../imports/api/promotions","lodash","meteor/http","../imports/common/scripts/date","../imports/common/scripts/order","../imports/server/main","lockfile","braintree","wkhtmltopdf",function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/main.js                                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _this = this;                                                                                                      //
                                                                                                                       //
var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }                      //
                                                                                                                       //
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
                                                                                                                       //
var _fb = require('fb');                                                                                               //
                                                                                                                       //
var _meteorMeteor = require('meteor/meteor');                                                                          //
                                                                                                                       //
var _importsApiSurveys = require('../imports/api/surveys');                                                            //
                                                                                                                       //
var _importsApiMeals = require('../imports/api/meals');                                                                //
                                                                                                                       //
var _importsApiPromotions = require('../imports/api/promotions');                                                      //
                                                                                                                       //
var _lodash = require('lodash');                                                                                       //
                                                                                                                       //
var _ = _interopRequireWildcard(_lodash);                                                                              //
                                                                                                                       //
var _meteorHttp = require('meteor/http');                                                                              //
                                                                                                                       //
var _importsCommonScriptsDate = require('../imports/common/scripts/date');                                             //
                                                                                                                       //
var _importsCommonScriptsOrder = require('../imports/common/scripts/order');                                           //
                                                                                                                       //
var _importsServerMain = require('../imports/server/main');                                                            //
                                                                                                                       //
var _lockfile = require('lockfile');                                                                                   //
                                                                                                                       //
var _lockfile2 = _interopRequireDefault(_lockfile);                                                                    //
                                                                                                                       //
Accounts.onCreateUser(function (options, user) {                                                                       // 13
	user.username = user.username.toLowerCase();                                                                          // 14
	if (!user.profile) {                                                                                                  // 15
		user.profile = {};                                                                                                   // 16
	}                                                                                                                     //
	user.profile.preferences = {};                                                                                        // 18
	user.profile.deliveryAddresses = [];                                                                                  // 19
	if (!user.profile.firstName && options.firstName) {                                                                   // 20
		user.profile.firstName = options.firstName;                                                                          // 21
	}                                                                                                                     //
	if (!user.profile.surname && options.surname) {                                                                       // 23
		user.profile.surname = options.surname;                                                                              // 24
	}                                                                                                                     //
	return user;                                                                                                          // 26
});                                                                                                                    //
                                                                                                                       //
Accounts.config({                                                                                                      // 29
	loginExpirationInDays: 1000                                                                                           // 30
});                                                                                                                    //
                                                                                                                       //
var gateway;                                                                                                           // 33
_meteorMeteor.Meteor.startup(function () {                                                                             // 34
	var braintree = require('braintree');                                                                                 // 35
	gateway = braintree.connect({                                                                                         // 36
		environment: _meteorMeteor.Meteor.settings.braintree.environment == 'sandbox' ? braintree.Environment.Sandbox : braintree.Environment.Production,
		publicKey: _meteorMeteor.Meteor.settings.braintree.publicKey,                                                        // 38
		privateKey: _meteorMeteor.Meteor.settings.braintree.privateKey,                                                      // 39
		merchantId: _meteorMeteor.Meteor.settings.braintree.merchantId                                                       // 40
	});                                                                                                                   //
});                                                                                                                    //
                                                                                                                       //
Accounts.emailTemplates.from = 'Fitness Ration <no-reply@fitnessration.com.sg>';                                       // 44
Accounts.emailTemplates.resetPassword.subject = function () {                                                          // 45
	return 'Password recovery for your Fitness Ration account';                                                           // 46
};                                                                                                                     //
Accounts.emailTemplates.resetPassword.html = function (user, url) {                                                    // 48
	return '\n\t\t<p>Dear ' + user.profile.firstName + ',</p>\n\t\t<p>You have requested for a password recovery in your Fitness Ration account.</p>\n\t\t<p>To change your password, <a href="' + url + '">click here</a> to login to your user dashboard.</p>\n\n\t\t<p>If you <b>did not</b> request for a password recovery, please email us immediately at enquiries@fitnessration.com.sg and we will respond within 24 hours.</p>\n\n\t\t<p>Sincerely,<br>\n\t\tTeam Fitness Ration</p>';
};                                                                                                                     //
                                                                                                                       //
_meteorMeteor.Meteor.publish('user', function () {                                                                     // 60
	return _meteorMeteor.Meteor.users.find({ _id: _this.userId });                                                        // 61
});                                                                                                                    //
                                                                                                                       //
var api = new Restivus({                                                                                               // 64
	useDefaultAuth: true,                                                                                                 // 65
	auth: {                                                                                                               // 66
		token: 'auth.apiKey'                                                                                                 // 67
	}                                                                                                                     //
});                                                                                                                    //
                                                                                                                       //
_meteorMeteor.Meteor.methods({                                                                                         // 71
	updateUsername: function updateUsername(username) {                                                                   // 72
		_meteorMeteor.Meteor.users.update({ _id: _meteorMeteor.Meteor.userId() }, { $set: { username: username, 'emails.0.address': username } });
	},                                                                                                                    //
	uploadProfilePicture: function uploadProfilePicture(args) {                                                           // 75
		if (_meteorMeteor.Meteor.user()) {                                                                                   // 76
			_meteorHttp.HTTP.post(_meteorMeteor.Meteor.settings['public'].imageServerUrl + '/upload.php', {                     // 77
				content: args.data                                                                                                 // 78
			}, function (err, result) {                                                                                         //
				if (result.data.result == 'success') {                                                                             // 80
					_meteorMeteor.Meteor.users.update({ _id: _meteorMeteor.Meteor.userId() }, { $set: { 'profile.picture': result.data.url } });
				}                                                                                                                  //
			});                                                                                                                 //
		}                                                                                                                    //
	}                                                                                                                     //
});                                                                                                                    //
                                                                                                                       //
api.addCollection(_meteorMeteor.Meteor.users);                                                                         // 88
api.addCollection(_importsApiSurveys.Surveys);                                                                         // 89
                                                                                                                       //
api.addRoute('delivery/calendar', {                                                                                    // 91
	post: function post() {                                                                                               // 92
		var userId = this.request.headers['x-user-id'];                                                                      // 93
		var order = (0, _importsServerMain.resolveOrder)(this.bodyParams.order, userId);                                     // 94
                                                                                                                       //
		var _queryParams$month$match = this.queryParams.month.match(/(\d{4})-(\d{1,2})/);                                    //
                                                                                                                       //
		var _queryParams$month$match2 = _slicedToArray(_queryParams$month$match, 3);                                         //
                                                                                                                       //
		var year = _queryParams$month$match2[1];                                                                             //
		var month = _queryParams$month$match2[2];                                                                            //
                                                                                                                       //
		var timeSlots = (0, _importsServerMain.timeSlotsForMonth)(new Date(year, month - 1));                                // 96
		var availabilityDates = (0, _importsServerMain.availablilityDatesForOrder)(order);                                   // 97
                                                                                                                       //
		var response = {};                                                                                                   // 99
		for (var date in timeSlots) {                                                                                        // 100
			if (availabilityDates.test(date)) {                                                                                 // 101
				response[date] = timeSlots[date];                                                                                  // 102
			} else {                                                                                                            //
				response[date] = [];                                                                                               // 105
			}                                                                                                                   //
		}                                                                                                                    //
		return response;                                                                                                     // 108
	}                                                                                                                     //
});                                                                                                                    //
                                                                                                                       //
api.addRoute('users/delivery-addresses', {                                                                             // 112
	post: function post() {                                                                                               // 113
		_meteorMeteor.Meteor.users.update({ _id: this.request.headers['x-user-id'] }, { $push: { 'profile.deliveryAddresses': this.bodyParams } });
		return true;                                                                                                         // 115
	}                                                                                                                     //
});                                                                                                                    //
                                                                                                                       //
api.addRoute('payment/client-token', {                                                                                 // 119
	get: function get() {                                                                                                 // 120
		var clientId = this.queryParams.clientId;                                                                            // 121
		var generateToken = _meteorMeteor.Meteor.wrapAsync(gateway.clientToken.generate, gateway.clientToken);               // 122
		var options = {};                                                                                                    // 123
                                                                                                                       //
		if (clientId) {                                                                                                      // 125
			options.clientId = clientId;                                                                                        // 126
		}                                                                                                                    //
                                                                                                                       //
		var response = generateToken(options);                                                                               // 129
                                                                                                                       //
		return response.clientToken;                                                                                         // 131
	}                                                                                                                     //
});                                                                                                                    //
                                                                                                                       //
api.addRoute('users/reset-password', {                                                                                 // 135
	get: function get() {                                                                                                 // 136
		var user = _meteorMeteor.Meteor.users.findOne({ username: this.queryParams.email.toLowerCase() });                   // 137
		if (user) {                                                                                                          // 138
			Accounts.sendResetPasswordEmail(user._id);                                                                          // 139
			return true;                                                                                                        // 140
		} else {                                                                                                             //
			return false;                                                                                                       // 143
		}                                                                                                                    //
	}                                                                                                                     //
});                                                                                                                    //
                                                                                                                       //
api.addRoute('promo-codes/validate', {                                                                                 // 148
	post: function post() {                                                                                               // 149
		var promotion = _importsApiPromotions.Promotions.findOne({ promoCode: new RegExp(this.bodyParams.promoCode, 'i') });
		var result = (0, _importsServerMain.validatePromotion)(this.request.headers['x-user-id'], this.bodyParams.order, promotion);
		if (_.isArray(result)) {                                                                                             // 152
			return {                                                                                                            // 153
				result: true,                                                                                                      // 154
				bundles: result,                                                                                                   // 155
				promotion: promotion                                                                                               // 156
			};                                                                                                                  //
		} else {                                                                                                             //
			return {                                                                                                            // 160
				result: false,                                                                                                     // 161
				error: result                                                                                                      // 162
			};                                                                                                                  //
		}                                                                                                                    //
	}                                                                                                                     //
});                                                                                                                    //
                                                                                                                       //
api.addRoute('orders', {                                                                                               // 168
	post: function post() {                                                                                               // 169
		var orderData = this.bodyParams;                                                                                     // 170
		var userId = this.request.headers['x-user-id'];                                                                      // 171
		_lockfile2['default'].lockSync('orders.lock');                                                                       // 172
		var response = (0, _importsServerMain.createOrder)(orderData, userId, {                                              // 173
			gateway: gateway,                                                                                                   // 174
			charge: true,                                                                                                       // 175
			sendEmails: true,                                                                                                   // 176
			transactions: true                                                                                                  // 177
		});                                                                                                                  //
		_lockfile2['default'].unlockSync('orders.lock');                                                                     // 179
		return response;                                                                                                     // 180
	}                                                                                                                     //
});                                                                                                                    //
                                                                                                                       //
api.addRoute('profile-picture', {                                                                                      // 184
	post: function post() {                                                                                               // 185
		console.log(this.request.files);                                                                                     // 186
		return true;                                                                                                         // 187
	}                                                                                                                     //
});                                                                                                                    //
                                                                                                                       //
api.addRoute('facebook-login', {                                                                                       // 191
	get: function get() {                                                                                                 // 192
		var accessToken = this.queryParams.accessToken;                                                                      // 193
		var expiresIn = this.queryParams.expiresIn;                                                                          // 194
                                                                                                                       //
		var fb = new _fb.Facebook({                                                                                          // 196
			accessToken: accessToken,                                                                                           // 197
			appId: _meteorMeteor.Meteor.settings.facebook.appId,                                                                // 198
			appSecret: _meteorMeteor.Meteor.settings.facebook.secret                                                            // 199
		});                                                                                                                  //
                                                                                                                       //
		var serviceData = _meteorMeteor.Meteor.wrapAsync(function (done) {                                                   // 202
			fb.api('me', { fields: ['id', 'email', 'name', 'first_name', 'last_name'] }, function (res) {                       // 203
				done(null, res);                                                                                                   // 204
			});                                                                                                                 //
		})();                                                                                                                //
                                                                                                                       //
		serviceData.accessToken = accessToken;                                                                               // 208
		serviceData.expiresAt = parseInt(+new Date() + 1000 * expiresIn);                                                    // 209
                                                                                                                       //
		var userId;                                                                                                          // 211
		var user = _meteorMeteor.Meteor.users.findOne({ username: serviceData.email });                                      // 212
                                                                                                                       //
		if (user && !user.services.facebook) {                                                                               // 214
			_meteorMeteor.Meteor.users.update({ _id: user._id }, {                                                              // 215
				$set: {                                                                                                            // 216
					'services.facebook': serviceData                                                                                  // 217
				}                                                                                                                  //
			});                                                                                                                 //
		}                                                                                                                    //
                                                                                                                       //
		if (!user) {                                                                                                         // 222
			user = _meteorMeteor.Meteor.users.findOne({ 'services.facebook.id': serviceData.id });                              // 223
		}                                                                                                                    //
                                                                                                                       //
		if (!user) {                                                                                                         // 226
			userId = Accounts.insertUserDoc({}, {                                                                               // 227
				username: serviceData.email,                                                                                       // 228
				emails: [{ address: serviceData.email, verified: true }],                                                          // 229
				profile: {                                                                                                         // 230
					firstName: serviceData.first_name,                                                                                // 231
					surname: serviceData.last_name                                                                                    // 232
				},                                                                                                                 //
				services: {                                                                                                        // 234
					facebook: serviceData                                                                                             // 235
				}                                                                                                                  //
			});                                                                                                                 //
		} else {                                                                                                             //
			userId = user._id;                                                                                                  // 240
		}                                                                                                                    //
                                                                                                                       //
		var authToken = Accounts._generateStampedLoginToken();                                                               // 243
		var hashedToken = Accounts._hashLoginToken(authToken.token);                                                         // 244
		Accounts._insertHashedLoginToken(userId, {                                                                           // 245
			hashedToken: hashedToken                                                                                            // 246
		});                                                                                                                  //
		return {                                                                                                             // 248
			authToken: authToken.token,                                                                                         // 249
			userId: userId                                                                                                      // 250
		};                                                                                                                   //
	}                                                                                                                     //
});                                                                                                                    //
                                                                                                                       //
api.addRoute('admin/invoices', {                                                                                       // 255
	get: function get() {                                                                                                 // 256
		var _this2 = this;                                                                                                   //
                                                                                                                       //
		var wkhtmltopdf = require('wkhtmltopdf');                                                                            // 257
		_meteorMeteor.Meteor.wrapAsync(function (done) {                                                                     // 258
			wkhtmltopdf(_meteorMeteor.Meteor.settings['public'].exportUrl + 'invoice.php?orders=' + _this2.queryParams.orders, {
				headerHtml: _meteorMeteor.Meteor.settings['public'].exportUrl + 'invoice-header.html',                             // 260
				footerHtml: _meteorMeteor.Meteor.settings['public'].exportUrl + 'invoice-footer.html'                              // 261
			}, function () {                                                                                                    //
				done();                                                                                                            // 262
			}).pipe(_this2.response);                                                                                           //
		})();                                                                                                                //
		this.done();                                                                                                         // 264
	}                                                                                                                     //
});                                                                                                                    //
                                                                                                                       //
// ServiceConfiguration.configurations.remove({                                                                        //
//     service: 'facebook'                                                                                             //
// });                                                                                                                 //
// ServiceConfiguration.configurations.insert({                                                                        //
//     service: 'facebook',                                                                                            //
//     appId: '832188753584745',                                                                                       //
//     secret: '178fbaf18a80a823a3ad42026ecd8716'                                                                      //
// });                                                                                                                 //
                                                                                                                       //
// function checkOrderStock(order) {                                                                                   //
// 	var mealStock = {};                                                                                                //
// 	for (let bundle of order.bundles) {                                                                                //
// 		for (let mealSelection of bundle.mealSelections) {                                                                //
// 			var currentStock = Meals.findOne({_id:mealSelection.meal._id}).stock;                                            //
// 			if (currentStock < mealSelection.quantity) {                                                                     //
// 				mealStock[mealSelection.meal._id._str] = currentStock;                                                          //
// 			}                                                                                                                //
// 		}                                                                                                                 //
// 	}                                                                                                                  //
// 	if (_.isEmpty(mealStock)) {                                                                                        //
// 		return true;                                                                                                      //
// 	}                                                                                                                  //
// 	else {                                                                                                             //
// 		return mealStock;                                                                                                 //
// 	}                                                                                                                  //
// }                                                                                                                   //
                                                                                                                       //
// function adjustStock(order) {                                                                                       //
// 	for (let bundle of order.bundles) {                                                                                //
// 		for (let mealSelection of bundle.mealSelections) {                                                                //
// 			Meals.update({_id:mealSelection.meal._id}, {$inc:{stock:-mealSelection.quantity}});                              //
// 		}                                                                                                                 //
// 	}                                                                                                                  //
// }                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json",".html",".ts"]});
require("./server/main.js");
//# sourceMappingURL=app.js.map
