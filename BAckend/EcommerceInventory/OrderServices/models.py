from django.db import models

from ProductServices.models import Products
from UserServices.models import Users


class PurchaseOrder(models.Model):
    id = models.AutoField(primary_key=True)
    warehouse_id = models.ForeignKey(
        "InventoryServices.Warehouse",
        on_delete=models.CASCADE,
        related_name="warehouse_id",
    )
    supplier_id = models.ForeignKey(
        Users, on_delete=models.CASCADE, related_name="supplier_id"
    )
    po_code = models.CharField(max_length=255)
    po_date = models.DateTimeField()
    expected_delivery_date = models.DateTimeField()
    payment_terms = models.CharField(
        max_length=255,
        choices=[
            ("CASH", "CASH"),
            ("CREDIT", "CREDIT"),
            ("ONLINE", "ONLINE"),
            ("CHEQUE", "CHEQUE"),
        ],
        default="CASH",
    )
    payment_status = models.CharField(
        max_length=255,
        choices=[
            ("PAID", "PAID"),
            ("UNPAID", "UNPAID"),
            ("PARTIAL PAID", "PARTIAL PAID"),
            ("CANCELLED", "CANCELLED"),
        ],
        default="UNPAID",
    )
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_type = models.CharField(
        max_length=255,
        choices=[
            ("PERCENTAGE", "PERCENTAGE"),
            ("AMOUNT", "AMOUNT"),
            ("NO DISCOUNT", "NO DISCOUNT"),
            ("ITEM DISCOUNT", "ITEM DISCOUNT"),
        ],
        default="NO DISCOUNT",
    )
    additional_details = models.JSONField()
    status = models.CharField(
        max_length=255,
        choices=[
            ("DRAFT", "DRAFT"),
            ("CREATED", "CREATED"),
            ("APPROVED", "APPROVED"),
            ("SENT", "SENT"),
            ("RECEIVED", "RECEIVED"),
            ("PARTIAL RECEIVED", "PARTIAL RECEIVED"),
            ("CANCELLED", "CANCELLED"),
            ("RETURNED", "RETURNED"),
            ("COMPLETE", "COMPLETE"),
        ],
        default="DRAFT",
    )
    created_by_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="created_by_user_id_purchase_order",
    )
    updated_by_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="updated_by_user_id_purchase_order",
    )
    domain_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="domain_user_id_purchase_order",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    approved_by_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="approved_by_user_id_purchase_order",
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    cancelled_by_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="cancelled_by_user_id_purchase_order",
    )
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancelled_reason = models.TextField(null=True, blank=True)

    def defaultkey():
        return "po_code"


class PurchaseOrderItems(models.Model):
    id = models.AutoField(primary_key=True)
    po_id = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="po_id_purchase_order_items",
    )
    product_id = models.ForeignKey(
        Products,
        on_delete=models.CASCADE,
        related_name="product_id_purchase_order_items",
    )
    quantity_ordered = models.IntegerField(default=0)
    quantity_received = models.IntegerField(default=0)
    quantity_cancelled = models.IntegerField(default=0)
    quantity_returned = models.IntegerField(default=0)
    buying_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount_returned = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount_cancelled = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount_ordered = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_percentage = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_type = models.CharField(
        max_length=255,
        choices=[
            ("PERCENTAGE", "PERCENTAGE"),
            ("AMOUNT", "AMOUNT"),
            ("NO DISCOUNT", "NO DISCOUNT"),
        ],
        default="PERCENTAGE",
    )
    additional_details = models.JSONField()
    domain_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="domain_user_id_purchase_order_items",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class PurchaseOrderInwardedLog(models.Model):
    id = models.AutoField(primary_key=True)
    po_id = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="po_item_id",
    )
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    invoice_path = models.JSONField()
    invoice_number = models.CharField(max_length=255)
    notes = models.TextField()
    inwarded_by_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="inwarded_by_user_id_purchase_order_items_inwarded_log",
    )
    inwarded_at = models.DateTimeField()
    additional_details = models.JSONField()
    status = models.CharField(
        max_length=255,
        choices=[
            ("RECEIVED", "RECEIVED"),
            ("RETURNED", "RETURNED"),
            ("ROLLEDBACK", "ROLLEDBACK"),
        ],
        default="RECEIVED",
    )
    domain_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="domain_user_id_inwarded_log",
    )
    shipping_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_type = models.CharField(
        max_length=255, choices=[("FREE", "FREE"), ("PAID", "PAID")], default="FREE"
    )
    shipping_tax_percentage = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    shipping_cancelled_type = models.CharField(
        max_length=255, choices=[("FREE", "FREE"), ("PAID", "PAID")], default="FREE"
    )
    shipping_cancelled_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    shipping_cancelled_tax_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    received_by_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="received_by_user_id_purchase_order",
    )
    received_at = models.DateTimeField(null=True, blank=True)
    returned_by_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="returned_by_user_id_purchase_order",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class PurchaseOrderItemInwardedLog(models.Model):
    id = models.AutoField(primary_key=True)
    po_item_id = models.ForeignKey(
        PurchaseOrderItems,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="po_item_id_inwarded_log",
    )
    po_inward_id = models.ForeignKey(
        PurchaseOrderInwardedLog,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="po_item_id_inwarded_log_po_inwarded",
    )
    inwarded_quantity = models.IntegerField()
    buy_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sell_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_percentage = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_type = models.CharField(
        max_length=255,
        choices=[
            ("PERCENTAGE", "PERCENTAGE"),
            ("AMOUNT", "AMOUNT"),
            ("NO DISCOUNT", "NO DISCOUNT"),
        ],
        default="NO DISCOUNT",
    )
    shipping_type = models.CharField(
        max_length=255, choices=[("FREE", "FREE"), ("PAID", "PAID")], default="FREE"
    )
    shipping_amount = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_tax_percentage = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_cancelled_type = models.CharField(
        max_length=255, choices=[("FREE", "FREE"), ("PAID", "PAID")], default="FREE"
    )
    shipping_cancelled_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    shipping_cancelled_tax_percentage = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    additional_details = models.JSONField()
    status = models.CharField(
        max_length=255,
        choices=[
            ("RECEIVED", "RECEIVED"),
            ("ROLLEDBACK", "ROLLEDBACK"),
            ("RETURNED", "RETURNED"),
        ],
        default="RECEIVED",
    )
    domain_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="domain_user_purcahse_order_id_inwarded_log",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class PurchaseOrderLogs(models.Model):
    id = models.AutoField(primary_key=True)
    po_id = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="po_id_purchase_order_logs",
    )
    comment = models.TextField()
    additional_details = models.JSONField()
    created_by_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="created_by_user_id_purchase_order_logs",
    )
    domain_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="domain_user_id_purchase_order_logs",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class SalesOrder(models.Model):
    id = models.AutoField(primary_key=True)
    customer_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="supplier_id_sales_order",
    )
    last_updated_by_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="last_updated_by_user_id_sales_order",
    )
    so_code = models.CharField(max_length=255)
    so_date = models.DateTimeField()
    expected_delivery_date = models.DateTimeField()
    payment_terms = models.CharField(
        max_length=255,
        choices=[
            ("CASH", "CASH"),
            ("CREDIT", "CREDIT"),
            ("ONLINE", "ONLINE"),
            ("CHEQUE", "CHEQUE"),
        ],
        default="CASH",
    )
    payment_status = models.CharField(
        max_length=255,
        choices=[
            ("PAID", "PAID"),
            ("UNPAID", "UNPAID"),
            ("PARTIAL PAID", "PARTIAL PAID"),
            ("CANCELLED", "CANCELLED"),
        ],
        default="UNPAID",
    )
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_type = models.CharField(
        max_length=255,
        choices=[
            ("PERCENTAGE", "PERCENTAGE"),
            ("AMOUNT", "AMOUNT"),
            ("NO DISCOUNT", "NO DISCOUNT"),
            ("ITEM DISCOUNT", "ITEM DISCOUNT"),
        ],
        default="PERCENTAGE",
    )
    shipping_amount = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_type = models.CharField(
        max_length=255, choices=[("FREE", "FREE"), ("PAID", "PAID")], default="FREE"
    )
    shipping_tax_percentage = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_cancelled_type = models.CharField(
        max_length=255, choices=[("FREE", "FREE"), ("PAID", "PAID")], default="FREE"
    )
    shipping_cancelled_amount = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_cancelled_tax_amount = models.DecimalField(max_digits=10, decimal_places=2)
    additional_details = models.JSONField()
    status = models.CharField(
        max_length=255,
        choices=[
            ("DRAFT", "DRAFT"),
            ("SENT", "SENT"),
            ("DELIVERED", "DELIVERED"),
            ("PARTIAL DELIVERED", "PARTIAL DELIVERED"),
            ("CANCELLED", "CANCELLED"),
            ("RETURNED", "RETURNED"),
            ("COMPLETED", "COMPLETED"),
        ],
        default="DRAFT",
    )
    created_by_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="created_by_user_id_sales_order",
    )
    updated_by_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="updated_by_user_id_sales_order",
    )
    domain_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="domain_user_id_sales_order",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    approved_by_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="approved_by_user_id_sales_order",
    )
    approved_at = models.DateTimeField()
    cancelled_by_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="cancelled_by_user_id_sales_order",
    )
    cancelled_at = models.DateTimeField()
    cancelled_reason = models.TextField()


class SalesOrderOrderItems(models.Model):
    id = models.AutoField(primary_key=True)
    so_id = models.ForeignKey(
        SalesOrder,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="so_id_so_order_items",
    )
    product_id = models.ForeignKey(
        Products,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="product_id_so_order_items",
    )
    quantity_ordered = models.IntegerField()
    quantity_delivered = models.IntegerField()
    quantity_shipped = models.IntegerField()
    quantity_cancelled = models.IntegerField()
    quantity_returned = models.IntegerField()
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    tax_percentage = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    amount_returned = models.DecimalField(max_digits=10, decimal_places=2)
    amount_cancelled = models.DecimalField(max_digits=10, decimal_places=2)
    amount_ordered = models.DecimalField(max_digits=10, decimal_places=2)
    tax_percentage = models.DecimalField(max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_type = models.CharField(
        max_length=255,
        choices=[("PERCENTAGE", "PERCENTAGE"), ("AMOUNT", "AMOUNT")],
        default="PERCENTAGE",
    )
    additional_details = models.JSONField()
    domain_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="domain_user_id_so_order_items",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class SalesOrderOutWardedLog(models.Model):
    id = models.AutoField(primary_key=True)
    so_id = models.ForeignKey(
        SalesOrder,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="so_order_id_outwarded_log",
    )
    invoice_path = models.JSONField()
    invoice_number = models.CharField(max_length=255)
    notes = models.TextField()
    outwarded_by_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="outwarded_by_user_id_so_order_items_outwarded_log",
    )
    outwared_at = models.DateTimeField()
    additional_details = models.JSONField()
    status = models.CharField(
        max_length=255,
        choices=[
            ("DELIVERED", "DELIVERED"),
            ("RETURNED", "RETURNED"),
            ("ROLLEDBACK", "ROLLEDBACK"),
        ],
        default="DELIVERED",
    )
    shipping_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_type = models.CharField(
        max_length=255, choices=[("FREE", "FREE"), ("PAID", "PAID")], default="FREE"
    )
    shipping_tax_percentage = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    shipping_cancelled_type = models.CharField(
        max_length=255, choices=[("FREE", "FREE"), ("PAID", "PAID")], default="FREE"
    )
    shipping_cancelled_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    shipping_cancelled_tax_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    send_by_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="send_by_user_id_purchase_order",
    )
    send_at = models.DateTimeField(null=True, blank=True)
    returned_by_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="returned_by_user_id_sales_order",
    )
    returned_at = models.DateTimeField(null=True, blank=True)
    domain_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="domain_user_id_outwarded_log",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class SalesOrderItemOutwardedLog(models.Model):
    id = models.AutoField(primary_key=True)
    so_item_id = models.ForeignKey(
        SalesOrderOrderItems,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="so_item_id_outwarded_log",
    )
    so_outwarded_id = models.ForeignKey(
        SalesOrderOutWardedLog,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="so_item_id_outwarded_log_outwarded_id",
    )
    outwarded_quantity = models.IntegerField()
    buy_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sell_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_percentage = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_type = models.CharField(
        max_length=255,
        choices=[
            ("PERCENTAGE", "PERCENTAGE"),
            ("AMOUNT", "AMOUNT"),
            ("NO DISCOUNT", "NO DISCOUNT"),
        ],
        default="NO DISCOUNT",
    )
    shipping_amount = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_tax_percentage = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_type = models.CharField(
        max_length=255, choices=[("FREE", "FREE"), ("PAID", "PAID")], default="FREE"
    )
    shipping_cancelled_type = models.CharField(
        max_length=255, choices=[("FREE", "FREE"), ("PAID", "PAID")], default="FREE"
    )
    shipping_cancelled_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    shipping_cancelled_tax_percentage = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    additional_details = models.JSONField()
    status = models.CharField(
        max_length=255,
        choices=[
            ("DELIVERED", "DELIVERED"),
            ("ROLLEDBACK", "ROLLEDBACK"),
            ("RETURNED", "RETURNED"),
        ],
        default="DELIVERED",
    )
    domain_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="domain_user_sales_order_id_outwarded_log",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class SalesOrderLogs(models.Model):
    id = models.AutoField(primary_key=True)
    so_id = models.ForeignKey(
        SalesOrder,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="so_id_sales_order_logs",
    )
    comment = models.TextField()
    created_by_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="created_by_user_id_sales_order_logs",
    )
    domain_user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="domain_user_id_sales_order_logs",
    )
    additional_details = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
