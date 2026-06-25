import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Word-level caption for TikTok-style highlight display
export interface WordCaption {
  word: string;
  startMs: number;
  endMs: number;
}

interface CaptionOverlayProps {
  words: WordCaption[];
  // How many words to show at once in a "page" (item-count cap).
  wordsPerPage?: number;
  // Soft character budget per page. A page breaks before adding a word that
  // would push its total characters past this limit. Essential for CJK:
  // Chinese caption items are often whole phrases, so paging purely by item
  // count (6 phrases) produces oversized subtitle blocks that obscure the
  // scene. Counting characters keeps both Latin word-lists and CJK phrases
  // tidy. Set very high to effectively disable and rely on wordsPerPage only.
  maxCharsPerPage?: number;
  fontSize?: number;
  color?: string;
  highlightColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
}

interface CaptionPage {
  words: WordCaption[];
  startMs: number;
  endMs: number;
}

function buildPages(
  words: WordCaption[],
  wordsPerPage: number,
  maxCharsPerPage: number,
): CaptionPage[] {
  const pages: CaptionPage[] = [];
  let page: WordCaption[] = [];
  let pageChars = 0;
  for (const w of words) {
    // +1 accounts for the inter-word separator added at render time.
    const wChars = w.word.length + 1;
    const wouldExceed =
      page.length >= wordsPerPage ||
      (page.length > 0 && pageChars + wChars > maxCharsPerPage);
    if (wouldExceed) {
      pages.push({
        words: page,
        startMs: page[0].startMs,
        endMs: page[page.length - 1].endMs,
      });
      page = [];
      pageChars = 0;
    }
    page.push(w);
    pageChars += wChars;
  }
  if (page.length > 0) {
    pages.push({
      words: page,
      startMs: page[0].startMs,
      endMs: page[page.length - 1].endMs,
    });
  }
  return pages;
}

const PageRenderer: React.FC<{
  page: CaptionPage;
  fontSize: number;
  color: string;
  highlightColor: string;
  backgroundColor: string;
  fontFamily: string;
}> = ({ page, fontSize, color, highlightColor, backgroundColor, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentMs = page.startMs + (frame / fps) * 1000;

  // Spring entrance
  const entrance = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 80,
      }}
    >
      <div
        style={{
          opacity: entrance,
          transform: `translateY(${interpolate(entrance, [0, 1], [20, 0])}px)`,
          backgroundColor,
          borderRadius: 12,
          padding: "14px 28px",
          maxWidth: "80%",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize,
            fontWeight: 700,
            fontFamily,
            lineHeight: 1.4,
            whiteSpace: "pre-wrap",
          }}
        >
          {page.words.map((w, i) => {
            const isActive = w.startMs <= currentMs && w.endMs > currentMs;
            const isPast = w.endMs <= currentMs;
            return (
              <span
                key={`${w.startMs}-${i}`}
                style={{
                  color: isActive ? highlightColor : isPast ? color : `${color}99`,
                  transition: "none", // CSS transitions forbidden in Remotion
                  textShadow: isActive
                    ? `0 0 20px ${highlightColor}66, 0 2px 4px rgba(0,0,0,0.5)`
                    : "0 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                {w.word}{i < page.words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const CaptionOverlay: React.FC<CaptionOverlayProps> = ({
  words,
  wordsPerPage = 6,
  maxCharsPerPage = 24,
  fontSize = 42,
  color = "#F8FAFC",
  highlightColor = "#22D3EE",
  backgroundColor = "rgba(15, 23, 42, 0.75)",
  fontFamily = "Space Grotesk, Inter, system-ui, sans-serif",
}) => {
  const { fps } = useVideoConfig();
  const pages = buildPages(words, wordsPerPage, maxCharsPerPage);

  return (
    <AbsoluteFill>
      {pages.map((page, i) => {
        const fromFrame = Math.round((page.startMs / 1000) * fps);
        const nextStart = pages[i + 1]?.startMs ?? page.endMs + 500;
        const duration = Math.max(
          1,
          Math.round(((nextStart - page.startMs) / 1000) * fps)
        );

        return (
          <Sequence key={i} from={fromFrame} durationInFrames={duration}>
            <PageRenderer
              page={page}
              fontSize={fontSize}
              color={color}
              highlightColor={highlightColor}
              backgroundColor={backgroundColor}
              fontFamily={fontFamily}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
