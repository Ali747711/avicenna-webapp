import jsPDF from 'jspdf';

export const exportMedicalHistoryToPDF = (medicalHistory, userProfile) => {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const lineHeight = 7;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace = 30) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // Helper function to wrap text
  const addWrappedText = (text, x, y, maxWidth, fontSize = 10) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line, index) => {
      checkPageBreak();
      doc.text(line, x, y + (index * lineHeight));
      yPosition = Math.max(yPosition, y + (index * lineHeight) + lineHeight);
    });
    return yPosition;
  };

  // Helper function to format date
  const formatDate = (timestamp) => {
    let date;
    if (timestamp?.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Header
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('Medical History Report', margin, yPosition);
  yPosition += 15;

  // Patient Information
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Patient Information', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(`Name: ${userProfile?.name || 'N/A'}`, margin, yPosition);
  yPosition += lineHeight;
  doc.text(`Email: ${userProfile?.email || 'N/A'}`, margin, yPosition);
  yPosition += lineHeight;
  doc.text(`Report Generated: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, margin, yPosition);
  yPosition += lineHeight;
  doc.text(`Total Conversations: ${medicalHistory.length}`, margin, yPosition);
  yPosition += 20;

  // Medical History Entries
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Medical History', margin, yPosition);
  yPosition += 15;

  medicalHistory.forEach((entry, index) => {
    checkPageBreak(60);

    // Entry header
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Conversation ${index + 1}`, margin, yPosition);
    yPosition += 10;

    // Date and language
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Date: ${formatDate(entry.timestamp)}`, margin, yPosition);
    doc.text(`Language: ${(entry.language || 'English').toUpperCase()}`, margin + 100, yPosition);
    yPosition += 10;

    // User symptoms
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Patient Symptoms:', margin, yPosition);
    yPosition += 7;
    
    doc.setFont(undefined, 'normal');
    yPosition = addWrappedText(
      entry.userMessage || entry.symptoms || 'No symptoms recorded',
      margin + 5,
      yPosition,
      170,
      10
    );
    yPosition += 10;

    // AI Analysis
    if (entry.aiResponse?.analysis) {
      const analysis = entry.aiResponse.analysis;

      // Urgency Level
      if (analysis.urgency) {
        doc.setFont(undefined, 'bold');
        doc.text('Urgency Level:', margin, yPosition);
        yPosition += 7;
        
        doc.setFont(undefined, 'normal');
        let urgencyText = '';
        let urgencyColor = [0, 0, 0]; // Black default
        
        switch (analysis.urgency) {
          case 'emergency_care':
            urgencyText = 'EMERGENCY CARE NEEDED';
            urgencyColor = [255, 0, 0]; // Red
            break;
          case 'see_doctor_soon':
            urgencyText = 'See Doctor Soon';
            urgencyColor = [255, 165, 0]; // Orange
            break;
          case 'monitor_at_home':
            urgencyText = 'Monitor at Home';
            urgencyColor = [0, 128, 0]; // Green
            break;
          default:
            urgencyText = 'Assessment Not Available';
        }
        
        doc.setTextColor(urgencyColor[0], urgencyColor[1], urgencyColor[2]);
        doc.text(urgencyText, margin + 5, yPosition);
        doc.setTextColor(0, 0, 0); // Reset to black
        yPosition += 10;
      }

      // Possible Conditions
      if (analysis.conditions && analysis.conditions.length > 0) {
        checkPageBreak(30);
        doc.setFont(undefined, 'bold');
        doc.text('Possible Conditions:', margin, yPosition);
        yPosition += 7;
        
        analysis.conditions.forEach((condition, idx) => {
          doc.setFont(undefined, 'bold');
          yPosition = addWrappedText(
            `${idx + 1}. ${condition.name}`,
            margin + 5,
            yPosition,
            170,
            10
          );
          
          doc.setFont(undefined, 'normal');
          yPosition = addWrappedText(
            condition.explanation,
            margin + 10,
            yPosition,
            165,
            9
          );
          yPosition += 5;
        });
        yPosition += 5;
      }

      // Doctor Recommendation
      if (analysis.doctor_type) {
        doc.setFont(undefined, 'bold');
        doc.text('Recommended Specialist:', margin, yPosition);
        yPosition += 7;
        
        doc.setFont(undefined, 'normal');
        doc.text(analysis.doctor_type, margin + 5, yPosition);
        yPosition += 10;
      }

      // Recommendations
      if (analysis.recommendations && analysis.recommendations.length > 0) {
        checkPageBreak(20);
        doc.setFont(undefined, 'bold');
        doc.text('Recommendations:', margin, yPosition);
        yPosition += 7;
        
        analysis.recommendations.forEach((recommendation, idx) => {
          doc.setFont(undefined, 'normal');
          yPosition = addWrappedText(
            `• ${recommendation}`,
            margin + 5,
            yPosition,
            170,
            9
          );
          yPosition += 2;
        });
        yPosition += 10;
      }
    }

    // Separator line
    if (index < medicalHistory.length - 1) {
      checkPageBreak(15);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, 190, yPosition);
      yPosition += 15;
    }
  });

  // Footer/Disclaimer
  checkPageBreak(40);
  yPosition += 10;
  doc.setFontSize(8);
  doc.setFont(undefined, 'italic');
  doc.setTextColor(100, 100, 100);
  
  const disclaimer = "MEDICAL DISCLAIMER: This report contains AI-generated health information for reference only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns.";
  addWrappedText(disclaimer, margin, yPosition, 170, 8);

  // Generate filename
  const date = new Date().toISOString().split('T')[0];
  const filename = `Avicenna-Medical-History-${date}.pdf`;

  // Save the PDF
  doc.save(filename);
};

export const exportSingleConversationToPDF = (entry, userProfile) => {
  exportMedicalHistoryToPDF([entry], userProfile);
}; 