/** Builds a realistic 12-month demo statement so visitors can try the app instantly. */
export function buildSampleCsv(end = new Date()): string {
  const rows: [Date, string, number][] = [];
  const monthsBack = (n: number, day: number) =>
    new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - n, day));

  for (let n = 11; n >= 0; n--) {
    rows.push([monthsBack(n, 3), "NETFLIX.COM 866-579-7172 CA", n > 4 ? -15.49 : -17.99]);
    rows.push([monthsBack(n, 7), "Spotify USA 877-778-1161", -11.99]);
    rows.push([monthsBack(n, 9), "APPLE.COM/BILL 866-712-7753", -2.99]);
    rows.push([monthsBack(n, 12), "PLANET FITNESS #1123", -24.99]);
    rows.push([monthsBack(n, 14), "HULU 877-8244858 CA", -17.99]);
    rows.push([monthsBack(n, 15), "DISNEY PLUS 888-9053478", n > 6 ? -13.99 : -15.99]);
    rows.push([monthsBack(n, 18), "OPENAI *CHATGPT SUBSCR", -20.0]);
    rows.push([monthsBack(n, 21), "ADOBE *CREATIVE CLOUD", -59.99]);
    rows.push([monthsBack(n, 22), "DASHPASS DOORDASH", -9.99]);
    rows.push([monthsBack(n, 1), "PAYROLL DEPOSIT ACME CORP", 3850.0]);
    rows.push([monthsBack(n, 15), "PAYROLL DEPOSIT ACME CORP", 3850.0]);
    rows.push([monthsBack(n, 2), "RENT PAYMENT ZELLE", -1650.0]);
    rows.push([monthsBack(n, 3 + ((n * 5) % 20)), "SHELL OIL 57442", -(38 + ((n * 7) % 20))]);
    rows.push([monthsBack(n, 11), "TRADER JOE'S #552", -(62 + ((n * 13) % 45))]);
    rows.push([monthsBack(n, 19), "AMAZON MKTPLACE PMTS", -(18 + ((n * 17) % 90))]);
    rows.push([monthsBack(n, 25), "CHIPOTLE 1932", -(11 + ((n * 3) % 9))]);
    // Forgotten free trial that converted and stopped 5 months ago.
    if (n >= 5 && n <= 8) rows.push([monthsBack(n, 27), "PARAMOUNT+ 888-274-5343", -11.99]);
  }
  rows.push([monthsBack(10, 4), "AMAZON PRIME*2K4L81 AMZN.COM/BILL", -139.0]);
  rows.push([monthsBack(10, 16), "NORDVPN NORDVPN.COM", -99.0]);

  rows.sort((a, b) => a[0].getTime() - b[0].getTime());
  const lines = rows.map(([d, desc, amt]) => `${d.toISOString().slice(0, 10)},"${desc}",${amt.toFixed(2)}`);
  return ["Date,Description,Amount", ...lines].join("\n");
}
