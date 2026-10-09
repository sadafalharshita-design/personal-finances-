import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { SAMPLE_RECEIPTS, parseUploadedReceipt, SampleReceipt } from '../services/receiptScanner';
import { ReceiptExtraction } from '../types/finance';
import { formatINR } from '../components/common/FormatRupee';
import { EXPENSE_CATEGORIES } from '../data/seedData';
import {
  FileText,
  Upload,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';

export const ReceiptScannerView: React.FC = () => {
  const { accounts, addTransaction, setActiveTab } = useFinance();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [extractedData, setExtractedData] = useState<ReceiptExtraction | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    accounts.find((a) => a.is_default)?.id || accounts[0]?.id || ''
  );
  const [successSaved, setSuccessSaved] = useState(false);

  // Handle sample receipt selection
  const handleSelectSample = (sample: SampleReceipt) => {
    setIsScanning(true);
    setPreviewImage(sample.imagePath);
    setSuccessSaved(false);

    setTimeout(() => {
      setExtractedData(sample.mockData);
      setIsScanning(false);
    }, 600);
  };

  // Handle file drop/upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please select a JPG, PNG, or WEBP image.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    setIsScanning(true);
    setSuccessSaved(false);

    try {
      const result = await parseUploadedReceipt(file);
      setExtractedData(result);
    } catch {
      alert('Error parsing receipt image.');
    } finally {
      setIsScanning(false);
    }
  };

  // Handle save & confirm
  const handleConfirmSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractedData) return;

    addTransaction({
      account_id: selectedAccountId,
      type: 'EXPENSE',
      amount: extractedData.amount,
      category: extractedData.category,
      merchant: extractedData.merchant,
      date: extractedData.date,
      note: extractedData.notes || `Scanned receipt #${extractedData.invoice_number || 'bill'}`,
    });

    setSuccessSaved(true);
  };

  const handleReset = () => {
    setPreviewImage(null);
    setExtractedData(null);
    setSuccessSaved(false);
  };

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Receipt & Invoice Vision Scanner
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Extract merchant, itemized totals, and GST taxes. Review every field before saving.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Client-side OCR · Private & Zero Retention</span>
        </div>
      </div>

      {/* Main Scanner Flow */}
      {!extractedData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Upload Zone (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl border-2 border-dashed border-white/[0.12] bg-[#121620] p-8 text-center hover:border-[#c99e52]/50 transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-[#dfb66d]">
                <Upload className="h-6 w-6" />
              </div>

              <h3 className="mt-4 font-heading text-base font-semibold text-white">
                Upload or Drop Receipt Image
              </h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                Supports thermal store receipts, tax invoices, and dining bills in JPG, PNG, or WEBP
                format (up to 8 MB).
              </p>

              <div className="mt-5">
                <span className="inline-block rounded-lg bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white">
                  Browse Device Files
                </span>
              </div>
            </div>

            {isScanning && (
              <div className="p-4 rounded-xl border border-[#c99e52]/30 bg-[#c99e52]/[0.08] flex items-center justify-center gap-3 text-xs text-[#dfb66d]">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Running document vision parsing and tabular extraction...</span>
              </div>
            )}
          </div>

          {/* Quick 1-Click Samples to test immediately (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#121620] p-6 space-y-4">
            <div>
              <h3 className="font-heading text-sm font-semibold text-white uppercase tracking-wider">
                Instant Test Invoices
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any real sample below to test the full extraction workflow instantly.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {SAMPLE_RECEIPTS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="p-3.5 rounded-xl border border-white/[0.08] bg-black/25 hover:border-[#c99e52]/40 hover:bg-black/40 cursor-pointer transition-all flex items-center gap-3 group"
                >
                  <img
                    src={sample.imagePath}
                    alt={sample.merchant}
                    className="h-14 w-11 object-cover rounded-md border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white group-hover:text-[#dfb66d] transition-colors truncate">
                      {sample.merchant}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{sample.subtitle}</p>
                    <p className="mt-1 font-mono text-xs font-semibold text-slate-300 tabular-nums">
                      {formatINR(sample.mockData.amount)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Review Extracted Data Screen */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Original Receipt Image Preview (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl border border-white/[0.08] bg-[#121620] p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="text-xs font-medium text-slate-400">Captured Slip</span>
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Rescan</span>
              </button>
            </div>

            {previewImage ? (
              <div className="overflow-hidden rounded-xl border border-white/10 max-h-[460px] flex items-center justify-center bg-black/40">
                <img
                  src={previewImage}
                  alt="Receipt"
                  className="w-full object-contain max-h-[440px]"
                />
              </div>
            ) : (
              <div className="h-64 rounded-xl bg-white/[0.02] flex items-center justify-center text-xs text-slate-500">
                Receipt Image
              </div>
            )}

            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>OCR Confidence Score</span>
              <span className="font-mono text-emerald-400">
                {Math.round(extractedData.confidence_score * 100)}%
              </span>
            </div>
          </div>

          {/* Right: Verified Data Form & Confirmation (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl border border-white/[0.08] bg-[#121620] p-6 space-y-6">
            <div className="pb-3 border-b border-white/[0.06]">
              <h3 className="font-heading text-lg font-semibold text-white">
                Review Extracted Fields
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every field has been verified from the invoice. Adjust if needed before saving.
              </p>
            </div>

            {successSaved ? (
              <div className="py-12 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Check className="h-7 w-7" />
                </div>
                <h4 className="font-heading text-lg font-bold text-white">
                  Transaction Confirmed & Saved
                </h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  {formatINR(extractedData.amount)} debited from linked account and recorded in your
                  ground truth ledger.
                </p>
                <div className="pt-3 flex items-center justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-xl border border-white/[0.1] text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Scan Another Bill
                  </button>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="px-4 py-2 rounded-xl bg-[#c99e52] text-xs font-bold text-[#0c0f17] hover:bg-[#dfb66d]"
                  >
                    View in Ledger →
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Merchant / Vendor
                    </label>
                    <input
                      type="text"
                      value={extractedData.merchant}
                      onChange={(e) =>
                        setExtractedData({ ...extractedData, merchant: e.target.value })
                      }
                      required
                      className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3.5 py-2 text-sm text-white focus:border-[#c99e52] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Grand Total Amount (₹)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={extractedData.amount}
                      onChange={(e) =>
                        setExtractedData({
                          ...extractedData,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                      className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3.5 py-2 text-sm text-white font-mono font-bold text-emerald-400 focus:border-[#c99e52] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Tax / GST (₹)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={extractedData.tax}
                      onChange={(e) =>
                        setExtractedData({
                          ...extractedData,
                          tax: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3.5 py-2 text-xs text-white font-mono focus:border-[#c99e52] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Invoice Date
                    </label>
                    <input
                      type="date"
                      value={extractedData.date}
                      onChange={(e) =>
                        setExtractedData({ ...extractedData, date: e.target.value })
                      }
                      required
                      className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3.5 py-2 text-xs text-white focus:border-[#c99e52] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Category
                    </label>
                    <select
                      value={extractedData.category}
                      onChange={(e) =>
                        setExtractedData({ ...extractedData, category: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3.5 py-2 text-xs text-white focus:border-[#c99e52] focus:outline-none"
                    >
                      {EXPENSE_CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-[#121620]">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Account Selection */}
                <div className="pt-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Charge To Account (Updates balance immediately)
                  </label>
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.1] bg-[#0b0e14] px-3.5 py-2.5 text-xs text-white focus:border-[#c99e52] focus:outline-none"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id} className="bg-[#121620]">
                        {acc.name} — Current Balance: {formatINR(acc.balance)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Itemized Line Items Table */}
                {extractedData.line_items.length > 0 && (
                  <div className="pt-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Itemized Line Items
                    </label>
                    <div className="rounded-xl border border-white/[0.08] bg-black/20 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-white/[0.06] text-slate-500 text-[11px]">
                            <th className="p-2.5 font-medium">Description</th>
                            <th className="p-2.5 font-medium text-center w-12">Qty</th>
                            <th className="p-2.5 font-medium text-right w-24">Price</th>
                            <th className="p-2.5 font-medium text-right w-24">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {extractedData.line_items.map((item, idx) => (
                            <tr key={idx} className="text-slate-300">
                              <td className="p-2.5">{item.description}</td>
                              <td className="p-2.5 text-center font-mono">{item.qty}</td>
                              <td className="p-2.5 text-right font-mono tabular-nums">
                                {formatINR(item.price)}
                              </td>
                              <td className="p-2.5 text-right font-mono font-semibold tabular-nums text-white">
                                {formatINR(item.total)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#c99e52] px-5 py-2.5 text-xs font-bold text-[#0c0f17] hover:bg-[#dfb66d] active:scale-[0.98] transition-all"
                  >
                    <Check className="h-4 w-4" />
                    <span>Confirm & Save Transaction</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
