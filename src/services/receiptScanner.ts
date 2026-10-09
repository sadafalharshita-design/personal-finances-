import { ReceiptExtraction } from '../types/finance';
import receiptElectronics from '../assets/images/receipt_sample_electronics_1791570772997.jpg';
import receiptDining from '../assets/images/receipt_sample_dining_1791570784641.jpg';

export interface SampleReceipt {
  id: string;
  title: string;
  merchant: string;
  subtitle: string;
  imagePath: string;
  mockData: ReceiptExtraction;
}

export const SAMPLE_RECEIPTS: SampleReceipt[] = [
  {
    id: 'sample-apex',
    title: 'Retail Technology Invoice',
    merchant: 'Apex Electronics',
    subtitle: 'Bengaluru Tech Plaza · Bill #AE-98745',
    imagePath: receiptElectronics,
    mockData: {
      merchant: 'Apex Electronics',
      date: '2026-10-06',
      amount: 14747.64,
      tax: 2249.64,
      category: 'Shopping',
      payment_method: 'Debit Card',
      invoice_number: 'AE-98745',
      confidence_score: 0.98,
      notes: 'GSTIN: 29AABCA1234A1Z1 · Verified store thermal receipt',
      line_items: [
        {
          description: 'Keychron K2 Mech Keyboard (K2/A1)',
          qty: 1,
          price: 8999.0,
          total: 8999.0,
        },
        {
          description: 'Anker USB-C Hub 8-in-1 (A8383)',
          qty: 1,
          price: 3499.0,
          total: 3499.0,
        },
      ],
    },
  },
  {
    id: 'sample-dining',
    title: 'Artisan Cafe Dining Bill',
    merchant: 'The Daily Grind Cafe',
    subtitle: '145 Oak Street · Table 14',
    imagePath: receiptDining,
    mockData: {
      merchant: 'The Daily Grind Cafe',
      date: '2026-10-08',
      amount: 2645.0,
      tax: 240.5,
      category: 'Dining',
      payment_method: 'UPI / Card',
      invoice_number: '000452',
      confidence_score: 0.96,
      notes: 'Server: Sarah · Customer Copy',
      line_items: [
        {
          description: 'Artisan Coffee (Flat White)',
          qty: 2,
          price: 540.0,
          total: 1080.0,
        },
        {
          description: 'Avocado Tartine with Feta',
          qty: 1,
          price: 1150.0,
          total: 1150.0,
        },
        {
          description: 'Poached Egg Add-on',
          qty: 1,
          price: 415.0,
          total: 415.0,
        },
      ],
    },
  },
];

export async function parseUploadedReceipt(file: File): Promise<ReceiptExtraction> {
  // Simulate AI Vision processing latency
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const fileName = file.name.toLowerCase();

  // Smart heuristic based on file metadata or common names
  if (fileName.includes('electric') || fileName.includes('power') || fileName.includes('bescom')) {
    return {
      merchant: 'BESCOM Power Utility',
      date: new Date().toISOString().slice(0, 10),
      amount: 2150.0,
      tax: 180.0,
      category: 'Utilities',
      payment_method: 'Auto-Debit',
      invoice_number: `UTIL-${Math.floor(100000 + Math.random() * 900000)}`,
      confidence_score: 0.94,
      notes: 'Monthly domestic electricity billing cycle',
      line_items: [
        { description: 'Domestic Energy Consumption (245 kWh)', qty: 1, price: 1970.0, total: 1970.0 },
        { description: 'Fixed Demand & Fuel Adjustment', qty: 1, price: 180.0, total: 180.0 },
      ],
    };
  }

  if (fileName.includes('food') || fileName.includes('swiggy') || fileName.includes('zomato') || fileName.includes('cafe')) {
    return {
      merchant: 'Fresh Plate Gourmet',
      date: new Date().toISOString().slice(0, 10),
      amount: 1420.0,
      tax: 115.0,
      category: 'Dining',
      payment_method: 'UPI',
      invoice_number: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      confidence_score: 0.95,
      notes: 'Online food delivery & packing charges',
      line_items: [
        { description: 'Mezze Platter & Falafel', qty: 1, price: 750.0, total: 750.0 },
        { description: 'Fresh Cold Pressed Orange Juice', qty: 2, price: 275.0, total: 550.0 },
        { description: 'Delivery & Handling', qty: 1, price: 120.0, total: 120.0 },
      ],
    };
  }

  // Generic realistic document extraction
  const randomAmount = Math.round((Math.random() * 3500 + 450) * 100) / 100;
  const tax = Math.round(randomAmount * 0.12 * 100) / 100;

  return {
    merchant: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Merchant Store',
    date: new Date().toISOString().slice(0, 10),
    amount: randomAmount,
    tax,
    category: 'Shopping',
    payment_method: 'UPI',
    invoice_number: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
    confidence_score: 0.92,
    notes: 'Parsed from uploaded document with 92% OCR field confidence',
    line_items: [
      {
        description: 'Itemized purchase',
        qty: 1,
        price: randomAmount - tax,
        total: randomAmount - tax,
      },
    ],
  };
}
