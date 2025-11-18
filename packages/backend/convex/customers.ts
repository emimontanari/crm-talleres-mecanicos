import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ==================== QUERIES ====================

export const list = query({
  args: {
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const orgId = identity.orgId as string;
    if (!orgId) throw new Error("No pertenece a una organización");

    let customers = await ctx.db
      .query("customers")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Búsqueda local
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.firstName.toLowerCase().includes(searchLower) ||
          c.lastName.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.phone.includes(args.search!)
      );
    }

    // Paginación
    const offset = args.offset || 0;
    const limit = args.limit || 50;
    const paginatedCustomers = customers.slice(offset, offset + limit);

    return {
      customers: paginatedCustomers,
      total: customers.length,
      hasMore: offset + limit < customers.length,
    };
  },
});

export const getById = query({
  args: { id: v.id("customers") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const customer = await ctx.db.get(args.id);
    if (!customer) throw new Error("Cliente no encontrado");

    const orgId = identity.orgId as string;
    if (customer.organizationId !== orgId) {
      throw new Error("No autorizado");
    }

    return customer;
  },
});

// ==================== MUTATIONS ====================

export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const orgId = identity.orgId as string;
    if (!orgId) throw new Error("No pertenece a una organización");

    // Validar email único
    const existingByEmail = await ctx.db
      .query("customers")
      .withIndex("by_email", (q) =>
        q.eq("organizationId", orgId).eq("email", args.email)
      )
      .first();

    if (existingByEmail) {
      throw new Error("Ya existe un cliente con ese email");
    }

    const now = Date.now();

    const customerId = await ctx.db.insert("customers", {
      organizationId: orgId,
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return customerId;
  },
});

export const update = mutation({
  args: {
    id: v.id("customers"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const { id, ...updates } = args;

    const customer = await ctx.db.get(id);
    if (!customer) throw new Error("Cliente no encontrado");

    const orgId = identity.orgId as string;
    if (customer.organizationId !== orgId) {
      throw new Error("No autorizado");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("customers") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const customer = await ctx.db.get(args.id);
    if (!customer) throw new Error("Cliente no encontrado");

    const orgId = identity.orgId as string;
    if (customer.organizationId !== orgId) {
      throw new Error("No autorizado");
    }

    await ctx.db.patch(args.id, {
      isActive: false,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});
