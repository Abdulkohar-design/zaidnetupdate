export const exportToWord = (customers: any[], stats: any, employeeName: string) => {
  const date = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
    <head>
      <meta charset='utf-8'>
      <title>Laporan Tagihan WiFi Zaid Net</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
        }
        .company-name {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .report-title {
          font-size: 18px;
          margin-bottom: 5px;
        }
        .date {
          font-size: 14px;
          color: #666;
        }
        .stats {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 5px;
        }
        .stat-item {
          text-align: center;
        }
        .stat-value {
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }
        .stat-label {
          font-size: 12px;
          color: #666;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        .paid {
          color: green;
          font-weight: bold;
        }
        .pending {
          color: red;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">ZAID NET</div>
        <div class="report-title">LAPORAN TAGIHAN WIFI HOTSPOT & PPPOE</div>
        <div class="date">Tanggal: ${date}</div>
        <div class="date">Petugas: ${employeeName}</div>
      </div>

      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">${stats.totalCustomers}</div>
          <div class="stat-label">Total Pelanggan</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">Rp ${stats.totalUnpaid.toLocaleString('id-ID')}</div>
          <div class="stat-label">Total Belum Bayar</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">Rp ${stats.totalPaidAmount.toLocaleString('id-ID')}</div>
          <div class="stat-label">Total Sudah Bayar</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">Rp ${stats.totalRevenue.toLocaleString('id-ID')}</div>
          <div class="stat-label">Total Keseluruhan</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Pelanggan</th>
            <th>Nominal Tagihan</th>
            <th>Status</th>
            <th>Tanggal Input</th>
          </tr>
        </thead>
        <tbody>
  `;

  customers.forEach((customer, index) => {
    const statusClass = customer.status === 'paid' ? 'paid' : 'pending';
    const statusText = customer.status === 'paid' ? 'LUNAS' : 'BELUM BAYAR';
    const createdDate = new Date(customer.created_at).toLocaleDateString('id-ID');
    
    htmlContent += `
      <tr>
        <td>${index + 1}</td>
        <td>${customer.name}</td>
        <td>Rp ${customer.amount.toLocaleString('id-ID')}</td>
        <td class="${statusClass}">${statusText}</td>
        <td>${createdDate}</td>
      </tr>
    `;
  });

  htmlContent += `
        </tbody>
      </table>

      <div class="footer">
        <p>Dicetak dari Sistem Billing WiFi Zaid Net</p>
        <p>Untuk informasi lebih lanjut hubungi admin Zaid Net</p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Laporan-Tagihan-WiFi-Zaid-Net-${new Date().toISOString().split('T')[0]}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};