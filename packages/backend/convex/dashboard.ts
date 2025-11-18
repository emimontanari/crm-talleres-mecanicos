import { query } from "./_generated/server";

export const getStats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const orgId = identity.orgId as string;
    if (!orgId) throw new Error("No pertenece a una organización");

    // Órdenes activas
    const activeOrders = await ctx.db
      .query("workOrders")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("status"), "in_progress")
        )
      )
      .collect();

    // Citas de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointmentsToday = await ctx.db
      .query("appointments")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .filter((q) =>
        q.and(
          q.gte(q.field("scheduledDate"), today.getTime()),
          q.lt(q.field("scheduledDate"), tomorrow.getTime()),
          q.or(
            q.eq(q.field("status"), "scheduled"),
            q.eq(q.field("status"), "confirmed")
          )
        )
      )
      .collect();

    // Clientes totales
    const totalCustomers = await ctx.db
      .query("customers")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Ingresos del mes
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthlyInvoices = await ctx.db
      .query("invoices")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .filter((q) =>
        q.and(
          q.gte(q.field("createdAt"), monthStart.getTime()),
          q.eq(q.field("status"), "paid")
        )
      )
      .collect();

    const monthlyRevenue = monthlyInvoices.reduce((sum, inv) => sum + inv.total, 0);

    return {
      activeOrders: activeOrders.length,
      appointmentsToday: appointmentsToday.length,
      totalCustomers: totalCustomers.length,
      monthlyRevenue,
    };
  },
});
