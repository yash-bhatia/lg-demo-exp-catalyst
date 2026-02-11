/* eslint-disable */
/* global WebImporter */

/**
 * Parser for table block
 *
 * Source: https://www.lg.com/fr/lg-experience/tech-hub/meilleures-enceintes-portables-pour-soiree
 * Base Block: table
 *
 * Block Structure (from markdown example):
 * - Row 1: Block name header ("Table")
 * - Row 2: Header row (column names)
 * - Row 3+: Data rows
 *
 * Source HTML Pattern:
 * <table class="rounded-corners">
 *   <tbody>
 *     <tr style="background-color: black; color: white;"> (header row)
 *       <td><strong>Fonctionnalité</strong></td>
 *       <td><a href="..."><strong>Bounce</strong></a></td>
 *       ...
 *     </tr>
 *     <tr> (data rows)
 *       <td><strong>Qualité sonore</strong></td>
 *       <td>Puissance de sortie 30 W...</td>
 *       ...
 *     </tr>
 *   </tbody>
 * </table>
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  // Extract all rows from the table
  // VALIDATED: Source DOM uses table.rounded-corners > tbody > tr structure
  const rows = element.querySelectorAll('tbody tr');

  if (!rows || rows.length === 0) return;

  const cells = [];

  rows.forEach((row) => {
    const rowCells = row.querySelectorAll('td, th');
    const rowContent = [];

    rowCells.forEach((cell) => {
      // Clone cell content to preserve links and formatting
      const cellDiv = document.createElement('div');
      cellDiv.innerHTML = cell.innerHTML;
      rowContent.push(cellDiv);
    });

    cells.push(rowContent);
  });

  // Create block using WebImporter utility
  // Using 'Table (striped, bordered)' to match the migration markdown variant
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Table (striped, bordered)',
    cells,
  });

  // Replace original element with structured block table
  element.replaceWith(block);
}
