import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  Filter,
  Image,
  Lightbulb,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Music,
  Package,
  Play,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  Sun,
  Ticket,
  X,
} from "lucide-react";

import {
  CATEGORIES,
  CATEGORY_META,
  buildChapterSummaries,
  buildInsights,
  buildSignalCounts,
  buildStats,
  filterRows,
  getChapterRows,
  parseUploadedDataset,
  rowToReceipt,
} from "./data";

/* =========================================================
   HELPERS
   ========================================================= */

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function getIcon(type, size = 17) {
  const icons = {
    Music,
    Movie: Play,
    Place: MapPin,
    Purchase: ShoppingBag,
    Photo: Image,
    Message: MessageCircle,
    Search,
    Event: CalendarDays,
    Note: FileText,
  };

  const Icon =
    icons[type] || Activity;

  return <Icon size={size} />;
}

function getRowById(rows, id) {
  if (!id) {
    return null;
  }

  const prefix = "receipt-";

  if (!id.startsWith(prefix)) {
    return null;
  }

  const index = Number(
    id.slice(prefix.length)
  );

  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= rows.length
  ) {
    return null;
  }

  return rows[index];
}

/* =========================================================
   UPLOAD SCREEN
   ========================================================= */

function DatasetUpload({
  onDatasetLoaded,
  error,
}) {
  const inputRef = useRef(null);

  const [
    isDragging,
    setIsDragging,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    processed,
    setProcessed,
  ] = useState(0);

  async function handleFile(file) {
    if (!file) {
      return;
    }

    setLoading(true);
    setProcessed(0);

    try {
      const result =
        await parseUploadedDataset(
          file,
          (count) => {
            setProcessed(count);
          }
        );

      onDatasetLoaded(result);
    } catch (uploadError) {
      console.error(uploadError);
      setLoading(false);
    }
  }

  function handleInput(event) {
    const file =
      event.target.files?.[0];

    handleFile(file);
  }

  function handleDrop(event) {
    event.preventDefault();

    setIsDragging(false);

    const file =
      event.dataTransfer.files?.[0];

    handleFile(file);
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-orbit">
          <Sparkles size={28} />
        </div>

        <h1>
          Building your life in receipts...
        </h1>

        <p>
          Processing the dataset locally in your browser.
        </p>

        <div className="loading-bar">
          <div />
        </div>

        <div className="loading-progress-text">
          {formatNumber(processed)} moments processed
        </div>

        <div className="loading-status">
          Your data is not being uploaded to a server.
        </div>
      </div>
    );
  }

  return (
    <div className="upload-screen">
      <div className="upload-glow upload-glow-one" />
      <div className="upload-glow upload-glow-two" />

      <div className="upload-brand">
        <div className="brand-mark">
          <Sparkles size={18} />
        </div>

        <div>
          <strong>LifeReceipt</strong>
          <span>
            Your Life, in Receipts
          </span>
        </div>
      </div>

      <main className="upload-content">
        <div className="eyebrow">
          <span className="pulse-dot" />
          FRONTEND-ONLY DATA EXPERIENCE
        </div>

        <h1>
          Turn scattered moments
          <span> into a story.</span>
        </h1>

        <p className="upload-description">
          Upload the provided life-receipts dataset
          and explore the hidden connections between
          music, places, purchases, photos, messages,
          searches, events and notes.
        </p>

        <button
          className={`dataset-dropzone ${
            isDragging
              ? "dragging"
              : ""
          }`}
          onClick={() =>
            inputRef.current?.click()
          }
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() =>
            setIsDragging(false)
          }
          onDrop={handleDrop}
        >
          <div className="upload-icon">
            <FileText size={28} />
          </div>

          <strong>
            Upload your dataset
          </strong>

          <span>
            Drag & drop a CSV here or click to browse
          </span>

          <small>
            CSV files only • Processed locally
          </small>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          hidden
          onChange={handleInput}
        />

        {error && (
          <div className="upload-error">
            <X size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="upload-features">
          <div>
            <Sparkles size={15} />
            <span>
              Discover patterns
            </span>
          </div>

          <div>
            <Activity size={15} />
            <span>
              Connect moments
            </span>
          </div>

          <div>
            <BarChart3 size={15} />
            <span>
              Explore insights
            </span>
          </div>
        </div>

        <p className="upload-privacy">
          Nothing is sent to a backend. The selected
          dataset stays inside this browser session.
        </p>
      </main>
    </div>
  );
}

/* =========================================================
   TOPBAR
   ========================================================= */

function Topbar({
  page,
  setPage,
  dark,
  setDark,
}) {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  function navigate(nextPage) {
    setPage(nextPage);
    setMobileOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <header className="topbar">
      <div
        className="brand"
        onClick={() => navigate("story")}
      >
        <div className="brand-mark">
          <Sparkles size={17} />
        </div>

        <div>
          <strong>LifeReceipt</strong>
          <span>
            Your Life, in Receipts
          </span>
        </div>
      </div>

      <nav
        className={`nav ${
          mobileOpen ? "open" : ""
        }`}
      >
        <button
          className={
            page === "story"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("story")
          }
        >
          <Sparkles size={14} />
          Story
        </button>

        <button
          className={
            page === "explore"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("explore")
          }
        >
          <Search size={14} />
          Explore
        </button>

        <button
          className={
            page === "insights"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("insights")
          }
        >
          <BarChart3 size={14} />
          Insights
        </button>
      </nav>

      <div className="top-actions">
        <button
          className="icon-button"
          onClick={() =>
            setDark((value) => !value)
          }
          aria-label="Toggle theme"
        >
          {dark ? (
            <Sun size={17} />
          ) : (
            <Moon size={17} />
          )}
        </button>

        <button
          className="icon-button mobile-toggle"
          onClick={() =>
            setMobileOpen(
              (value) => !value
            )
          }
          aria-label="Open menu"
        >
          {mobileOpen ? (
            <X size={18} />
          ) : (
            <Menu size={18} />
          )}
        </button>
      </div>
    </header>
  );
}

/* =========================================================
   HERO
   ========================================================= */

function Hero({
  stats,
  fileName,
  onExplore,
}) {
  return (
    <section className="hero">
      <div className="hero-glow glow-one" />
      <div className="hero-glow glow-two" />

      <div className="eyebrow">
        <span className="pulse-dot" />
        A DIGITAL LIFE, RECONSTRUCTED
      </div>

      <h1>
        Hundreds of moments.
        <span> One story.</span>
      </h1>

      <p className="hero-description">
        A collection of disconnected digital moments
        can become something more when the patterns,
        relationships and repetitions between them
        are brought together.
      </p>

      <div className="hero-actions">
        <button
          className="primary-button"
          onClick={onExplore}
        >
          Explore the receipts
          <ArrowRight size={16} />
        </button>

        <div className="secondary-button">
          <FileText size={16} />
          {fileName}
        </div>
      </div>

      <div className="hero-stats">
        <div>
          <strong>
            {formatNumber(
              stats.moments
            )}
          </strong>

          <span>
            moments
          </span>
        </div>

        <div>
          <strong>
            {formatNumber(
              stats.artists
            )}
          </strong>

          <span>
            people / creators
          </span>
        </div>

        <div>
          <strong>
            {formatNumber(
              stats.tracks
            )}
          </strong>

          <span>
            unique items
          </span>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CHAPTER CARD
   ========================================================= */

function ChapterCard({
  chapter,
  rows,
  onOpen,
}) {
  const previewReceipts =
    useMemo(
      () =>
        chapter.previewIds
          .map(
            (id) => rows[id]
          )
          .filter(Boolean)
          .map(rowToReceipt),
      [chapter.previewIds, rows]
    );

  return (
    <button
      className="chapter-card"
      onClick={() =>
        onOpen(chapter)
      }
    >
      <div className="chapter-top">
        <span className="chapter-number">
          CHAPTER{" "}
          {String(
            chapter.id
          ).padStart(2, "0")}
        </span>

        <span className="chapter-arrow">
          <ChevronRight
            size={15}
          />
        </span>
      </div>

      <div
        className={`chapter-icon ${chapter.color}`}
      >
        <Sparkles size={21} />
      </div>

      <div className="chapter-content">
        <span className="chapter-count">
          {formatNumber(
            chapter.count
          )} moments
        </span>

        <h3>
          {chapter.name}
        </h3>

        <p>
          {chapter.description}
        </p>

        <div className="mini-receipts">
          {previewReceipts.map(
            (receipt) => (
              <span
                key={receipt.id}
                className={`mini-icon ${receipt.color}`}
              >
                {getIcon(
                  receipt.type,
                  12
                )}
              </span>
            )
          )}
        </div>
      </div>
    </button>
  );
}

/* =========================================================
   STORY
   ========================================================= */

function StoryView({
  rows,
  stats,
  chapters,
  fileName,
  onExplore,
  onChapter,
}) {
  const graphRows =
    rows.slice(0, 4);

  return (
    <>
      <Hero
        stats={stats}
        fileName={fileName}
        onExplore={onExplore}
      />

      <section className="section-block">
        <div className="section-heading">
          <span className="section-label">
            THE STORY
          </span>

          <h2>
            Your digital life,
            chapter by chapter.
          </h2>

          <p>
            The dataset is not treated as a simple
            timeline. Moments are grouped into periods
            so that changes, repetitions and patterns
            become easier to discover.
          </p>
        </div>

        <div className="chapter-grid">
          {chapters.map(
            (chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                rows={rows}
                onOpen={onChapter}
              />
            )
          )}
        </div>
      </section>

      <ConnectionSection
        rows={graphRows}
        onExplore={onExplore}
      />

      <section className="closing-section">
        <div className="closing-card">
          <Sparkles size={25} />

          <div>
            <h2>
              The interesting part is not
              what happened. It is what
              happened together.
            </h2>
          </div>
        </div>
      </section>
    </>
  );
}

/* =========================================================
   CONNECTION GRAPH
   ========================================================= */

function ConnectionSection({
  rows,
  onExplore,
}) {
  const graphData = rows.map(
    (row) => rowToReceipt(row)
  );

  return (
    <section className="connection-section">
      <div className="connection-copy">
        <span className="section-label">
          CONNECTIONS
        </span>

        <h2>
          Disconnected moments
          start connecting.
        </h2>

        <p>
          A song, a place, a purchase or a message
          can look insignificant on its own. Viewed
          together, repeated categories and shared
          context can reveal the larger shape of a
          period.
        </p>

        <button
          className="text-button"
          onClick={onExplore}
        >
          Explore the connections
          <ArrowRight size={15} />
        </button>
      </div>

      <div className="graph-card">
        <div className="graph-title">
          <span>
            MOMENT CONNECTIONS
          </span>

          <span className="live-badge">
            <span />
            DATA ACTIVE
          </span>
        </div>

        <div className="graph">
          <div className="graph-line line-one" />
          <div className="graph-line line-two" />
          <div className="graph-line line-three" />

          {graphData[0] && (
            <GraphNode
              receipt={graphData[0]}
              className="node-one"
            />
          )}

          {graphData[1] && (
            <GraphNode
              receipt={graphData[1]}
              className="node-two"
            />
          )}

          {graphData[2] && (
            <GraphNode
              receipt={graphData[2]}
              className="node-three"
            />
          )}

          {graphData[3] && (
            <GraphNode
              receipt={graphData[3]}
              className="node-four"
            />
          )}
        </div>

        <div className="graph-caption">
          <Lightbulb size={13} />
          Patterns become visible when different
          moments are viewed together.
        </div>
      </div>
    </section>
  );
}

function GraphNode({
  receipt,
  className,
}) {
  return (
    <div
      className={`graph-node ${className}`}
    >
      <div
        className={`graph-node-icon ${receipt.color}`}
      >
        {getIcon(
          receipt.type,
          14
        )}
      </div>

      <div>
        <span>
          {receipt.type}
        </span>

        <strong>
          {receipt.title.length >
          20
            ? `${receipt.title.slice(
                0,
                20
              )}…`
            : receipt.title}
        </strong>
      </div>
    </div>
  );
}

/* =========================================================
   EXPLORE
   ========================================================= */

function ExploreView({
  rows,
  signalCounts,
  onReceipt,
}) {
  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  const [search, setSearch] =
    useState("");

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("All");

  const [
    visibleCount,
    setVisibleCount,
  ] = useState(60);

  useEffect(() => {
    const timer =
      setTimeout(() => {
        setSearch(searchInput);
      }, 180);

    return () =>
      clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setVisibleCount(60);
  }, [
    search,
    activeCategory,
  ]);

  const filteredRows =
    useMemo(
      () =>
        filterRows(
          rows,
          search,
          activeCategory
        ),
      [
        rows,
        search,
        activeCategory,
      ]
    );

  const visibleRows =
    useMemo(
      () =>
        filteredRows.slice(
          0,
          visibleCount
        ),
      [
        filteredRows,
        visibleCount,
      ]
    );

  /*
   * Lazy conversion.
   *
   * At most 60 receipt objects are created here.
   */
  const visibleReceipts =
    useMemo(
      () =>
        visibleRows.map(
          rowToReceipt
        ),
      [visibleRows]
    );

  const hasMore =
    visibleCount <
    filteredRows.length;

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <span className="section-label">
            EXPLORE
          </span>

          <h1>
            Every moment
            matters.
          </h1>

          <p>
            Search through the dataset and discover
            the individual fragments behind the story.
          </p>
        </div>

        <div className="result-count">
          <strong>
            {formatNumber(
              filteredRows.length
            )}
          </strong>

          <span>
            matching moments
          </span>
        </div>
      </div>

      <div className="search-panel">
        <div className="search-box">
          <Search size={17} />

          <input
            value={searchInput}
            onChange={(event) =>
              setSearchInput(
                event.target.value
              )
            }
            placeholder="Search moments, people, places, dates..."
          />

          {searchInput && (
            <button
              className="clear-search"
              onClick={() =>
                setSearchInput("")
              }
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <button className="filter-toggle">
          <Filter size={15} />
          Filters
        </button>
      </div>

      <div className="category-bar">
        {CATEGORIES.map(
          (category) => (
            <button
              key={category}
              className={
                activeCategory ===
                category
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveCategory(
                  category
                )
              }
            >
              {category !==
                "All" &&
                getIcon(
                  category,
                  12
                )}

              {category}

              <span>
                {formatNumber(
                  signalCounts[
                    category
                  ] || 0
                )}
              </span>
            </button>
          )
        )}
      </div>

      {visibleReceipts.length >
      0 ? (
        <>
          <div className="receipt-grid">
            {visibleReceipts.map(
              (receipt) => (
                <ReceiptCard
                  key={receipt.id}
                  receipt={receipt}
                  onClick={() =>
                    onReceipt(
                      receipt.id
                    )
                  }
                />
              )
            )}
          </div>

          {hasMore && (
            <div className="load-more-container">
              <span className="load-more-count">
                Showing{" "}
                {formatNumber(
                  visibleReceipts.length
                )}{" "}
                of{" "}
                {formatNumber(
                  filteredRows.length
                )}
              </span>

              <button
                className="primary-button"
                onClick={() =>
                  setVisibleCount(
                    (count) =>
                      count + 60
                  )
                }
              >
                Load more
                <ArrowRight
                  size={15}
                />
              </button>
            </div>
          )}

          {!hasMore && (
            <div className="load-more-count complete">
              All matching moments are visible.
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <Search size={30} />

          <h3>
            No moments found
          </h3>

          <p>
            Try another search or category.
          </p>
        </div>
      )}
    </main>
  );
}

/* =========================================================
   RECEIPT CARD
   ========================================================= */

function ReceiptCard({
  receipt,
  onClick,
}) {
  return (
    <button
      className="receipt-card"
      onClick={onClick}
    >
      <div className="receipt-card-top">
        <div
          className={`receipt-icon ${receipt.color}`}
        >
          {getIcon(
            receipt.type,
            16
          )}
        </div>

        <span className="receipt-type">
          {receipt.type}
        </span>

        <ChevronRight
          size={14}
          className="receipt-arrow"
        />
      </div>

      <div className="receipt-date">
        <Clock3 size={11} />

        {receipt.date ||
          "Undated"}

        {receipt.time &&
          ` • ${receipt.time}`}
      </div>

      <h3>
        {receipt.title}
      </h3>

      {receipt.subtitle && (
        <p>
          {receipt.subtitle}
        </p>
      )}

      {receipt.location && (
        <div className="receipt-location">
          <MapPin size={10} />
          {receipt.location}
        </div>
      )}

      <div className="receipt-tags">
        {receipt.tags.map(
          (tag) => (
            <span key={tag}>
              #{tag}
            </span>
          )
        )}
      </div>
    </button>
  );
}

/* =========================================================
   INSIGHTS
   ========================================================= */

function InsightsView({
  insights,
  stats,
  signalCounts,
  rows,
  onReceipt,
}) {
  const topInsight =
    insights[0];

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <span className="section-label">
            INSIGHTS
          </span>

          <h1>
            What does it mean?
          </h1>

          <p>
            The dataset becomes more interesting when
            recurring behaviour and relationships are
            pulled out of the individual records.
          </p>
        </div>
      </div>

      {topInsight && (
        <div className="insight-hero">
          <div className="insight-hero-icon">
            <Lightbulb size={25} />
          </div>

          <div>
            <span>
              A PATTERN EMERGES
            </span>

            <h2>
              {topInsight.title}
            </h2>

            <p>
              {topInsight.text}
            </p>
          </div>
        </div>
      )}

      <div className="insight-grid">
        {insights.map(
          (insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              rows={rows}
              onReceipt={onReceipt}
            />
          )
        )}
      </div>

      <section className="pattern-section">
        <div className="pattern-header">
          <span className="section-label">
            DIGITAL SIGNATURE
          </span>

          <h2>
            What fills the story?
          </h2>
        </div>

        <div className="signal-list">
          {CATEGORIES.filter(
            (category) =>
              category !== "All"
          ).map(
            (category) => {
              const count =
                signalCounts[
                  category
                ] || 0;

              const percentage =
                rows.length
                  ? Math.round(
                      (count /
                        rows.length) *
                        100
                    )
                  : 0;

              return (
                <div
                  className="signal-row"
                  key={category}
                >
                  <div className="signal-name">
                    <span>
                      {category}
                    </span>

                    <strong>
                      {formatNumber(
                        count
                      )}
                    </strong>
                  </div>

                  <div className="signal-track">
                    <div
                      className="signal-fill"
                      style={{
                        width: `${Math.min(
                          100,
                          percentage
                        )}%`,
                      }}
                    />
                  </div>

                  <span className="signal-percent">
                    {percentage}%
                  </span>
                </div>
              );
            }
          )}
        </div>
      </section>
    </main>
  );
}

function InsightCard({
  insight,
  rows,
  onReceipt,
}) {
  return (
    <div className="insight-card">
      <div className="insight-icon">
        <Sparkles size={18} />
      </div>

      <span className="insight-kicker">
        PATTERN
      </span>

      <h3>
        {insight.title}
      </h3>

      <p>
        {insight.text}
      </p>

      <div className="related-row">
        {insight.related
          .slice(0, 5)
          .map((index) => {
            const row =
              rows[index];

            if (!row) {
              return null;
            }

            return (
              <button
                key={index}
                onClick={() =>
                  onReceipt(
                    `receipt-${index}`
                  )
                }
              >
                {row.type}
              </button>
            );
          })}
      </div>
    </div>
  );
}

/* =========================================================
   RECEIPT MODAL
   ========================================================= */

function ReceiptModal({
  row,
  onClose,
}) {
  /*
   * Only ONE receipt is converted.
   */
  const receipt = useMemo(
    () =>
      row
        ? rowToReceipt(row)
        : null,
    [row]
  );

  useEffect(() => {
    if (!row) {
      return;
    }

    function handleKey(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleKey
    );

    return () =>
      document.removeEventListener(
        "keydown",
        handleKey
      );
  }, [row, onClose]);

  if (!receipt) {
    return null;
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="receipt-modal">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div
          className={`modal-icon ${receipt.color}`}
        >
          {getIcon(
            receipt.type,
            23
          )}
        </div>

        <span className="modal-type">
          {receipt.type}
        </span>

        <h2>
          {receipt.title}
        </h2>

        {receipt.subtitle && (
          <p className="modal-subtitle">
            {receipt.subtitle}
          </p>
        )}

        <div className="modal-meta">
          <div>
            <CalendarDays
              size={14}
            />

            <span>
              Date
              <strong>
                {receipt.date ||
                  "Unknown"}
              </strong>
            </span>
          </div>

          <div>
            <Clock3 size={14} />

            <span>
              Time
              <strong>
                {receipt.time ||
                  "Unknown"}
              </strong>
            </span>
          </div>

          {receipt.location && (
            <div>
              <MapPin size={14} />

              <span>
                Location
                <strong>
                  {receipt.location}
                </strong>
              </span>
            </div>
          )}

          {row.platform && (
            <div>
              <Activity size={14} />

              <span>
                Source
                <strong>
                  {row.platform}
                </strong>
              </span>
            </div>
          )}
        </div>

        <div className="modal-story">
          <span>
            WHY THIS MOMENT MATTERS
          </span>

          <p>
            {receipt.description}
          </p>
        </div>

        <div className="modal-tags">
          {receipt.tags.map(
            (tag) => (
              <span key={tag}>
                #{tag}
              </span>
            )
          )}
        </div>

        <div className="modal-chapter">
          <span>
            CHAPTER
          </span>

          <strong>
            {row.chapter}
          </strong>
        </div>

        {(row.artist ||
          row.album ||
          row.amount ||
          row.duration > 0) && (
          <div className="modal-extra-data">
            {row.artist && (
              <div>
                <span>
                  Artist
                </span>

                <strong>
                  {row.artist}
                </strong>
              </div>
            )}

            {row.album && (
              <div>
                <span>
                  Album
                </span>

                <strong>
                  {row.album}
                </strong>
              </div>
            )}

            {row.amount && (
              <div>
                <span>
                  Amount
                </span>

                <strong>
                  {row.amount}
                </strong>
              </div>
            )}

            {row.duration > 0 && (
              <div>
                <span>
                  Duration
                </span>

                <strong>
                  {Math.round(
                    row.duration /
                      60000
                  )}{" "}
                  min
                </strong>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   CHAPTER MODAL
   ========================================================= */

function ChapterModal({
  chapter,
  rows,
  onClose,
  onReceipt,
}) {
  const chapterRows =
    useMemo(
      () =>
        chapter
          ? getChapterRows(
              rows,
              chapter.name
            )
          : [],
      [chapter, rows]
    );

  /*
   * Do not render thousands of records inside
   * the modal.
   */
  const previewRows =
    chapterRows.slice(0, 100);

  useEffect(() => {
    if (!chapter) {
      return;
    }

    function handleKey(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleKey
    );

    return () =>
      document.removeEventListener(
        "keydown",
        handleKey
      );
  }, [
    chapter,
    onClose,
  ]);

  if (!chapter) {
    return null;
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="chapter-modal">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div
          className={`modal-icon ${chapter.color}`}
        >
          <Sparkles size={23} />
        </div>

        <span className="modal-type">
          CHAPTER
        </span>

        <h2>
          {chapter.name}
        </h2>

        <p className="chapter-modal-description">
          {chapter.description}
        </p>

        <div className="chapter-summary">
          <div>
            <strong>
              {formatNumber(
                chapterRows.length
              )}
            </strong>

            <span>
              moments
            </span>
          </div>

          <div>
            <strong>
              {chapterRows.length
                ? new Set(
                    chapterRows.map(
                      (row) =>
                        row.type
                    )
                  ).size
                : 0}
            </strong>

            <span>
              categories
            </span>
          </div>
        </div>

        <div className="chapter-receipts">
          {previewRows.map(
            (row) => {
              const receipt =
                rowToReceipt(
                  row
                );

              return (
                <button
                  key={receipt.id}
                  onClick={() =>
                    onReceipt(
                      receipt.id
                    )
                  }
                >
                  <span
                    className={`mini-modal-icon ${receipt.color}`}
                  >
                    {getIcon(
                      receipt.type,
                      13
                    )}
                  </span>

                  <span>
                    <strong>
                      {receipt.title}
                    </strong>

                    <span>
                      {receipt.date}
                      {receipt.subtitle
                        ? ` • ${receipt.subtitle}`
                        : ""}
                    </span>
                  </span>

                  <ChevronRight
                    size={13}
                  />
                </button>
              );
            }
          )}
        </div>

        {chapterRows.length >
          100 && (
          <div className="chapter-more">
            Showing the first 100 moments
            from this chapter. Use Explore to
            search the complete dataset.
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   FOOTER
   ========================================================= */

function Footer() {
  return (
    <footer className="footer">
      <div>
        <Sparkles size={12} />
        LifeReceipt
      </div>

      <div>
        Frontend-only • Data stays in your browser
      </div>
    </footer>
  );
}

/* =========================================================
   MAIN APP
   ========================================================= */

export default function App() {
  const [
    dataset,
    setDataset,
  ] = useState(null);

  const [
    selectedReceipt,
    setSelectedReceipt,
  ] = useState(null);

  const [
    selectedChapter,
    setSelectedChapter,
  ] = useState(null);

  const [
    page,
    setPage,
  ] = useState("story");

  const [
    dark,
    setDark,
  ] = useState(true);

  const [
    uploadError,
    setUploadError,
  ] = useState("");

  const stats = useMemo(
    () =>
      dataset
        ? buildStats(
            dataset.rows
          )
        : null,
    [dataset]
  );

  const chapters = useMemo(
    () =>
      dataset
        ? buildChapterSummaries(
            dataset.rows
          )
        : [],
    [dataset]
  );

  const insights = useMemo(
    () =>
      dataset
        ? buildInsights(
            dataset.rows
          )
        : [],
    [dataset]
  );

  const signalCounts =
    useMemo(
      () =>
        dataset
          ? buildSignalCounts(
              dataset.rows
            )
          : {},
      [dataset]
    );

  function handleDatasetLoaded(
    result
  ) {
    setUploadError("");

    setDataset(result);

    setSelectedReceipt(
      null
    );

    setSelectedChapter(
      null
    );

    setPage("story");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleReceipt(id) {
    if (!dataset) {
      return;
    }

    const row = getRowById(
      dataset.rows,
      id
    );

    if (row) {
      setSelectedReceipt(
        row
      );
    }
  }

  function handleChapter(
    chapter
  ) {
    setSelectedChapter(
      chapter
    );
  }

  function handleResetDataset() {
    setDataset(null);
    setSelectedReceipt(
      null
    );
    setSelectedChapter(
      null
    );
    setPage("story");
  }

  if (!dataset) {
    return (
      <div className="app">
        <DatasetUpload
          onDatasetLoaded={
            handleDatasetLoaded
          }
          error={uploadError}
        />
      </div>
    );
  }

  return (
    <div
      className={`app ${
        dark ? "" : "light"
      }`}
    >
      <Topbar
        page={page}
        setPage={setPage}
        dark={dark}
        setDark={setDark}
      />

      {page === "story" && (
        <StoryView
          rows={dataset.rows}
          stats={stats}
          chapters={chapters}
          fileName={
            dataset.fileName
          }
          onExplore={() =>
            setPage("explore")
          }
          onChapter={
            handleChapter
          }
        />
      )}

      {page === "explore" && (
        <ExploreView
          rows={dataset.rows}
          signalCounts={
            signalCounts
          }
          onReceipt={
            handleReceipt
          }
        />
      )}

      {page === "insights" && (
        <InsightsView
          insights={insights}
          stats={stats}
          signalCounts={
            signalCounts
          }
          rows={dataset.rows}
          onReceipt={
            handleReceipt
          }
        />
      )}

      <section className="dataset-control-section">
        <div>
          <span>
            CURRENT DATASET
          </span>

          <strong>
            {dataset.fileName}
          </strong>
        </div>

        <button
          className="secondary-button"
          onClick={
            handleResetDataset
          }
        >
          <FileText size={14} />
          Upload another dataset
        </button>
      </section>

      <Footer />

      {selectedReceipt && (
        <ReceiptModal
          row={
            selectedReceipt
          }
          onClose={() =>
            setSelectedReceipt(
              null
            )
          }
        />
      )}

      {selectedChapter && (
        <ChapterModal
          chapter={
            selectedChapter
          }
          rows={dataset.rows}
          onClose={() =>
            setSelectedChapter(
              null
            )
          }
          onReceipt={
            handleReceipt
          }
        />
      )}
    </div>
  );
}