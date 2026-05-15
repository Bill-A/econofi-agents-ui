'use client';

import { useState, useRef } from 'react';
import { generateNarrative, parseNarrative } from '@/lib/narratives';
import type { BsaAmlAlert } from '@/lib/types';

interface Props {
  alert: BsaAmlAlert;
}

export function SARNarrativePanel({ alert }: Props) {
  const [institutionType, setInstitutionType] = useState<'bank' | 'credit_union'>('bank');
  const [copied, setCopied] = useState(false);
  const narrativeRef = useRef<HTMLDivElement>(null);

  const narrativeText = generateNarrative(alert, institutionType);
  const segments = parseNarrative(narrativeText);

  const handleCopy = () => {
    if (narrativeRef.current) {
      navigator.clipboard.writeText(narrativeRef.current.innerText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleDownload = async () => {
    const { Document, Packer, Paragraph, TextRun, AlignmentType } = await import('docx');

    const SECTION_HEADERS = new Set([
      'SUBJECT OF SUSPICIOUS ACTIVITY',
      'DESCRIPTION OF SUSPICIOUS ACTIVITY',
      'MDI CONTEXT — REVIEW BEFORE FILING',
      'INVESTIGATION CONDUCTED',
      'BASIS FOR FILING',
      'FILING INSTITUTION',
    ]);

    const PLACEHOLDER_RE_DOCX = /\[([A-Z][^\[\]]*— REVIEW REQUIRED)\]/g;

    function buildRuns(line: string) {
      const runs = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      PLACEHOLDER_RE_DOCX.lastIndex = 0;
      while ((match = PLACEHOLDER_RE_DOCX.exec(line)) !== null) {
        if (match.index > lastIndex) {
          runs.push(new TextRun({ text: line.slice(lastIndex, match.index), font: 'Courier New', size: 18 }));
        }
        runs.push(new TextRun({ text: match[0], font: 'Courier New', size: 18, color: 'C8870A', bold: true }));
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < line.length) {
        runs.push(new TextRun({ text: line.slice(lastIndex), font: 'Courier New', size: 18 }));
      }
      return runs.length ? runs : [new TextRun({ text: line, font: 'Courier New', size: 18 })];
    }

    const paragraphs = [
      new Paragraph({
        children: [new TextRun({ text: 'DRAFT — NOT A FILED SAR', bold: true, color: 'B91C1C', size: 20, font: 'Arial' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [new TextRun({ text: `Alert ID: ${alert.alert_id}  ·  Risk Score: ${alert.risk_score}/100`, color: 'B91C1C', size: 16, font: 'Arial' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
    ];

    for (const line of narrativeText.split('\n')) {
      if (SECTION_HEADERS.has(line.trim())) {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: line, bold: true, font: 'Courier New', size: 18 })],
          spacing: { before: 240, after: 120 },
        }));
      } else if (line.trim() === '') {
        paragraphs.push(new Paragraph({ children: [new TextRun({ text: '' })], spacing: { after: 80 } }));
      } else {
        paragraphs.push(new Paragraph({ children: buildRuns(line), spacing: { after: 0 } }));
      }
    }

    const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SAR-Draft-${alert.alert_id}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border border-[#e9ecef] rounded-lg overflow-hidden mt-2 mb-5">

      {/* Panel header */}
      <div className="bg-[#f7f8fa] border-b border-[#e9ecef] px-4 py-3 flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-[#13204c] uppercase tracking-wide">SAR Narrative Draft</span>
          <span className="ml-2 text-sm font-mono text-[#3d4557]">{alert.alert_id}</span>
        </div>
        <div className="flex items-center gap-1 bg-white border border-[#e9ecef] rounded-md p-0.5">
          <button
            type="button"
            onClick={() => setInstitutionType('bank')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              institutionType === 'bank'
                ? 'bg-[#13204c] text-white'
                : 'text-[#3d4557] hover:text-[#13204c]'
            }`}
          >
            Bank
          </button>
          <button
            type="button"
            onClick={() => setInstitutionType('credit_union')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              institutionType === 'credit_union'
                ? 'bg-[#13204c] text-white'
                : 'text-[#3d4557] hover:text-[#13204c]'
            }`}
          >
            Credit Union
          </button>
        </div>
      </div>

      {/* Draft banner */}
      <div className="bg-red-50 border-b border-red-100 px-4 py-2 flex items-center gap-2">
        <span className="text-red-600 text-sm">⚠</span>
        <p className="text-xs text-red-700">
          <strong>DRAFT — NOT A FILED SAR.</strong> Review, complete all highlighted sections, and edit before use.
          Filing is solely the responsibility of your institution and its BSA Officer.
        </p>
      </div>

      {/* Narrative legend */}
      <div className="px-4 py-2 border-b border-[#e9ecef] bg-white flex items-center gap-2">
        <span className="text-xs font-mono font-bold text-amber-600">[PLACEHOLDER — REVIEW REQUIRED]</span>
        <span className="text-xs text-[#3d4557]">= sections requiring your review and completion</span>
      </div>

      {/* Narrative body */}
      <div
        ref={narrativeRef}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        className="px-5 py-5 font-mono text-sm leading-7 text-[#1a1d26] bg-white whitespace-pre-wrap outline-none focus:ring-1 focus:ring-[#13204c] min-h-128"
      >
        {segments.map((seg, i) =>
          seg.type === 'placeholder' ? (
            <span key={i} className="text-amber-600 font-bold bg-amber-50 rounded px-0.5">{seg.value}</span>
          ) : (
            <span key={i}>{seg.value}</span>
          )
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-[#f7f8fa] border-t border-[#e9ecef] flex items-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="px-3 py-1.5 text-xs font-medium bg-[#13204c] text-white rounded hover:bg-[#1c2f6b] transition-colors"
        >
          {copied ? 'Copied ✓' : 'Copy to clipboard'}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="px-3 py-1.5 text-xs font-medium border border-[#e9ecef] bg-white text-[#3d4557] rounded hover:border-[#13204c] hover:text-[#13204c] transition-colors"
        >
          Download Word doc
        </button>
        <span className="text-xs font-mono text-[#3d4557] ml-auto">
          Edit inline before copying or downloading
        </span>
      </div>
    </div>
  );
}
