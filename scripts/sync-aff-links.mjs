import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TARGET_FILE = path.resolve(__dirname, '../src/features/affiliate/config/affiliateLinks.ts');

// Anh Victor dán URL CSV từ Google Sheet vào đây hoặc cấu hình qua .env
// Để lấy URL này: File > Share > Publish to web > CSV
const GOOGLE_SHEET_CSV_URL = process.env.VITE_AFFILIATE_SHEET_CSV_URL || '';

async function sync() {
    if (!GOOGLE_SHEET_CSV_URL) {
        console.error('❌ LỖI: Chưa cấu hình VITE_AFFILIATE_SHEET_CSV_URL trong .env');
        process.exit(1);
    }

    console.log('⏳ Đang lấy dữ liệu từ Google Sheet...');

    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        const csvText = await response.text();

        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data;
                updateFile(data);
            },
            error: (err) => {
                console.error('❌ LỖI khi parse CSV:', err);
            }
        });
    } catch (error) {
        console.error('❌ LỖI khi fetch data:', error);
    }
}

function updateFile(data) {
    let fileContent = fs.readFileSync(TARGET_FILE, 'utf8');

    // Chuyển array thành object string định dạng TS
    const linksObject = {};
    data.forEach(row => {
        if (row.key && row.url) {
            linksObject[row.key] = row.url;
        }
    });

    const newLinksContent = `// --- AUTOMATION_START ---
export const AFF_LINKS = ${JSON.stringify(linksObject, null, 4)} as const;
// --- AUTOMATION_END ---`;

    const regex = /\/\/ --- AUTOMATION_START ---[\s\S]*?\/\/ --- AUTOMATION_END ---/;

    if (regex.test(fileContent)) {
        fileContent = fileContent.replace(regex, newLinksContent);
        fs.writeFileSync(TARGET_FILE, fileContent);
        console.log('✅ Đã đồng bộ thành công Affiliate Links vào affiliateLinks.ts!');
    } else {
        console.error('❌ LỖI: Không tìm thấy nhãn AUTOMATION_START/END trong file target.');
    }
}

sync();
