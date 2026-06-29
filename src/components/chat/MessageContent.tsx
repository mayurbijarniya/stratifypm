import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneLight,
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../../hooks/useTheme";
import { ChevronDown, ChevronRight, Sparkles } from "../ui/icons";
import { useAppStore } from "../../stores/appStore";
import { motion, AnimatePresence } from "framer-motion";

interface MessageContentProps {
  content: string;
  isUser?: boolean;
  isStreaming?: boolean;
}

export const MessageContent: React.FC<MessageContentProps> = ({ content, isUser, isStreaming }) => {
  const { isDark } = useTheme();
  const selectedModel = useAppStore((state) => state.selectedModel);

  const thinkRegex = new RegExp("<think>([\\s\\S]*?)(?:</think>|$)", "i");
  const match = content.match(thinkRegex);
  
  let thinking = "";
  let mainContent = content;
  let hasThink = false;
  let isThinkingUnfinished = false;

  if (match) {
    hasThink = true;
    thinking = match[1].trim();
    isThinkingUnfinished = !content.includes("</think>");
    mainContent = content.replace(thinkRegex, "").trim();
  } else if (content.includes("</think>")) {
    hasThink = true;
    const parts = content.split("</think>");
    thinking = parts[0].trim();
    mainContent = parts.slice(1).join("</think>").trim();
    isThinkingUnfinished = false;
  } else if (selectedModel === "subconscious-glm" && !isUser && isStreaming) {
    hasThink = true;
    thinking = content.trim();
    mainContent = "";
    isThinkingUnfinished = true;
  }

  const [isExpanded, setIsExpanded] = useState(isThinkingUnfinished);
  const [lastUnfinished, setLastUnfinished] = useState(isThinkingUnfinished);

  // If thinking state changes (e.g. thinking finished streaming), auto-collapse
  if (isThinkingUnfinished !== lastUnfinished) {
    setIsExpanded(isThinkingUnfinished);
    setLastUnfinished(isThinkingUnfinished);
  }

  return (
    <div className="prose prose-sm max-w-none">
      {hasThink && thinking && (
        <div className="mb-4 rounded-xl border border-border bg-muted/30 overflow-hidden shadow-sm">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted/80 transition-colors text-left focus:outline-none"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className={`w-3.5 h-3.5 text-primary ${isThinkingUnfinished ? "animate-spin" : ""}`} style={isThinkingUnfinished ? { animationDuration: "3s" } : undefined} />
              <span>{isThinkingUnfinished ? "Thinking..." : "Thinking Process"}</span>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-4 py-3 border-t border-border bg-muted/10 text-sm text-muted-foreground italic leading-relaxed whitespace-pre-wrap">
                  {thinking}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {(!hasThink || mainContent) && (
        <ReactMarkdown
          remarkPlugins={ [remarkGfm] }
          components={ {
          code({ inline, className, children, ...props }: React.ComponentPropsWithoutRef<"code"> & { inline?: boolean }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                style={ (isDark ? oneDark : oneLight) as any }
                language={ match[1] }
                PreTag="div"
                { ...props }
              >
                { String(children).replace(/\n$/, "") }
              </SyntaxHighlighter>
            ) : (
              <code
                className={ `${className} bg-muted px-1.5 py-0.5 rounded text-sm font-mono` }
                { ...props }
              >
                { children }
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 rounded-lg border border-border shadow-sm">
                <table className="min-w-full divide-y divide-border">
                  { children }
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-muted/50">{ children }</thead>;
          },
          tbody({ children }) {
            return (
              <tbody className="bg-background divide-y divide-border">
                { children }
              </tbody>
            );
          },
          tr({ children }) {
            return (
              <tr className="hover:bg-muted/30 transition-colors duration-150">
                { children }
              </tr>
            );
          },
          th({ children }) {
            return (
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold text-current uppercase tracking-wider border-b border-border">
                { children }
              </th>
            );
          },
          td({ children }) {
            // Convert <br> tags to actual line breaks
            const processContent = (content: React.ReactNode): React.ReactNode => {
              if (typeof content === "string") {
                return content
                  .split("<br>")
                  .map((part, index, array) =>
                    index < array.length - 1 ? [part, <br key={ index } />] : part
                  )
                  .flat();
              }
              return content;
            };

            return (
              <td className="px-2 py-2 sm:px-4 sm:py-3 text-sm text-current border-r border-border last:border-r-0 whitespace-pre-wrap">
                { Array.isArray(children)
                  ? children.map((child) => processContent(child))
                  : processContent(children) }
              </td>
            );
          },
          h1({ children }) {
            return (
              <h1 className="text-2xl font-bold text-current mb-4 mt-6 first:mt-0 leading-tight">
                { children }
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-xl font-bold text-current mb-3 mt-5 first:mt-0 leading-tight">
                { children }
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-lg font-bold text-current mb-2 mt-4 first:mt-0 leading-tight">
                { children }
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 className="text-base font-bold text-current mb-2 mt-3 first:mt-0 leading-tight">
                { children }
              </h4>
            );
          },
          p({ children }) {
            return (
              <p className="text-current leading-relaxed mb-4 last:mb-0">
                { children }
              </p>
            );
          },
          strong({ children }) {
            return (
              <strong
                className="font-bold text-current"
                style={ { fontWeight: 700 } }
              >
                { children }
              </strong>
            );
          },
          em({ children }) {
            return <em className="italic text-current">{ children }</em>;
          },
          ul({ children }) {
            return <ul className="mb-4 space-y-2 pl-0">{ children }</ul>;
          },
          ol({ children }) {
            return (
              <ol
                className="mb-4 space-y-2 pl-0"
                style={ { counterReset: "list-counter" } }
              >
                { children }
              </ol>
            );
          },
          li({ children }) {
            return (
              <li className="text-current leading-relaxed pl-6 relative">
                { children }
              </li>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4 bg-muted/30 py-2 rounded-r-lg">
                { children }
              </blockquote>
            );
          },
          hr() {
            return <hr className="my-6 border-border" />;
          },
          a({ href, children }) {
            return (
              <a
                href={ href }
                className="text-primary hover:text-primary/80 underline transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                { children }
              </a>
            );
          },
        } }
      >
        { mainContent }
      </ReactMarkdown>
      )}
    </div>
  );
};
