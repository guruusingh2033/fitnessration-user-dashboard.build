import * as _ from 'lodash';
import { today, addDays } from './date';

function round(amount) {
  return parseFloat(amount.toFixed(2));  
}

export function orderFlagged(order, api) {
  for (let bundle of order.bundles) {
    if (api.compareObjectId(bundle.mealPlan._id, api.findOne('mealPlans', {name:'Heavy Duty'})._id) && api.compareObjectId(bundle.portion._id, api.findOne('portions', {name:'For Her'})._id)) {
      return true;
    }
    for (let mealSelection of bundle.mealSelections) {
      if (mealSelection.quantity >= 7) {
        return true;
      }
      if (api.mealStock(mealSelection.meal) < mealSelection.quantity) {
        return true;
      }
    }
  }
  return false;
}

export function orderFulfillmentDays(order, api) {
  if (orderFlagged(order, api)) {
    return 3;
  }
  else {
    return 0;    
  }
}

export function excludeAvailabilityDate(opts) {
  return (date) => {
    if (opts.excludedFulfillmentDates.test(date)) {
      return true;
    }

    var fulfillmentDays = opts.fulfillmentDays();


    var day = today();
    if (new Date().getHours() >= 9) {
      day = addDays(day, 1);
    }

    while (fulfillmentDays) {
      day = addDays(day, 1);
      if (!opts.excludedFulfillmentDates.test(day)) {
        --fulfillmentDays;
      }
    }

    return date < day;
  };
}

export function orderTotalMeals(order: any) {
  return _.reduce(order.bundles, (totalMeals: any, bundle: any) => {
    return totalMeals + _.reduce(bundle.mealSelections, (t, mealSelection: any) => {
      return t + mealSelection.quantity;
    }, 0);
  }, 0);
}


export function bundlePrice(bundle: any): number {
  if (bundle.promotion) {
    var promotionPrice;
    if (bundle.promotion.type == 'discount') {
      promotionPrice = bundle.type.price * (100 - bundle.promotion.discount)/100;
    }
    else if (bundle.promotion.type == 'override') {
      promotionPrice = bundle.promotion.overridePrice;
    }
    return round(promotionPrice);
  }
  else {
    return bundle.type.price;
  } 
}

export function bundleTotal(bundle: any): number {
  var total = bundle.price;
  var totalPremiumMeals = 0;
  for (var mealSelection of bundle.mealSelections) {
    if (mealSelection.meal.grade == 'premium') {
      for (var i = 0; i < mealSelection.quantity; ++ i) {
        totalPremiumMeals++;
        if (totalPremiumMeals > (bundle.promotion && typeof bundle.promotion.premiumAllowance == 'number' ? bundle.promotion.premiumAllowance : bundle.type.premiumMeals)) {
          total += mealSelection.meal.price;
        }        
      }
    }
  }
  for (var allergy of bundle.allergies) {
    if (allergy.action == 'substitute') {
      for (var mealSelection of bundle.mealSelections) {
        if (_.some(mealSelection.meal.allergens, { _id: allergy._id })) {
          total += allergy.surcharge*mealSelection.quantity;
        }
      }
    }
  }
  return round(total);
}

export function orderSubtotal(order: any): number {
  var subtotal = 0;
  var allergyRemovals = {};
  for (var bundle of order.bundles) {
    subtotal += bundle.total;
    for (var allergy of bundle.allergies) {
      if (allergy.action == 'remove') {
        for (var mealSelection of bundle.mealSelections) {
          if (_.some(mealSelection.meal.allergens, {_id:allergy._id})) {
            allergyRemovals[allergy._id] = allergy;
          }
        }
      }
    }
  }
  for (var addOnSelection of order.addOnSelections) {
    subtotal += addOnSelection.addOn.price*addOnSelection.quantity;
  }

  for (var id in allergyRemovals) {
    subtotal += allergyRemovals[id].surcharge;
  }

  return round(subtotal);
}

export function orderTotal(order: any): number {
  var total = order.subtotal + order.deliveryFee;
  return round(total);
}

export function orderLocationSurcharge(order: any, api: any): number {
  for (var locationSurcharge of api.locationSurcharges) {
    if (_.startsWith(order.deliveryOptions.postalCode, locationSurcharge.postalPrefix)) {
      return locationSurcharge.surcharge;
    }
  }
  return 0;
}

export function orderDeliveryFee(order: any, api: any): number {
  if (order.deliveryOptions.selfCollection) {
    return 0;
  }
  var deliveryFee;
  for (let bundle of order.bundles) {
    if (!bundle.type.deliveryFee || (bundle.promotion && !bundle.promotion.deliveryFee)) {
      deliveryFee = 0;
      break;
    }
  }
  if (typeof deliveryFee == 'undefined') {
    if (api.totalMeals(order) >= api.fulfillmentSettings.freeDeliveryThreshold) {
      deliveryFee = 0;
    }
    else {
      deliveryFee = api.fulfillmentSettings.deliveryFee;
    }
  }

  deliveryFee += 'locationSurcharge' in order ? order.locationSurcharge : orderLocationSurcharge(order, api);

  // for (var locationSurcharge of api.locationSurcharges) {
  //   if (_.startsWith(order.deliveryOptions.postalCode, locationSurcharge.postalPrefix)) {
  //     deliveryFee += locationSurcharge.surcharge;
  //     break;
  //   }
  // }

  return deliveryFee;
}