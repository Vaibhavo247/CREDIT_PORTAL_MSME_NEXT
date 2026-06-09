import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

const dateStr1 = "12-05-2024";
const dateStr2 = "2024-05-12T10:30:00Z";

console.log("If DD-MM-YYYY:");
console.log(dayjs(dateStr1, 'DD-MM-YYYY').format('DD-MMM-YYYY'));

console.log("If ISO:");
console.log(dayjs(dateStr2).format('DD-MMM-YYYY'));
