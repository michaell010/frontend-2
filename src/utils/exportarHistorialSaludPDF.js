import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoGanaControl from "../assets/icons/cow.png";

const COLORS = {
  verdeOscuro: [20, 83, 45],
  verde: [22, 163, 74],
  verdeSuave: [220, 252, 231],
  texto: [15, 23, 42],
  gris: [100, 116, 139],
  borde: [220, 230, 220],
};

const formatCOP = (valor) => {
  const n = Number(valor || 0);
  return n.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
};

const fechaActual = () =>
  new Date().toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const horaActual = () =>
  new Date().toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

const cargarImagenBase64 = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });

const agregarMarcaAgua = (doc) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity: 0.06 }));
  doc.setTextColor(...COLORS.verdeOscuro);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(46);
  doc.text("GanaControl", pageWidth / 2, pageHeight / 2, {
    align: "center",
    angle: 35,
  });
  doc.restoreGraphicsState();
};

const agregarFooter = (doc) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pages = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);

    agregarMarcaAgua(doc);

    doc.setDrawColor(...COLORS.borde);
    doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gris);
    doc.text("GanaControl · Gestión Ganadera", 14, pageHeight - 10);
    doc.text(`Página ${i} de ${pages}`, pageWidth - 14, pageHeight - 10, {
      align: "right",
    });
  }
};

export async function exportarHistorialSaludPDF(eventos = [], usuario = {}) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  const logoBase64 = await cargarImagenBase64(logoGanaControl);

  // Header principal
  doc.setFillColor(...COLORS.verdeOscuro);
  doc.roundedRect(10, 10, pageWidth - 20, 36, 6, 6, "F");

  if (logoBase64) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(16, 16, 16, 16, 4, 4, "F");
    doc.addImage(logoBase64, "PNG", 19, 19, 10, 10);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("GanaControl", 38, 23);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Reporte de Historial Clínico Sanitario", 38, 31);

  doc.setFontSize(8);
  doc.text(`Generado el ${fechaActual()} · ${horaActual()}`, 38, 38);

  doc.setFillColor(...COLORS.verde);
  doc.roundedRect(pageWidth - 55, 20, 34, 12, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("SALUD", pageWidth - 38, 28, { align: "center" });

  // Datos de usuario
  doc.setTextColor(...COLORS.texto);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Resumen del historial", 14, 60);

  const totalEventos = eventos.length;
  const completados = eventos.filter((e) => e.estadoKey === "completado").length;
  const pendientes = eventos.filter((e) => e.estadoKey === "pendiente").length;
  const enCurso = eventos.filter((e) => e.estadoKey === "en_curso").length;
  const costoTotal = eventos.reduce((acc, e) => acc + Number(e.costo || 0), 0);

  autoTable(doc, {
    startY: 67,
    theme: "plain",
    margin: { left: 14, right: 14 },
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 3,
    },
    body: [
      ["Usuario", usuario?.nombres || usuario?.nombre || "Sin usuario"],
      ["Rol", usuario?.rol || "Administrador"],
      ["Finca", usuario?.finca || "La Ceiva"],
      ["Total eventos", String(totalEventos)],
      ["Completados", String(completados)],
      ["En curso", String(enCurso)],
      ["Pendientes", String(pendientes)],
      ["Costo total", formatCOP(costoTotal)],
    ],
    columnStyles: {
      0: {
        fontStyle: "bold",
        textColor: COLORS.verdeOscuro,
        cellWidth: 45,
      },
      1: {
        textColor: COLORS.gris,
      },
    },
  });

  const yCards = doc.lastAutoTable.finalY + 8;

  const cards = [
    ["Eventos", totalEventos],
    ["Completados", completados],
    ["Pendientes", pendientes],
    ["Costo", formatCOP(costoTotal)],
  ];

  cards.forEach((card, index) => {
    const x = 14 + index * 46;

    doc.setFillColor(248, 253, 249);
    doc.setDrawColor(...COLORS.borde);
    doc.roundedRect(x, yCards, 40, 22, 4, 4, "FD");

    doc.setTextColor(...COLORS.gris);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(String(card[0]).toUpperCase(), x + 4, yCards + 7);

    doc.setTextColor(...COLORS.verdeOscuro);
    doc.setFontSize(12);
    doc.text(String(card[1]), x + 4, yCards + 16);
  });

  const yTabla = yCards + 34;

  doc.setTextColor(...COLORS.texto);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Detalle del historial clínico", 14, yTabla);

  const rows = eventos.map((ev) => [
    ev.id || ev.backendId || "-",
    ev.animalCod || "-",
    ev.animalNombre || "-",
    ev.tipo || ev.categoria || "-",
    ev.tratamiento || ev.descripcion || ev.notas || "-",
    ev.vet || "Sin asignar",
    ev.fecha || ev.fechaISO || "-",
    ev.estado || "-",
    ev.cantidad_usada ? `${ev.cantidad_usada}` : "-",
    ev.costo ? formatCOP(ev.costo) : "-",
  ]);

  autoTable(doc, {
    startY: yTabla + 6,
    head: [[
      "ID",
      "Código",
      "Animal",
      "Tipo",
      "Tratamiento",
      "Veterinario",
      "Fecha",
      "Estado",
      "Cant.",
      "Costo",
    ]],
    body: rows,
    theme: "grid",
    margin: { left: 10, right: 10 },
    headStyles: {
      fillColor: COLORS.verdeOscuro,
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
      fontSize: 7,
    },
    styles: {
      font: "helvetica",
      fontSize: 7,
      cellPadding: 2,
      overflow: "linebreak",
      valign: "middle",
      lineColor: COLORS.borde,
      lineWidth: 0.1,
    },
    alternateRowStyles: {
      fillColor: COLORS.verdeSuave,
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 9 },
      1: { cellWidth: 16 },
      2: { cellWidth: 20 },
      3: { cellWidth: 21 },
      4: { cellWidth: 32 },
      5: { cellWidth: 27 },
      6: { cellWidth: 20 },
      7: { cellWidth: 18 },
      8: { halign: "center", cellWidth: 12 },
      9: { halign: "right", cellWidth: 22 },
    },
  });

  let firmaY = doc.lastAutoTable.finalY + 20;

  if (firmaY > 260) {
    doc.addPage();
    firmaY = 45;
  }

  doc.setTextColor(...COLORS.texto);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Firma responsable", 14, firmaY);

  doc.setDrawColor(...COLORS.verdeOscuro);
  doc.line(14, firmaY + 20, 80, firmaY + 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gris);
  doc.text(usuario?.nombres || usuario?.nombre || "Usuario responsable", 14, firmaY + 26);
  doc.text(usuario?.rol || "Administrador", 14, firmaY + 31);

  agregarFooter(doc);

  doc.save(`historial-salud-${new Date().toISOString().split("T")[0]}.pdf`);
}