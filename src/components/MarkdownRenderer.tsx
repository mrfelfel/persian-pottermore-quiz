'use client';
import Markdown from 'react-markdown';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <Markdown
      components={{
        h2: ({children}) => <h2 className="text-lg font-bold mt-8 mb-4" style={{color: 'var(--tg-text)'}}>{children}</h2>,
        h3: ({children}) => <h3 className="text-base font-bold mt-6 mb-3" style={{color: 'var(--tg-text)'}}>{children}</h3>,
        p: ({children}) => <p className="text-[14px] leading-[2] mb-4" style={{color: 'var(--tg-text)'}}>{children}</p>,
        blockquote: ({children}) => (
          <blockquote className="border-r-2 pr-4 my-4 italic" style={{borderColor: 'var(--tg-button)', color: 'var(--tg-hint)'}}>
            {children}
          </blockquote>
        ),
        hr: () => <hr className="my-6 opacity-20" style={{borderColor: 'var(--tg-hint)'}} />,
        a: ({href, children}) => (
          <a href={href} target="_blank" rel="noopener" style={{color: 'var(--tg-link)'}}>{children}</a>
        ),
        ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1 text-[14px] leading-[2]" style={{color: 'var(--tg-text)'}}>{children}</ul>,
        ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1 text-[14px] leading-[2]" style={{color: 'var(--tg-text)'}}>{children}</ol>,
        strong: ({children}) => <strong className="font-bold" style={{color: 'var(--tg-text)'}}>{children}</strong>,
        code: ({children}) => (
          <code className="px-1.5 py-0.5 rounded text-[13px]" style={{background: 'var(--tg-bg)', color: 'var(--tg-button)'}}>
            {children}
          </code>
        ),
        table: ({children}) => (
          <div className="overflow-x-auto my-4">
            <table className="w-full text-[13px]">{children}</table>
          </div>
        ),
        th: ({children}) => (
          <th className="text-right px-3 py-2 font-bold" style={{background: 'var(--tg-bg-secondary)', color: 'var(--tg-text)'}}>{children}</th>
        ),
        td: ({children}) => (
          <td className="text-right px-3 py-2 border-t" style={{borderColor: 'rgba(255,255,255,0.06)', color: 'var(--tg-text)'}}>{children}</td>
        ),
      }}
    >
      {content}
    </Markdown>
  );
}
