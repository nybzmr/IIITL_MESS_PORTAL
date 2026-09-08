const mongoose = require("mongoose");
const User = require("./User");
const CouponWeek = require("../services/couponWeek");

const BuyerSchema = mongoose.model("buyer", new mongoose.Schema({
    email: { type: String, required: true },
    secret: { type: String, required: true },
    bought: { type: Boolean, default: false },
    thisWeekStart: { type: String, default: null },
    nextWeekStart: { type: String, default: null },
    this: {
        monday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        tuesday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        wednesday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        thursday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        friday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        saturday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        sunday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        }
    },
    next: {
        monday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        tuesday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        wednesday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        thursday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        friday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        saturday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },
        sunday: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        }
    }
}));

function emptyWeek() {
    return {
        monday: { breakfast: false, lunch: false, dinner: false },
        tuesday: { breakfast: false, lunch: false, dinner: false },
        wednesday: { breakfast: false, lunch: false, dinner: false },
        thursday: { breakfast: false, lunch: false, dinner: false },
        friday: { breakfast: false, lunch: false, dinner: false },
        saturday: { breakfast: false, lunch: false, dinner: false },
        sunday: { breakfast: false, lunch: false, dinner: false }
    };
}

function hasCoupons(week) {
    return Object.values(week || {}).some((day) =>
        Object.values(day || {}).some(Boolean)
    );
}

async function synchronizeCouponWeeks(email) {
    const buyer = await BuyerSchema.findOne({ email });
    if (!buyer) return null;

    const weeks = CouponWeek.getCouponWeeks();
    const blankWeek = emptyWeek();
    let thisWeek = buyer.this || blankWeek;
    let nextWeek = buyer.next || blankWeek;
    let thisWeekStart = buyer.thisWeekStart;
    let nextWeekStart = buyer.nextWeekStart;

    // Documents created before week keys existed cannot be assigned safely, so expire them.
    if (!thisWeekStart && !nextWeekStart) {
        thisWeek = blankWeek;
        nextWeek = blankWeek;
        thisWeekStart = weeks.current.start;
        nextWeekStart = null;
    } else {
        if (nextWeekStart === weeks.current.start) {
            thisWeek = nextWeek;
            thisWeekStart = weeks.current.start;
            nextWeek = blankWeek;
            nextWeekStart = null;
        } else if (thisWeekStart !== weeks.current.start) {
            thisWeek = blankWeek;
            thisWeekStart = weeks.current.start;
        }

        if (nextWeekStart !== weeks.next.start) {
            nextWeek = blankWeek;
            nextWeekStart = null;
        }
    }

    const bought = nextWeekStart === weeks.next.start && hasCoupons(nextWeek);
    await BuyerSchema.updateOne(
        { _id: buyer._id },
        { this: thisWeek, next: nextWeek, thisWeekStart, nextWeekStart, bought }
    );
    return await BuyerSchema.findById(buyer._id).select({ _id: 0 });
}

// Get the user details 
module.exports.getBuyer = async function (email) {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let randomStr = "";
    for (let i = 0; i < 4; i++)
        randomStr += charset[Math.floor(Math.random() * charset.length)];

    const Buyer = await BuyerSchema.findOneAndUpdate(
        { email: email },
        {
            $setOnInsert: {
                bought: false,
                secret: randomStr,
                this: {
                    monday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    tuesday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    wednesday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    thursday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    friday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    saturday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    sunday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    }
                },
                next: {
                    monday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    tuesday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    wednesday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    thursday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    friday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    saturday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    },
                    sunday: {
                        breakfast: false,
                        lunch: false,
                        dinner: false
                    }
                }
            }
        },
        { new: true, upsert: true }
    ).select({ _id: 0 });
    return await synchronizeCouponWeeks(email) || Buyer;
}

// Resets the user secret 
module.exports.resetSecret = async function (email) {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let randomStr = "";
    for (let i = 0; i < 4; i++)
        randomStr += charset[Math.floor(Math.random() * charset.length)];

    const Buyer = await BuyerSchema.findOneAndUpdate(
        { email: email },
        { secret: randomStr }).select({ _id: 0 });
    return Buyer;
}

// Check if the user's coupon is valid 
module.exports.checkCoupon = async function (data) {
    await synchronizeCouponWeeks(data.email);
    const Buyer = await BuyerSchema.findOne({ email: data.email, secret: data.secret });
    if (Buyer == null) return false;
    if (Buyer.this[data.day][data.type]) {
        await BuyerSchema.updateOne({ email: data.email }, { ["this." + data.day + "." + data.type]: false });
        return true;
    }
    return false;
}

// Save the purchased coupons 
module.exports.saveOrder = async function (email, data) {
    await module.exports.getBuyer(email);
    const weeks = CouponWeek.getCouponWeeks();
    const result = await BuyerSchema.updateOne(
        { email, nextWeekStart: { $ne: weeks.next.start } },
        { next: data, nextWeekStart: weeks.next.start, bought: true }
    );
    return result.modifiedCount === 1;
}

// Check if the user has already bought the coupons for the coming week
module.exports.boughtNextWeek = async function (email) {
    const buyer = await module.exports.getBuyer(email);
    const weeks = CouponWeek.getCouponWeeks();
    return {
        bought: buyer.bought && buyer.nextWeekStart === weeks.next.start,
        period: weeks.next,
    };
}

// Returns details of all the users
module.exports.allBuyers = async function () {
    const Buyers = await BuyerSchema.find({});
    return Buyers;
}

// Returns registered users who have not bought coupons for the coming week.
module.exports.usersMissingNextWeekCoupon = async function () {
    await module.exports.rolloverWeek();
    const boughtEmails = await BuyerSchema.distinct("email", { bought: true });
    return await User.find({ email: { $nin: boughtEmails } })
        .select({ _id: 0, displayName: 1, email: 1 });
}

// Move purchased next-week coupons into the active week and clear next-week state.
module.exports.rolloverWeek = async function () {
    const buyers = await BuyerSchema.find({});
    for (const buyer of buyers) {
        await synchronizeCouponWeeks(buyer.email);
    }

    return buyers.length;
}
