export const CONTENT_WARNINGS = [
  { label: "End-Time Themes", tip: "Topics like plagues, judgment, or Sunday law enforcement." },
  { label: "Spiritual Warfare", tip: "Mentions of demonic deception or the great controversy." },
  { label: "Persecution Accounts", tip: "Martyrdom or religious oppression stories." },
  { label: "Apocalyptic Imagery", tip: "Symbolic beasts, trumpets, or prophetic symbols." },
  { label: "Anatomical/Medical Discussion", tip: "Basic body education including reproductive health." },
  { label: "Mental Health Themes", tip: "Depression, anxiety, or emotional distress in spiritual context." },
  { label: "Addiction & Recovery", tip: "Breaking habits such as substance use or self-control." },
  { label: "Disease & Suffering", tip: "Accounts of illness and God’s healing power." },
  { label: "Self-Harm or Suicide Prevention", tip: "Messages of hope in biblical hopelessness situations." },
  { label: "Violent Biblical Events", tip: "Stories like the flood, crucifixion, or battles." },
  { label: "Sexual Immorality (Biblical Context)", tip: "Sodom, Bathsheba, or Delilah type stories, handled reverently." },
  { label: "Idolatry & Pagan Practices", tip: "False worship, golden calf, or Baal-type content." },
  { label: "Apostasy & Rebellion", tip: "Warnings against spiritual compromise." },
  { label: "Marriage & Courtship Guidance", tip: "Biblical principles of relationships and gender roles." },
  { label: "Discussions of Parenting Failures", tip: "Lessons from Eli, David, or modern parenting fails." },
  { label: "Controversial Cultural Topics", tip: "Sensitive issues like abortion, gender, or family redefinition." },
  { label: "False Doctrines Exposed", tip: "Challenges to error in light of Scripture." },
  { label: "Rebuke and Reformation", tip: "Call to repentance or warnings to the Laodiceans." },
  { label: "Historic Testimonies", tip: "Survivors of persecution, exile, or miracles." },
];

export const ALL_LANGUAGES = [
  "English", "French", "Spanish", "German", "Portuguese",
  "Swahili", "Arabic", "Hindi", "Mandarin", "Zulu"
];

export const GENRES = [
  "Prophecy", "Bible", "Faith", "Healing", "Education", "Youth", "Science",
  "History", "Health", "Music", "Nature", "Family", "Creation", "Sabbath",
  "Salvation", "End Times", "Reformation", "Spirituality", "Testimonies",
  "Missionary", "Adventist", "Kids", "Documentary", "Sermon", "Drama"
];

export const TAGS = [
  "Inspiration", "Youth", "Sermon", "Health", "Kids", "Music", "Nature",
  "Marriage", "Education", "Science", "History", "Devotional"
];
export const FLATTENED_AGE_RATINGS = {
  MPAA: [
    {
      value: "G",
      label: "G – General Audiences",
      description: "All ages admitted. No content that would offend parents.",
    },
    {
      value: "PG",
      label: "PG – Parental Guidance Suggested",
      description: "Some material may not be suitable for children.",
    },
    {
      value: "PG-13",
      label: "PG-13 – Parents Strongly Cautioned",
      description: "Some material may be inappropriate for children under 13.",
    },
    {
      value: "R",
      label: "R – Restricted",
      description: "Under 17 requires accompanying parent or adult guardian. Contains adult material.",
    },
    {
      value: "NC-17",
      label: "NC-17 – Adults Only",
      description: "Explicit content. No one 17 and under admitted.",
    },
  ],

  TV_US: [
    {
      value: "TV-Y",
      label: "TV-Y – All Children",
      description: "Suitable for all children; no inappropriate content.",
    },
    {
      value: "TV-Y7",
      label: "TV-Y7 – Older Children",
      description: "Mild fantasy violence; may not be suitable for under 7.",
    },
    {
      value: "TV-G",
      label: "TV-G – General Audience",
      description: "Suitable for all ages; little or no violence or language.",
    },
    {
      value: "TV-PG",
      label: "TV-PG – Parental Guidance",
      description: "Some suggestive dialogue, infrequent coarse language.",
    },
    {
      value: "TV-14",
      label: "TV-14 – Parents Strongly Cautioned",
      description: "Intense language, sexual content, or violence.",
    },
    {
      value: "TV-MA",
      label: "TV-MA – Mature Audience Only",
      description: "Explicit adult content. Not suitable for children under 17.",
    },
  ],

  UK_EU: [
    {
      value: "U",
      label: "U – Universal",
      description: "Suitable for all. May contain mild language or scary scenes.",
    },
    {
      value: "PG (UK)",
      label: "PG – Parental Guidance (UK)",
      description: "Unaccompanied children of any age may watch, but not for young children.",
    },
    {
      value: "12A",
      label: "12A – 12 with Adult",
      description: "Not suitable for under 12 unless with an adult.",
    },
    {
      value: "12",
      label: "12 – Age 12 and over",
      description: "Suitable for 12+ only. Mild violence or mature themes.",
    },
    {
      value: "15",
      label: "15 – Age 15 and over",
      description: "Strong language, drug use, sexual content.",
    },
    {
      value: "18",
      label: "18 – Age 18 and over",
      description: "Adult themes. Strong violence, explicit content.",
    },
    {
      value: "R18",
      label: "R18 – Restricted 18",
      description: "Explicit adult content. Restricted to licensed cinemas or shops.",
    },
  ],

  SDA_Christian: [
    {
      value: "ThreeAngels",
      label: "Three Angels Approved",
      description: "Christ-centered, truth-based, safe for all audiences; aligns with SDA doctrine.",
    },
    {
      value: "TruthTestimony",
      label: "Truth & Testimony",
      description: "Biblically faithful content including rebuke, prophecy, or personal testimony.",
    },
    {
      value: "BiblicallyCautious",
      label: "Biblically Cautious",
      description: "May include sensitive themes handled in a redemptive way; discretion advised.",
    },
    {
      value: "FamilyFaithSafe",
      label: "Family & Faith Safe",
      description: "Wholesome entertainment for SDA homes. No profanity, violence, or sensuality.",
    },
  ],
};