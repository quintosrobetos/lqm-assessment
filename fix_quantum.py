import os, re

# Find the file
path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src', 'QuantumLiving.jsx')
if not os.path.exists(path):
    print("ERROR: Cannot find", path)
    exit(1)

content = open(path, encoding='utf-8').read()
original = content

# Fix 1: }/1 🔥 pattern
content = content.replace(
    '{checklist[todayLawIdx]?"1":"0"}/1 🔥',
    '{checklist[todayLawIdx]?"1":"0"}{"/"}{`1 \U0001F525`}'
)

# Fix 2: }/4 ⭐ pattern  
content = content.replace(
    '{checklist.filter((v,i)=>v && i!==todayLawIdx).length}/4 ⭐',
    '{checklist.filter((v,i)=>v && i!==todayLawIdx).length}{"/"}{`4 \u2B50`}'
)

# Fix 3: division in template literals
content = re.sub(
    r'\$\{(\([^}]*?/21\)[^}]*?)\}',
    lambda m: '${Math.round(' + m.group(1) + ')}',
    content
)
content = re.sub(
    r'\$\{(\([^}]*?/21\*100\))\}',
    lambda m: '${Math.round(' + m.group(1) + ')}',
    content
)

# Fix 4: bare decimal template literals like ${.28+i*.06}
content = content.replace('.28+i*.06', '0.28+i*0.06')
content = content.replace('.28+i*.06', '0.28+i*0.06')

if content != original:
    open(path, 'w', encoding='utf-8').write(content)
    print("SUCCESS: Fixed", path)
    print("Changes made.")
else:
    print("File already fixed or patterns not found.")
    print("Checking for issues manually...")
    for i, line in enumerate(content.split('\n')):
        if '}/1' in line or '}/4' in line:
            print(f"  Line {i+1}: {line.strip()[:80]}")
