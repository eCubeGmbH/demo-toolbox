/**
 * special_csv Reader
 *
 * Reads a special hierarchical CSV format with semicolon separators.
 * Lines starting with '#' are comment/header lines and are skipped.
 *
 * Three record types are supported:
 *   OH  – Order Header: record_type; buyer_id; order_number; order_date
 *   OP  – Order Position: record_type; position_number; ean_code; price; quantity; volume
 *   PT  – Position Text: record_type; position_reference; text
 *
 * Output: one record per OP line, enriched with the parent OH fields and
 *         all PT texts belonging to that position (collected as an array).
 *
 * Output fields per record:
 *   buyer_id, order_number, order_date,
 *   position_number, ean_code, price, quantity, volume,
 *   texts  (array of text strings from PT lines for this position)
 */
function specialCsvReader(config, streamHelper, journal) {
    var delimiter = getConfigValue(config, 'delimiter', ';');
    var records = [];
    var currentIndex = 0;

    return {
        open: function() {
            records = [];
            currentIndex = 0;

            streamHelper.open('UTF-8');

            // Current order header context
            var currentOH = null;
            // Map from position_number -> OP record (so we can attach PT lines)
            var currentPositions = {};
            // Ordered list of position numbers for the current order
            var currentPositionOrder = [];

            function flushOrder() {
                // Push all collected OP records (in order) into results
                for (var i = 0; i < currentPositionOrder.length; i++) {
                    var posNum = currentPositionOrder[i];
                    records.push(currentPositions[posNum]);
                }
                currentPositions = {};
                currentPositionOrder = [];
            }

            var line = streamHelper.readLine();
            while (line !== null) {
                // Skip empty lines and comment/header lines starting with '#'
                var trimmed = line.trim();
                if (trimmed.length === 0 || trimmed.charAt(0) === '#') {
                    line = streamHelper.readLine();
                    continue;
                }

                var parts = trimmed.split(delimiter);
                var recordType = parts[0] ? parts[0].trim() : '';

                if (recordType === 'OH') {
                    // New order header – flush previous order if any
                    if (currentOH !== null) {
                        flushOrder();
                    }
                    currentOH = {
                        buyer_id:     parts[1] ? parts[1].trim() : '',
                        order_number: parts[2] ? parts[2].trim() : '',
                        order_date:   parts[3] ? parts[3].trim() : ''
                    };
                } else if (recordType === 'OP') {
                    var posNum = parts[1] ? parts[1].trim() : '';
                    var opRecord = {
                        buyer_id:        currentOH ? currentOH.buyer_id : '',
                        order_number:    currentOH ? currentOH.order_number : '',
                        order_date:      currentOH ? currentOH.order_date : '',
                        position_number: posNum,
                        ean_code:        parts[2] ? parts[2].trim() : '',
                        price:           parts[3] ? parts[3].trim() : '',
                        quantity:        parts[4] ? parts[4].trim() : '',
                        volume:          parts[5] ? parts[5].trim() : '',
                        texts:           []
                    };
                    currentPositions[posNum] = opRecord;
                    currentPositionOrder.push(posNum);
                } else if (recordType === 'PT') {
                    var posRef = parts[1] ? parts[1].trim() : '';
                    var text   = parts[2] ? parts[2].trim() : '';
                    if (currentPositions[posRef]) {
                        currentPositions[posRef].texts.push(text);
                    }
                }

                line = streamHelper.readLine();
                journal.onProgress(records.length);
            }

            // Flush the last order
            if (currentOH !== null) {
                flushOrder();
            }

            streamHelper.close();
        },

        readRecords: function*() {
            while (currentIndex < records.length) {
                yield records[currentIndex++];
            }
        },

        close: function() {
            records = [];
            currentIndex = 0;
        }
    };
}

module.exports = specialCsvReader;
