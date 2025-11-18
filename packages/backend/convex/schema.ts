import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ==================== CLIENTES ====================
  customers: defineTable({
    organizationId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    notes: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_email", ["organizationId", "email"])
    .index("by_phone", ["organizationId", "phone"])
    .searchIndex("search_customers", {
      searchField: "firstName",
      filterFields: ["organizationId"],
    }),

  // ==================== VEHÍCULOS ====================
  vehicles: defineTable({
    organizationId: v.string(),
    customerId: v.id("customers"),
    brand: v.string(),
    model: v.string(),
    year: v.number(),
    licensePlate: v.string(),
    vin: v.optional(v.string()),
    color: v.optional(v.string()),
    engineType: v.optional(v.string()),
    transmission: v.optional(v.string()),
    mileage: v.number(),
    lastServiceDate: v.optional(v.number()),
    nextServiceDue: v.optional(v.number()),
    notes: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_customer", ["customerId"])
    .index("by_license_plate", ["organizationId", "licensePlate"])
    .searchIndex("search_vehicles", {
      searchField: "licensePlate",
      filterFields: ["organizationId"],
    }),

  // ==================== CITAS ====================
  appointments: defineTable({
    organizationId: v.string(),
    customerId: v.id("customers"),
    vehicleId: v.id("vehicles"),
    scheduledDate: v.number(),
    duration: v.number(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("confirmed"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show")
    ),
    serviceType: v.string(),
    description: v.optional(v.string()),
    assignedMechanicId: v.optional(v.id("mechanics")),
    reminderSent: v.boolean(),
    reminderSentAt: v.optional(v.number()),
    cancellationReason: v.optional(v.string()),
    createdBy: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_customer", ["customerId"])
    .index("by_vehicle", ["vehicleId"])
    .index("by_date", ["organizationId", "scheduledDate"])
    .index("by_status", ["organizationId", "status"])
    .index("by_mechanic", ["assignedMechanicId", "scheduledDate"]),

  // ==================== ÓRDENES DE TRABAJO ====================
  workOrders: defineTable({
    organizationId: v.string(),
    appointmentId: v.optional(v.id("appointments")),
    customerId: v.id("customers"),
    vehicleId: v.id("vehicles"),
    orderNumber: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("waiting_parts"),
      v.literal("completed"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    ),
    mileageIn: v.number(),
    mileageOut: v.optional(v.number()),
    assignedMechanicId: v.optional(v.id("mechanics")),
    estimatedCost: v.number(),
    finalCost: v.optional(v.number()),
    estimatedTime: v.number(),
    actualTime: v.optional(v.number()),
    description: v.string(),
    diagnosis: v.optional(v.string()),
    customerNotes: v.optional(v.string()),
    mechanicNotes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    deliveredAt: v.optional(v.number()),
    createdBy: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_customer", ["customerId"])
    .index("by_vehicle", ["vehicleId"])
    .index("by_status", ["organizationId", "status"])
    .index("by_order_number", ["organizationId", "orderNumber"])
    .searchIndex("search_orders", {
      searchField: "orderNumber",
      filterFields: ["organizationId"],
    }),

  // ==================== SERVICIOS ====================
  workOrderServices: defineTable({
    organizationId: v.string(),
    workOrderId: v.id("workOrders"),
    serviceName: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    quantity: v.number(),
    unitPrice: v.number(),
    discount: v.optional(v.number()),
    tax: v.optional(v.number()),
    totalPrice: v.number(),
    isCompleted: v.boolean(),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_work_order", ["workOrderId"]),

  // ==================== INVENTARIO ====================
  inventoryItems: defineTable({
    organizationId: v.string(),
    partNumber: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    brand: v.optional(v.string()),
    supplier: v.optional(v.string()),
    currentStock: v.number(),
    minStock: v.number(),
    maxStock: v.optional(v.number()),
    unitCost: v.number(),
    sellingPrice: v.number(),
    location: v.optional(v.string()),
    barcode: v.optional(v.string()),
    isActive: v.boolean(),
    lastRestockDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_part_number", ["organizationId", "partNumber"])
    .index("by_category", ["organizationId", "category"])
    .index("by_low_stock", ["organizationId", "currentStock"])
    .searchIndex("search_parts", {
      searchField: "name",
      filterFields: ["organizationId"],
    }),

  // ==================== USO DE PIEZAS ====================
  inventoryUsage: defineTable({
    organizationId: v.string(),
    workOrderId: v.id("workOrders"),
    inventoryItemId: v.id("inventoryItems"),
    partNumber: v.string(),
    partName: v.string(),
    quantity: v.number(),
    unitCost: v.number(),
    sellingPrice: v.number(),
    totalCost: v.number(),
    usedBy: v.string(),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_work_order", ["workOrderId"])
    .index("by_inventory_item", ["inventoryItemId"])
    .index("by_date", ["organizationId", "createdAt"]),

  // ==================== MECÁNICOS ====================
  mechanics: defineTable({
    organizationId: v.string(),
    userId: v.optional(v.string()),
    employeeNumber: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    specialty: v.optional(v.string()),
    certification: v.optional(v.string()),
    hourlyRate: v.optional(v.number()),
    hireDate: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_user", ["userId"])
    .index("by_employee_number", ["organizationId", "employeeNumber"]),

  // ==================== FACTURAS ====================
  invoices: defineTable({
    organizationId: v.string(),
    workOrderId: v.id("workOrders"),
    customerId: v.id("customers"),
    invoiceNumber: v.string(),
    subtotal: v.number(),
    discount: v.number(),
    tax: v.number(),
    total: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("partially_paid"),
      v.literal("overdue"),
      v.literal("cancelled")
    ),
    dueDate: v.number(),
    paidDate: v.optional(v.number()),
    paidAmount: v.optional(v.number()),
    paymentMethod: v.optional(v.string()),
    paymentReference: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdBy: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_work_order", ["workOrderId"])
    .index("by_customer", ["customerId"])
    .index("by_status", ["organizationId", "status"])
    .index("by_invoice_number", ["organizationId", "invoiceNumber"])
    .searchIndex("search_invoices", {
      searchField: "invoiceNumber",
      filterFields: ["organizationId"],
    }),

  // ==================== HISTORIAL DE SERVICIOS ====================
  serviceHistory: defineTable({
    organizationId: v.string(),
    vehicleId: v.id("vehicles"),
    workOrderId: v.id("workOrders"),
    serviceDate: v.number(),
    mileage: v.number(),
    serviceSummary: v.string(),
    servicesPerformed: v.array(v.string()),
    partsReplaced: v.array(v.string()),
    cost: v.number(),
    mechanicId: v.optional(v.id("mechanics")),
    nextServiceDue: v.optional(v.number()),
    nextServiceMileage: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_vehicle", ["vehicleId"])
    .index("by_date", ["vehicleId", "serviceDate"]),

  // ==================== WEBHOOKS n8n ====================
  n8nWebhooks: defineTable({
    organizationId: v.string(),
    webhookType: v.union(
      v.literal("appointment_reminder"),
      v.literal("appointment_confirmation"),
      v.literal("low_stock_alert"),
      v.literal("order_completed"),
      v.literal("order_ready"),
      v.literal("invoice_sent"),
      v.literal("payment_reminder"),
      v.literal("feedback_request")
    ),
    webhookUrl: v.string(),
    isActive: v.boolean(),
    lastTriggered: v.optional(v.number()),
    triggerCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_type", ["organizationId", "webhookType"]),

  // ==================== CONFIGURACIÓN ====================
  organizationSettings: defineTable({
    organizationId: v.string(),
    workshopName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    taxId: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    currency: v.string(),
    timezone: v.string(),
    appointmentSlotDuration: v.number(),
    autoConfirmAppointments: v.boolean(),
    sendRemindersBefore: v.number(),
    lowStockThreshold: v.optional(v.number()),
    invoiceDueDays: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_organization", ["organizationId"]),

  // ==================== NOTIFICACIONES ====================
  notifications: defineTable({
    organizationId: v.string(),
    userId: v.string(),
    type: v.union(
      v.literal("appointment_created"),
      v.literal("appointment_updated"),
      v.literal("order_completed"),
      v.literal("low_stock"),
      v.literal("payment_received"),
      v.literal("overdue_invoice")
    ),
    title: v.string(),
    message: v.string(),
    relatedId: v.optional(v.string()),
    isRead: v.boolean(),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId", "isRead"])
    .index("by_organization", ["organizationId", "createdAt"]),
});
