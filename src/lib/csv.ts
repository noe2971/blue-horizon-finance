export interface Transaction {
  date: Date;
  description: string;
  /** Money leaving the account is positive; refunds/income are negative. */
  outflow: number;
}

export interface ParseResult {
  transactions: Transaction[];
  skipped: number;
}

/** Splits CSV text into rows, honouring quoted fields and escaped quotes. */
export function splitCsv(text: string): string[][] {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const delimiter = [",", ";", "\t"].reduce((best, d) =>
    firstLine.split(d).length > firstLine.split(best).length ? d : best,
  ",");

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === delimiter) {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  row.push(field);
  if (row.some((f) => f.trim() !== "")) rows.push(row);
  return rows.map((r) => r.map((f) => f.trim()));
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** Parses a date string. `dayFirst` resolves ambiguous 01/02/2024 style dates. */
export function parseDate(raw: string, dayFirst = false): Date | null {
  const s = raw.trim();
  if (!s) return null;

  let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (m) return makeDate(+m[1], +m[2], +m[3]);

  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/);
  if (m) {
    let year = +m[3];
    if (year < 100) year += 2000;
    const [a, b] = [+m[1], +m[2]];
    const [month, day] = dayFirst || a > 12 ? [b, a] : [a, b];
    return makeDate(year, month, day);
  }

  m = s.match(/^(\d{1,2})[\s-]([A-Za-z]{3})[A-Za-z]*[\s-,]+(\d{2,4})/);
  if (m) {
    const month = MONTHS.indexOf(m[2].toLowerCase()) + 1;
    let year = +m[3];
    if (year < 100) year += 2000;
    if (month > 0) return makeDate(year, month, +m[1]);
  }

  m = s.match(/^([A-Za-z]{3})[A-Za-z]*\.?\s+(\d{1,2}),?\s+(\d{4})/);
  if (m) {
    const month = MONTHS.indexOf(m[1].toLowerCase()) + 1;
    if (month > 0) return makeDate(+m[3], month, +m[2]);
  }

  return null;
}

function makeDate(year: number, month: number, day: number): Date | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCMonth() === month - 1 ? d : null;
}

/** Parses "$1,234.56", "-12.00", "(12.00)", "12,50 €" (European) etc. */
export function parseAmount(raw: string): number | null {
  let s = raw.trim();
  if (!s) return null;
  let negative = false;
  if (/^\(.*\)$/.test(s)) {
    negative = true;
    s = s.slice(1, -1);
  }
  if (s.includes("-")) negative = true;
  s = s.replace(/[^\d.,]/g, "");
  if (!s) return null;

  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  if (lastComma > lastDot && s.length - lastComma - 1 <= 2) {
    // European format: 1.234,56
    s = s.replace(/\./g, "").replace(",", ".");
  } else {
    s = s.replace(/,/g, "");
  }
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return negative ? -n : n;
}

interface ColumnMap {
  date: number;
  description: number;
  amount?: number;
  debit?: number;
  credit?: number;
}

function findHeaderColumns(header: string[]): ColumnMap | null {
  const h = header.map((x) => x.toLowerCase());
  const find = (re: RegExp, exclude: number[] = []) =>
    h.findIndex((name, i) => re.test(name) && !exclude.includes(i));

  const date = find(/date|posted|time/);
  const description = find(/desc|merchant|payee|name|memo|detail|narrative|reference|particulars/, [date]);
  const amount = find(/^amount|amount$|value|^sum$|^total$/);
  const debit = find(/debit|withdraw|paid out|money out|^out$/);
  const credit = find(/credit|deposit|paid in|money in|^in$/);

  if (date < 0 || description < 0) return null;
  if (amount >= 0) return { date, description, amount };
  if (debit >= 0) return { date, description, debit, credit: credit >= 0 ? credit : undefined };
  return null;
}

/** Guesses columns from content when the file has no recognisable header. */
function guessColumns(rows: string[][]): ColumnMap | null {
  const width = Math.max(...rows.map((r) => r.length));
  const sample = rows.slice(0, 50);
  const score = (fn: (v: string) => boolean, col: number) =>
    sample.filter((r) => r[col] !== undefined && fn(r[col])).length / sample.length;

  let date = -1;
  let amount = -1;
  let description = -1;
  let bestText = 0;
  for (let c = 0; c < width; c++) {
    if (date < 0 && score((v) => parseDate(v) !== null, c) > 0.8) {
      date = c;
      continue;
    }
    if (amount < 0 && score((v) => /\d/.test(v) && parseAmount(v) !== null && !/[a-z]{3,}/i.test(v), c) > 0.8) {
      amount = c;
      continue;
    }
    const avgLen = sample.reduce((s, r) => s + (r[c]?.length ?? 0), 0) / sample.length;
    if (avgLen > bestText && score((v) => /[a-z]/i.test(v), c) > 0.8) {
      bestText = avgLen;
      description = c;
    }
  }
  if (date < 0 || amount < 0 || description < 0) return null;
  return { date, description, amount };
}

export class CsvFormatError extends Error {}

/** Turns a bank-export CSV into normalised transactions. */
export function parseTransactions(text: string): ParseResult {
  const rows = splitCsv(text);
  if (rows.length === 0) throw new CsvFormatError("The file is empty.");

  let cols = findHeaderColumns(rows[0]);
  let body = rows.slice(1);
  if (!cols) {
    cols = guessColumns(rows);
    body = rows;
  }
  if (!cols) {
    throw new CsvFormatError(
      "Couldn't find date, description and amount columns. Export your statement as CSV with a header row.",
    );
  }

  const dateCol = cols.date;
  const dayFirst = body.some((r) => {
    const m = r[dateCol]?.match(/^(\d{1,2})[-/.](\d{1,2})[-/.]/);
    return m !== null && m !== undefined && +m[1] > 12;
  });

  const raw: { date: Date; description: string; amount: number }[] = [];
  let skipped = 0;
  for (const r of body) {
    const date = parseDate(r[cols.date] ?? "", dayFirst);
    const description = r[cols.description] ?? "";
    let amount: number | null;
    if (cols.amount !== undefined) {
      amount = parseAmount(r[cols.amount] ?? "");
    } else {
      const debit = parseAmount(r[cols.debit!] ?? "");
      const credit = cols.credit !== undefined ? parseAmount(r[cols.credit] ?? "") : null;
      // Normalise to "negative = money out" so the sign logic below is shared.
      amount = debit ? -Math.abs(debit) : credit ? Math.abs(credit) : null;
    }
    if (!date || amount === null || !description) {
      skipped++;
      continue;
    }
    raw.push({ date, description, amount });
  }

  // Most bank exports use negative numbers for spending, but some (credit cards)
  // list purchases as positive. Whichever sign dominates is treated as spending.
  const negatives = raw.filter((t) => t.amount < 0).length;
  const spendingIsNegative = negatives >= raw.length / 2;

  return {
    transactions: raw.map((t) => ({
      date: t.date,
      description: t.description,
      outflow: spendingIsNegative ? -t.amount : t.amount,
    })),
    skipped,
  };
}
