import React, { useCallback, useState } from 'react';
import AdminLayout from './components/AdminLayout.jsx';
import { Toast } from './components/ui.jsx';
import LoginPage from './pages/LoginPage.jsx';
import WelcomePage from './pages/WelcomePage.jsx';
import StockPage from './pages/StockPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import PaymentsPage from './pages/PaymentsPage.jsx';
import { PRODUCTS, INITIAL_ORDERS, nowLabel } from './data.js';

const FOOTER = {
  stock: 'Pratinjau admin • Data produk dan persediaan merupakan contoh desain.',
  orders: 'Data pesanan dan pelanggan merupakan contoh desain.',
  payments: 'Data pembayaran dan nomor Virtual Account merupakan contoh desain.',
};

export default function App() {
  // page: login | welcome | stock | orders | payments
  const [page, setPage] = useState('login');
  const [products, setProducts] = useState(PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [stockLog, setStockLog] = useState([]);
  const [toast, setToast] = useState('');
  const [orderSel, setOrderSel] = useState(INITIAL_ORDERS[0].id);
  const [paySel, setPaySel] = useState(INITIAL_ORDERS.find((o) => o.payment.status === 'menunggu').id);

  const closeToast = useCallback(() => setToast(''), []);

  const navigate = (target) => {
    setPage(target);
    window.scrollTo({ top: 0 });
  };

  const addStock = (productId, qty, note) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: p.stock + qty } : p)));
    setStockLog((prev) => [{ productId, qty, note, at: nowLabel() }, ...prev]);
  };

  const exportStock = () => {
    const rows = [['SKU', 'Produk', 'Kategori', 'Stok']].concat(
      products.map((p) => [p.sku, p.name, p.category, p.stock]),
    );
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stok-senkanan.csv';
    a.click();
    URL.revokeObjectURL(url);
    setToast('Stok berhasil diekspor ke stok-senkanan.csv.');
  };

  // Admin mengonfirmasi / menolak pembayaran VA.
  const decidePayment = (orderId, status, note) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, payment: { ...o.payment, status, note: note || '', confirmedAt: status === 'lunas' ? nowLabel() : '' } }
          : o,
      ),
    );
  };

  // Majukan tahap pesanan: dibuat -> diproses -> dikirim (resi dibuat saat dikirim).
  const advanceOrder = (orderId) => {
    let message = '';
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        if (o.stage === 'dibuat' && o.payment.status === 'lunas') {
          message = `Pesanan #${o.id} mulai diproses.`;
          return { ...o, stage: 'diproses' };
        }
        if (o.stage === 'diproses') {
          message = `Pesanan #${o.id} dikirim.`;
          return { ...o, stage: 'dikirim', resi: 'DEMO' + Math.floor(1e9 + Math.random() * 9e9) };
        }
        return o;
      }),
    );
    if (message) setToast(message);
  };

  // Batalkan dan hapus pesanan dari daftar pesanan admin.
  const cancelOrder = (orderId) => {
    setOrders((prev) => {
      const next = prev.filter((o) => o.id !== orderId);
      if (orderSel === orderId) {
        setOrderSel(next[0]?.id || '');
      }
      if (paySel === orderId) {
        const nextPending = next.find((o) => o.payment.status === 'menunggu') || next[0];
        setPaySel(nextPending?.id || '');
      }
      return next;
    });
    setToast(`Pesanan #${orderId} berhasil dibatalkan dan dihapus.`);
  };

  const pendingPayments = orders.filter((o) => o.payment.status === 'menunggu').length;

  if (page === 'login') {
    return <LoginPage onLogin={() => navigate('stock')} />;
  }
  if (page === 'welcome') {
    return <WelcomePage onNavigate={navigate} pendingPayments={pendingPayments} />;
  }

  return (
    <>
      <AdminLayout
        page={page}
        onNavigate={navigate}
        onLogout={() => navigate('login')}
        counts={{ orders: orders.length, payments: pendingPayments }}
        footerNote={FOOTER[page]}
      >
        {page === 'stock' && (
          <StockPage products={products} onAddStock={addStock} onExport={exportStock} onToast={setToast} />
        )}
        {page === 'orders' && (
          <OrdersPage
            orders={orders}
            onAdvance={advanceOrder}
            onCancelOrder={cancelOrder}
            onGoPayments={(id) => {
              setPaySel(id);
              navigate('payments');
            }}
            selectedId={orderSel}
            setSelectedId={setOrderSel}
          />
        )}
        {page === 'payments' && (
          <PaymentsPage
            orders={orders}
            onDecide={decidePayment}
            onToast={setToast}
            selectedId={paySel}
            setSelectedId={setPaySel}
          />
        )}
      </AdminLayout>
      <Toast message={toast} onClose={closeToast} />
    </>
  );
}
