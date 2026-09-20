import Papa from "papaparse";

/* =========================================================
   CONSTANTS
   ========================================================= */

export const CATEGORIES = [
  "All",
  "Music",
  "Movie",
  "Place",
  "Purchase",
  "Photo",
  "Message",
  "Search",
  "Event",
  "Note",
];

export const CATEGORY_META = {
  Music: {
    label: "Music",
    color: "purple",
  },
  Movie: {
    label: "Movies",
    color: "pink",
  },
  Place: {
    label: "Places",
    color: "green",
  },
  Purchase: {
    label: "Purchases",
    color: "orange",
  },
  Photo: {
    label: "Photos",
    color: "blue",
  },
  Message: {
    label: "Messages",
    color: "cyan",
  },
  Search: {
    label: "Searches",
    color: "indigo",
  },
  Event: {
    label: "Events",
    color: "yellow",
  },
  Note: {
    label: "Notes",
    color: "red",
  },
};

export const CHAPTER_COLORS = [
  "purple",
  "green",
  "orange",
  "blue",
  "yellow",
  "pink",
];

export const CHAPTER_NAMES = [
  "The First Traces",
  "Finding a Rhythm",
  "Changing Directions",
  "The Long Middle",
  "New Chapters",
  "The Recent Story",
];

const CHAPTER_DESCRIPTIONS = {
  "The First Traces":
    "The earliest fragments in the dataset. Small moments begin to reveal the shape of a story.",

  "Finding a Rhythm":
    "Different interests and routines begin to appear, creating the first recognizable patterns.",

  "Changing Directions":
    "The digital trail starts to shift as new places, interests and activities enter the picture.",

  "The Long Middle":
    "A richer period of activity where recurring people, places, interests and habits become visible.",

  "New Chapters":
    "New kinds of moments appear and older patterns begin to evolve.",

  "The Recent Story":
    "The latest part of the journey, showing the most recent version of this digital life.",
};

/* =========================================================
   SMALL HELPERS
   ========================================================= */

function clean(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function lower(value) {
  return clean(value).toLowerCase();
}

function firstValue(row, possibleNames) {
  const keys = Object.keys(row);

  for (const wanted of possibleNames) {
    const exact = keys.find(
      (key) => lower(key) === lower(wanted)
    );

    if (exact && clean(row[exact])) {
      return clean(row[exact]);
    }
  }

  return "";
}

function findKey(row, possibleNames) {
  const keys = Object.keys(row);

  for (const wanted of possibleNames) {
    const exact = keys.find(
      (key) => lower(key) === lower(wanted)
    );

    if (exact) {
      return exact;
    }
  }

  return null;
}

function parseBoolean(value) {
  const valueLower = lower(value);

  return (
    value === true ||
    valueLower === "true" ||
    valueLower === "yes" ||
    valueLower === "1"
  );
}

function parseNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

/* =========================================================
   COLUMN DETECTION
   ========================================================= */

function detectColumns(row) {
  return {
    type: findKey(row, [
      "type",
      "category",
      "activity_type",
      "activity type",
      "receipt_type",
      "receipt type",
      "content_type",
      "content type",
    ]),

    title: findKey(row, [
      "title",
      "name",
      "activity",
      "item",
      "subject",
      "track_name",
      "track name",
      "movie",
      "movie_name",
      "place",
      "place_name",
      "purchase",
      "search",
      "query",
      "event",
      "note",
      "message",
    ]),

    description: findKey(row, [
      "description",
      "details",
      "detail",
      "text",
      "content",
      "body",
      "note_text",
      "message_text",
    ]),

    date: findKey(row, [
      "date",
      "timestamp",
      "datetime",
      "date_time",
      "created_at",
      "createdAt",
      "ts",
      "time",
    ]),

    artist: findKey(row, [
      "artist",
      "artist_name",
      "artist name",
      "performer",
    ]),

    album: findKey(row, [
      "album",
      "album_name",
      "album name",
    ]),

    location: findKey(row, [
      "location",
      "place",
      "city",
      "address",
      "venue",
      "platform",
    ]),

    amount: findKey(row, [
      "amount",
      "price",
      "cost",
      "total",
      "value",
      "purchase_amount",
    ]),

    platform: findKey(row, [
      "platform",
      "source",
      "app",
      "service",
    ]),

    duration: findKey(row, [
      "duration",
      "duration_ms",
      "ms_played",
      "minutes",
    ]),

    shuffle: findKey(row, [
      "shuffle",
    ]),

    skipped: findKey(row, [
      "skipped",
    ]),

    uri: findKey(row, [
      "spotify_track_uri",
      "uri",
      "url",
      "link",
    ]),
  };
}

/* =========================================================
   TYPE DETECTION
   ========================================================= */

function normalizeType(value, row, columns) {
  const raw = lower(value);

  if (
    raw.includes("music") ||
    raw.includes("song") ||
    raw.includes("spotify") ||
    raw.includes("track") ||
    raw.includes("audio")
  ) {
    return "Music";
  }

  if (
    raw.includes("movie") ||
    raw.includes("film") ||
    raw.includes("netflix") ||
    raw.includes("series") ||
    raw.includes("entertainment") ||
    raw.includes("tv")
  ) {
    return "Movie";
  }

  if (
    raw.includes("place") ||
    raw.includes("location") ||
    raw.includes("travel") ||
    raw.includes("visit")
  ) {
    return "Place";
  }

  if (
    raw.includes("purchase") ||
    raw.includes("shopping") ||
    raw.includes("buy") ||
    raw.includes("transaction") ||
    raw.includes("expense")
  ) {
    return "Purchase";
  }

  if (
    raw.includes("photo") ||
    raw.includes("image") ||
    raw.includes("picture")
  ) {
    return "Photo";
  }

  if (
    raw.includes("message") ||
    raw.includes("chat") ||
    raw.includes("text")
  ) {
    return "Message";
  }

  if (
    raw.includes("search") ||
    raw.includes("query")
  ) {
    return "Search";
  }

  if (
    raw.includes("event") ||
    raw.includes("meeting") ||
    raw.includes("calendar")
  ) {
    return "Event";
  }

  if (
    raw.includes("note") ||
    raw.includes("journal") ||
    raw.includes("memo")
  ) {
    return "Note";
  }

  /* Spotify-specific fallback */
  if (
    columns.artist ||
    columns.album ||
    columns.shuffle ||
    columns.skipped
  ) {
    return "Music";
  }

  /* Infer from column names */
  const keys = Object.keys(row)
    .map(lower)
    .join(" ");

  if (
    keys.includes("track") ||
    keys.includes("artist") ||
    keys.includes("album")
  ) {
    return "Music";
  }

  if (
    keys.includes("purchase") ||
    keys.includes("amount") ||
    keys.includes("price")
  ) {
    return "Purchase";
  }

  if (
    keys.includes("photo") ||
    keys.includes("image")
  ) {
    return "Photo";
  }

  if (
    keys.includes("message") ||
    keys.includes("chat")
  ) {
    return "Message";
  }

  if (
    keys.includes("search") ||
    keys.includes("query")
  ) {
    return "Search";
  }

  if (
    keys.includes("place") ||
    keys.includes("location") ||
    keys.includes("city")
  ) {
    return "Place";
  }

  if (keys.includes("movie")) {
    return "Movie";
  }

  if (keys.includes("event")) {
    return "Event";
  }

  if (keys.includes("note")) {
    return "Note";
  }

  return "Note";
}

/* =========================================================
   DATE PARSING
   ========================================================= */

function parseTimestamp(value) {
  const raw = clean(value);

  if (!raw) {
    return {
      timestampValue: 0,
      year: null,
      month: null,
      day: null,
      hour: null,
      date: "",
      time: "",
    };
  }

  const date = new Date(raw);
  const timestampValue = date.getTime();

  if (Number.isNaN(timestampValue)) {
    return {
      timestampValue: 0,
      year: null,
      month: null,
      day: null,
      hour: null,
      date: raw.slice(0, 10),
      time: raw.slice(11, 16),
    };
  }

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();

  const dateString =
    `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

  const timeString =
    `${String(hour).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;

  return {
    timestampValue,
    year,
    month,
    day,
    hour,
    date: dateString,
    time: timeString,
  };
}

/* =========================================================
   CHAPTER
   ========================================================= */

export function getChapterName(year, minYear, maxYear) {
  if (!year) {
    return CHAPTER_NAMES[0];
  }

  if (!minYear || !maxYear || minYear === maxYear) {
    return CHAPTER_NAMES[5];
  }

  const range = maxYear - minYear + 1;

  const position = year - minYear;

  const chapterIndex = Math.min(
    CHAPTER_NAMES.length - 1,
    Math.floor((position / range) * CHAPTER_NAMES.length)
  );

  return CHAPTER_NAMES[chapterIndex];
}

/* =========================================================
   ROW NORMALIZATION
   ========================================================= */

function normalizeRow(row, index, minYear, maxYear, columns) {
  const typeValue = columns.type
    ? row[columns.type]
    : "";

  const type = normalizeType(
    typeValue,
    row,
    columns
  );

  const timestampRaw = columns.date
    ? row[columns.date]
    : "";

  const timestamp = parseTimestamp(timestampRaw);

  let title = columns.title
    ? clean(row[columns.title])
    : "";

  const artist = columns.artist
    ? clean(row[columns.artist])
    : "";

  const album = columns.album
    ? clean(row[columns.album])
    : "";

  /* Spotify fallback */
  if (!title && artist) {
    title = album || artist;
  }

  if (!title) {
    title = `${type} moment`;
  }

  const description = columns.description
    ? clean(row[columns.description])
    : "";

  const location = columns.location
    ? clean(row[columns.location])
    : "";

  const platform = columns.platform
    ? clean(row[columns.platform])
    : "";

  const amount = columns.amount
    ? clean(row[columns.amount])
    : "";

  const duration = columns.duration
    ? parseNumber(row[columns.duration])
    : 0;

  const shuffle = columns.shuffle
    ? parseBoolean(row[columns.shuffle])
    : false;

  const skipped = columns.skipped
    ? parseBoolean(row[columns.skipped])
    : false;

  const uri = columns.uri
    ? clean(row[columns.uri])
    : "";

  const chapter = getChapterName(
    timestamp.year,
    minYear,
    maxYear
  );

  return {
    index,

    type,

    title,

    artist,

    album,

    description,

    location,

    platform,

    amount,

    duration,

    shuffle,

    skipped,

    uri,

    timestamp: timestamp.timestampValue,

    year: timestamp.year,

    month: timestamp.month,

    day: timestamp.day,

    hour: timestamp.hour,

    date: timestamp.date,

    time: timestamp.time,

    chapter,
  };
}

/* =========================================================
   DATASET LOADER
   ========================================================= */

export function parseUploadedDataset(file, onProgress) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No dataset selected."));
      return;
    }

    const extension = file.name
      .split(".")
      .pop()
      .toLowerCase();

    if (extension !== "csv") {
      reject(
        new Error(
          "Please upload a CSV dataset."
        )
      );

      return;
    }

    const rawRows = [];

    let detectedColumns = null;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,

      chunkSize: 512 * 1024,

      chunk(results) {
        const rows = results.data || [];

        if (!detectedColumns && rows.length) {
          detectedColumns = detectColumns(rows[0]);
        }

        for (const row of rows) {
          if (!row || typeof row !== "object") {
            continue;
          }

          const hasContent = Object.values(row).some(
            (value) => clean(value)
          );

          if (hasContent) {
            rawRows.push(row);
          }
        }

        if (onProgress) {
          onProgress(rawRows.length);
        }
      },

      complete() {
        try {
          if (!rawRows.length) {
            reject(
              new Error(
                "The uploaded CSV does not contain any records."
              )
            );

            return;
          }

          const columns =
            detectedColumns ||
            detectColumns(rawRows[0]);

          /*
           * Find the overall year range first.
           * This allows chapter generation without
           * another expensive pass through Date objects.
           */
          let minYear = Infinity;
          let maxYear = -Infinity;

          for (const row of rawRows) {
            const dateValue = columns.date
              ? row[columns.date]
              : "";

            const date = new Date(dateValue);

            if (!Number.isNaN(date.getTime())) {
              const year = date.getFullYear();

              if (year < minYear) {
                minYear = year;
              }

              if (year > maxYear) {
                maxYear = year;
              }
            }
          }

          if (minYear === Infinity) {
            minYear = null;
          }

          if (maxYear === -Infinity) {
            maxYear = null;
          }

          /*
           * Convert to compact records.
           *
           * IMPORTANT:
           * We deliberately do not keep the original
           * CSV objects here.
           */
          const rows = new Array(rawRows.length);

          for (let i = 0; i < rawRows.length; i++) {
            rows[i] = normalizeRow(
              rawRows[i],
              i,
              minYear,
              maxYear,
              columns
            );
          }

          /*
           * Release references to raw CSV objects.
           */
          rawRows.length = 0;

          /*
           * Sort only once.
           */
          rows.sort(
            (a, b) =>
              b.timestamp - a.timestamp
          );

          /*
           * Reassign indexes after sorting.
           *
           * This gives us O(1) lookup later without
           * creating a 150k-entry Map.
           */
          for (let i = 0; i < rows.length; i++) {
            rows[i].index = i;
          }

          resolve({
            rows,
            fileName: file.name,
            fileSize: file.size,
            columns,
            minYear,
            maxYear,
          });
        } catch (error) {
          reject(error);
        }
      },

      error(error) {
        reject(error);
      },
    });
  });
}

/* =========================================================
   RECEIPT CREATION
   =========================================================
   
   IMPORTANT:
   This function is lazy.

   We only call it for receipts that are actually displayed.
   */

export function rowToReceipt(row) {
  if (!row) {
    return null;
  }

  const meta =
    CATEGORY_META[row.type] ||
    CATEGORY_META.Note;

  let subtitle = "";

  if (row.type === "Music") {
    subtitle =
      row.artist ||
      row.album ||
      row.platform ||
      "Listening moment";
  } else if (row.type === "Purchase") {
    subtitle =
      row.amount ||
      row.location ||
      "Purchase";
  } else if (row.type === "Place") {
    subtitle =
      row.location ||
      row.platform ||
      "Location";
  } else if (row.type === "Movie") {
    subtitle =
      row.platform ||
      row.location ||
      "Entertainment";
  } else {
    subtitle =
      row.location ||
      row.platform ||
      row.artist ||
      row.album ||
      "";
  }

  let description = row.description;

  if (!description) {
    if (row.type === "Music") {
      if (row.duration > 0) {
        const minutes = Math.round(
          row.duration / 60000
        );

        description =
          `A listening moment lasting approximately ${minutes} minute${
            minutes === 1 ? "" : "s"
          }.`;
      } else {
        description =
          "A fragment from the digital soundtrack.";
      }
    } else {
      description =
        `A ${row.type.toLowerCase()} moment in the digital journey.`;
    }
  }

  const tags = [];

  tags.push(row.type.toLowerCase());

  if (row.artist) {
    tags.push(row.artist);
  }

  if (row.location) {
    tags.push(row.location);
  }

  if (row.platform && tags.length < 3) {
    tags.push(row.platform);
  }

  return {
    id: `receipt-${row.index}`,

    type: row.type,

    title: row.title,

    subtitle,

    date: row.date,

    time: row.time,

    location:
      row.location ||
      row.platform ||
      "",

    iconType: row.type,

    color: meta.color,

    tags: tags.slice(0, 3),

    description,

    chapter: row.chapter,

    raw: row,
  };
}

/* =========================================================
   CHAPTER SUMMARIES
   ========================================================= */

export function buildChapterSummaries(rows) {
  const grouped = CHAPTER_NAMES.map(
    () => ({
      count: 0,
      previewIds: [],
    })
  );

  const chapterIndex = new Map(
    CHAPTER_NAMES.map(
      (name, index) => [name, index]
    )
  );

  for (const row of rows) {
    const index = chapterIndex.get(
      row.chapter
    );

    if (index === undefined) {
      continue;
    }

    grouped[index].count++;

    /*
     * Only keep five IDs for the chapter card.
     * We do NOT store all chapter receipts.
     */
    if (grouped[index].previewIds.length < 5) {
      grouped[index].previewIds.push(
        row.index
      );
    }
  }

  return CHAPTER_NAMES.map(
    (name, index) => ({
      id: index + 1,
      name,
      description:
        CHAPTER_DESCRIPTIONS[name],
      count: grouped[index].count,
      previewIds:
        grouped[index].previewIds,
      color:
        CHAPTER_COLORS[index],
    })
  );
}

/* =========================================================
   STATS
   ========================================================= */

export function buildStats(rows) {
  const artists = new Set();
  const albums = new Set();
  const titles = new Set();

  let totalDuration = 0;

  for (const row of rows) {
    if (row.artist) {
      artists.add(row.artist);
    }

    if (row.album) {
      albums.add(row.album);
    }

    if (row.title) {
      titles.add(row.title);
    }

    totalDuration += row.duration || 0;
  }

  return {
    moments: rows.length,

    artists: artists.size,

    albums: albums.size,

    tracks: titles.size,

    totalDuration,

    years:
      rows.filter((row) => row.year !== null)
        .reduce((set, row) => {
          set.add(row.year);
          return set;
        }, new Set()).size,
  };
}

/* =========================================================
   INSIGHTS
   ========================================================= */

function getTopCount(counts) {
  let topKey = "";
  let topValue = 0;

  for (const [key, value] of Object.entries(
    counts
  )) {
    if (value > topValue) {
      topKey = key;
      topValue = value;
    }
  }

  return [topKey, topValue];
}

export function buildInsights(rows) {
  if (!rows.length) {
    return [];
  }

  const typeCounts = Object.create(null);
  const titleCounts = Object.create(null);
  const artistCounts = Object.create(null);
  const locationCounts = Object.create(null);
  const hourCounts = Object.create(null);

  let totalDuration = 0;

  for (const row of rows) {
    typeCounts[row.type] =
      (typeCounts[row.type] || 0) + 1;

    if (row.title) {
      titleCounts[row.title] =
        (titleCounts[row.title] || 0) + 1;
    }

    if (row.artist) {
      artistCounts[row.artist] =
        (artistCounts[row.artist] || 0) + 1;
    }

    if (row.location) {
      locationCounts[row.location] =
        (locationCounts[row.location] || 0) + 1;
    }

    if (row.hour !== null) {
      hourCounts[row.hour] =
        (hourCounts[row.hour] || 0) + 1;
    }

    totalDuration += row.duration || 0;
  }

  const [
    topType,
    topTypeCount,
  ] = getTopCount(typeCounts);

  const [
    topTitle,
    topTitleCount,
  ] = getTopCount(titleCounts);

  const [
    topArtist,
    topArtistCount,
  ] = getTopCount(artistCounts);

  const [
    topLocation,
    topLocationCount,
  ] = getTopCount(locationCounts);

  const [
    topHour,
    topHourCount,
  ] = getTopCount(hourCounts);

  /*
   * Only five related IDs per insight.
   */
  const related = {
    type: [],
    title: [],
    artist: [],
    location: [],
    hour: [],
    recent: rows
      .slice(0, 5)
      .map((row) => row.index),
  };

  for (const row of rows) {
    if (
      related.type.length < 5 &&
      row.type === topType
    ) {
      related.type.push(row.index);
    }

    if (
      related.title.length < 5 &&
      row.title === topTitle
    ) {
      related.title.push(row.index);
    }

    if (
      related.artist.length < 5 &&
      row.artist === topArtist
    ) {
      related.artist.push(row.index);
    }

    if (
      related.location.length < 5 &&
      row.location === topLocation
    ) {
      related.location.push(row.index);
    }

    if (
      related.hour.length < 5 &&
      row.hour === Number(topHour)
    ) {
      related.hour.push(row.index);
    }

    if (
      related.type.length >= 5 &&
      related.title.length >= 5 &&
      related.artist.length >= 5 &&
      related.location.length >= 5 &&
      related.hour.length >= 5
    ) {
      break;
    }
  }

  const totalHours =
    totalDuration / 1000 / 60 / 60;

  const insights = [];

  if (topType) {
    insights.push({
      id: "type",
      title: "One kind of moment keeps appearing",
      text: `${topType} accounts for ${topTypeCount.toLocaleString()} records in this digital life.`,
      value: topType,
      count: topTypeCount,
      related: related.type,
    });
  }

  if (topArtist) {
    insights.push({
      id: "artist",
      title: "A familiar name keeps returning",
      text: `${topArtist} appears ${topArtistCount.toLocaleString()} times across the dataset.`,
      value: topArtist,
      count: topArtistCount,
      related: related.artist,
    });
  }

  if (topTitle) {
    insights.push({
      id: "title",
      title: "One moment stands out",
      text: `"${topTitle}" appears ${topTitleCount.toLocaleString()} times in the collected records.`,
      value: topTitle,
      count: topTitleCount,
      related: related.title,
    });
  }

  if (topLocation) {
    insights.push({
      id: "location",
      title: "A place becomes part of the story",
      text: `${topLocation} appears ${topLocationCount.toLocaleString()} times in the dataset.`,
      value: topLocation,
      count: topLocationCount,
      related: related.location,
    });
  }

  if (topHour) {
    const hourText = `${String(
      Number(topHour)
    ).padStart(2, "0")}:00`;

    insights.push({
      id: "hour",
      title: "The digital life has a rhythm",
      text: `The busiest recorded hour is around ${hourText}, with ${topHourCount.toLocaleString()} moments.`,
      value: hourText,
      count: topHourCount,
      related: related.hour,
    });
  }

  if (totalDuration > 0) {
    insights.push({
      id: "duration",
      title: "The moments add up",
      text: `The dataset contains approximately ${totalHours.toFixed(
        1
      )} hours of recorded activity duration.`,
      value: `${totalHours.toFixed(1)}h`,
      count: Math.round(totalHours),
      related: related.recent,
    });
  }

  return insights;
}

/* =========================================================
   SIGNALS
   ========================================================= */

export function buildSignalCounts(rows) {
  const counts = {};

  for (const category of CATEGORIES) {
    counts[category] =
      category === "All"
        ? rows.length
        : 0;
  }

  for (const row of rows) {
    if (counts[row.type] !== undefined) {
      counts[row.type]++;
    }
  }

  return counts;
}

/* =========================================================
   SEARCH
   ========================================================= */

export function filterRows(
  rows,
  search,
  category
) {
  const query = lower(search);

  if (!query && category === "All") {
    return rows;
  }

  const result = [];

  for (const row of rows) {
    if (
      category !== "All" &&
      row.type !== category
    ) {
      continue;
    }

    if (!query) {
      result.push(row);
      continue;
    }

    const matches =
      lower(row.title).includes(query) ||
      lower(row.artist).includes(query) ||
      lower(row.album).includes(query) ||
      lower(row.location).includes(query) ||
      lower(row.platform).includes(query) ||
      lower(row.description).includes(query) ||
      lower(row.type).includes(query) ||
      lower(row.chapter).includes(query) ||
      lower(row.date).includes(query);

    if (matches) {
      result.push(row);
    }
  }

  return result;
}

/* =========================================================
   CHAPTER QUERY
   ========================================================= */

export function getChapterRows(
  rows,
  chapterName
) {
  const result = [];

  for (const row of rows) {
    if (row.chapter === chapterName) {
      result.push(row);
    }
  }

  return result;
}