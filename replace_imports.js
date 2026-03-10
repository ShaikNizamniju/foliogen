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
    const regex = /import\s+\{\s*supabase\s*\}\s+from\s+['"]@\/integrations\/supabase\/client['"];?/g;
    const dynamicRegex = /const\s+\{\s*supabase\s*\}\s+=\s+await\s+import\(['"]@\/integrations\/supabase\/client['"]\);?/g;
    if (regex.test(content) || dynamicRegex.test(content)) {
        content = content.replace(regex, "import { supabase } from '@/lib/supabase';");
        content = content.replace(dynamicRegex, "const { supabase } = await import('@/lib/supabase');");
        fs.writeFileSync(file, content, 'utf8');
        changed++;
        console.log('Updated: ' + file);
    }
});
console.log(`Total files updated: ${changed}`);
