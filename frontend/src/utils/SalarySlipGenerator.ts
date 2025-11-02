import { SalarySheet } from "../services/api/salarySheetsAPI";
import { Employee } from "../types/employeeTypes";

// Month names for display
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function generateAllSalarySlipsHTML(
  sheets: SalarySheet[],
  employees: Employee[],
) {
  const store = {
    name: "POS System",
    address: "123 Main St, City, Country",
    phone: "(123) 456-7890",
  };
  const currency = "$";

  const rows = sheets
    .map((sheet) => {
      let emp = employees.find((e) => e.id === sheet.employeeId);
      if (!emp) {
        emp = {
          id: sheet.employeeId,
          name: sheet.employee?.name || "Unknown",
          username: "",
          role: "STAFF",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      const joinDate = emp.joinedDate || emp.createdAt;
      const joinDateObj = joinDate ? new Date(joinDate) : null;
      const joinDateStr = joinDateObj
        ? `${monthNames[joinDateObj.getMonth()]} ${joinDateObj.getFullYear()}`
        : "N/A";
      const monthName = monthNames[sheet.month - 1] || sheet.month;
      return `<tr>
      <td>${emp.id}</td>
      <td>${emp.name}</td>
      <td>${joinDateStr}</td>
      <td>${monthName} ${sheet.year}</td>
      <td>${currency}${sheet.baseSalary.toLocaleString()}</td>
      <td>${currency}${sheet.bonus.toLocaleString()}</td>
      <td>${currency}${sheet.deduction.toLocaleString()}</td>
      <td>${currency}${(sheet.baseSalary + sheet.bonus - sheet.deduction).toLocaleString()}</td>
      <td>${sheet.paid ? "Paid" : "Unpaid"}</td>
    </tr>`;
    })
    .join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>All Salary Slips</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #fafafa; }
      .receipt-table-container {
        width: 100vw;
        max-width: 100vw;
        margin: 0 auto;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.07);
        box-sizing: border-box;
        padding: 40px 32px 32px 32px;
      }
      @media print {
        body, html {
          background: #fff !important;
        }
        .receipt-table-container {
          width: 100vw;
          max-width: 100vw;
          min-width: 100vw;
          margin: 0;
          padding: 40px 32px 32px 32px;
          border-radius: 0;
          box-shadow: none;
        }
      }
      .header {
        text-align: center;
        border-bottom: 2px solid #222;
        padding-bottom: 18px;
        margin-bottom: 32px;
      }
      .store-name {
        font-size: 28px;
        font-weight: 700;
        letter-spacing: 1px;
        color: #111;
      }
      .store-info {
        font-size: 14px;
        color: #444;
        margin-top: 2px;
      }
      .title {
        text-align:center;
        font-size: 22px;
        font-weight: 600;
        margin-top: 14px;
        color: #111;
        letter-spacing: 0.5px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 28px;
        background: #fff;
      }
      th, td {
        border: 1px solid #bbb;
        padding: 12px 8px;
        text-align: center;
        font-size: 16px;
        color: #111;
      }
      th {
        background: #f5f5f5;
        font-weight: bold;
        color: #111;
        font-size: 17px;
        letter-spacing: 0.2px;
      }
      tr:nth-child(even) td {
        background: #fafbfc;
      }
      tr:hover td {
        background: #f0f0f0;
      }
      .footer {
        text-align: center;
        font-size: 15px;
        color: #444;
        margin-top: 36px;
        border-top: 1px solid #bbb;
        padding-top: 18px;
        letter-spacing: 0.2px;
      }
    </style>
    </head><body>
      <div class="receipt-table-container">
        <div class="header">
          <div class="store-name">${store.name}</div>
          <div class="store-info">${store.address}<br>Phone: ${store.phone}</div>
          <div class="title">All Salary Slips</div>
        </div>
        <table>
          <thead>
            <tr>
            <th>Employee ID</th>
              <th>Employee</th>
              <th>Join Date</th>
              <th>Pay Period</th>
              <th>Base Salary</th>
              <th>Bonus</th>
              <th>Deduction</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <div class="footer">This is a computer-generated salary sheet.<br>Thank you for your dedication and hard work!</div>
      </div>
    </body></html>`;
}

export function generateSalarySlipHTML(sheet: SalarySheet, employee: Employee) {
  const store = {
    name: "POS System",
    address: "123 Main St, City, Country",
    phone: "(123) 456-7890",
  };
  const currency = "$";

  const joinDate = employee.joinedDate || employee.createdAt;
  // Format join date as: 28 October 2025
  const joinDateObj = joinDate ? new Date(joinDate) : null;
  const joinDateStr = joinDateObj
    ? `${monthNames[joinDateObj.getMonth()]} ${joinDateObj.getFullYear()}`
    : "N/A";
  const monthName = monthNames[sheet.month - 1] || sheet.month;
  return `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8"><title>Salary Slip</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #fafafa; }
      .receipt-card {
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        padding: 36px 48px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.07);
        box-sizing: border-box;
        color: #111;
      }
      @media print {
        body, html {
          background: #fff !important;
        }
        .receipt-card {
          width: 100vw;
          max-width: 100vw;
          min-width: 100vw;
          margin: 0;
          padding: 36px 48px;
          border-radius: 0;
          box-shadow: none;
        }
      }
      .header {
        text-align: center;
        border-bottom: 2px solid #222;
        padding-bottom: 14px;
        margin-bottom: 28px;
      }
      .store-name {
        font-size: 28px;
        font-weight: 700;
        letter-spacing: 1px;
        color: #111;
      }
      .store-info {
        font-size: 14px;
        color: #444;
        margin-top: 2px;
      }
      .title {
        text-align:center;
        font-size: 22px;
        font-weight: 600;
        margin-top: 14px;
        color: #111;
        letter-spacing: 0.5px;
      }
      .info {
        margin-bottom: 22px;
        font-size: 16px;
        display: flex;
        flex-wrap: wrap;
        gap: 18px 40px;
      }
      .info-row {
        min-width: 220px;
        margin-bottom: 2px;
      }
      .label {
        font-weight: 600;
        color: #111;
        margin-right: 4px;
      }
      .totals {
        border-top: 1.5px solid #bbb;
        padding-top: 16px;
        margin-bottom: 18px;
        font-size: 17px;
      }
      .totals-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 7px;
      }
      .totals-row.total {
        font-size: 20px;
        font-weight: 700;
        color: #111;
        margin-top: 12px;
        margin-bottom: 10px;
      }
      .status {
        font-size: 16px;
        font-weight: 600;
        color: #111;
        margin-top: 8px;
      }
      .footer {
        text-align: center;
        font-size: 14px;
        color: #444;
        margin-top: 36px;
        border-top: 1px solid #bbb;
        padding-top: 18px;
        letter-spacing: 0.2px;
      }
    </style></head><body>
      <div class="receipt-card">
        <div class="header">
          <div class="store-name">${store.name}</div>
          <div class="store-info">${store.address}<br>Phone: ${store.phone}</div>
          <div class="title">Salary Slip</div>
        </div>
        <div class="info">
          <div class="info-row"><span class="label">Employee:</span> ${employee.name}</div>
          <div class="info-row"><span class="label">Employee ID:</span> ${employee.id}</div>
          <div class="info-row"><span class="label">Join Date:</span>${joinDateStr}</div>
          <div class="info-row"><span class="label">Pay Period:</span>${monthName} ${sheet.year}</div>
        </div>
        <div class="totals">
          <div class="totals-row"><span class="label">Base Salary:</span> <span>${currency}${sheet.baseSalary.toLocaleString()}</span></div>
          <div class="totals-row"><span class="label">Bonus:</span> <span>${currency}${sheet.bonus.toLocaleString()}</span></div>
          <div class="totals-row"><span class="label">Deduction:</span> <span>${currency}${sheet.deduction.toLocaleString()}</span></div>
          <div class="totals-row total"><span class="label">Total:</span> <span>${currency}${(
            sheet.baseSalary +
            sheet.bonus -
            sheet.deduction
          ).toLocaleString()}</span></div>
          <div class="status">${sheet.paid ? "Status: Paid" : "Status: Unpaid"}</div>
        </div>
        <div class="footer">This is a computer-generated salary slip.<br>Thank you for your dedication and hard work!</div>
      </div>
    </body></html>
  `;
}
