import type { Customer } from "../models/customer.js";

type Ctx = {
  models: { Customer: typeof Customer };
};

export const resolvers = {
  Customer: {
    cCustomerSk(parent: Customer) {
      return String(parent.cCustomerSk);
    },
  },
  Query: {
    async customers(_: unknown, args: { limit?: number }, ctx: Ctx) {
      const limit = Math.min(Math.max(args.limit ?? 5, 1), 50);
      return ctx.models.Customer.findAll({
        limit,
        order: [["cCustomerSk", "ASC"]],
        raw: true,
      });
    },
    async customerHealth(_: unknown, __: unknown, ctx: Ctx) {
      await ctx.models.Customer.findOne({
        attributes: ["cCustomerSk"],
        raw: true,
      });
      return "ok";
    },
  },
};
