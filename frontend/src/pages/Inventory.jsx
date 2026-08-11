import { useEffect, useState } from "react";
import { Package, Plus, Edit2, Trash2, AlertTriangle, CheckCircle2, AlertCircle, Loader2, DollarSign, X } from "lucide-react";
import { getItems, createItem, updateItem, deleteItem } from "../services/inventory";

const LOW_STOCK_THRESHOLD = 5;

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const loadInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getItems();
      setItems(data || []);
    } catch (err) {
      setError(err.message || "Failed to load inventory items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setProductName("");
    setQuantity("");
    setCostPrice("");
    setSellingPrice("");
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setProductName(item.product_name || "");
    setQuantity(String(item.quantity !== undefined ? item.quantity : 0));
    setCostPrice(String(item.cost_price !== undefined ? item.cost_price : 0));
    setSellingPrice(String(item.selling_price !== undefined ? item.selling_price : 0));
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const name = productName.trim();
    const qty = parseInt(quantity, 10);
    const cost = parseFloat(costPrice);
    const selling = parseFloat(sellingPrice);

    if (!name) {
      setError("Please enter a product name.");
      return;
    }
    if (isNaN(qty) || qty < 0) {
      setError("Please enter a valid non-negative integer for quantity.");
      return;
    }
    if (isNaN(cost) || cost < 0) {
      setError("Please enter a valid non-negative number for cost price.");
      return;
    }
    if (isNaN(selling) || selling < 0) {
      setError("Please enter a valid non-negative number for selling price.");
      return;
    }

    setSaving(true);
    const payload = {
      product_name: name,
      quantity: qty,
      cost_price: cost,
      selling_price: selling,
    };

    try {
      if (editingId) {
        const updated = await updateItem(editingId, payload);
        setItems((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
        setSuccessMsg(`"${updated.product_name}" updated successfully!`);
      } else {
        const created = await createItem(payload);
        setItems((prev) => [created, ...prev]);
        setSuccessMsg(`"${created.product_name}" added to inventory!`);
      }
      resetForm();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message || "Failed to save inventory item.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
      return;
    }
    setDeletingId(id);
    setError(null);
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) {
        resetForm();
      }
      setSuccessMsg(`"${name}" deleted successfully.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message || "Failed to delete item.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  const lowStockCount = items.filter((i) => i.quantity < LOW_STOCK_THRESHOLD).length;
  const totalQuantity = items.reduce((acc, i) => acc + (i.quantity || 0), 0);

  return (
    <div className="max-w-6xl mx-auto py-4 px-2 sm:px-4">
      {/* Header */}
      <header className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gold-light)] text-[var(--gold-dark)] shadow-sm">
          <Package size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl tracking-tight">Inventory Tracker</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Monitor product stock quantities, unit costs, selling prices, and low-stock alerts.
          </p>
        </div>
      </header>

      {/* Notifications */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-fade-in-up">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 animate-fade-in-up">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Total Products</p>
          <p className="mt-2 text-2xl font-bold text-[var(--text)]">{items.length}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">Unique items tracked</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Low Stock Alerts</p>
          <div className="mt-2 flex items-center gap-2">
            <p className={`text-2xl font-bold ${lowStockCount > 0 ? "text-amber-600" : "text-emerald-600"}`}>
              {lowStockCount}
            </p>
            {lowStockCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                <AlertTriangle size={12} /> &lt; 5 units
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">Items below threshold ({LOW_STOCK_THRESHOLD})</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Total Units in Stock</p>
          <p className="mt-2 text-2xl font-bold text-[var(--text)]">{totalQuantity}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">Aggregate unit inventory</p>
        </div>
      </div>

      {/* Form (Add or Edit) */}
      <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text)]">
              {editingId ? "Edit Product" : "Add Product to Inventory"}
            </h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {editingId ? "Modify product details and stock level below." : "Enter product details to start tracking stock."}
            </p>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] px-3 py-1.5 rounded-lg border border-[var(--border)] transition-colors"
            >
              <X size={14} /> Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="product_name" className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="product_name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Wireless Mouse"
                className="block w-full rounded-xl border border-[var(--border)] bg-[#FAF7F0]/40 px-3.5 py-2 text-sm font-medium text-[var(--text)] focus:border-[var(--gold)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--gold)] transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Quantity in Stock *
              </label>
              <input
                type="number"
                id="quantity"
                min="0"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="block w-full rounded-xl border border-[var(--border)] bg-[#FAF7F0]/40 px-3.5 py-2 text-sm font-medium text-[var(--text)] focus:border-[var(--gold)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--gold)] transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="cost_price" className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Cost Price ($) *
              </label>
              <input
                type="number"
                id="cost_price"
                min="0"
                step="any"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="0.00"
                className="block w-full rounded-xl border border-[var(--border)] bg-[#FAF7F0]/40 px-3.5 py-2 text-sm font-medium text-[var(--text)] focus:border-[var(--gold)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--gold)] transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="selling_price" className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Selling Price ($) *
              </label>
              <input
                type="number"
                id="selling_price"
                min="0"
                step="any"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="0.00"
                className="block w-full rounded-xl border border-[var(--border)] bg-[#FAF7F0]/40 px-3.5 py-2 text-sm font-medium text-[var(--text)] focus:border-[var(--gold)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--gold)] transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-[var(--gold)] disabled:opacity-50 transition-all"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{editingId ? "Updating..." : "Saving..."}</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 text-[var(--gold)]" />
                  <span>{editingId ? "Update Product" : "Add Product"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Inventory Items Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text)]">Stock List</h2>
          <span className="text-xs font-medium text-[var(--muted)]">
            {items.length} {items.length === 1 ? "item" : "items"} total
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--gold)] mb-3" />
            <p className="text-sm text-[var(--muted)] font-medium">Loading inventory items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--section)] text-[var(--muted)] mb-3">
              <Package size={20} />
            </div>
            <h3 className="text-base font-semibold text-[var(--text)]">No Products in Inventory</h3>
            <p className="mt-1 text-sm text-[var(--muted)] max-w-sm mx-auto">
              Add your first product using the form above to track stock levels and profits.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF7F0] text-xs font-semibold uppercase tracking-wider text-[var(--muted)] border-b border-[var(--border)]">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Product Name</th>
                  <th scope="col" className="px-6 py-3.5">Quantity</th>
                  <th scope="col" className="px-6 py-3.5">Cost Price</th>
                  <th scope="col" className="px-6 py-3.5">Selling Price</th>
                  <th scope="col" className="px-6 py-3.5">Profit / Unit</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {items.map((item) => {
                  const isLowStock = item.quantity < LOW_STOCK_THRESHOLD;
                  const unitProfit = (item.selling_price || 0) - (item.cost_price || 0);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-[#FAF7F0]/60 transition-colors ${
                        isLowStock ? "bg-amber-50/40" : ""
                      }`}
                    >
                      {/* Product Name */}
                      <td className="px-6 py-4 font-semibold text-[var(--text)]">
                        {item.product_name}
                      </td>

                      {/* Quantity & Low Stock Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[var(--text)]">{item.quantity}</span>
                          {isLowStock && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                              <AlertTriangle size={12} /> Low Stock
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Cost Price */}
                      <td className="px-6 py-4 whitespace-nowrap text-[var(--muted)]">
                        {formatCurrency(item.cost_price)}
                      </td>

                      {/* Selling Price */}
                      <td className="px-6 py-4 whitespace-nowrap text-[var(--text)] font-medium">
                        {formatCurrency(item.selling_price)}
                      </td>

                      {/* Profit per Unit */}
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">
                        <span className={unitProfit > 0 ? "text-emerald-600" : unitProfit < 0 ? "text-red-600" : "text-[var(--muted)]"}>
                          {formatCurrency(unitProfit)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            title="Edit Product"
                            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--section)] transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.product_name)}
                            disabled={deletingId === item.id}
                            title="Delete Product"
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-40"
                          >
                            {deletingId === item.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
