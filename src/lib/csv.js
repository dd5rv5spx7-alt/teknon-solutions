// Was hand-rolled independently in AdminDashboard.jsx and AdminPayments.jsx
// (identical headers→rows→quote-escape→Blob→anchor-download sequence,
// differing only in the column list) — one shared helper for every admin
// list page that needs an export, instead of copy-pasting the Blob/anchor
// dance a third time.
export function downloadCsv(filename, headers, rows) {
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
