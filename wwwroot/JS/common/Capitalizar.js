function capitalizarTexto(texto) {
    return texto.replace(/\b\w/g, function(char) {
        return char.toUpperCase();
    });
}


function generarInformePDF({ titulo, columnas, filas, nombreArchivo = "informe.pdf" }) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // 🧠 Encabezado visual
  doc.setDrawColor(78, 115, 223);
  doc.setLineWidth(0.7);
  doc.rect(14, 10, 30, 20, 'S'); // Logo o espacio reservado
  doc.rect(44, 10, 151, 20, 'S'); // Título

  doc.setFontSize(12);
  doc.text(titulo, 46, 15);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 46, 22);
  doc.text("Versión del sistema: 1.0.0", 46, 28.5);

  doc.line(44, 17, 195, 17);
  doc.line(44, 24, 195, 24);

  // 📊 Tabla
  doc.autoTable({
    startY: 40,
    head: [columnas],
    body: filas,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [78, 115, 223],
      textColor: 255,
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    createdCell: function (cell, opts) {
      cell.styles.fontSize = 7;
      if ([0, 3, 4].includes(opts.column.index)) {
        cell.styles.halign = 'center';
      }
    },
    createdHeaderCell: function (cell, opts) {
      cell.styles.fontSize = 8;
      if ([0, 3, 4].includes(opts.column.index)) {
        cell.styles.halign = 'center';
      }
    },
    didDrawPage: function (data) {
      const pageHeight = doc.internal.pageSize.height;
      const pageCount = doc.internal.getNumberOfPages();
      const str = `Página ${data.pageCount} de ${pageCount}`;

      doc.setLineWidth(8);
      doc.setDrawColor(78, 115, 223);
      doc.setTextColor(255, 255, 255);
      doc.line(14, pageHeight - 11, 196, pageHeight - 11);

      doc.setFontSize(10);
      doc.text(str, 17, pageHeight - 10);
    }
  });

  // 💾 Descargar
  doc.save(nombreArchivo);
}