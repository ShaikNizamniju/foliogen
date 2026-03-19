import os
import re

migrations_dir = r"c:\Users\shaik\Downloads\foliogen\supabase\migrations"

def make_policies_idempotent(content):
    # Regex for CREATE POLICY "policy_name" ON table_name ...
    # Note: table_name might be public.tablename or just tablename.
    # It might have quotes or not.
    # Pattern: CREATE\s+POLICY\s+"(?P<policy_name>[^"]+)"\s+ON\s+(?P<table_name>\S+)
    
    # We want to match CREATE POLICY ... ON ...
    # Then we check if DROP POLICY IF EXISTS ... ON ... is already before it.
    
    # Let's find all CREATE POLICY occurrences.
    # We'll use a regex that captures the policy name and table name.
    
    # (?i) for case-insensitive
    pattern = re.compile(r'(?i)CREATE\s+POLICY\s+"(?P<policy_name>[^"]+)"\s+ON\s+(?P<table_name>\S+)')
    
    # We'll process findings in reverse order to not mess up offsets if we modify.
    # Or just use sub with a replacer.
    
    def replacer(match):
        policy_name = match.group('policy_name')
        table_name = match.group('table_name')
        
        # Check if this exact DROP already exists immediately before (ignoring whitespace/comments)
        # That's hard with regex. 
        # A safer way: just add it, and if there are duplicates, we can clean up if needed.
        # But the user said "add this line immediately before it".
        
        drop_stat = f'DROP POLICY IF EXISTS "{policy_name}" ON {table_name};'
        
        # Check if the content already has this drop statement.
        # We can look back in the original content if we were doing it line by line.
        # For simplicity, I'll just check if the drop_stat is already present in the block.
        
        return f'{drop_stat}\n{match.group(0)}'

    # Actually, we should check for existing DROP POLICY IF EXISTS before matching.
    # To avoid double-adding if we run the script twice.
    
    new_content = ""
    last_pos = 0
    for m in pattern.finditer(content):
        start = m.start()
        # Look back for "DROP POLICY IF EXISTS" 
        # A simple check: check the last 200 characters before the match for the policy name.
        lookback = content[max(0, start-200):start]
        policy_name = m.group('policy_name')
        if f'DROP POLICY IF EXISTS "{policy_name}"' in lookback:
            # Already has a drop, skip adding.
            continue
        
        new_content += content[last_pos:start]
        policy_name = m.group('policy_name')
        table_name = m.group('table_name')
        new_content += f'DROP POLICY IF EXISTS "{policy_name}" ON {table_name};\n'
        last_pos = start
    
    new_content += content[last_pos:]
    return new_content

for filename in os.listdir(migrations_dir):
    if filename.endswith(".sql"):
        filepath = os.path.join(migrations_dir, filename)
        content = None
        encoding_used = 'utf-8'
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            try:
                with open(filepath, 'r', encoding='utf-16') as f:
                    content = f.read()
                encoding_used = 'utf-16'
            except UnicodeDecodeError:
                print(f"Skipping {filename}: Could not decode")
                continue
        
        if content is None: continue

        new_content = make_policies_idempotent(content)
        
        if new_content != content:
            with open(filepath, 'w', encoding=encoding_used) as f:
                f.write(new_content)
            print(f"Updated {filename}")
        else:
            print(f"No changes needed for {filename}")
