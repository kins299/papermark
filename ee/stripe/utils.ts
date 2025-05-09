import Stripe from "stripe";

export function getPlanFromPriceId(
  priceId: string,
  isOldAccount: boolean = false,
) {
  const env =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "production" : "test";
  const accountType = isOldAccount ? "old" : "new";
  return PLANS.find(
    (plan) =>
      plan.price.monthly.priceIds[env][accountType] === priceId ||
      plan.price.yearly.priceIds[env][accountType] === priceId,
  )!;
}

// custom type coercion because Stripe's types are wrong
export function isNewCustomer(
  previousAttributes: Partial<Stripe.Subscription> | undefined,
) {
  let isNewCustomer = false;
  try {
    if (
      // if the user is upgrading from free to pro
      previousAttributes?.default_payment_method === null
    ) {
      isNewCustomer = true;
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
  return isNewCustomer;
}

export function isUpgradedCustomer(
  previousAttributes: Partial<Stripe.Subscription> | undefined,
) {
  let isUpgradedUser = false;
  try {
    if (
      // if user has items in their subscription
      previousAttributes?.items !== undefined
    ) {
      isUpgradedUser = true;
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
  return isUpgradedUser;
}

export const PLANS = [
  {
    name: "Pro",
    slug: "pro",
    minQuantity: 1,
    price: {
      monthly: {
        amount: 29,
        unitPrice: 1950,
        priceIds: {
          test: {
            old: "price_1Q3bcHFJyGSZ96lhElXBA5C1",
            // new: "price_1Q8aUBBYvhH6u7U7LPIVxYpz",
            new: "price_1QvgdNBYvhH6u7U7drrXAXM3", // exp
          },
          production: {
            old: "price_1P3FK4FJyGSZ96lhD67yF3lj",
            // new: "price_1Q8egtBYvhH6u7U7gq1Pbp5Z",
            new: "price_1Qvk3LBYvhH6u7U7JE4V6JY0", // exp
          },
        },
      },
      yearly: {
        amount: 24,
        unitPrice: 1450,
        priceIds: {
          test: {
            old: "price_1Q3bV9FJyGSZ96lhCYWIcmg5",
            // new: "price_1Q8aTkBYvhH6u7U7kUiNTSLX",
            new: "price_1QviTtBYvhH6u7U79PQ2rzMI", // exp
          },
          production: {
            old: "price_1Q3gfNFJyGSZ96lh2jGhEadm",
            // new: "price_1Q8egtBYvhH6u7U7T4ehn7SM",
            new: "price_1Qvk3LBYvhH6u7U7kppryTjV", // exp
          },
        },
      },
    },
  },
  {
    name: "Business",
    slug: "business",
    minQuantity: 3,
    price: {
      monthly: {
        amount: 79,
        unitPrice: 2633,
        priceIds: {
          test: {
            old: "price_1Q3bPhFJyGSZ96lhnxpiJMwz",
            new: "price_1Q8aWlBYvhH6u7U7gTeKJJ0Y",
          },
          production: {
            old: "price_1Q3gbVFJyGSZ96lhf7hsZciQ",
            new: "price_1Q8egwBYvhH6u7U7XKLGjgHL",
          },
        },
      },
      yearly: {
        amount: 59,
        unitPrice: 1967,
        priceIds: {
          test: {
            old: "price_1Q3bQ5FJyGSZ96lhoS8QbYXr",
            new: "price_1Q8aVSBYvhH6u7U72mn6iPfK",
          },
          production: {
            old: "price_1Q3gbVFJyGSZ96lhqqLhBNDv",
            new: "price_1Q8egwBYvhH6u7U7wRU6iPcW",
          },
        },
      },
    },
  },
  {
    name: "Data Rooms",
    slug: "datarooms",
    minQuantity: 3,
    price: {
      monthly: {
        amount: 149,
        unitPrice: 4967,
        priceIds: {
          test: {
            old: "price_1Q3bHPFJyGSZ96lhpQD0lMdU",
            new: "price_1Q8aYLBYvhH6u7U7RUqHnsBh",
          },
          production: {
            old: "price_1Q3gbbFJyGSZ96lhvmEwjZtm",
            new: "price_1Q8egzBYvhH6u7U7IQUGzwoZ",
          },
        },
      },
      yearly: {
        amount: 99,
        unitPrice: 3300,
        priceIds: {
          test: {
            old: "price_1Q3bJUFJyGSZ96lhLiEJlXlt",
            new: "price_1Q8aXWBYvhH6u7U7unPGTnfy",
          },
          production: {
            old: "price_1Q3gbbFJyGSZ96lhnk1CtnIZ",
            new: "price_1Q8egzBYvhH6u7U7M2uoROMa",
          },
        },
      },
    },
  },
  {
    name: "Data Rooms Plus",
    slug: "datarooms-plus",
    minQuantity: 5,
    price: {
      monthly: {
        amount: 349,
        unitPrice: 6980,
        priceIds: {
          test: {
            old: "price_1QojZuFJyGSZ96lhNwiD1y2r",
            new: "price_1Qw63uBYvhH6u7U7dHVZ0kWZ",
          },
          production: {
            old: "price_1QwMmmFJyGSZ96lhhaDXmzkY",
            new: "price_1QwMkABYvhH6u7U74ccUfWkq",
          },
        },
      },
      yearly: {
        amount: 249,
        unitPrice: 4980,
        priceIds: {
          test: {
            old: "price_1QojaPFJyGSZ96lhods9TOxh",
            new: "price_1Qw63ABYvhH6u7U7MXK3UOJF",
          },
          production: {
            old: "price_1QwMmeFJyGSZ96lh934mFNPA",
            new: "price_1QwMjABYvhH6u7U7ccxGJXKN",
          },
        },
      },
    },
  },
];

export const isOldAccount = (plan: string) => {
  return plan.includes("old");
};
