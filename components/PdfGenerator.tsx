
import React from 'react';
import jsPDF from 'jspdf';
import { Download, ShieldCheck } from 'lucide-react';
import { SeoReport, UserPlan } from '../types';

interface PdfGeneratorProps {
  report: SeoReport;
  userPlan: UserPlan;
}

export const PdfGenerator: React.FC<PdfGeneratorProps> = ({ report, userPlan }) => {
  
  const generatePdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = 20;

    // Helper: Check Page Break
    const checkPageBreak = (heightNeeded: number) => {
      if (yPos + heightNeeded > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    // Helper: Add Section Title
    const addSectionTitle = (title: string) => {
      checkPageBreak(20);
      doc.setFillColor(241, 245, 249); // slate-100
      doc.roundedRect(margin, yPos, contentWidth, 10, 2, 2, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59); // slate-800
      doc.text(title, margin + 4, yPos + 6.5);
      
      yPos += 18;
    };

    // --- PAGE 1: HEADER & SUMMARY ---

    // Header Background
    const headerColor = userPlan === 'Agency' ? [15, 23, 42] : [37, 99, 235]; // Slate-900 vs Blue-600
    doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
    doc.rect(0, 0, pageWidth, 55, 'F');
    
    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    
    // WHITE LABEL LOGIC: If Agency, remove brand name "GEO Sentinel"
    const reportTitle = userPlan === 'Agency' ? "EXECUTIVE VISIBILITY AUDIT" : "GEO SENTINEL ANALYSIS";
    doc.text(reportTitle, margin, 25);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Domain Analysis: ${report.url}`, margin, 35);
    doc.text(`Protocol Date: ${new Date(report.timestamp).toLocaleDateString()}`, margin, 42);

    // Agency White Labeling details
    if (userPlan === 'Agency') {
      doc.setFont("helvetica", "bold");
      doc.text("CONFIDENTIAL STRATEGY", pageWidth - margin - 55, 25);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("Neural Infrastructure Protocol v2.5", pageWidth - margin - 55, 31);
    }

    yPos = 75;

    // Executive Summary
    doc.setTextColor(30, 41, 59);
    addSectionTitle("Executive Summary");
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(report.summary, contentWidth);
    doc.text(summaryLines, margin, yPos);
    yPos += (summaryLines.length * 5) + 15;

    // Competitive Benchmark
    checkPageBreak(65);
    addSectionTitle("Competitive Landscape Analysis");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`Market Position: ${report.benchmarks.marketPosition}`, margin, yPos);
    yPos += 10;

    const drawScoreBar = (label: string, score: number, color: [number, number, number], y: number) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text(`${label} (${score}/100)`, margin, y - 2);
        doc.setFillColor(226, 232, 240);
        doc.roundedRect(margin, y, contentWidth, 4, 1, 1, 'F');
        doc.setFillColor(color[0], color[1], color[2]);
        const barWidth = Math.max(2, (contentWidth * score) / 100);
        doc.roundedRect(margin, y, barWidth, 4, 1, 1, 'F');
    };

    drawScoreBar("Analyzed Entity Score", report.overallScore, [37, 99, 235], yPos); 
    yPos += 14;
    drawScoreBar("Industry Benchmark", report.benchmarks.industryAverage, [148, 163, 184], yPos); 
    yPos += 14;
    drawScoreBar(`Primary Competitor: ${report.benchmarks.topCompetitor.name}`, report.benchmarks.topCompetitor.score, [168, 85, 247], yPos); 
    yPos += 12;

    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 116, 139);
    const compStrengthLines = doc.splitTextToSize(`Competitor Strategy: ${report.benchmarks.topCompetitor.strengths}`, contentWidth);
    doc.text(compStrengthLines, margin, yPos + 4);
    yPos += (compStrengthLines.length * 5) + 10;

    // --- Recommendations ---
    addSectionTitle("Strategic Recommendations");

    report.recommendations.forEach((rec, i) => {
        checkPageBreak(50);
        doc.setTextColor(37, 99, 235);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(`${i + 1}. ${rec.title}`, margin, yPos);
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        const impactText = `Impact: ${rec.impact}`;
        const impactWidth = doc.getTextWidth(impactText);
        doc.text(impactText, pageWidth - margin - impactWidth, yPos);
        yPos += 6;
        doc.setTextColor(71, 85, 105);
        doc.setFont("helvetica", "normal");
        const descLines = doc.splitTextToSize(rec.description, contentWidth);
        doc.text(descLines, margin, yPos);
        yPos += (descLines.length * 4.5) + 4;
        doc.setFillColor(241, 245, 249);
        const actionFullText = "Action Item: " + rec.actionItem;
        const actionLines = doc.splitTextToSize(actionFullText, contentWidth - 4);
        const boxHeight = (actionLines.length * 4.5) + 6;
        doc.rect(margin, yPos, contentWidth, boxHeight, 'F');
        doc.setTextColor(15, 23, 42);
        doc.text(actionLines, margin + 2, yPos + 5);
        yPos += boxHeight + 10;
    });

    // --- FOOTER & WATERMARK ---
    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // WATERMARK: Only for Free Plan
        if (userPlan === 'Free') {
            doc.saveGraphicsState();
            doc.setGState(new (doc as any).GState({opacity: 0.1}));
            doc.setFontSize(40);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(200, 200, 200);
            doc.text("GEO SENTINEL FREE AUDIT", pageWidth / 2, pageHeight / 2, { angle: 45, align: 'center' });
            doc.restoreGraphicsState();
        }

        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        // WHITE LABEL: Change footer text for Agency
        const footerTitle = userPlan === 'Agency' ? "Proprietary Search Analysis Report" : "GEO Sentinel AI-SEO Report";
        doc.text(`Page ${i} of ${pageCount} - ${footerTitle}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    doc.save(`Audit-${report.url.replace(/[^a-z0-9]/gi, '_')}.pdf`);
  };

  return (
    <button 
      onClick={generatePdf}
      className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg transition-all font-bold shadow-lg shadow-slate-200"
    >
      <Download size={18} />
      <span>{userPlan === 'Agency' ? 'White-Label Export' : 'Download PDF Report'}</span>
    </button>
  );
};
