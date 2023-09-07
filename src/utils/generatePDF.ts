// utils/generatePDF.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const generatePDF = (document: Document, outputPath: string): void => {

    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    const capture = document.querySelector(".actual-receipt") as HTMLElement;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const canvas = html2canvas(capture).then((canvas) => {

        const imgData = canvas.toDataURL('image/png');

        const doc = new jsPDF('p', 'mm', 'a4');

        const componentWidth = doc.internal.pageSize.getWidth();
        const componentHeight = doc.internal.pageSize.getHeight();

        doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
        // setLoading(false);
        doc.save(outputPath);
    }); // Replace with the HTML content you want to convert to PDF

}

export default generatePDF;
