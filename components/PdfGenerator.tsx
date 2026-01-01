import React from 'react';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';
import { SeoReport } from '../types';

interface PdfGeneratorProps {
  report: SeoReport;
}

export const PdfGenerator: React.FC<PdfGeneratorProps> = ({ report }) => {
  
  const generatePdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = 20;

    // Helper: Check Page Break
    // Returns true if a page break occurred
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
    doc.setFillColor(37, 99, 235); // Blue-600
    doc.rect(0, 0, pageWidth, 55, 'F');
    
    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("AI-SEO Audit Report", margin, 25);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Target URL: ${report.url}`, margin, 35);
    doc.text(`Generated: ${new Date(report.timestamp).toLocaleDateString()}`, margin, 42);

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
    addSectionTitle("Competitive Landscape");
    
    // Market Position Line
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`Market Position: ${report.benchmarks.marketPosition}`, margin, yPos);
    yPos += 10;

    // Score Bars Helper
    const drawScoreBar = (label: string, score: number, color: [number, number, number], y: number) => {
        // Label
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text(`${label} (${score}/100)`, margin, y - 2);
        
        // Background track
        doc.setFillColor(226, 232, 240); // slate-200
        doc.roundedRect(margin, y, contentWidth, 4, 1, 1, 'F');
        
        // Value bar
        doc.setFillColor(color[0], color[1], color[2]);
        // Clamp width
        const barWidth = Math.max(2, (contentWidth * score) / 100);
        doc.roundedRect(margin, y, barWidth, 4, 1, 1, 'F');
    };

    drawScoreBar("Your Site Score", report.overallScore, [37, 99, 235], yPos); // Blue
    yPos += 14;
    drawScoreBar("Industry Average", report.benchmarks.industryAverage, [148, 163, 184], yPos); // Slate
    yPos += 14;
    drawScoreBar(`Top Competitor: ${report.benchmarks.topCompetitor.name}`, report.benchmarks.topCompetitor.score, [168, 85, 247], yPos); // Purple
    yPos += 12;

    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 116, 139);
    const compStrengthText = `Competitor Strength: ${report.benchmarks.topCompetitor.strengths}`;
    const compStrengthLines = doc.splitTextToSize(compStrengthText, contentWidth);
    doc.text(compStrengthLines, margin, yPos + 4);
    yPos += (compStrengthLines.length * 5) + 10;

    // --- Google vs AI Comparison ---
    checkPageBreak(80);
    addSectionTitle("Traditional vs. AI SEO Focus");
    
    const colWidth = (contentWidth / 2) - 5;
    const col1X = margin;
    const col2X = margin + colWidth + 10;
    
    // Column Headers
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(22, 163, 74); // Green-600
    doc.text("Google SEO Focus", col1X, yPos);
    
    doc.setTextColor(147, 51, 234); // Purple-600
    doc.text("AI SEO Focus", col2X, yPos);
    yPos += 8;

    // Content Lists
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);

    let gY = yPos;
    report.googleVsAiComparison.googleFocus.forEach(item => {
        const lines = doc.splitTextToSize(`• ${item}`, colWidth);
        doc.text(lines, col1X, gY);
        gY += (lines.length * 4.5) + 2;
    });

    let aY = yPos;
    report.googleVsAiComparison.aiFocus.forEach(item => {
        const lines = doc.splitTextToSize(`• ${item}`, colWidth);
        doc.text(lines, col2X, aY);
        aY += (lines.length * 4.5) + 2;
    });

    yPos = Math.max(gY, aY) + 15;

    // --- Content Gaps ---
    checkPageBreak(60);
    addSectionTitle("Content Opportunities");
    
    report.contentGaps.forEach((gap) => {
        checkPageBreak(25);
        
        // Background card for gap
        doc.setFillColor(248, 250, 252); // slate-50
        doc.roundedRect(margin, yPos - 5, contentWidth, 20, 2, 2, 'F');
        
        // Topic Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(gap.topic, margin + 4, yPos);
        
        // Details
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        
        const details = `Vol: ${gap.searchVolume} | AI Freq: ${gap.aiFrequency}`;
        doc.text(details, margin + 4, yPos + 5);
        
        const competitors = `Competitors: ${gap.competitorsCovering.join(', ')}`;
        const compLines = doc.splitTextToSize(competitors, contentWidth - 8);
        doc.text(compLines, margin + 4, yPos + 10);
        
        yPos += 24;
    });
    
    yPos += 5;

    // --- Technical Issues ---
    checkPageBreak(50);
    addSectionTitle("Technical Barriers");

    if (report.technicalIssues.length === 0) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.text("No major technical issues found.", margin, yPos);
        yPos += 15;
    } else {
        report.technicalIssues.forEach((issue) => {
            checkPageBreak(20);
            
            // Severity Color
            const severityColor = issue.severity === 'Critical' ? [220, 38, 38] : issue.severity === 'Major' ? [234, 88, 12] : [202, 138, 4];
            doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text(`[${issue.severity}] ${issue.issue}`, margin, yPos);
            
            // Description / Impact
            doc.setTextColor(30, 41, 59);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            const impactLines = doc.splitTextToSize(`Impact: ${issue.aiImpact}`, contentWidth);
            doc.text(impactLines, margin, yPos + 5);
            
            yPos += (impactLines.length * 4.5) + 10;
        });
    }

    // --- Recommendations ---
    doc.addPage();
    yPos = 20;
    addSectionTitle("Strategic Recommendations");

    report.recommendations.forEach((rec, i) => {
        checkPageBreak(50);
        
        // Title
        doc.setTextColor(37, 99, 235); // Blue
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(`${i + 1}. ${rec.title}`, margin, yPos);
        
        // Impact Badge
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        const impactText = `Impact: ${rec.impact}`;
        const impactWidth = doc.getTextWidth(impactText);
        doc.text(impactText, pageWidth - margin - impactWidth, yPos);
        
        yPos += 6;

        // Description
        doc.setTextColor(71, 85, 105);
        doc.setFont("helvetica", "normal");
        const descLines = doc.splitTextToSize(rec.description, contentWidth);
        doc.text(descLines, margin, yPos);
        yPos += (descLines.length * 4.5) + 4;

        // Action Item Box
        doc.setFillColor(241, 245, 249);
        const actionPrefix = "Action Item: ";
        const actionFullText = actionPrefix + rec.actionItem;
        const actionLines = doc.splitTextToSize(actionFullText, contentWidth - 4);
        const boxHeight = (actionLines.length * 4.5) + 6;
        
        doc.rect(margin, yPos, contentWidth, boxHeight, 'F');
        doc.setTextColor(15, 23, 42);
        doc.text(actionLines, margin + 2, yPos + 5);
        yPos += boxHeight + 5;

        // Estimated Lift
        if (rec.estimatedLift) {
            doc.setTextColor(22, 163, 74); // Green
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.text(`Expected Lift: ${rec.estimatedLift}`, margin, yPos);
            yPos += 10;
        }

        yPos += 5;
    });

    // --- FOOTER ---
    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // Slate-400
        doc.text(`Page ${i} of ${pageCount} - AI-SEO Architect Report`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    doc.save('AI-SEO-Analysis-Report.pdf');
  };

  return (
    <button 
      onClick={generatePdf}
      className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
    >
      <Download size={18} />
      <span>Download PDF Report</span>
    </button>
  );
};
