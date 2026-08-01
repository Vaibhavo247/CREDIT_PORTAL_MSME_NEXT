import os
import re

files_to_update = [
    "src/app/(authenticated)/about/CustomerTableClient.js",
    "src/app/(authenticated)/employee-access/EmployeeTableClient.js",
    "src/app/(authenticated)/fi-report/FiReportClient.js",
    "src/app/(authenticated)/msme-lead/MsmeLeadClient.js"
]

def update_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    with open(filepath, 'r') as f:
        content = f.read()

    # Add import
    if "import { Search" not in content and "from \"lucide-react\"" not in content:
        content = content.replace("import React", "import React\nimport { Search } from \"lucide-react\";", 1)
    elif "from \"lucide-react\"" in content and "Search" not in content:
        content = re.sub(r'import\s+\{([^}]+)\}\s+from\s+"lucide-react";', r'import { \1, Search } from "lucide-react";', content)

    # Extract props
    input_match = re.search(r'<Input(.*?)/>', content, re.DOTALL)
    if not input_match:
        print(f"Input not found in {filepath}")
        return
        
    props_str = input_match.group(1)
    placeholder = re.search(r'placeholder="([^"]+)"', props_str)
    placeholder = placeholder.group(1) if placeholder else "Search..."
    
    value = re.search(r'value=\{([^}]+)\}', props_str)
    value = value.group(1) if value else "searchText"
    
    # Extract onChange, carefully handling nested curlies
    # Best way: match onChange={ ... } where ... handles up to 2 levels of braces, or just match everything after onChange={ until className=
    on_change = re.search(r'onChange=\{([\s\S]*?)\}\s*(?:className|wrapperClassName)', props_str)
    if on_change:
        on_change_str = on_change.group(1).strip()
    else:
        # simpler match
        on_change = re.search(r'onChange=\{((?:[^{}]*|\{[^{}]*\})*)\}', props_str)
        on_change_str = on_change.group(1) if on_change else "(e) => handleSearch(e.target.value)"

    search_bar_html = f"""
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={{18}} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all"
            placeholder="{placeholder}"
            value={{{value}}}
            onChange={{{on_change_str}}}
          />
        </div>
"""
    
    # Remove the Input block entirely from the main flow
    input_wrapper_pattern = r'<div className="py-4[^>]*">\s*<Input.*?/>\s*</div>'
    content = re.sub(input_wrapper_pattern, '', content, flags=re.DOTALL)
    
    # Alternate wrapper if there's a comment
    old_search_pattern = r'\{\s*/\*\s*Search Toolbar\s*\*/\s*\}.*?<Input.*?/>\s*</div>'
    content = re.sub(old_search_pattern, '', content, flags=re.DOTALL)

    # Insert into PageHeader
    page_header_pattern = r'<PageHeader([^>]+)/>'
    
    def repl(m):
        props = m.group(1)
        return f'<PageHeader{props}>\n{search_bar_html}\n</PageHeader>'

    content = re.sub(page_header_pattern, repl, content, count=1)
    
    with open(filepath, 'w') as f:
        f.write(content)
        
    print(f"Successfully updated {filepath}")

for f in files_to_update:
    update_file(f)
