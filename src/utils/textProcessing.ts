
// utils/textProcessing.ts

/**
 * Converts Markdown tables within a string to HTML table elements.
 * Non-table lines are wrapped in <p> tags with basic HTML escaping.
 * @param markdown The string containing Markdown text. Can be null or undefined.
 * @returns An HTML string with Markdown tables converted, or empty string for invalid input.
 */
export function markdownTableToHtml(markdown: string | null | undefined): string {
  if (typeof markdown !== 'string' || markdown.trim() === '') {
    // If input is not a string, or is an empty/whitespace-only string,
    // return an empty string. Alternatively, could return '<p><br></p>' if preferred for spacing.
    return ''; 
  }

  const lines = markdown.split('\n');
  let resultHtml = '';
  let i = 0;

  while (i < lines.length) {
    const currentLineTrimmed = lines[i].trim();

    // Check for table start:
    // 1. Current line is a valid table row: |...|
    // 2. Next line exists and is a valid separator row: |---|---| or | :--: | --- |
    // 3. Line after header must have at least one cell.
    const isCurrentLineTableStructure = currentLineTrimmed.startsWith('|') && currentLineTrimmed.endsWith('|') && currentLineTrimmed.length > 1;
    let isNextLineSeparator = false;
    if (lines[i + 1]) { // Check if next line exists
      const nextLineTrimmed = lines[i + 1].trim();
      if (nextLineTrimmed.startsWith('|') && nextLineTrimmed.endsWith('|') && nextLineTrimmed.length > 1) {
        const separatorCells = nextLineTrimmed.slice(1, -1).split('|').map(cell => cell.trim());
        isNextLineSeparator = separatorCells.every(cell => /^\s*:{0,1}-{2,}:{0,1}\s*$/.test(cell));
      }
    }

    if (isCurrentLineTableStructure && isNextLineSeparator) {
      let tableMarkdownBlock = '';
      // Header row
      tableMarkdownBlock += lines[i] + '\n';
      i++;
      // Separator row
      tableMarkdownBlock += lines[i] + '\n';
      i++;
      // Body rows
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableMarkdownBlock += lines[i] + '\n';
        i++;
      }
      resultHtml += convertSingleMarkdownTableToHtml(tableMarkdownBlock.trim());
    } else { // Not a table line or not a valid start of a table
      if (currentLineTrimmed === '') {
        // Only add paragraph for empty line if it's not the very start and the previous wasn't also just an empty line paragraph.
        // This avoids piling up <p><br></p> if the original input had multiple blank lines, 
        // but still allows some spacing.
        // For simplicity, current behavior might be fine, but this is a nuance.
        // Keeping current logic:
        resultHtml += '<p class="my-1"><br></p>'; // Represent empty lines for spacing
      } else {
        // Basic HTML escaping for safety for non-table lines
        const escapedLine = currentLineTrimmed.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        resultHtml += `<p class="my-1 leading-relaxed">${escapedLine}</p>`;
      }
      i++;
    }
  }
  return resultHtml;
}

/**
 * Converts a single block of Markdown table text to an HTML table.
 * @param tableMarkdown The Markdown string for a single table.
 * @returns HTML string for the table.
 */
function convertSingleMarkdownTableToHtml(tableMarkdown: string): string {
  const lines = tableMarkdown.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return ''; // Not a valid table (needs at least header and separator)

  let html = `
    <div class="overflow-x-auto my-4 shadow rounded-lg border border-slate-200">
      <table class="min-w-full divide-y divide-slate-300 table-auto">
  `;
  
  // Header
  const headerCells = lines[0].slice(1, -1).split('|').map(cell => cell.trim());
  html += '<thead class="bg-slate-100 print:bg-slate-100">';
  html += '<tr class="border-b border-slate-300">';
  headerCells.forEach(cell => {
    html += `<th scope="col" class="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-slate-700 print:text-xs whitespace-nowrap">${cell}</th>`;
  });
  html += '</tr></thead>';

  // Body
  html += '<tbody class="divide-y divide-slate-200 bg-white print:bg-white">';
  // lines[1] is the separator, so body rows start from index 2
  for (let i = 2; i < lines.length; i++) {
    const bodyCells = lines[i].slice(1, -1).split('|').map(cell => cell.trim());
    html += '<tr class="hover:bg-primary-50/30 transition-colors duration-150 print:break-inside-avoid">';
    bodyCells.forEach(cell => {
      // Escape HTML in cells to prevent XSS from cell content
      const escapedCellContent = cell.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      html += `<td class="px-4 py-3 text-xs sm:text-sm text-slate-600 print:text-xs whitespace-normal break-words">${escapedCellContent}</td>`;
    });
    html += '</tr>';
  }
  html += '</tbody></table></div>';
  return html;
}
