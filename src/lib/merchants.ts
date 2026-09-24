export type Category =
  | "Streaming"
  | "Music"
  | "Software"
  | "Cloud storage"
  | "News"
  | "Fitness"
  | "Food delivery"
  | "Shopping"
  | "Gaming"
  | "Dating"
  | "Phone & internet"
  | "Insurance"
  | "Other";

export interface KnownMerchant {
  name: string;
  /** Lower-case substrings that identify this merchant in a bank description. */
  match: string[];
  category: Category;
  cancelUrl?: string;
  cancelSteps?: string;
}

export const KNOWN_MERCHANTS: KnownMerchant[] = [
  { name: "Netflix", match: ["netflix"], category: "Streaming", cancelUrl: "https://www.netflix.com/cancelplan" },
  { name: "Disney+", match: ["disney plus", "disneyplus", "disney+"], category: "Streaming", cancelUrl: "https://www.disneyplus.com/account/subscription" },
  { name: "Hulu", match: ["hulu"], category: "Streaming", cancelUrl: "https://secure.hulu.com/account/cancel" },
  { name: "Max", match: ["hbo max", "hbomax", "max.com"], category: "Streaming", cancelUrl: "https://auth.max.com/subscription" },
  { name: "Paramount+", match: ["paramount"], category: "Streaming", cancelUrl: "https://www.paramountplus.com/account/" },
  { name: "Peacock", match: ["peacock"], category: "Streaming", cancelUrl: "https://www.peacocktv.com/account/plans" },
  { name: "Apple TV+", match: ["apple tv"], category: "Streaming", cancelUrl: "https://support.apple.com/en-us/118428" },
  { name: "Crunchyroll", match: ["crunchyroll"], category: "Streaming", cancelUrl: "https://www.crunchyroll.com/account/membership" },
  { name: "YouTube Premium", match: ["youtube", "google youtube"], category: "Streaming", cancelUrl: "https://www.youtube.com/paid_memberships" },
  { name: "Amazon Prime", match: ["amazon prime", "prime video", "amzn prime", "primevideo"], category: "Shopping", cancelUrl: "https://www.amazon.com/mc/pipelines/cancellation" },
  { name: "Spotify", match: ["spotify"], category: "Music", cancelUrl: "https://www.spotify.com/account/subscription/" },
  { name: "Apple Music", match: ["apple music"], category: "Music", cancelUrl: "https://support.apple.com/en-us/118428" },
  { name: "Tidal", match: ["tidal"], category: "Music", cancelUrl: "https://account.tidal.com/subscription" },
  { name: "Audible", match: ["audible"], category: "Music", cancelUrl: "https://www.audible.com/account/overview" },
  { name: "Apple (iCloud / App Store)", match: ["apple.com/bill", "itunes", "apple.com bill", "icloud"], category: "Cloud storage", cancelUrl: "https://support.apple.com/en-us/118428" },
  { name: "Google One", match: ["google one", "google storage", "google *google one"], category: "Cloud storage", cancelUrl: "https://one.google.com/storage/management" },
  { name: "Dropbox", match: ["dropbox"], category: "Cloud storage", cancelUrl: "https://www.dropbox.com/account/plan" },
  { name: "Microsoft 365", match: ["microsoft", "msft", "office 365"], category: "Software", cancelUrl: "https://account.microsoft.com/services" },
  { name: "Adobe", match: ["adobe"], category: "Software", cancelUrl: "https://account.adobe.com/plans", cancelSteps: "Adobe annual plans billed monthly charge an early-termination fee. Check your plan's renewal date before cancelling." },
  { name: "ChatGPT Plus", match: ["openai", "chatgpt"], category: "Software", cancelUrl: "https://chatgpt.com/#settings/Subscription" },
  { name: "Claude Pro", match: ["anthropic", "claude.ai"], category: "Software", cancelUrl: "https://claude.ai/settings/billing" },
  { name: "Canva", match: ["canva"], category: "Software", cancelUrl: "https://www.canva.com/settings/billing-and-teams" },
  { name: "Notion", match: ["notion"], category: "Software", cancelUrl: "https://www.notion.so/my-account" },
  { name: "Grammarly", match: ["grammarly"], category: "Software", cancelUrl: "https://account.grammarly.com/subscription" },
  { name: "LinkedIn Premium", match: ["linkedin"], category: "Software", cancelUrl: "https://www.linkedin.com/premium/manage/" },
  { name: "NordVPN", match: ["nordvpn", "nord vpn"], category: "Software", cancelUrl: "https://my.nordaccount.com/billing/" },
  { name: "ExpressVPN", match: ["expressvpn"], category: "Software", cancelUrl: "https://www.expressvpn.com/subscriptions" },
  { name: "The New York Times", match: ["nytimes", "ny times", "new york times"], category: "News", cancelUrl: "https://myaccount.nytimes.com/seg/subscription" },
  { name: "Wall Street Journal", match: ["wsj", "wall street journal", "dow jones"], category: "News", cancelUrl: "https://customercenter.wsj.com/" },
  { name: "Washington Post", match: ["washington post", "washpost"], category: "News", cancelUrl: "https://subscribe.washingtonpost.com/myaccount/" },
  { name: "Medium", match: ["medium.com", "medium corp"], category: "News", cancelUrl: "https://medium.com/me/settings/membership" },
  { name: "Substack", match: ["substack"], category: "News", cancelUrl: "https://substack.com/settings" },
  { name: "Planet Fitness", match: ["planet fitness", "pf club"], category: "Fitness", cancelSteps: "Planet Fitness usually requires cancelling in person at your home club or by certified letter. Use the generated letter below." },
  { name: "Peloton", match: ["peloton"], category: "Fitness", cancelUrl: "https://members.onepeloton.com/preferences/subscriptions" },
  { name: "Strava", match: ["strava"], category: "Fitness", cancelUrl: "https://www.strava.com/account" },
  { name: "Headspace", match: ["headspace"], category: "Fitness", cancelUrl: "https://www.headspace.com/subscriptions" },
  { name: "Calm", match: ["calm.com", "calm app"], category: "Fitness", cancelUrl: "https://www.calm.com/account" },
  { name: "ClassPass", match: ["classpass"], category: "Fitness", cancelUrl: "https://classpass.com/settings/membership" },
  { name: "DoorDash DashPass", match: ["dashpass", "doordash"], category: "Food delivery", cancelUrl: "https://www.doordash.com/consumer/membership/" },
  { name: "Uber One", match: ["uber one", "uber *one"], category: "Food delivery", cancelUrl: "https://account.uber.com/" },
  { name: "Instacart+", match: ["instacart"], category: "Food delivery", cancelUrl: "https://www.instacart.com/store/account/instacart-plus" },
  { name: "HelloFresh", match: ["hellofresh", "hello fresh"], category: "Food delivery", cancelUrl: "https://www.hellofresh.com/my-account/deliveries/menu" },
  { name: "Walmart+", match: ["walmart+", "walmart plus"], category: "Shopping", cancelUrl: "https://www.walmart.com/plus/account" },
  { name: "Costco", match: ["costco membership"], category: "Shopping" },
  { name: "Xbox Game Pass", match: ["xbox", "game pass", "microsoft*xbox", "microsoft xbox"], category: "Gaming", cancelUrl: "https://account.microsoft.com/services" },
  { name: "PlayStation Plus", match: ["playstation", "sony interactive", "psn"], category: "Gaming", cancelUrl: "https://www.playstation.com/acct/management" },
  { name: "Nintendo Switch Online", match: ["nintendo"], category: "Gaming", cancelUrl: "https://accounts.nintendo.com/shop/subscription" },
  { name: "Twitch", match: ["twitch"], category: "Gaming", cancelUrl: "https://www.twitch.tv/subscriptions" },
  { name: "Tinder", match: ["tinder"], category: "Dating", cancelUrl: "https://help.tinder.com/hc/en-us/articles/115003512846" },
  { name: "Bumble", match: ["bumble"], category: "Dating", cancelUrl: "https://bumble.com/en/help" },
  { name: "Hinge", match: ["hinge"], category: "Dating", cancelUrl: "https://help.hinge.co/hc/en-us" },
  { name: "Match.com", match: ["match.com", "match group"], category: "Dating", cancelUrl: "https://www.match.com/settings" },
  { name: "Patreon", match: ["patreon"], category: "Other", cancelUrl: "https://www.patreon.com/settings/memberships" },
  { name: "Duolingo", match: ["duolingo"], category: "Other", cancelUrl: "https://www.duolingo.com/settings/super" },
];

export function findKnownMerchant(description: string): KnownMerchant | undefined {
  const d = description.toLowerCase();
  // Prefer the most specific pattern, so "MICROSOFT*XBOX" is Xbox rather than Microsoft 365.
  let best: KnownMerchant | undefined;
  let bestLen = 0;
  for (const m of KNOWN_MERCHANTS) {
    for (const s of m.match) {
      if (s.length > bestLen && d.includes(s)) {
        best = m;
        bestLen = s.length;
      }
    }
  }
  return best;
}
