// frontend/src/components/PrivacyPanel.jsx
import { useState } from "react";

export default function PrivacyPanel({ token, onAccountDeleted }) {
  const [loadingExport, setLoadingExport] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function exportCsv() {
    if(!token) return;
    setLoadingExport(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/export/csv", { headers: { "Authorization": `Bearer ${token}` } });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mh_export.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Export failed');
    } finally {
      setLoadingExport(false);
    }
  }

  async function deleteAccount() {
    if(!token) return;
    const pwd = prompt('Type your password to confirm account deletion (this is irreversible):');
    if(!pwd) return;
    setDeleting(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/account', {
        method: 'DELETE',
        headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ password: pwd })
      });
      if(res.status === 204) {
        alert('Account deleted');
        onAccountDeleted && onAccountDeleted();
      } else {
        const body = await res.json();
        alert(body.detail || 'Failed');
      }
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-3 border rounded">
      <h3 className="font-semibold mb-2">Privacy & Export</h3>
      <div className="space-y-2">
        <button onClick={exportCsv} className="px-3 py-1 bg-sky-600 text-white rounded" disabled={loadingExport}>{loadingExport ? 'Exporting...' : 'Export my data (CSV)'}</button>
        <button onClick={deleteAccount} className="px-3 py-1 bg-red-600 text-white rounded" disabled={deleting}>{deleting ? 'Deleting...' : 'Delete my account'}</button>
      </div>
    </div>
  )
}
