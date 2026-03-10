const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const srcDir = 'c:\\Users\\shaik\\Downloads\\foliogen\\src';
const files = walk(srcDir);
let changed = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const regex = /import\s+\{\s*supabase\s*\}\s+from\s+['"]@\/lib\/supabase['"];?/g;
    const dynamicRegex = /const\s+\{\s*supabase\s*\}\s+=\s+await\s+import\(['"]@\/lib\/supabase['"]\);?/g;
    // Also cover relative imports within src/lib if there are any
    const relRegex = /import\s+\{\s*supabase\s*\}\s+from\s+['"]\.\/supabase['"];?/g;

    if (regex.test(content) || dynamicRegex.test(content) || relRegex.test(content)) {
        content = content.replace(regex, "import { supabase } from '@/lib/supabase_v2';");
        content = content.replace(dynamicRegex, "const { supabase } = await import('@/lib/supabase_v2');");
        content = content.replace(relRegex, "import { supabase } from './supabase_v2';");
        fs.writeFileSync(file, content, 'utf8');
        changed++;
        console.log('Updated: ' + file);
    }
});
console.log(`Total files updated: ${changed}`);
