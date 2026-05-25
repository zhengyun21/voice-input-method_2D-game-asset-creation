import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

const ACCEPTED_EXTENSIONS = ['.txt', '.docx', '.pdf', '.pptx'];

export function getAcceptedExtensions(): string[] {
  return ACCEPTED_EXTENSIONS;
}

export function getAcceptedMimeTypes(): string {
  return '.txt,.docx,.pdf,.pptx';
}

function parseTxt(file: File): Promise<string> {
  return file.text();
}

async function parseDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function parsePdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item: any) => item.str)
      .join(' ');
    pages.push(text);
  }
  return pages.join('\n\n');
}

function extractTextFromXml(xmlString: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  const textElements = doc.getElementsByTagNameNS('http://schemas.openxmlformats.org/drawingml/2006/main', 't');
  const texts: string[] = [];
  for (let i = 0; i < textElements.length; i++) {
    const el = textElements[i];
    if (el.textContent) texts.push(el.textContent);
  }
  return texts.join(' ');
}

async function parsePptx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const slideTexts: string[] = [];
  let slideIndex = 1;

  while (true) {
    const slideFile = zip.file(`ppt/slides/slide${slideIndex}.xml`);
    if (!slideFile) break;
    const xmlContent = await slideFile.async('string');
    const text = extractTextFromXml(xmlContent);
    if (text.trim()) slideTexts.push(text.trim());
    slideIndex++;
  }

  return slideTexts.join('\n\n');
}

export async function parseDocument(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  if (name.endsWith('.txt')) {
    return parseTxt(file);
  }
  if (name.endsWith('.docx')) {
    return parseDocx(file);
  }
  if (name.endsWith('.pdf')) {
    return parsePdf(file);
  }
  if (name.endsWith('.pptx')) {
    return parsePptx(file);
  }

  throw new Error(`不支持的文件格式: ${name.split('.').pop()}`);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
